import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import {
  AuthLogo,
  BackLink,
  Checkbox,
  Field,
  OrDivider,
  PrimaryButton,
  SecondaryButton,
} from '../components/AuthUI'
import { SmartQueuePhone } from '../../components/SmartQueuePhone'
import { isValidMobile, useSession } from '../sessionContext'

export default function PatientLogin() {
  const navigate = useNavigate()
  const { session, signInPatient } = useSession()

  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ mobile?: string; password?: string }>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isValidMobile(mobile)) next.mobile = 'Please enter a valid 10-digit mobile number.'
    if (!password) next.password = 'Please enter your password.'
    setErrors(next)
    if (Object.keys(next).length) return

    signInPatient(mobile)
    // A returning patient with a queue already connected goes straight to it.
    navigate(session.connectedQueue ? '/queue' : '/patient/connect-queue')
  }

  return (
    <div className="grid min-h-dvh bg-admin-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
      {/* ---------------- form ---------------- */}
      <div className="flex flex-col px-6 py-8 lg:px-12">
        <AuthLogo />

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <h1 className="display text-[38px] text-ivory">Welcome back</h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
            Sign in to track your OPD queue and receive turn updates.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-5">
            <Field
              label="Mobile Number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="98765 43210"
              prefix={<span className="border-r border-field-border pr-3">+91</span>}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              error={errors.mobile}
            />

            <Field
              label="Password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              suffix={
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="rounded-lg p-2 text-muted-2 transition-colors duration-200 hover:text-ivory"
                >
                  {show ? (
                    <EyeOff className="h-[17px] w-[17px]" strokeWidth={1.7} />
                  ) : (
                    <Eye className="h-[17px] w-[17px]" strokeWidth={1.7} />
                  )}
                </button>
              }
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Checkbox id="remember" checked={remember} onChange={setRemember}>
                Remember me
              </Checkbox>
              <a
                href="#reset"
                className="link text-[13.5px] transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            <PrimaryButton type="submit">
              Sign In &amp; Track Queue
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
                strokeWidth={2}
                aria-hidden
              />
            </PrimaryButton>

            <OrDivider label="New to SmartQueue?" />

            <Link to="/patient/register" className="contents">
              <SecondaryButton type="button">Create Patient Account</SecondaryButton>
            </Link>
          </form>

          <div className="mt-8">
            <BackLink to="/login">Back to access options</BackLink>
          </div>
        </div>
      </div>

      {/* ---------------- why you are signing in ---------------- */}
      <aside className="relative hidden overflow-hidden border-l border-admin-line lg:block">
        <picture>
          <source srcSet="/images/smartqueue-hospital-hero.webp" type="image/webp" />
          <img
            src="/images/smartqueue-hospital-hero.png"
            alt=""
            className="photo-grade-soft absolute inset-0 h-full w-full object-cover object-[58%_center]"
          />
        </picture>
        <div
          aria-hidden
          className="absolute inset-0 auth-wash-v"
        />

        <div className="relative flex h-full flex-col items-center justify-center px-10 py-12">
          <h2 className="display max-w-[10ch] text-center text-[38px] leading-[1.12] text-ivory">
            Wait Smarter. Live Better.
          </h2>

          <SmartQueuePhone
            className="mt-8 max-w-[300px]"
            nowServing="A59"
            ahead={13}
            statusLabel="Queue moving normally"
            tone="ok"
          />
        </div>
      </aside>
    </div>
  )
}
