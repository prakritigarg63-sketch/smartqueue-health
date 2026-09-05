import { Bell, Info, Landmark, Menu, Wifi } from 'lucide-react'
import { useQueueSimulation } from '../hooks/useQueueSimulation'
import { visit } from '../data/mock'
import { QueueProgress } from './QueueProgress'
import { QueueStatus, type QueueTone } from './QueueStatus'
import { PatientGuidance } from './PatientGuidance'

interface SmartQueuePhoneProps {
  /** Let the queue advance on a timer, as it does in the hero. */
  live?: boolean
  nowServing?: string
  ahead?: number | null
  statusLabel?: string
  tone?: QueueTone
  guidance?: string
  className?: string
}

export function SmartQueuePhone({
  live = false,
  nowServing,
  ahead,
  statusLabel = 'Queue moving normally',
  tone = 'ok',
  guidance,
  className = '',
}: SmartQueuePhoneProps) {
  const sim = useQueueSimulation()

  const currentToken = live ? sim.nowServing : (nowServing ?? visit.startingToken)
  const patientsAhead = live ? sim.ahead : (ahead ?? visit.startingAhead)
  const progress = live ? sim.progress : 1 - (patientsAhead ?? 0) / (visit.startingAhead || 1)

  return (
    <div className={`relative mx-auto w-full max-w-[368px] ${className}`}>
      {/* device shell */}
      <div className="rounded-[46px] device-frame p-[3px] shadow-device">
        <div className="rounded-[43px] bg-[var(--color-device-2)] p-[5px]">
          <div className="relative overflow-hidden rounded-[38px] bg-screen">
            {/* notch */}
            <div className="absolute left-1/2 top-2.5 z-20 h-[27px] w-[112px] -translate-x-1/2 rounded-full bg-black" />

            {/* status bar */}
            <div className="relative z-10 flex items-center justify-between px-6 pb-2 pt-4 text-[12px] font-medium text-ivory-2">
              <span>10:42</span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="flex items-end gap-[2px]">
                  <i className="block h-1 w-[3px] rounded-[1px] bg-ivory-2/80" />
                  <i className="block h-[6px] w-[3px] rounded-[1px] bg-ivory-2/80" />
                  <i className="block h-2 w-[3px] rounded-[1px] bg-ivory-2/80" />
                  <i className="block h-[11px] w-[3px] rounded-[1px] bg-ivory-2/80" />
                </span>
                <Wifi className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span
                  aria-hidden
                  className="ml-0.5 flex h-[12px] w-[22px] items-center rounded-[3px] border border-ivory-2/55 p-[2px]"
                >
                  <i className="block h-full w-4/5 rounded-[1px] bg-ivory-2/80" />
                </span>
              </span>
            </div>

            {/* department header */}
            <div className="flex items-start justify-between px-6 pt-4">
              <span className="w-6" />
              <div className="text-center">
                <h3 className="text-[19px] font-medium text-ivory">{visit.department}</h3>
                <p className="mt-1 text-[13px] text-muted">
                  {visit.room} &middot; {visit.doctor}
                </p>
              </div>
              <Menu className="mt-1 h-5 w-5 text-muted" strokeWidth={1.8} />
            </div>

            {/* status */}
            <div className="mt-4 px-6">
              <QueueStatus tone={tone} label={statusLabel} />
            </div>

            {/* the token — the single most important thing on the screen */}
            <div className="px-6 pt-5 text-center">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.22em] text-muted-2">
                Your token
              </p>
              <p className="mt-1.5 text-[56px] font-light leading-none tracking-tight text-sage">
                {visit.patientToken}
              </p>
            </div>

            {/* now serving / patients ahead */}
            <div className="mt-6 grid grid-cols-2 px-6">
              <div className="border-r border-line pr-5 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-2">
                  Now serving
                </p>
                <p
                  key={currentToken}
                  className="animate-settle mt-2 text-[30px] font-medium leading-none text-ivory"
                >
                  {currentToken}
                </p>
              </div>
              <div className="pl-5 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-2">
                  Patients ahead
                </p>
                {patientsAhead === null ? (
                  <p className="mt-2 text-[30px] font-medium leading-none text-ivory">&mdash;</p>
                ) : (
                  <>
                    <p
                      key={patientsAhead}
                      className="animate-settle mt-2 text-[30px] font-medium leading-none text-ivory"
                    >
                      {patientsAhead}
                    </p>
                    <p className="mt-1 text-[12px] text-muted-2">patients</p>
                  </>
                )}
              </div>
            </div>

            {/* queue progress */}
            <div className="mt-5 px-6">
              <QueueProgress
                nowServing={currentToken}
                patientToken={visit.patientToken}
                progress={progress}
                ahead={patientsAhead}
              />
            </div>

            {/* guidance */}
            <div className="mt-5 px-6">
              <PatientGuidance tone={tone} ahead={patientsAhead} instruction={guidance} />
            </div>

            {/* alerts */}
            <div className="mt-3.5 px-6">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-line-2 bg-surface/70 py-3.5 text-[14px] font-medium text-ivory transition-colors duration-300 hover:border-sage/50"
              >
                <Bell className="h-4 w-4 text-status-next" strokeWidth={2} aria-hidden />
                Alerts ON
              </button>
            </div>

            {/* bottom navigation */}
            <div className="mt-5 grid grid-cols-2 border-t border-line">
              <span className="flex items-center justify-center gap-2 py-4 text-[13px] text-ivory-2">
                <Info className="h-4 w-4 text-muted" strokeWidth={1.7} />
                Queue Info
              </span>
              <span className="flex items-center justify-center gap-2 border-l border-line py-4 text-[13px] text-muted">
                <Landmark className="h-4 w-4" strokeWidth={1.7} />
                Hospital Info
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
