import { Landmark, Shield, ShieldCheck } from 'lucide-react'

const marks = [
  { icon: Shield, label: 'Secure' },
  { icon: ShieldCheck, label: 'Reliable' },
  { icon: Landmark, label: 'Built for Government Hospitals' },
]

/** Quiet credibility under the calls to action — gold marks, no badges. */
export function TrustRow({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      {marks.map(({ icon: Icon, label }, i) => (
        <li key={label} className="flex items-center gap-4">
          {/* separators only where the row actually stays on one line */}
          {i > 0 && (
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-gold/45 sm:block" />
          )}
          <span className="flex items-center gap-2.5">
            <Icon className="h-[17px] w-[17px] text-gold" strokeWidth={1.5} />
            <span className="text-[14px] text-muted">{label}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
