export type QueueTone = 'ok' | 'warn' | 'urgent' | 'idle'

const toneStyles: Record<QueueTone, { dot: string; text: string }> = {
  ok: { dot: 'bg-state-ok', text: 'text-sage-ink' },
  warn: { dot: 'bg-state-warn', text: 'text-state-warn' },
  urgent: { dot: 'bg-state-urgent', text: 'text-state-urgent' },
  idle: { dot: 'bg-state-idle', text: 'text-state-idle' },
}

/**
 * Queue condition pill. The wording carries the status on its own — the
 * colour only reinforces it, so status is never communicated by colour alone.
 */
export function QueueStatus({ tone, label }: { tone: QueueTone; label: string }) {
  const styles = toneStyles[tone]

  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-surface/80 px-4 py-2">
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className={`absolute h-3 w-3 rounded-full ${styles.dot} opacity-25 animate-breathe`} />
          <span className={`relative h-[7px] w-[7px] rounded-full ${styles.dot}`} />
        </span>
        <span className={`text-[13px] font-medium ${styles.text}`}>{label}</span>
      </span>
    </div>
  )
}
