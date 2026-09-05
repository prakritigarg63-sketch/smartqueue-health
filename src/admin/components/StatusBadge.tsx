import {
  CheckCircle2,
  CircleDot,
  CircleX,
  Hourglass,
  PauseCircle,
  PlayCircle,
  TriangleAlert,
  UserRoundCheck,
  UserX,
} from 'lucide-react'
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
    icon: TriangleAlert,
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
    icon: CircleX,
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

const tokenStyles: Record<
  TokenStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  consulting: { label: 'In Consultation', className: 'text-status-normal', icon: UserRoundCheck },
  next: { label: 'Next', className: 'text-status-next', icon: CircleDot },
  waiting: { label: 'Waiting', className: 'text-muted', icon: Hourglass },
  held: { label: 'Held', className: 'text-status-delayed', icon: PauseCircle },
  missed: { label: 'Missed', className: 'text-status-paused', icon: UserX },
  completed: { label: 'Completed', className: 'text-muted-2', icon: CheckCircle2 },
  onhold: { label: 'On Hold', className: 'text-status-paused', icon: PauseCircle },
}

/** Per-token status inside the queue table. */
export function TokenStatusLabel({ status }: { status: TokenStatus }) {
  const s = tokenStyles[status]
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-2 text-[14px] font-medium ${s.className}`}>
      <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={2} aria-hidden />
      {s.label}
    </span>
  )
}
