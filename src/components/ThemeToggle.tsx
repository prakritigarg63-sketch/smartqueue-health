import { useEffect, useRef, useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '../theme/themeContext'

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

interface ThemeToggleProps {
  /** `bare` sits on a transparent navbar; `bordered` sits in the admin header. */
  variant?: 'bare' | 'bordered'
  className?: string
}

/** Compact appearance control: icon button opening a three-option menu. */
export function ThemeToggle({ variant = 'bare', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // The icon shows what a click leads to, so the tooltip names the destination.
  const Icon = resolvedTheme === 'dark' ? Sun : Moon
  const tooltip = resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={tooltip}
        aria-label={tooltip}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          variant === 'bordered'
            ? 'rounded-lg p-2.5 text-muted transition-colors duration-200 hover:bg-admin-card hover:text-ivory'
            : 'rounded-lg p-2.5 text-muted transition-colors duration-200 hover:text-ivory'
        }
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Appearance"
          className="animate-modal absolute right-0 top-[calc(100%+8px)] z-[70] w-[186px] rounded-xl border border-line-2 bg-surface p-1.5 shadow-float"
        >
          <p className="px-3 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-2">
            Appearance
          </p>

          {options.map(({ value, label, icon: OptIcon }) => {
            const active = theme === value
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors duration-200 ${
                  active ? 'bg-sage/15 text-sage-ink' : 'text-ivory-2 hover:bg-surface-2'
                }`}
              >
                <OptIcon className="h-[16px] w-[16px]" strokeWidth={1.7} aria-hidden />
                {label}
                {active && <Check className="ml-auto h-4 w-4" strokeWidth={2.2} aria-hidden />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Inline segmented control, used inside menus and the Settings page. */
export function ThemeChoices({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ value, label, icon: OptIcon }) => {
          const active = theme === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-[13px] transition-colors duration-200 ${
                active
                  ? 'border-sage/50 bg-sage/12 text-sage-ink'
                  : 'border-line-2 text-muted hover:text-ivory'
              }`}
            >
              <OptIcon className="h-[17px] w-[17px]" strokeWidth={1.7} aria-hidden />
              {label}
            </button>
          )
        })}
      </div>
      <p className="mt-2.5 text-[12.5px] text-muted-2">
        Current: <span className="text-ivory-2">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
        {theme === 'system' && ' — following your device'}
      </p>
    </div>
  )
}
