const TOTAL_DOTS = 7

interface QueueProgressProps {
  nowServing: string
  patientToken: string
  /** 0 → the queue has not moved, 1 → it has reached this patient. */
  progress: number
}

/**
 * The stretch of queue between the token being called and this patient's own.
 * Sage marks ground already covered; the patient's token is ringed in gold so
 * it reads as the destination rather than another step.
 */
export function QueueProgress({ nowServing, patientToken, progress }: QueueProgressProps) {
  const filled = Math.max(1, Math.min(TOTAL_DOTS, Math.round(progress * TOTAL_DOTS) + 1))

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 rounded-full border border-sage/45 px-2.5 py-[3px] text-[11.5px] font-medium text-sage">
          {nowServing}
        </span>

        <span className="relative flex flex-1 items-center justify-between px-1">
          <span
            aria-hidden
            className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-line-2"
          />
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <span
              key={i}
              className={`relative h-[7px] w-[7px] rounded-full transition-colors duration-700 ${
                i < filled ? 'bg-sage' : 'bg-faint'
              }`}
            />
          ))}
        </span>

        <span className="shrink-0 rounded-full border border-gold/60 px-2.5 py-[3px] text-[11.5px] font-medium text-gold">
          {patientToken}
        </span>
      </div>

      <div className="mt-2 flex justify-between text-[11.5px] text-muted-2">
        <span>Now</span>
        <span>You</span>
      </div>
    </div>
  )
}
