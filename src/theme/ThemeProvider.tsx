import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ENHANCED_KEY,
  THEME_KEY,
  ThemeContext,
  readStoredEnhanced,
  readStoredTheme,
  systemTheme,
  type ResolvedTheme,
  type Theme,
} from './themeContext'

/**
 * Owns the display preferences — theme, and the optional enhanced visual
 * differentiation — and keeps them on <html> as attributes.
 *
 * The first paint is handled by an inline script in index.html, so by the time
 * React mounts the attributes are already correct and nothing flashes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'system' : readStoredTheme(),
  )
  const [systemPref, setSystemPref] = useState<ResolvedTheme>(() =>
    typeof window === 'undefined' ? 'dark' : systemTheme(),
  )
  const [enhanced, setEnhancedState] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : readStoredEnhanced(),
  )

  // Derived, not stored: the preference plus the OS setting fully determine it.
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemPref : theme

  const first = useRef(true)

  useEffect(() => {
    const root = document.documentElement

    if (first.current) {
      first.current = false
      root.setAttribute('data-theme', resolvedTheme)
      return
    }

    root.classList.add('theme-switching')
    root.setAttribute('data-theme', resolvedTheme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'light' ? '#F5F3EB' : '#07100F')

    // Must outlast the 200ms transition: cancelling a var-derived colour
    // transition mid-flight leaves Chrome showing the previous value.
    const id = window.setTimeout(() => root.classList.remove('theme-switching'), 460)
    return () => window.clearTimeout(id)
  }, [resolvedTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-enhanced', String(enhanced))
  }, [enhanced])

  // Follow the operating system. The listener stays mounted so switching back
  // to 'system' picks up the current setting immediately.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemPref(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* private mode — the choice still applies for this session */
    }
    setThemeState(next)
  }, [])

  const setEnhanced = useCallback((on: boolean) => {
    try {
      localStorage.setItem(ENHANCED_KEY, String(on))
    } catch {
      /* private mode */
    }
    setEnhancedState(on)
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, enhanced, setEnhanced }),
    [theme, resolvedTheme, setTheme, enhanced, setEnhanced],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
