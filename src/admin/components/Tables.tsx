import { Link } from 'react-router-dom'
import { StatusBadge, TokenStatusLabel } from './StatusBadge'
import { waitingCount } from '../adminContext'
import type { Department, QueueEntry } from '../types'

export function TableShell({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-admin-line bg-admin-card">
      <div className="flex items-center justify-between gap-4 border-b border-admin-line px-5 py-4">
        <h2 className="text-[16px] font-semibold text-ivory">{title}</h2>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}

const th =
  'px-5 py-3 text-left text-[11.5px] font-medium uppercase tracking-[0.12em] text-muted-2 whitespace-nowrap'
const td = 'px-5 py-3.5 text-[14.5px] text-muted whitespace-nowrap'

/** Which OPDs need attention — the Overview's only real question. */
export function OPDTable({ departments }: { departments: Department[] }) {
  return (
    <TableShell title="OPD Status">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-admin-line">
            <th className={th}>Department</th>
            <th className={th}>Doctor</th>
            <th className={th}>Now Serving</th>
            <th className={th}>Waiting</th>
            <th className={th}>Status</th>
            <th className={`${th} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr
              key={d.id}
              className="border-b border-admin-line/60 last:border-0 transition-colors duration-200 hover:bg-admin-card-2"
            >
              <td className={`${td} font-medium text-ivory`}>{d.name}</td>
              <td className={td}>{d.doctor}</td>
              <td className={`${td} font-semibold text-ivory tabular-nums`}>{d.nowServing}</td>
              <td className={`${td} tabular-nums`}>{waitingCount(d)}</td>
              <td className={td}>
                <StatusBadge state={d.state} />
              </td>
              <td className={`${td} text-right`}>
                <Link
                  to={`/admin/queues/${d.id}`}
                  className="inline-block rounded-lg border border-admin-line-2 px-4 py-1.5 text-[13.5px] font-medium text-ivory-2 transition-colors duration-200 hover:border-sage/50 hover:text-sage"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  )
}

/** The live queue for one OPD. Rows are selectable so staff can act on a token. */
export function QueueTable({
  queue,
  selected,
  onSelect,
}: {
  queue: QueueEntry[]
  selected?: string
  onSelect?: (token: string) => void
}) {
  const visible = queue.filter((q) => q.status !== 'completed')

  return (
    <TableShell title="Current Queue">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr className="border-b border-admin-line">
            <th className={`${th} w-14`}>#</th>
            <th className={th}>Token</th>
            <th className={th}>Status</th>
            <th className={th}>Waiting Time</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((q, i) => {
            const isSelected = selected === q.token
            return (
              <tr
                key={q.token}
                onClick={() => onSelect?.(q.token)}
                tabIndex={onSelect ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onSelect(q.token)
                  }
                }}
                aria-selected={onSelect ? isSelected : undefined}
                className={`border-b border-admin-line/60 last:border-0 transition-colors duration-200 ${
                  onSelect ? 'cursor-pointer' : ''
                } ${isSelected ? 'bg-sage/10' : 'hover:bg-admin-card-2'}`}
              >
                <td className={`${td} text-muted-2 tabular-nums`}>{i + 1}</td>
                <td className={`${td} font-semibold text-ivory tabular-nums`}>{q.token}</td>
                <td className={td}>
                  <TokenStatusLabel status={q.status} />
                </td>
                <td className={`${td} tabular-nums`}>
                  {q.waitingMin === null ? '—' : `${q.waitingMin} min`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </TableShell>
  )
}

/** Department-wise summary on the Insights page. */
export function DepartmentSummary({
  rows,
}: {
  rows: { name: string; served: number; avgWait: string; interruptions: number }[]
}) {
  return (
    <TableShell title="Department-wise Summary">
      <table className="w-full min-w-[560px]">
        <thead>
          <tr className="border-b border-admin-line">
            <th className={th}>Department</th>
            <th className={th}>Patients Served</th>
            <th className={th}>Avg. Wait</th>
            <th className={th}>Interruptions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-admin-line/60 last:border-0">
              <td className={`${td} font-medium text-ivory`}>{r.name}</td>
              <td className={`${td} tabular-nums`}>{r.served}</td>
              <td className={`${td} tabular-nums`}>{r.avgWait}</td>
              <td className={`${td} tabular-nums`}>{r.interruptions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  )
}
