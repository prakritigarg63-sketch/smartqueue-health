import { Link } from 'react-router-dom'
import { ArrowRight, Bell, BellRing, Building2, Check, ListOrdered, Send, Ticket, User } from 'lucide-react'
import { AuthLogo, BackLink } from '../components/AuthUI'

const patientBenefits = [
  { icon: Ticket, label: 'Track your token' },
  { icon: ListOrdered, label: 'See patients ahead' },
  { icon: BellRing, label: 'Receive turn alerts' },
]

const adminBenefits = [
  { icon: ListOrdered, label: 'Monitor live queues' },
  { icon: Bell, label: 'Manage delays' },
  { icon: Send, label: 'Notify waiting patients' },
]

function BenefitList({ items }: { items: { icon: typeof Check; label: string }[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-2.5">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5 text-[14px] text-muted">
          <Icon className="h-[15px] w-[15px] shrink-0 text-gold" strokeWidth={1.7} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  )
}

export default function RoleSelect() {
  return (
    <div className="flex min-h-dvh flex-col bg-admin-bg px-6 py-8 lg:px-10">
      <AuthLogo />

      <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col justify-center py-12">
        <div className="text-center">
          <p className="text-[11.5px] font-medium uppercase tracking-[0.2em] text-muted-2">
            Welcome to SmartQueue Health
          </p>
          <h1 className="display mt-5 text-[clamp(2rem,4.4vw,2.9rem)] text-ivory">
            How would you like to continue?
          </h1>
          <p className="mt-3 text-[15.5px] text-muted">
            Choose how you&rsquo;re using SmartQueue today.
          </p>
        </div>

        {/* Patient first in the DOM, so it is also first on a stacked screen
            and first in the tab order — this is primarily a patient action. */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="group flex flex-col rounded-2xl border border-sage/35 bg-admin-card p-6 shadow-[0_0_0_1px_rgba(142,172,116,0.06)] transition duration-200 hover:-translate-y-[3px] hover:border-sage/60 hover:shadow-float sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/15">
              <User className="h-[22px] w-[22px] text-sage" strokeWidth={1.7} aria-hidden />
            </span>

            <h2 className="display mt-5 text-[24px] text-ivory">Patient / Attendant</h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">
              Track an OPD queue, receive turn alerts, and know when it&rsquo;s time to return.
            </p>

            <BenefitList items={patientBenefits} />

            <Link
              to="/patient/login"
              className="group/btn mt-7 flex items-center justify-center gap-2.5 rounded-xl bg-sage px-6 py-3.5 text-[15.5px] font-semibold text-on-primary transition-colors duration-200 hover:bg-sage-deep"
            >
              Continue as Patient
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover/btn:translate-x-[3px]"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
          </article>

          <article className="group flex flex-col rounded-2xl border border-gold/25 bg-admin-card p-6 transition duration-200 hover:-translate-y-[3px] hover:border-gold/50 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/12">
              <Building2 className="h-[22px] w-[22px] text-gold" strokeWidth={1.7} aria-hidden />
            </span>

            <h2 className="display mt-5 text-[24px] text-ivory">Hospital Admin</h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">
              Monitor OPD queues, manage queue status, and keep patients informed.
            </p>

            <BenefitList items={adminBenefits} />

            <Link
              to="/admin/login"
              className="group/btn mt-7 flex items-center justify-center gap-2.5 rounded-xl border border-gold/45 px-6 py-3.5 text-[15.5px] font-medium text-ivory transition-colors duration-200 hover:bg-gold/10"
            >
              Admin Login
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover/btn:translate-x-[3px]"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
          </article>
        </div>

        <div className="mt-10 text-center">
          <BackLink to="/">Back to SmartQueue</BackLink>
        </div>
      </main>
    </div>
  )
}
