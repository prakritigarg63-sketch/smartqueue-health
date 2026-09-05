import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { Link } from 'react-router-dom'

export function FinalCTA() {
  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto flex max-w-[1320px] flex-col items-start gap-10 px-6 py-24 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-28">
        <div>
          <h2 className="display max-w-[18rem] text-[clamp(1.9rem,3.6vw,2.9rem)] text-ivory">
            Track your OPD queue in seconds.
          </h2>
          <p className="mt-4 text-[14.5px] font-light text-muted">No app download required.</p>
        </div>

        <Link
          to="/login"
          className="group inline-flex items-center gap-2.5 rounded-[9px] bg-sage px-7 py-4 text-[14.5px] font-medium text-on-primary transition-colors duration-300 hover:bg-sage-deep"
        >
          Track My Queue
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.75}
          />
        </Link>
      </Reveal>
    </section>
  )
}
