import { BellRing, CircleCheck, CircleX, PauseCircle, PlayCircle, TriangleAlert } from 'lucide-react'

export type QueueTone = 'ok' | 'warn' | 'urgent' | 'idle' | 'next' | 'resumed' | 'closed'

/**
 * Each state carries four independent signals: an icon, a text label, a
 * distinct outline weight, and colour. Colour is the last of the four, so the
 * pill still reads correctly in greyscale or to anyone who cannot separate
 * sage from gold from terracotta.
 */
const toneStyles: Record<
  QueueTone,
  { icon: typeof CircleCheck; text: string; ring: string; bg: string }
> = {
  ok: {
    icon: CircleCheck,
    text: 'text-status-normal',
    ring: 'border-status-normal/45',
    bg: 'bg-status-normal-bg',
  },
  resumed: {
    icon: PlayCircle,
    text: 'text-status-normal',
    ring: 'border-status-normal/45',
    bg: 'bg-status-normal-bg',
  },
  warn: {
    icon: TriangleAlert,
    text: 'text-status-delayed',
    ring: 'border-status-delayed/50',
    bg: 'bg-status-delayed-bg',
  },
  next: {
    icon: BellRing,
    text: 'text-status-next',
    ring: 'border-status-next/50',
    bg: 'bg-status-next-bg',
  },
  urgent: {
    icon: PauseCircle,
    text: 'text-status-paused',
    ring: 'border-status-paused/50',
    bg: 'bg-status-paused-bg',
  },
  idle: {
    icon: PauseCircle,
    text: 'text-status-closed',
    ring: 'border-status-closed/45',
    bg: 'bg-status-closed-bg',
  },
  closed: {
    icon: CircleX,
    text: 'text-status-closed',
    ring: 'border-status-closed/45',
    bg: 'bg-status-closed-bg',
  },
}

export function QueueStatus({ tone, label }: { tone: QueueTone; label: string }) {
  const styles = toneStyles[tone]
  const Icon = styles.icon

  return (
    <div className="flex justify-center">
      <span
        role="status"
        aria-label={`Queue status: ${label}`}
        className={`status-chip inline-flex items-center gap-2 rounded-full border px-3.5 py-2 ${styles.ring} ${styles.bg}`}
      >
        <Icon className={`h-[15px] w-[15px] shrink-0 ${styles.text}`} strokeWidth={2} aria-hidden />
        <span className={`text-[13px] font-medium ${styles.text}`}>{label}</span>
      </span>
    </div>
  )
}
