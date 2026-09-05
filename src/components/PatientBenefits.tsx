import { SmsArtifact } from './artifacts/SmsArtifact'
import { SectionHeading } from './SectionHeading'

const benefits = [
  'Know your place in the queue',
  'Receive timely alerts',
  'Use your waiting time better',
  'Simple, safe and accessible',
]

export function PatientBenefits() {
  return (
    <article id="patients" className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div>
        <SectionHeading
          eyebrow="For patients & attendants"
          title="Stay informed. Save time. Reduce stress."
        />

        <ul className="mt-9 flex flex-col">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="border-b border-line py-3.5 text-[14.5px] font-light text-ivory-dim"
            >
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <SmsArtifact className="lg:pt-14" />
    </article>
  )
}
