interface LogoProps {
  className?: string
}

/**
 * A queue of dots resolving into a medical cross — a healthcare identity
 * rather than a product icon.
 */
export function LogoMark({ className = 'h-9 w-9' }: LogoProps) {
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label="SmartQueue Health">
      {[
        { cx: 5, cy: 9, o: 0.35 },
        { cx: 5, cy: 18, o: 0.55 },
        { cx: 5, cy: 27, o: 0.35 },
        { cx: 14, cy: 9, o: 0.6 },
        { cx: 14, cy: 18, o: 0.85 },
        { cx: 14, cy: 27, o: 0.6 },
      ].map(({ cx, cy, o }) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.1" fill="currentColor" opacity={o} />
      ))}
      <path
        d="M26 12.5v11M20.5 18h11"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 text-sage" />
      <div className="leading-none">
        <div className="display text-[26px] tracking-[-0.01em] text-ivory">SmartQueue</div>
        <div className="mt-1 text-[11px] font-medium tracking-[0.34em] text-sage">HEALTH</div>
      </div>
    </div>
  )
}
