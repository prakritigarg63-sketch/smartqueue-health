import { RadioTower } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SmartQueuePhone } from '../components/SmartQueuePhone'
import { Logo } from '../components/Logo'
import { PatientAccountMenu } from '../components/PatientAccountMenu'
import { queueStatePresets, visit, type QueueState } from '../data/mock'
import { useAdmin, waitingCount } from '../admin/adminContext'
import type { Department } from '../admin/types'

/** `live` mirrors whatever hospital staff have done in the admin app. */
type ScreenState = QueueState | 'live'

const routes: { to: string; label: string; state: ScreenState }[] = [
  { to: '/queue', label: 'Live (mirrors admin)', state: 'live' },
  { to: '/queue/approaching', label: 'Turn approaching', state: 'approaching' },
  { to: '/queue/next', label: "You're next", state: 'next' },
  { to: '/queue/delay', label: 'Doctor delayed', state: 'paused' },
  { to: '/queue/complete', label: 'Completed', state: 'complete' },
]

/** Translate the operational queue state into what the patient is told. */
function livePreset(dept: Department) {
  const ahead = waitingCount(dept)

  switch (dept.state) {
    case 'paused':
      return {
        tone: 'urgent' as const,
        label: 'Queue temporarily paused',
        guidance: `${dept.pause?.reason ?? 'The doctor is temporarily unavailable'}. You don't need to return yet. We'll notify you when consultations resume.`,
        ahead,
      }
    case 'delayed':
      return {
        tone: 'warn' as const,
        label: 'Queue delayed',
        guidance: `${dept.delay?.reason ?? 'The queue is running late'}. Expected delay ${dept.delay?.window ?? 'unknown'}. You do not need to return yet.`,
        ahead,
      }
    case 'resumed':
      return {
        tone: 'resumed' as const,
        label: 'Consultations resumed',
        guidance: 'Your queue is moving again. Your position has been updated.',
        ahead,
      }
    case 'closed':
      return {
        tone: 'closed' as const,
        label: 'OPD closed',
        guidance: 'This OPD has closed for the day.',
        ahead: null,
      }
    default:
      return {
        tone: 'ok' as const,
        label: 'Queue moving normally',
        guidance: `You're safe to wait elsewhere. We'll alert you when ${visit.alertThreshold} patients remain.`,
        ahead,
      }
  }
}

export default function QueueDashboard({ state }: { state: ScreenState }) {
  const { getDepartment } = useAdmin()
  const dept = getDepartment('medicine')

  const isLive = state === 'live' && dept
  const preset = isLive ? livePreset(dept) : queueStatePresets[state as QueueState]
  const nowServing = isLive ? dept.nowServing : (preset as (typeof queueStatePresets)['normal']).nowServing
  const room = isLive ? dept.room : visit.room

  return (
    <div className="min-h-dvh bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-6 lg:px-10">
          <Link to="/" aria-label="SmartQueue Health home">
            <Logo />
          </Link>
          <PatientAccountMenu />
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-6 py-14 lg:px-10">
        <div className="text-center">
          <p className="label">{visit.hospital}</p>
          <h1 className="display mt-4 text-[clamp(1.9rem,3.4vw,2.5rem)] text-ivory">
            Your live queue
          </h1>
          <p className="mx-auto mt-3 max-w-[34rem] text-[15px] leading-relaxed text-muted">
            {preset.guidance}
          </p>

          {isLive && (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-sage/25 bg-sage/8 px-4 py-1.5 text-[12.5px] text-sage-ink">
              <RadioTower className="h-[14px] w-[14px]" strokeWidth={1.8} aria-hidden />
              Mirroring {dept.fullName} · {room} as managed by hospital staff
            </p>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <SmartQueuePhone
            nowServing={nowServing}
            ahead={preset.ahead}
            statusLabel={preset.label}
            tone={preset.tone}
            guidance={preset.guidance}
          />
        </div>

        <nav className="mx-auto mt-14 max-w-[760px] border-t border-line pt-8">
          <p className="label text-center">Prototype states</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {routes.map((route) => {
              const active = route.state === state
              return (
                <li key={route.to}>
                  <Link
                    to={route.to}
                    className={`border-b pb-1 text-[13.5px] font-light transition-colors duration-300 ${
                      active
                        ? 'border-sage text-sage'
                        : 'border-transparent text-muted hover:border-line-2 hover:text-ivory'
                    }`}
                  >
                    {route.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 text-center text-[13px] text-muted-2">
            Change the queue in{' '}
            <Link to="/admin/queues/medicine" className="link">
              Hospital Admin
            </Link>{' '}
            and this screen follows.
          </p>
        </nav>
      </main>
    </div>
  )
}
