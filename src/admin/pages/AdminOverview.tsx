import { AdminLayout } from '../components/AdminLayout'
import { StatCard } from '../components/StatCard'
import { OPDTable } from '../components/Tables'
import { useAdmin, waitingCount } from '../adminContext'

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-[30px] text-ivory">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14.5px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// City Government Hospital runs 12 OPDs. Five are instrumented in this
// prototype and move live; the rest contribute fixed figures so the
// hospital-level KPIs stay realistic.
const UNTRACKED_OPDS = 8
const UNTRACKED_WAITING = 120
const UNTRACKED_DELAYED = 1

export default function AdminOverview() {
  const { departments } = useAdmin()

  const tracked = departments.filter((d) => d.state !== 'closed')
  const active = UNTRACKED_OPDS + tracked.length
  const waiting = UNTRACKED_WAITING + departments.reduce((sum, d) => sum + waitingCount(d), 0)
  const avgQueue = active ? Math.round(waiting / active) : 0
  const delayed =
    UNTRACKED_DELAYED +
    departments.filter((d) => d.state === 'delayed' || d.state === 'paused').length

  return (
    <AdminLayout>
      <PageHeading title="City Government Hospital" subtitle="Today · Tue, 12 Mar 2025" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active OPDs" value={active} />
        <StatCard label="Patients Waiting" value={waiting} />
        <StatCard label="Average Queue Length" value={avgQueue} unit="patients" />
        <StatCard
          label="Delayed OPDs"
          value={delayed}
          tone={delayed > 0 ? 'gold' : 'default'}
          hint={delayed > 0 ? 'Needs attention' : undefined}
        />
      </div>

      <OPDTable departments={departments} />
    </AdminLayout>
  )
}
