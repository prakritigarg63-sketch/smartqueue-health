import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, HeartPulse, Landmark, Lock, Mail, Users } from 'lucide-react'
import { LogoMark } from '../../components/Logo'
import { useAdmin } from '../adminContext'
import { useSession } from '../../auth/sessionContext'
import { BackLink } from '../../auth/components/AuthUI'

const promises = [
  { icon: HeartPulse, label: 'Efficient OPDs' },
  { icon: Users, label: 'Informed Patients' },
  { icon: Building2, label: 'Smoother Operations' },
]

export default function AdminLogin() {
  const navigate = useNavigate()
  const { signIn } = useAdmin()
  const { signInAdmin } = useSession()
  const [email, setEmail] = useState('admin@cgh.gov.in')
  const [password, setPassword] = useState('smartqueue')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // Prototype: any credentials are accepted.
    signIn()
    signInAdmin(email)
    navigate('/admin')
  }

  return (
    <div className="grid min-h-dvh bg-admin-bg lg:grid-cols-2">
      {/* ---------------- credentials ---------------- */}
      <div className="flex items-center justify-center px-6 py-12 lg:px-14">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8 text-sage" />
            <span className="leading-none">
              <span className="display block text-[22px] text-ivory">SmartQueue</span>
              <span className="mt-1 block text-[10px] font-medium tracking-[0.3em] text-sage">
                HEALTH
              </span>
            </span>
          </div>

          <h1 className="display mt-10 text-[38px] text-ivory">Hospital Admin</h1>
          <p className="mt-2 text-[15px] text-muted">Sign in to manage OPD queues</p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-ivory-2">Hospital ID / Email</span>
              <span className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-2"
                  strokeWidth={1.7}
                  aria-hidden
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-admin-line-2 bg-admin-card py-3 pl-11 pr-4 text-[15px] text-ivory focus:border-sage focus:outline-none"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-ivory-2">Password</span>
              <span className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-2"
                  strokeWidth={1.7}
                  aria-hidden
                />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-admin-line-2 bg-admin-card py-3 pl-11 pr-11 text-[15px] text-ivory focus:border-sage focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-2 transition-colors duration-200 hover:text-ivory"
                >
                  {show ? (
                    <EyeOff className="h-[17px] w-[17px]" strokeWidth={1.7} />
                  ) : (
                    <Eye className="h-[17px] w-[17px]" strokeWidth={1.7} />
                  )}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between text-[13.5px]">
              <label className="flex cursor-pointer items-center gap-2.5 text-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`flex h-[17px] w-[17px] items-center justify-center rounded border transition-colors duration-200 ${
                    remember ? 'border-sage bg-sage' : 'border-admin-line-2'
                  }`}
                >
                  {remember && (
                    <svg viewBox="0 0 12 12" className="h-[10px] w-[10px] text-on-primary">
                      <path
                        d="M2 6.2 4.6 8.8 10 3.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                Remember me
              </label>
              <a href="#reset" className="text-gold transition-colors duration-200 hover:text-gold-2">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-sage py-3.5 text-[15px] font-semibold text-on-primary transition-colors duration-200 hover:bg-sage-deep"
            >
              Sign In
            </button>

            <div className="my-1 flex items-center gap-4">
              <span className="h-px flex-1 bg-admin-line" />
              <span className="text-[13px] text-muted-2">or</span>
              <span className="h-px flex-1 bg-admin-line" />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-admin-line-2 py-3.5 text-[15px] font-medium text-ivory-2 transition-colors duration-200 hover:border-gold/45"
            >
              <Landmark className="h-[17px] w-[17px] text-gold" strokeWidth={1.7} aria-hidden />
              Continue with Hospital SSO
            </button>
          </form>

          <div className="mt-8">
            <BackLink to="/login">Back to access options</BackLink>
          </div>
        </div>
      </div>

      {/* ---------------- the promise, over the hospital ---------------- */}
      <div className="relative hidden overflow-hidden lg:block">
        <picture>
          <source srcSet="/images/smartqueue-hospital-hero.webp" type="image/webp" />
          <img
            src="/images/smartqueue-hospital-hero.png"
            alt=""
            className="photo-grade-soft absolute inset-0 h-full w-full object-cover object-[62%_center]"
          />
        </picture>
        <div
          aria-hidden
          className="absolute inset-0 auth-wash"
        />

        <div className="relative flex h-full flex-col justify-center px-14">
          <h2 className="display max-w-[9ch] text-[52px] leading-[1.08] text-ivory">
            Better Queuing. Better Healthcare.
          </h2>

          <ul className="mt-10 flex flex-col gap-4">
            {promises.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/35">
                  <Icon className="h-[18px] w-[18px] text-gold" strokeWidth={1.6} aria-hidden />
                </span>
                <span className="text-[15.5px] text-ivory-2">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
