import { Check, Contrast } from 'lucide-react'
import { useTheme } from '../theme/themeContext'

/**
 * "Enhanced visual differentiation" — thicker status borders and stronger
 * shape cues.
 *
 * This is deliberately an enhancement, not the accessibility fix. Nobody has
 * to find this switch, or identify themselves as colour blind, to understand a
 * queue state: every state already carries an icon and a text label with it
 * turned off.
 */
export function EnhancedToggle({ className = '' }: { className?: string }) {
  const { enhanced, setEnhanced } = useTheme()

  return (
    <div className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-admin-line-2 bg-admin-card-2 px-4 py-3.5">
        <div className="flex gap-3">
          <Contrast className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold" strokeWidth={1.8} aria-hidden />
          <div>
            <p className="text-[14.5px] font-medium text-ivory">Enhanced visual differentiation</p>
            <p className="mt-1 max-w-[38rem] text-[13px] leading-relaxed text-muted">
              Adds stronger icons, borders and shape cues to status indicators.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enhanced}
          onClick={() => setEnhanced(!enhanced)}
          className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
            enhanced
              ? 'border-sage/50 bg-sage/15 text-sage-ink'
              : 'border-admin-line-2 text-muted hover:text-ivory'
          }`}
        >
          {enhanced && <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden />}
          {enhanced ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}
