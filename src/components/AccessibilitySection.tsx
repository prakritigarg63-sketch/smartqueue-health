import { MessageSquare, Monitor, Smartphone, Users } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const channels = [
  { icon: Smartphone, label: 'Mobile Web', note: 'Open a link. Nothing to install.' },
  { icon: MessageSquare, label: 'SMS', note: 'Works on any phone, including 2G.' },
  { icon: Monitor, label: 'Hospital Display', note: 'The corridor screen, kept in sync.' },
  { icon: Users, label: "Attendant's Phone", note: 'A family member can watch your token.' },
]

export function AccessibilitySection() {
  return (
    <section id="access" className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="Access"
            title="No app required."
            lede="Not every patient needs to download another app. SmartQueue is designed to work through channels patients already understand."
          />
        </Reveal>

        <ul className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {channels.map((channel, i) => {
            const Icon = channel.icon
            return (
              <Reveal key={channel.label} delay={i * 70} as="li" className="border-t border-line pt-5">
                <Icon className="h-[17px] w-[17px] text-sage-dim" strokeWidth={1.4} />
                <div className="display mt-4 text-[18px] text-ivory">{channel.label}</div>
                <p className="mt-1.5 text-[13px] font-light leading-[1.6] text-muted">
                  {channel.note}
                </p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
