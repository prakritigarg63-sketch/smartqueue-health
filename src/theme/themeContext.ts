import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_KEY = 'smartqueue-theme'
export const ENHANCED_KEY = 'smartqueue-enhanced-contrast'

export interface ThemeContextValue {
  /** What the user chose, including 'system'. */
  theme: Theme
  /** What is actually on screen right now. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  /**
   * "Enhanced visual differentiation" — an amplifier, not a fix. Every status
   * already carries an icon and a text label with this off.
   */
  enhanced: boolean
  setEnhanced: (on: boolean) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider')
  return ctx
}

export function systemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function readStoredEnhanced(): boolean {
  try {
    return localStorage.getItem(ENHANCED_KEY) === 'true'
  } catch {
    return false
  }
}
