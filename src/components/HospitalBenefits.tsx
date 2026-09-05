import { DisplayBoardArtifact } from './artifacts/DisplayBoardArtifact'
import { SectionHeading } from './SectionHeading'

const benefits = [
  'Reduce crowding near OPD rooms',
  'Fewer "When is my turn?" enquiries',
  'Improve patient experience',
  'Better visibility into queue flow',
]

export function HospitalBenefits() {
  return (
    <article id="hospitals" className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div>
        <SectionHeading
          eyebrow="For hospitals"
          title="Better patient experience. Smoother operations."
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

      <DisplayBoardArtifact className="lg:pt-14" />
    </article>
  )
}
