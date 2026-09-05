import { Activity, ArrowRight, Bell, Clock, MessageSquare, PlayCircle, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { TrustRow } from './TrustRow'
import { Link } from 'react-router-dom'

const featuresLeft: { icon: LucideIcon; label: string }[] = [
  { icon: Activity, label: 'Live queue updates' },
  { icon: Bell, label: 'Turn alerts' },
  { icon: Clock, label: 'Delay notifications' },
]

function FeatureRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="mt-px flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35">
        <Icon className="h-[17px] w-[17px] text-gold" strokeWidth={1.5} />
      </span>
      <span className="pt-1.5 text-[15.5px] leading-[1.4] text-ivory-2">{children}</span>
    </li>
  )
}

export function HeroContent() {
  return (
    <div className="animate-rise">
      {/* eyebrow pill */}
      <span className="inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-surface/60 px-4 py-2.5">
        <Shield className="h-[17px] w-[17px] text-gold" strokeWidth={1.5} />
        <span className="text-[14px] text-ivory-2">
          Powered by <span className="text-sage">Smart Hospitals</span>. Designed for Patients.
        </span>
      </span>

      <h1 className="display mt-8 text-[clamp(3.2rem,6.6vw,5.5rem)] text-ivory">
        Your Turn.
        <br />
        Your Time.
        <br />
        <span className="text-sage">Anywhere.</span>
      </h1>

      <p className="mt-6 max-w-[27rem] text-[16.5px] leading-[1.72] text-muted">
        SmartQueue Health helps you track your OPD queue in real time, get notified when your turn
        is near, and wait anywhere inside the hospital.
      </p>

      {/* feature list — three on the left, the access channel on the right */}
      <div className="mt-8 grid max-w-[34rem] gap-x-8 gap-y-5 sm:grid-cols-2">
        <ul className="flex flex-col gap-5">
          {featuresLeft.map(({ icon, label }) => (
            <FeatureRow key={label} icon={icon}>
              {label}
            </FeatureRow>
          ))}
        </ul>
        <ul>
          <FeatureRow icon={MessageSquare}>
            Multi-channel access
            <br />
            (Web, SMS)
          </FeatureRow>
        </ul>
      </div>

      {/* calls to action */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          to="/login"
          className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-sage to-sage-deep px-7 py-4 text-[16px] font-medium text-on-primary transition-[filter] duration-300 hover:brightness-110"
        >
          Track My Queue Now
          <ArrowRight
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-[3px]"
            strokeWidth={1.9}
          />
        </Link>

        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-3 rounded-xl border border-gold/40 px-7 py-4 text-[16px] font-medium text-ivory transition-colors duration-300 hover:bg-gold/10"
        >
          <PlayCircle className="h-[18px] w-[18px] text-gold" strokeWidth={1.6} />
          See How It Works
        </a>
      </div>

      <TrustRow className="mt-8" />
    </div>
  )
}
