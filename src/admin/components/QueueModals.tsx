import { useState } from 'react'
import { Bell, Check, Info, PauseCircle, PlayCircle, Send } from 'lucide-react'
import { Modal, ModalCancel, ModalConfirm } from './Modal'
import type { Department } from '../types'

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function Choice({
  name,
  value,
  current,
  onChange,
  children,
}: {
  name: string
  value: string
  current: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  const checked = current === value
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-[14px] transition-colors duration-200 ${
        checked
          ? 'border-sage/45 bg-sage/8 text-ivory'
          : 'border-admin-line text-muted hover:border-admin-line-2 hover:text-ivory'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-sage bg-sage' : 'border-admin-line-2'
        }`}
      >
        {checked && <Check className="h-[10px] w-[10px] text-on-primary" strokeWidth={3} />}
      </span>
      {children}
      {checked && (
        <span className="ml-auto text-[12px] font-medium text-sage-ink">Selected</span>
      )}
    </label>
  )
}

function NoticeBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 rounded-lg border border-gold/25 bg-gold/8 px-4 py-3">
      <Info className="mt-0.5 h-[16px] w-[16px] shrink-0 text-gold" strokeWidth={1.8} />
      <p className="text-[13px] leading-relaxed text-ivory-2">{children}</p>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.13em] text-muted-2">
      {children}
    </p>
  )
}

// ---------------------------------------------------------------------------
// Call next
// ---------------------------------------------------------------------------

interface BaseProps {
  open: boolean
  onClose: () => void
  dept: Department
}

export function CallNextModal({
  open,
  onClose,
  dept,
  nextToken,
  onConfirm,
}: BaseProps & { nextToken: string; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Call ${nextToken} next?`}
      width="max-w-[430px]"
      footer={
        <>
          <ModalCancel onClick={onClose} />
          <ModalConfirm
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            <PlayCircle className="h-4 w-4" strokeWidth={2} />
            Call {nextToken}
          </ModalConfirm>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-admin-line bg-admin-card px-4 py-3">
          <p className="text-[11.5px] uppercase tracking-[0.13em] text-muted-2">
            Current consultation
          </p>
          <p className="mt-1.5 text-[22px] font-semibold text-ivory">{dept.nowServing}</p>
        </div>
        <div className="rounded-lg border border-sage/30 bg-sage/8 px-4 py-3">
          <p className="text-[11.5px] uppercase tracking-[0.13em] text-muted-2">Next patient</p>
          <p className="mt-1.5 text-[22px] font-semibold text-sage">{nextToken}</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        SmartQueue will recalculate every waiting position and alert the patient who becomes fifth
        in line.
      </p>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Report delay
// ---------------------------------------------------------------------------

const DELAY_REASONS = [
  'Doctor temporarily unavailable',
  'Emergency case',
  'Consultation running slower than expected',
  'Technical issue',
  'Other',
]

const DELAY_WINDOWS = ['10–20 min', '20–40 min', '40+ min', 'Unknown']

export function ReportDelayModal({
  open,
  onClose,
  dept,
  waiting,
  onConfirm,
}: BaseProps & { waiting: number; onConfirm: (reason: string, window: string) => void }) {
  const [reason, setReason] = useState(DELAY_REASONS[0])
  const [window, setWindow] = useState(DELAY_WINDOWS[1])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Report Delay — ${dept.fullName}`}
      width="max-w-[520px]"
      footer={
        <>
          <ModalCancel onClick={onClose} />
          <ModalConfirm
            tone="gold"
            onClick={() => {
              onConfirm(reason, window)
              onClose()
            }}
          >
            <Send className="h-4 w-4" strokeWidth={2} />
            Notify Waiting Patients
          </ModalConfirm>
        </>
      }
    >
      <FieldLabel>What happened?</FieldLabel>
      <div className="flex flex-col gap-2">
        {DELAY_REASONS.map((r) => (
          <Choice key={r} name="delay-reason" value={r} current={reason} onChange={setReason}>
            {r}
          </Choice>
        ))}
      </div>

      <div className="mt-5">
        <FieldLabel>Expected delay</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {DELAY_WINDOWS.map((w) => (
            <Choice key={w} name="delay-window" value={w} current={window} onChange={setWindow}>
              {w}
            </Choice>
          ))}
        </div>
      </div>

      <NoticeBox>
        This will notify all {waiting} waiting patients about the delay. SmartQueue writes the
        message from the queue state — you do not need to compose it.
      </NoticeBox>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Pause / resume
// ---------------------------------------------------------------------------

const PAUSE_REASONS = [
  'Doctor break',
  'Emergency',
  'Technical issue',
  'Temporary closure',
  'Other',
]

export function PauseQueueModal({
  open,
  onClose,
  dept,
  waiting,
  onConfirm,
}: BaseProps & { waiting: number; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState(PAUSE_REASONS[0])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Pause ${dept.fullName} queue?`}
      footer={
        <>
          <ModalCancel onClick={onClose} />
          <ModalConfirm
            tone="urgent"
            onClick={() => {
              onConfirm(reason)
              onClose()
            }}
          >
            <PauseCircle className="h-4 w-4" strokeWidth={2} />
            Pause &amp; Notify Patients
          </ModalConfirm>
        </>
      }
    >
      <FieldLabel>Reason</FieldLabel>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-lg border border-admin-line-2 bg-admin-card px-4 py-3 text-[15px] text-ivory focus:border-sage focus:outline-none"
      >
        {PAUSE_REASONS.map((r) => (
          <option key={r} value={r} className="bg-admin-card">
            {r}
          </option>
        ))}
      </select>

      <NoticeBox>
        Queue positions are frozen while paused — nobody loses their place. All {waiting} waiting
        patients will be told they don&rsquo;t need to return yet.
      </NoticeBox>
    </Modal>
  )
}

export function ResumeQueueModal({
  open,
  onClose,
  dept,
  waiting,
  onConfirm,
}: BaseProps & { waiting: number; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Resume ${dept.fullName} queue?`}
      footer={
        <>
          <ModalCancel onClick={onClose} />
          <ModalConfirm
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            <PlayCircle className="h-4 w-4" strokeWidth={2} />
            Resume &amp; Notify Patients
          </ModalConfirm>
        </>
      }
    >
      <p className="text-[14px] leading-relaxed text-muted">
        Consultations will restart from the token that was on hold. All {waiting} waiting patients
        will be told the queue is moving again and given their updated position.
      </p>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Change room
// ---------------------------------------------------------------------------

const ROOMS = ['Room 3', 'Room 4', 'Room 7', 'Room 9', 'Room 12', 'Room 18', 'Room 21']

export function ChangeRoomModal({
  open,
  onClose,
  dept,
  waiting,
  onConfirm,
}: BaseProps & { waiting: number; onConfirm: (room: string) => void }) {
  const [room, setRoom] = useState(dept.room === 'Room 12' ? 'Room 18' : 'Room 12')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change Consultation Room"
      footer={
        <>
          <ModalCancel onClick={onClose} />
          <ModalConfirm
            onClick={() => {
              onConfirm(room)
              onClose()
            }}
          >
            <Bell className="h-4 w-4" strokeWidth={2} />
            Update &amp; Notify
          </ModalConfirm>
        </>
      }
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <FieldLabel>Current room</FieldLabel>
          <div className="rounded-lg border border-admin-line bg-admin-card px-4 py-3 text-[15px] text-muted">
            {dept.room}
          </div>
        </div>
        <span aria-hidden className="pb-3.5 text-muted-2">
          &rarr;
        </span>
        <div>
          <FieldLabel>New room</FieldLabel>
          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full rounded-lg border border-sage/40 bg-admin-card px-4 py-3 text-[15px] text-ivory focus:border-sage focus:outline-none"
          >
            {ROOMS.filter((r) => r !== dept.room).map((r) => (
              <option key={r} value={r} className="bg-admin-card">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <NoticeBox>
        All {waiting} waiting patients will be notified of this change. Their tokens stay the same.
      </NoticeBox>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Patient not present
// ---------------------------------------------------------------------------

export function PatientAbsentModal({
  open,
  onClose,
  token,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  token: string
  onConfirm: (action: 'hold' | 'helpdesk') => void
}) {
  const [action, setAction] = useState<'hold' | 'helpdesk'>('hold')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Patient ${token} is not present`}
      footer={
        <>
          <ModalCancel onClick={onClose} />
          <ModalConfirm
            onClick={() => {
              onConfirm(action)
              onClose()
            }}
          >
            Confirm
          </ModalConfirm>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Choice
          name="absent-action"
          value="hold"
          current={action}
          onChange={(v) => setAction(v as 'hold')}
        >
          Hold Token
        </Choice>
        <Choice
          name="absent-action"
          value="helpdesk"
          current={action}
          onChange={(v) => setAction(v as 'helpdesk')}
        >
          Send to Help Desk
        </Choice>
      </div>

      <NoticeBox>
        The token is held, never cancelled. {token} keeps their place and is asked to return to the
        help desk.
      </NoticeBox>
    </Modal>
  )
}
