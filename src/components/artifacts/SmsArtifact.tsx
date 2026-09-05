/**
 * The actual SMS a patient receives. Shown rather than described, because
 * this message is the whole product for anyone without a smartphone.
 */
export function SmsArtifact({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-[300px] ${className}`}>
      <p className="label mb-5">SMS &middot; 11:04</p>

      <div className="flex flex-col gap-3">
        <div className="rounded-[14px] rounded-tl-[4px] border border-line bg-surface px-4 py-3.5">
          <p className="text-[13px] font-light leading-[1.6] text-ivory-dim">
            SmartQueue: Token <span className="text-ivory">A72</span>, Medicine OPD. Now serving
            A57. 15 patients ahead. You may wait elsewhere.
          </p>
        </div>

        <div className="rounded-[14px] rounded-tl-[4px] border border-sage/25 bg-sage/[0.06] px-4 py-3.5">
          <p className="text-[13px] font-light leading-[1.6] text-ivory-dim">
            SmartQueue: Your turn is close.{' '}
            <span className="text-sage">5 patients ahead.</span> Please return to Medicine OPD, Room
            12 now.
          </p>
        </div>
      </div>

      <p className="mt-5 text-[11.5px] font-light leading-relaxed text-muted-2">
        No app, no login, no data connection required.
      </p>
    </div>
  )
}
