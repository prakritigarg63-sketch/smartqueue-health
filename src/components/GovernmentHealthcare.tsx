import { Landmark, Plug, ShieldCheck, Users } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your data is used only for managing your hospital visit.',
  },
  {
    icon: Plug,
    title: 'Works With Existing Systems',
    description: 'Designed to integrate with existing HMIS and hospital token systems.',
  },
  {
    icon: Users,
    title: 'Accessible for All',
    description: 'Multi-language support and multiple access channels.',
  },
  {
    icon: Landmark,
    title: 'Designed for Scale',
    description: 'Built for different types of government hospitals and OPDs.',
  },
]

export function GovernmentHealthcare() {
  return (
    <section id="government" className="border-y border-line bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="Public health infrastructure" title="Built for government healthcare." />
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <Reveal
                key={pillar.title}
                delay={i * 80}
                className={`lg:px-9 ${i === 0 ? 'lg:pl-0' : 'lg:border-l lg:border-line'} ${
                  i === pillars.length - 1 ? 'lg:pr-0' : ''
                }`}
              >
                <Icon className="h-[18px] w-[18px] text-sage-dim" strokeWidth={1.4} />
                <h3 className="display mt-5 text-[19px] text-ivory">{pillar.title}</h3>
                <p className="mt-2.5 text-[13.5px] font-light leading-[1.65] text-muted">
                  {pillar.description}
                </p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
