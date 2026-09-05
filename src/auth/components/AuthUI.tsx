import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { LogoMark } from '../../components/Logo'

/** Wordmark used at the top of every authentication screen. */
export function AuthLogo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 text-sage" />
      <span className="leading-none">
        <span className="display block text-[22px] text-ivory">SmartQueue</span>
        <span className="mt-1 block text-[10px] font-medium tracking-[0.3em] text-sage">
          HEALTH
        </span>
      </span>
    </Link>
  )
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-[14px] text-muted transition-colors duration-200 hover:text-ivory"
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={1.7}
        aria-hidden
      />
      {children}
    </Link>
  )
}

const inputBase =
  'w-full rounded-xl border bg-field px-4 py-3.5 text-[15.5px] text-ivory transition-colors duration-200 placeholder:text-muted-2 focus:outline-none'

// `prefix` is also a global HTML attribute typed as string, so it has to be
// dropped from the base props before being redeclared as a node.
interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string
  hint?: string
  error?: string
  /** Rendered inside the field, e.g. the +91 prefix or a reveal button. */
  prefix?: ReactNode
  suffix?: ReactNode
}

/**
 * Labelled input with inline validation. Errors are announced and tied to the
 * field, never surfaced through a browser alert.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, prefix, suffix, id, className = '', ...props },
  ref,
) {
  const fieldId = id ?? `f-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  const errorId = `${fieldId}-error`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-[13.5px] font-medium text-ivory-2">
        {label}
        {hint && <span className="ml-1.5 font-normal text-muted-2">{hint}</span>}
      </label>

      <div className="relative flex items-stretch">
        {prefix && (
          <span className="pointer-events-none absolute left-0 top-0 flex h-full items-center pl-4 text-[15px] text-muted">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
          className={`${inputBase} ${prefix ? 'pl-[68px]' : ''} ${suffix ? 'pr-12' : ''} ${
            error
              ? 'border-state-urgent/60 focus:border-state-urgent'
              : 'border-field-border focus:border-sage'
          } ${className}`}
        />
        {suffix && (
          <span className="absolute right-2 top-0 flex h-full items-center">{suffix}</span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-[13px] text-state-urgent">
          <AlertCircle className="h-[14px] w-[14px] shrink-0" strokeWidth={1.9} aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
})

/** Checkbox styled to the SmartQueue palette, keyboard operable. */
export function Checkbox({
  checked,
  onChange,
  children,
  id,
  error,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: ReactNode
  id: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-[14px] text-muted">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${
            checked ? 'border-sage bg-sage' : 'border-field-border'
          }`}
        >
          {checked && (
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
        <span>{children}</span>
      </label>
      {error && (
        <p role="alert" className="ml-7 text-[13px] text-state-urgent">
          {error}
        </p>
      )}
    </div>
  )
}

/** Primary action — sage, full width, 44px+ target. */
export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-sage px-6 py-3.5 text-[15.5px] font-semibold text-on-primary transition-colors duration-200 hover:bg-sage-deep disabled:cursor-not-allowed disabled:bg-sage/30"
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-gold/40 px-6 py-3.5 text-[15.5px] font-medium text-ivory transition-colors duration-200 hover:bg-gold/10"
    >
      {children}
    </button>
  )
}

export function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-admin-line" />
      <span className="text-[13px] text-muted-2">{label}</span>
      <span className="h-px flex-1 bg-admin-line" />
    </div>
  )
}
