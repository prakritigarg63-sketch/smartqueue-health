import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthLogo, BackLink, Field, PrimaryButton } from '../components/AuthUI'
import { useSession } from '../sessionContext'
import { useAdmin, waitingCount } from '../../admin/adminContext'
import { hospitals } from '../../data/mock'

const selectClass =
  'w-full rounded-xl border border-field-border bg-field px-4 py-3.5 text-[15.5px] text-ivory transition-colors duration-200 focus:border-sage focus:outline-none'

export default function ConnectQueue() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isNew = params.get('new') === '1'

  const { connectQueue } = useSession()
  const { getDepartment } = useAdmin()
  const medicine = getDepartment('medicine')

  const [hospital, setHospital] = useState<string>(hospitals[0])
  const [token, setToken] = useState('A72')
  const [department, setDepartment] = useState('Medicine OPD')
  const [trackingFor, setTrackingFor] = useState<'self' | 'accompanying'>('self')
  const [patientName, setPatientName] = useState('')
  const [error, setError] = useState<string>()
  const [found, setFound] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!token.trim()) {
      setError('Please enter the token number from your OPD slip.')
      return
    }
    setError(undefined)
    connectQueue({
      deptId: 'medicine',
      token: token.trim().toUpperCase(),
      trackingFor,
      patientName: patientName.trim() || undefined,
    })
    setFound(true)
  }

  // ---- success state -------------------------------------------------------
  if (found && medicine) {
    const ahead = waitingCount(medicine)
    return (
      <div className="flex min-h-dvh flex-col bg-admin-bg px-6 py-8 lg:px-10">
        <AuthLogo />

        <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          <p className="flex items-center gap-2 text-[14px] font-medium text-sage">
            <CheckCircle2 className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden />
            Queue found
          </p>

          <div className="mt-5 rounded-2xl border border-sage/30 bg-admin-card p-6">
            <h1 className="display text-[26px] text-ivory">{medicine.fullName}</h1>
            <p className="mt-1.5 text-[14.5px] text-muted">
              {medicine.room} · {medicine.doctor}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-muted-2">Token</p>
                <p className="mt-1.5 text-[34px] font-semibold leading-none text-sage">
                  {token.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-muted-2">
                  Patients ahead
                </p>
                <p className="mt-1.5 text-[34px] font-semibold leading-none text-ivory tabular-nums">
                  {ahead}
                </p>
              </div>
            </div>

            {trackingFor === 'accompanying' && (
              <p className="mt-5 border-t border-admin-line pt-4 text-[13.5px] text-muted">
                You&rsquo;re tracking this queue for{' '}
                <span className="text-ivory-2">{patientName || 'someone you are accompanying'}</span>.
              </p>
            )}
          </div>

          <div className="mt-6">
            <PrimaryButton type="button" onClick={() => navigate('/queue')}>
              View Live Queue
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
                strokeWidth={2}
                aria-hidden
              />
            </PrimaryButton>
          </div>
        </main>
      </div>
    )
  }

  // ---- form ---------------------------------------------------------------
  return (
    <div className="flex min-h-dvh flex-col bg-admin-bg px-6 py-8 lg:px-10">
      <AuthLogo />

      <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
        {isNew && (
          <p className="flex items-center gap-2 text-[14px] font-medium text-sage">
            <CheckCircle2 className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden />
            Account created
          </p>
        )}

        <h1 className={`display text-[34px] text-ivory ${isNew ? 'mt-4' : ''}`}>
          Let&rsquo;s find your OPD queue
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
          Enter the details from your OPD registration slip.
        </p>

        <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="hospital" className="text-[13.5px] font-medium text-ivory-2">
              Hospital
            </label>
            <select
              id="hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className={selectClass}
            >
              {hospitals.map((h) => (
                <option key={h} value={h} className="bg-admin-card">
                  {h}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="OPD Token Number"
            placeholder="A72"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            error={error}
            className="uppercase"
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="department" className="text-[13.5px] font-medium text-ivory-2">
              OPD / Department <span className="font-normal text-muted-2">(optional)</span>
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={selectClass}
            >
              {['Medicine OPD', 'Orthopaedics OPD', 'ENT OPD', 'Paediatrics OPD'].map((d) => (
                <option key={d} value={d} className="bg-admin-card">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Attendants use the same account — no separate sign-up path. */}
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-1 text-[13.5px] font-medium text-ivory-2">
              Who are you tracking this queue for?
            </legend>
            {[
              { value: 'self', label: 'Myself' },
              { value: 'accompanying', label: "Someone I'm accompanying" },
            ].map((opt) => {
              const checked = trackingFor === opt.value
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[14.5px] transition-colors duration-200 ${
                    checked
                      ? 'border-sage/50 bg-sage/8 text-ivory'
                      : 'border-field-border text-muted hover:text-ivory'
                  }`}
                >
                  <input
                    type="radio"
                    name="trackingFor"
                    value={opt.value}
                    checked={checked}
                    onChange={() => setTrackingFor(opt.value as 'self')}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${
                      checked ? 'border-sage' : 'border-field-border'
                    }`}
                  >
                    {checked && <span className="h-[8px] w-[8px] rounded-full bg-sage" />}
                  </span>
                  {opt.label}
                </label>
              )
            })}
          </fieldset>

          {trackingFor === 'accompanying' && (
            <Field
              label="Patient Name"
              hint="(optional)"
              placeholder="Who are you accompanying?"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          )}

          <PrimaryButton type="submit">
            Track My Queue
            <ArrowRight
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
              strokeWidth={2}
              aria-hidden
            />
          </PrimaryButton>
        </form>

        <div className="mt-7 text-center">
          <BackLink to="/patient/login">Back</BackLink>
        </div>
      </main>
    </div>
  )
}
