import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const steps = [
  { title: 'Register', description: 'Complete your normal OPD registration.' },
  { title: 'Get Your Token', description: 'Your existing OPD token is connected to SmartQueue.' },
  { title: 'Track Your Turn', description: 'See which token is currently being served.' },
  {
    title: 'Wait Anywhere',
    description: "You don't need to continuously stand outside the OPD room.",
  },
  { title: 'Return When Alerted', description: 'We notify you when your turn is approaching.' },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-line bg-ink-2 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Five steps, and four of them already happen."
            lede="SmartQueue sits on top of the token you already receive. Nothing about your hospital registration changes."
          />
        </Reveal>

        <ol className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80} as="li" className="relative">
              {/* the rule that carries the sequence forward */}
              <span
                aria-hidden
                className="absolute left-0 right-0 top-[13px] hidden h-px bg-line lg:block"
              />
              <span
                aria-hidden
                className="relative z-10 block h-[7px] w-[7px] translate-y-[10px] rounded-full bg-sage-dim"
              />
              <div className="mt-8 flex items-baseline gap-3">
                <span className="display text-[15px] text-sage-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display text-[19px] text-ivory">{step.title}</h3>
              </div>
              <p className="mt-2.5 pr-4 text-[13.5px] font-light leading-[1.65] text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
