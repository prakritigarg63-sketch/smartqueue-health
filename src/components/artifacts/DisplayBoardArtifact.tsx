/**
 * The corridor display board — the channel that reaches every patient in the
 * room at once, and the surface hospital staff already trust.
 */
export function DisplayBoardArtifact({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-[320px] ${className}`}>
      <p className="label mb-5">Corridor display &middot; Room 12</p>

      <div className="border border-line-2 bg-ink-2 p-6">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-2">
            Now serving
          </span>
          <span className="display text-[38px] leading-none text-ivory">A57</span>
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {[
            { token: 'A58', state: 'Next' },
            { token: 'A59', state: 'Waiting' },
            { token: 'A60', state: 'Waiting' },
          ].map((row, i) => (
            <li key={row.token} className="flex items-center justify-between">
              <span
                className={`text-[15px] tracking-wide ${i === 0 ? 'text-sage' : 'text-muted-2'}`}
              >
                {row.token}
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.16em] ${
                  i === 0 ? 'text-sage' : 'text-muted-2'
                }`}
              >
                {row.state}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
          <span className="h-[5px] w-[5px] rounded-full bg-state-ok" />
          <span className="text-[10px] uppercase tracking-[0.16em] text-state-ok">
            Queue moving normally
          </span>
        </div>
      </div>
    </div>
  )
}
