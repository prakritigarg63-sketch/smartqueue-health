import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, CheckCircle2, Lock } from 'lucide-react'
import { AuthLogo, BackLink, Field, PrimaryButton } from '../components/AuthUI'
import { useSession } from '../sessionContext'
import { nextToken, useAdmin, waitingCount } from '../../admin/adminContext'
import { hospitals } from '../../data/mock'

const selectClass =
  'w-full rounded-xl border border-field-border bg-field px-4 py-3.5 text-[15.5px] text-ivory transition-colors duration-200 focus:border-sage focus:outline-none'

export default function ConnectQueue() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isNew = params.get('new') === '1'

  const { connectQueue } = useSession()
  const { departments, getDepartment } = useAdmin()

  // A closed OPD is not issuing tokens today, so it cannot be joined.
  const openDepartments = departments.filter((d) => d.state !== 'closed')

  const [hospital, setHospital] = useState<string>(hospitals[0])
  const [deptId, setDeptId] = useState(openDepartments[0]?.id ?? 'medicine')
  const [trackingFor, setTrackingFor] = useState<'self' | 'accompanying'>('self')
  const [patientName, setPatientName] = useState('')
  const [error, setError] = useState<string>()
  /** The token actually handed out, frozen at the moment of joining. */
  const [issued, setIssued] = useState<string>()

  const dept = getDepartment(deptId)
  const ahead = dept ? waitingCount(dept) : 0
  const token = dept ? nextToken(dept) : ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!dept) {
      setError('Choose an OPD that is open today.')
      return
    }
    setError(undefined)
    setIssued(token)
    connectQueue({
      deptId: dept.id,
      token,
      trackingFor,
      patientName: patientName.trim() || undefined,
    })
  }

  // ---- success state -------------------------------------------------------
  if (issued && dept) {
    return (
      <div className="flex min-h-dvh flex-col bg-admin-bg px-6 py-8 lg:px-10">
        <AuthLogo />

        <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          <p className="flex items-center gap-2 text-[14px] font-medium text-sage">
            <CheckCircle2 className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden />
            Token issued
          </p>

          <div className="mt-5 rounded-2xl border border-sage/30 bg-admin-card p-6">
            <h1 className="display text-[26px] text-ivory">{dept.fullName}</h1>
            <p className="mt-1.5 text-[14.5px] text-muted">
              {dept.room} &middot; {dept.doctor}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-muted-2">Your token</p>
                <p className="mt-1.5 text-[34px] font-semibold leading-none text-sage">{issued}</p>
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
                <span className="text-ivory-2">{patientName || 'someone you are accompanying'}</span>
                .
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
          Pick your hospital and OPD. Your token is issued from that queue&rsquo;s live waiting list.
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

          <div className="flex flex-col gap-2">
            <label htmlFor="department" className="text-[13.5px] font-medium text-ivory-2">
              OPD / Department
            </label>
            <select
              id="department"
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className={selectClass}
            >
              {openDepartments.map((d) => (
                <option key={d.id} value={d.id} className="bg-admin-card">
                  {d.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Issued by the hospital, not claimed by the patient: the number comes
              from the end of the live waiting list and cannot be typed over. */}
          <div className="flex flex-col gap-2">
            <span id="token-label" className="text-[13.5px] font-medium text-ivory-2">
              OPD Token Number
            </span>
            <div
              aria-labelledby="token-label"
              className="flex items-center justify-between gap-3 rounded-xl border border-field-border bg-field px-4 py-3.5"
            >
              <output className="text-[15.5px] font-semibold tracking-wide text-ivory">
                {token || '—'}
              </output>
              <span className="flex shrink-0 items-center gap-1.5 text-[12.5px] text-muted">
                <Lock className="h-[13px] w-[13px]" strokeWidth={2} aria-hidden />
                Assigned automatically
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted">
              {dept
                ? `Next in line at ${dept.fullName}. ${ahead} ${
                    ahead === 1 ? 'patient is' : 'patients are'
                  } ahead of you; now serving ${dept.nowServing}.`
                : 'Choose an OPD to be issued a token.'}
            </p>
            {error && (
              <p role="alert" className="text-[13px] text-state-urgent">
                {error}
              </p>
            )}
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
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                      checked ? 'border-sage bg-sage' : 'border-field-border'
                    }`}
                  >
                    {checked && (
                      <Check className="h-[11px] w-[11px] text-on-primary" strokeWidth={3} />
                    )}
                  </span>
                  {opt.label}
                  {checked && (
                    <span className="ml-auto text-[12px] font-medium text-sage-ink">Selected</span>
                  )}
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
            Join This Queue
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
