import { CheckCircle2, CircleSlash, Clock, PauseCircle, PlayCircle } from 'lucide-react'
import type { QueueState, TokenStatus } from '../types'

const queueStyles: Record<
  QueueState,
  { label: string; icon: typeof CheckCircle2; text: string; bg: string; ring: string }
> = {
  normal: {
    label: 'Queue moving normally',
    icon: CheckCircle2,
    text: 'text-sage-ink',
    bg: 'bg-sage/12',
    ring: 'ring-sage/25',
  },
  delayed: {
    label: 'Queue delayed',
    icon: Clock,
    text: 'text-gold',
    bg: 'bg-gold/12',
    ring: 'ring-gold/30',
  },
  paused: {
    label: 'Queue paused',
    icon: PauseCircle,
    text: 'text-state-urgent',
    bg: 'bg-state-urgent/12',
    ring: 'ring-state-urgent/30',
  },
  resumed: {
    label: 'Consultations resumed',
    icon: PlayCircle,
    text: 'text-sage-ink',
    bg: 'bg-sage/12',
    ring: 'ring-sage/25',
  },
  closed: {
    label: 'OPD closed',
    icon: CircleSlash,
    text: 'text-muted-2',
    bg: 'bg-muted-2/10',
    ring: 'ring-muted-2/25',
  },
}

/** Short form used inside dense tables. */
const shortLabel: Record<QueueState, string> = {
  normal: 'Normal',
  delayed: 'Delayed',
  paused: 'Paused',
  resumed: 'Resumed',
  closed: 'Closed',
}

interface StatusBadgeProps {
  state: QueueState
  /** `short` for table cells, `full` for headers and banners. */
  variant?: 'short' | 'full'
  className?: string
}

/**
 * Queue condition, always as icon + text. Colour reinforces the state but
 * never carries it alone.
 */
export function StatusBadge({ state, variant = 'short', className = '' }: StatusBadgeProps) {
  const s = queueStyles[state]
  const Icon = s.icon

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 ${s.bg} ${s.text} ${s.ring} ${className}`}
    >
      <Icon className="h-[15px] w-[15px]" strokeWidth={1.9} aria-hidden />
      {variant === 'short' ? shortLabel[state] : s.label}
    </span>
  )
}

const tokenStyles: Record<TokenStatus, { label: string; className: string }> = {
  consulting: { label: 'In Consultation', className: 'text-sage' },
  next: { label: 'Next', className: 'text-gold' },
  waiting: { label: 'Waiting', className: 'text-muted' },
  held: { label: 'Held', className: 'text-state-warn' },
  missed: { label: 'Missed', className: 'text-state-urgent' },
  completed: { label: 'Completed', className: 'text-muted-2' },
  onhold: { label: 'On Hold', className: 'text-state-urgent' },
}

/** Per-token status inside the queue table. */
export function TokenStatusLabel({ status }: { status: TokenStatus }) {
  const s = tokenStyles[status]
  return <span className={`text-[14px] font-medium ${s.className}`}>{s.label}</span>
}
