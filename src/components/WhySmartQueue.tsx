import { AlertTriangle, Bell, Clock, MapPin, MonitorSmartphone } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const features = [
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'See the current token and how many patients are ahead of you.',
  },
  {
    icon: Bell,
    title: 'Turn Alerts',
    description: 'We notify you when your turn is approaching so you never miss it.',
  },
  {
    icon: MapPin,
    title: 'Wait Anywhere',
    description: "You don't need to stand outside the consultation room for hours.",
  },
  {
    icon: AlertTriangle,
    title: 'Delay Notifications',
    description: 'Get updates if the doctor is delayed or the queue is paused.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Easy for Everyone',
    description: 'Access via mobile web, SMS, hospital displays, or through your attendant.',
  },
]

export function WhySmartQueue() {
  return (
    <section id="features" className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Why SmartQueue Health"
          title="Everything a waiting patient actually needs to know."
        />
      </Reveal>

      <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-0">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <Reveal
              key={feature.title}
              delay={i * 70}
              as="li"
              className={`border-t border-line pt-6 lg:px-7 ${
                i === 0 ? 'lg:pl-0' : ''
              } ${i === features.length - 1 ? 'lg:pr-0' : ''}`}
            >
              <Icon className="h-[18px] w-[18px] text-sage-dim" strokeWidth={1.4} />
              <h3 className="display mt-5 text-[19px] text-ivory">{feature.title}</h3>
              <p className="mt-2.5 text-[13.5px] font-light leading-[1.65] text-muted">
                {feature.description}
              </p>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
