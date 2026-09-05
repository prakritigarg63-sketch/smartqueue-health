import { BarChart3, HeartHandshake, Users, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const items: { icon: LucideIcon; line1: string; line2: string }[] = [
  { icon: Users, line1: 'Reduce waiting', line2: 'room crowding' },
  { icon: HeartHandshake, line1: 'Improve patient', line2: 'experience' },
  { icon: Workflow, line1: 'Better OPD flow', line2: 'management' },
  { icon: BarChart3, line1: 'Data-driven hospital', line2: 'operations' },
]

/** Closes the first viewport: the promise on the left, the outcomes beside it. */
export function ImpactStrip() {
  return (
    <section className="border-t border-gold/15">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-9 lg:grid-cols-[auto_1fr] lg:gap-12 lg:px-8">
        <p className="display max-w-[15rem] text-[27px] leading-[1.3]">
          <span className="text-ivory">Trusted by hospitals.</span>
          <br />
          <span className="text-sage">Loved by patients.</span>
        </p>

        <ul className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
          {items.map(({ icon: Icon, line1, line2 }, i) => (
            <li
              key={line1}
              className={`flex items-center gap-4 lg:px-7 ${
                i > 0 ? 'lg:border-l lg:border-line' : ''
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30">
                <Icon className="h-[21px] w-[21px] text-gold" strokeWidth={1.4} />
              </span>
              <span className="text-[15px] leading-[1.35] text-ivory-2">
                {line1}
                <br />
                {line2}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
