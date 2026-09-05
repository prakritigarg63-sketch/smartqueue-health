import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { AuthLogo, BackLink, Checkbox, Field, PrimaryButton } from '../components/AuthUI'
import { isValidMobile, useSession } from '../sessionContext'

interface Errors {
  name?: string
  mobile?: string
  password?: string
  confirm?: string
  terms?: string
}

export default function PatientRegister() {
  const navigate = useNavigate()
  const { registerPatient } = useSession()

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!name.trim()) next.name = 'Please enter your full name.'
    if (!isValidMobile(mobile)) next.mobile = 'Please enter a valid 10-digit mobile number.'
    if (password.length < 6) next.password = 'Please choose a password of at least 6 characters.'
    if (confirm !== password) next.confirm = 'Passwords do not match.'
    if (!agreed) next.terms = 'Please accept the Terms & Privacy Policy to continue.'
    setErrors(next)
    if (Object.keys(next).length) return

    registerPatient({ name: name.trim(), mobile, email: email.trim() || undefined })
    navigate('/patient/connect-queue?new=1')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-admin-bg px-6 py-8 lg:px-10">
      <AuthLogo />

      <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
        <h1 className="display text-[34px] text-ivory">Create your SmartQueue account</h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
          Register once to track your hospital visits and receive queue updates.
        </p>

        <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-5">
          <Field
            label="Full Name"
            autoComplete="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

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
            label="Email"
            hint="(optional)"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Field
            label="Password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
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

          <Field
            label="Confirm Password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />

          <Checkbox id="terms" checked={agreed} onChange={setAgreed} error={errors.terms}>
            I agree to the{' '}
            <a href="#terms" className="text-gold hover:underline">
              Terms &amp; Privacy Policy
            </a>
          </Checkbox>

          <PrimaryButton type="submit">
            Create Account
            <ArrowRight
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
              strokeWidth={2}
              aria-hidden
            />
          </PrimaryButton>
        </form>

        {/* Registration asks for nothing clinical — this is queue tracking. */}
        <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-admin-line bg-admin-card px-4 py-3 text-[13px] leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 h-[15px] w-[15px] shrink-0 text-gold" strokeWidth={1.7} aria-hidden />
          We only ask for what&rsquo;s needed to reach you about your turn. No ID numbers, no
          medical history.
        </p>

        <p className="mt-6 text-center text-[14px] text-muted">
          Already registered?{' '}
          <Link to="/patient/login" className="text-sage transition-colors duration-200 hover:text-sage-deep">
            Sign In
          </Link>
        </p>

        <div className="mt-6 text-center">
          <BackLink to="/login">Back to access options</BackLink>
        </div>
      </main>
    </div>
  )
}
