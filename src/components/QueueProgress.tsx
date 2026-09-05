const TOTAL_NODES = 7

interface QueueProgressProps {
  nowServing: string
  patientToken: string
  /** 0 → the queue has not moved, 1 → it has reached this patient. */
  progress: number
  ahead?: number | null
}

/**
 * The stretch of queue between the token being called and this patient's own.
 *
 * Every node is distinguished by SHAPE first and colour second: positions
 * already passed are solid discs, positions still waiting are hollow rings,
 * and the patient's own token is a rotated square. Rendered in greyscale the
 * three remain completely distinct.
 *
 * This visualisation is supplementary. The numbers above it — now serving,
 * patients ahead — are the primary information, and the whole strip carries a
 * single spoken description rather than making a screen reader enumerate dots.
 */
export function QueueProgress({
  nowServing,
  patientToken,
  progress,
  ahead,
}: QueueProgressProps) {
  const done = Math.max(1, Math.min(TOTAL_NODES, Math.round(progress * TOTAL_NODES) + 1))

  const spoken =
    ahead === null || ahead === undefined
      ? `Now serving token ${nowServing}. Your token is ${patientToken}.`
      : `Now serving token ${nowServing}. Your token is ${patientToken}. ${ahead} ${
          ahead === 1 ? 'patient is' : 'patients are'
        } ahead of you.`

  return (
    <div>
      <div className="flex items-center gap-2.5" role="img" aria-label={spoken}>
        <span className="shrink-0 rounded-full border border-status-normal/50 bg-status-normal-bg px-2.5 py-[3px] text-[11.5px] font-semibold text-status-normal">
          {nowServing}
        </span>

        <span aria-hidden className="relative flex flex-1 items-center justify-between px-1">
          <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-line-2" />

          {Array.from({ length: TOTAL_NODES }).map((_, i) =>
            i < done ? (
              // passed — solid disc
              <span
                key={i}
                className="queue-node-done relative h-[9px] w-[9px] rounded-full bg-status-normal text-status-normal transition-colors duration-700"
              />
            ) : (
              // still waiting — hollow ring
              <span
                key={i}
                className="queue-node-waiting relative h-[9px] w-[9px] rounded-full border-[1.5px] border-muted-2 bg-transparent"
              />
            ),
          )}

          {/* the patient's own position — a rotated square, never a circle */}
          <span className="queue-node-you relative h-[9px] w-[9px] rotate-45 border-[1.5px] border-status-next bg-status-next-bg text-status-next" />
        </span>

        <span className="shrink-0 rounded-full border border-status-next/60 bg-status-next-bg px-2.5 py-[3px] text-[11.5px] font-semibold text-status-next">
          {patientToken}
        </span>
      </div>

      <div className="mt-2 flex justify-between text-[11.5px] font-medium text-muted-2">
        <span>Now serving</span>
        <span>You</span>
      </div>
    </div>
  )
}
