import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, Bell, Check, Clock, PauseCircle, PlayCircle, UserX } from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import { PageHeading } from './AdminOverview'
import { StatCard, InsightsCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { DepartmentSummary, OPDTable, TableShell } from '../components/Tables'
import { useAdmin, waitingCount } from '../adminContext'
import { ThemeChoices } from '../../components/ThemeToggle'
import type { AlertKind, PatientAlert } from '../types'

// ---------------------------------------------------------------------------
// Live queues index
// ---------------------------------------------------------------------------

export function AdminQueues() {
  const { departments } = useAdmin()
  return (
    <AdminLayout>
      <PageHeading
        title="Live Queues"
        subtitle="Open an OPD to see what is happening right now and make operational changes."
      />
      <OPDTable departments={departments} />
    </AdminLayout>
  )
}

// ---------------------------------------------------------------------------
// Alert centre
// ---------------------------------------------------------------------------

const alertIcons: Record<AlertKind, typeof Bell> = {
  turn: Bell,
  delay: Clock,
  paused: PauseCircle,
  room: ArrowLeftRight,
  resumed: PlayCircle,
  missed: UserX,
}

const filters: { id: string; label: string; match: (a: PatientAlert) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'turn', label: 'Turn Alerts', match: (a) => a.kind === 'turn' },
  { id: 'delay', label: 'Delays', match: (a) => a.kind === 'delay' || a.kind === 'paused' },
  { id: 'room', label: 'Room Changes', match: (a) => a.kind === 'room' },
  { id: 'resumed', label: 'Queue Resumed', match: (a) => a.kind === 'resumed' },
  { id: 'missed', label: 'Missed Tokens', match: (a) => a.kind === 'missed' },
]

export function AlertList({ alerts }: { alerts: PatientAlert[] }) {
  if (!alerts.length) {
    return (
      <p className="rounded-xl border border-admin-line bg-admin-card px-5 py-10 text-center text-[14px] text-muted-2">
        No alerts of this kind yet today.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {alerts.map((a) => {
        const Icon = alertIcons[a.kind]
        return (
          <li
            key={a.id}
            className="rounded-xl border border-admin-line bg-admin-card p-4 transition-colors duration-200 hover:border-admin-line-2"
          >
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30">
                <Icon className="h-[17px] w-[17px] text-gold" strokeWidth={1.7} aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[15px] font-semibold text-ivory tabular-nums">
                    {a.token}
                  </span>
                  <span className="text-[14px] text-ivory-2">{a.title}</span>
                  <span className="text-[13px] text-muted-2">{a.department}</span>
                </div>
                <p className="mt-1 text-[13.5px] text-muted">{a.detail}</p>
                <p className="mt-2.5 rounded-lg border border-admin-line bg-admin-bg-2 px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
                  {a.message}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-sage">
                  <Check className="h-[14px] w-[14px]" strokeWidth={2.4} aria-hidden />
                  Sent
                </span>
                <p className="mt-1 text-[12.5px] text-muted-2 tabular-nums">{a.sentAt}</p>
                <p className="mt-0.5 text-[12px] text-muted-2">
                  {a.recipients} {a.recipients === 1 ? 'patient' : 'patients'}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function AdminAlerts() {
  const { alerts } = useAdmin()
  const [active, setActive] = useState('all')
  const filter = filters.find((f) => f.id === active) ?? filters[0]
  const visible = alerts.filter(filter.match)

  return (
    <AdminLayout>
      <PageHeading
        title="Patient Alerts"
        subtitle="Automatic notifications generated from queue activity."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = f.id === active
          const count = alerts.filter(f.match).length
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              aria-pressed={isActive}
              className={`rounded-lg border px-3.5 py-2 text-[13.5px] transition-colors duration-200 ${
                isActive
                  ? 'border-sage/45 bg-sage/15 font-medium text-sage-ink'
                  : 'border-admin-line-2 text-muted hover:text-ivory'
              }`}
            >
              {f.label}
              <span className="ml-2 text-[12px] text-muted-2 tabular-nums">{count}</span>
            </button>
          )
        })}
      </div>

      <AlertList alerts={visible} />
    </AdminLayout>
  )
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export function AdminDepartments() {
  const { departments } = useAdmin()

  return (
    <AdminLayout>
      <PageHeading title="Departments" subtitle="OPDs configured for this hospital." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => (
          <article
            key={d.id}
            className="rounded-xl border border-admin-line bg-admin-card p-5 transition-colors duration-200 hover:border-admin-line-2"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[17px] font-semibold text-ivory">{d.name}</h2>
              <StatusBadge state={d.state} />
            </div>

            <dl className="mt-4 flex flex-col gap-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-2">Doctor</dt>
                <dd className="text-ivory-2">{d.doctor}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-2">Room</dt>
                <dd className="text-ivory-2">{d.room}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-2">Current queue</dt>
                <dd className="text-ivory-2 tabular-nums">{waitingCount(d)} waiting</dd>
              </div>
            </dl>

            <Link
              to={`/admin/queues/${d.id}`}
              className="mt-4 inline-block rounded-lg border border-admin-line-2 px-4 py-2 text-[13.5px] font-medium text-ivory-2 transition-colors duration-200 hover:border-sage/50 hover:text-sage"
            >
              Manage queue
            </Link>
          </article>
        ))}
      </div>
    </AdminLayout>
  )
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

const hourly = [
  { hour: '8 AM', value: 22 },
  { hour: '9 AM', value: 48 },
  { hour: '10 AM', value: 96 },
  { hour: '11 AM', value: 112 },
  { hour: '12 PM', value: 74 },
  { hour: '1 PM', value: 41 },
  { hour: '2 PM', value: 52 },
  { hour: '3 PM', value: 30 },
]

function QueueVolumeChart() {
  const max = Math.max(...hourly.map((h) => h.value))
  const w = 720
  const h = 200
  const padX = 34
  const padY = 20
  const stepX = (w - padX * 2) / (hourly.length - 1)
  const y = (v: number) => h - padY - (v / max) * (h - padY * 2)
  const points = hourly.map((d, i) => [padX + i * stepX, y(d.value)] as const)
  const line = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join(' ')
  const area = `${line} L${points[points.length - 1][0]},${h - padY} L${points[0][0]},${h - padY} Z`
  const peakIndex = hourly.findIndex((d) => d.value === max)

  return (
    <section className="rounded-xl border border-admin-line bg-admin-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-ivory">Queue Volume by Hour</h2>
        <p className="text-[13px] text-muted-2">
          Peak <span className="text-gold">10:30 – 11:30 AM</span>
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-[200px] w-full min-w-[560px]" role="img"
          aria-label="Patients waiting by hour. Peak between 10 AM and 11 AM.">
          <defs>
            <linearGradient id="qv-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-sage)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((f) => (
            <line
              key={f}
              x1={padX}
              x2={w - padX}
              y1={padY + f * (h - padY * 2)}
              y2={padY + f * (h - padY * 2)}
              stroke="var(--color-admin-line)"
              strokeWidth="1"
            />
          ))}

          <path d={area} fill="url(#qv-fill)" />
          <path d={line} fill="none" stroke="var(--color-sage)" strokeWidth="2" strokeLinejoin="round" />

          {points.map(([px, py], i) => (
            <circle
              key={hourly[i].hour}
              cx={px}
              cy={py}
              r={i === peakIndex ? 5 : 3}
              fill={i === peakIndex ? 'var(--color-gold)' : 'var(--color-sage)'}
            />
          ))}

          {hourly.map((d, i) => (
            <text
              key={d.hour}
              x={padX + i * stepX}
              y={h - 4}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-muted-2)"
              fontFamily="Inter, sans-serif"
            >
              {d.hour}
            </text>
          ))}
        </svg>
      </div>
      <p className="mt-1 text-[12px] text-muted-2">Patients waiting</p>
    </section>
  )
}

const summaryRows = [
  { name: 'Medicine', served: 65, avgWait: '18 min', interruptions: 1 },
  { name: 'Orthopaedics', served: 48, avgWait: '28 min', interruptions: 1 },
  { name: 'ENT', served: 42, avgWait: '14 min', interruptions: 0 },
  { name: 'Dermatology', served: 31, avgWait: '16 min', interruptions: 1 },
  { name: 'Paediatrics', served: 28, avgWait: '12 min', interruptions: 0 },
]

export function AdminInsights() {
  const { alerts } = useAdmin()

  return (
    <AdminLayout>
      <PageHeading title="Today's OPD Summary" subtitle="Tue, 12 Mar 2025" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InsightsCard label="Patients Served" value={214} />
        <InsightsCard label="Peak Waiting" value={<span className="text-[22px]">10:30–11:30 AM</span>} />
        <InsightsCard label="Queue Interruptions" value={3} tone="gold" />
        <InsightsCard label="Missed Tokens" value={8} tone="gold" />
        <InsightsCard label="Patient Alerts Sent" value={401 + alerts.length - 4} />
        <InsightsCard label="Avg. Queue Length" value={15} unit="patients" />
      </div>

      <div className="mb-6">
        <QueueVolumeChart />
      </div>

      <DepartmentSummary rows={summaryRows} />
    </AdminLayout>
  )
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export function AdminSettings() {
  const { departments } = useAdmin()
  const medicine = departments.find((d) => d.id === 'medicine')

  return (
    <AdminLayout>
      <PageHeading title="Settings" subtitle="Queue behaviour for this hospital." />

      <div className="mb-4 rounded-xl border border-admin-line bg-admin-card p-5">
        <h2 className="text-[16px] font-semibold text-ivory">Appearance</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Choose how SmartQueue looks on this device.
        </p>
        <ThemeChoices className="mt-4 max-w-[420px]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TableShell title="Alert thresholds">
          <dl className="divide-y divide-admin-line">
            {[
              ['Turn-approaching alert', '5 patients remaining'],
              ['Delay notification', 'Sent on every reported delay'],
              ['Room change notification', 'Sent to all waiting patients'],
              ['Missed token handling', 'Hold token · patient sent to help desk'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-wrap justify-between gap-3 px-5 py-3.5">
                <dt className="text-[14px] text-muted">{k}</dt>
                <dd className="text-[14px] text-ivory-2">{v}</dd>
              </div>
            ))}
          </dl>
        </TableShell>

        <TableShell title="Delivery channels">
          <dl className="divide-y divide-admin-line">
            {[
              ['SMS', 'Enabled · all patients'],
              ['Mobile web', 'Enabled · token link'],
              ['Corridor display', `Enabled · ${medicine?.room ?? 'Room 12'}`],
              ['Attendant number', 'Enabled · up to 2 per token'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-wrap justify-between gap-3 px-5 py-3.5">
                <dt className="text-[14px] text-muted">{k}</dt>
                <dd className="text-[14px] text-ivory-2">{v}</dd>
              </div>
            ))}
          </dl>
        </TableShell>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Hospital" value={<span className="text-[18px]">City Government</span>} />
        <StatCard label="Departments" value={departments.length} />
        <StatCard label="Integration" value={<span className="text-[18px]">HMIS · read-only</span>} />
      </div>
    </AdminLayout>
  )
}
