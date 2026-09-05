import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  unit?: string
  /** `gold` marks a figure that needs attention; `muted` de-emphasises. */
  tone?: 'default' | 'gold' | 'urgent' | 'muted'
  hint?: string
}

const toneStyles = {
  default: 'text-ivory',
  gold: 'text-gold',
  urgent: 'text-state-urgent',
  muted: 'text-muted',
} as const

/** Compact KPI tile used across Overview, Live Queue and Insights. */
export function StatCard({ label, value, unit, tone = 'default', hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-admin-line bg-admin-card px-5 py-4 transition-colors duration-200 hover:border-admin-line-2">
      <p className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-2">{label}</p>
      <p className={`mt-2 flex items-baseline gap-1.5 ${toneStyles[tone]}`}>
        <span className="text-[30px] font-semibold leading-none tabular-nums">{value}</span>
        {unit && <span className="text-[13px] text-muted">{unit}</span>}
      </p>
      {hint && <p className="mt-1.5 text-[12px] text-muted-2">{hint}</p>}
    </div>
  )
}

/** Insights variant — same tile, lighter weight, used on the summary page. */
export function InsightsCard({ label, value, unit, tone = 'default', hint }: StatCardProps) {
  return <StatCard label={label} value={value} unit={unit} tone={tone} hint={hint} />
}
