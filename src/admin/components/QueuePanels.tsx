import {
  AlertTriangle,
  ArrowLeftRight,
  Ban,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  UserX,
} from 'lucide-react'
import type { Department } from '../types'

interface ActionPanelProps {
  dept: Department
  selectedToken?: string
  onCallNext: () => void
  onPause: () => void
  onResume: () => void
  onReportDelay: () => void
  onChangeRoom: () => void
  onAbsent: () => void
}

function ActionButton({
  icon: Icon,
  children,
  onClick,
  disabled,
  hint,
}: {
  icon: typeof PauseCircle
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint}
      aria-disabled={disabled}
      className="flex w-full items-center gap-3 rounded-lg border border-admin-line-2 px-4 py-3 text-left text-[14px] font-medium text-ivory-2 transition-colors duration-200 hover:border-sage/45 hover:text-ivory disabled:cursor-not-allowed disabled:border-dashed disabled:border-admin-line disabled:text-muted-2"
    >
      <Icon className="h-[17px] w-[17px] shrink-0 text-gold" strokeWidth={1.8} aria-hidden />
      {children}
    </button>
  )
}

/**
 * Every operational change lives here, visible at all times. Nothing is hidden
 * behind an overflow menu — staff should see what they can do at a glance.
 */
export function QueueActionPanel({
  dept,
  selectedToken,
  onCallNext,
  onPause,
  onResume,
  onReportDelay,
  onChangeRoom,
  onAbsent,
}: ActionPanelProps) {
  const paused = dept.state === 'paused'
  const closed = dept.state === 'closed'

  return (
    <section className="rounded-xl border border-admin-line bg-admin-card p-5">
      <h2 className="text-[16px] font-semibold text-ivory">Actions</h2>

      <div className="mt-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onCallNext}
          disabled={paused || closed}
          aria-disabled={paused || closed}
          title={
            paused
              ? 'Resume the queue before calling the next patient.'
              : closed
                ? 'This OPD is closed.'
                : undefined
          }
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-transparent bg-sage px-4 py-3.5 text-[15px] font-semibold text-on-primary transition-colors duration-200 hover:bg-sage-deep disabled:cursor-not-allowed disabled:border-dashed disabled:border-admin-line-2 disabled:bg-transparent disabled:text-muted-2"
        >
          {paused || closed ? (
            <Ban className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
          ) : (
            <PlayCircle className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
          )}
          Call Next Patient
          {(paused || closed) && <span className="text-[13px] font-normal">— unavailable</span>}
        </button>

        {paused ? (
          <ActionButton icon={PlayCircle} onClick={onResume}>
            Resume Queue
          </ActionButton>
        ) : (
          <ActionButton icon={PauseCircle} onClick={onPause} disabled={closed}>
            Pause Queue
          </ActionButton>
        )}

        <ActionButton icon={AlertTriangle} onClick={onReportDelay} disabled={closed}>
          Report Delay
        </ActionButton>

        <ActionButton icon={ArrowLeftRight} onClick={onChangeRoom} disabled={closed}>
          Change Room
        </ActionButton>

        <ActionButton
          icon={UserX}
          onClick={onAbsent}
          disabled={!selectedToken || closed}
          hint={selectedToken ? undefined : 'Select a token in the queue first'}
        >
          Patient Not Present
        </ActionButton>
      </div>

      <p className="mt-4 border-t border-admin-line pt-3.5 text-[12.5px] leading-relaxed text-muted-2">
        {selectedToken ? (
          <>
            Selected token: <span className="text-ivory-2">{selectedToken}</span>
          </>
        ) : (
          'Select a row in the queue to act on a specific token.'
        )}
      </p>
    </section>
  )
}

/**
 * The state banner shown above the queue. Carries the reason and the fact that
 * patients were told, because that is what staff need to confirm.
 */
export function QueueStatusBanner({ dept }: { dept: Department }) {
  if (dept.state === 'paused' && dept.pause) {
    return (
      <div className="rounded-xl border border-state-urgent/30 bg-state-urgent/8 p-5">
        <div className="flex gap-3.5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-state-urgent" strokeWidth={1.9} />
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-ivory">Queue is currently paused</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              Patients have been notified. They do not need to return yet.
            </p>

            <div className="mt-4 grid max-w-[420px] grid-cols-2 gap-3">
              <div className="rounded-lg border border-admin-line bg-admin-card px-4 py-2.5">
                <p className="text-[11.5px] uppercase tracking-[0.12em] text-muted-2">Reason</p>
                <p className="mt-1 text-[14px] text-ivory">{dept.pause.reason}</p>
              </div>
              <div className="rounded-lg border border-admin-line bg-admin-card px-4 py-2.5">
                <p className="text-[11.5px] uppercase tracking-[0.12em] text-muted-2">Paused at</p>
                <p className="mt-1 text-[14px] text-ivory tabular-nums">{dept.pause.at}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (dept.state === 'delayed' && dept.delay) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/8 p-5">
        <div className="flex gap-3.5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.9} />
          <div>
            <h3 className="text-[16px] font-semibold text-ivory">
              {dept.fullName} is experiencing a delay.
            </h3>
            <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-2 text-[14px]">
              <div>
                <dt className="text-[11.5px] uppercase tracking-[0.12em] text-muted-2">Reason</dt>
                <dd className="mt-0.5 text-ivory">{dept.delay.reason}</dd>
              </div>
              <div>
                <dt className="text-[11.5px] uppercase tracking-[0.12em] text-muted-2">
                  Expected delay
                </dt>
                <dd className="mt-0.5 text-ivory">{dept.delay.window}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[13.5px] text-muted">Patients have been notified.</p>
          </div>
        </div>
      </div>
    )
  }

  if (dept.state === 'resumed' && dept.resumedAt) {
    return (
      <div className="rounded-xl border border-sage/30 bg-sage/8 p-5">
        <div className="flex gap-3.5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage" strokeWidth={1.9} />
          <div>
            <h3 className="text-[16px] font-semibold text-ivory">Consultations have resumed</h3>
            <p className="mt-1 text-[14px] text-muted">All waiting patients have been notified.</p>
            <p className="mt-3 text-[13.5px] text-muted-2">
              Resumed at <span className="text-ivory-2 tabular-nums">{dept.resumedAt}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
