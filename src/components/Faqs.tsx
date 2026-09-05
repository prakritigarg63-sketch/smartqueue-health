import { Plus } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const faqs = [
  {
    q: 'Does SmartQueue reduce my waiting time?',
    a: 'No. Waiting time depends on how many patients the hospital sees and how long each consultation takes. SmartQueue makes the wait predictable, so you know where you stand and when to come back.',
  },
  {
    q: 'Do I need to download an app?',
    a: 'No. SmartQueue works over mobile web and SMS, and the same queue is shown on hospital display screens. A family member can also track your token from their own phone.',
  },
  {
    q: 'What if I miss my turn?',
    a: 'The alert is deliberately conservative and reaches you well before your turn. Missed-token handling continues to follow your hospital’s existing policy — SmartQueue does not change how staff call patients.',
  },
  {
    q: 'Will it tell me my exact consultation time?',
    a: 'No, and that is intentional. Queues change when emergencies arrive or a doctor is called away. We show your position and how the queue is moving rather than a time that could turn out to be wrong.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. You enter the token number from your OPD slip. Your details are used only for managing that hospital visit.',
  },
]

export function Faqs() {
  return (
    <section id="faqs" className="border-t border-line bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="Questions" title="Frequently asked." />
        </Reveal>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <details className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <span className="display text-[18px] leading-snug text-ivory transition-colors duration-300 group-hover:text-sage">
                    {faq.q}
                  </span>
                  <Plus
                    className="h-4 w-4 shrink-0 text-muted-2 transition-transform duration-300 group-open:rotate-45"
                    strokeWidth={1.5}
                  />
                </summary>
                <p className="mt-4 max-w-[38rem] text-[14px] font-light leading-[1.75] text-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
