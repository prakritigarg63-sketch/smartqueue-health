import { createContext, useContext } from 'react'
import type { Department, PatientAlert, Toast } from './types'

export interface AdminContextValue {
  departments: Department[]
  alerts: PatientAlert[]
  toasts: Toast[]
  signedIn: boolean
  signIn: () => void
  signOut: () => void
  getDepartment: (id: string) => Department | undefined
  callNext: (id: string) => void
  reportDelay: (id: string, reason: string, window: string) => void
  pauseQueue: (id: string, reason: string) => void
  resumeQueue: (id: string) => void
  changeRoom: (id: string, room: string) => void
  markAbsent: (id: string, token: string, action: 'hold' | 'helpdesk') => void
  dismissToast: (id: string) => void
}

export const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside an AdminProvider')
  return ctx
}

/** Patients still to be seen — the number staff and patients both care about. */
export function waitingCount(dept: Department) {
  return dept.queue.filter((q) => q.status === 'waiting' || q.status === 'next').length
}

export function heldCount(dept: Department) {
  return dept.queue.filter((q) => q.status === 'held').length
}

/** Tokens are a per-department letter prefix followed by a number: A57, B31. */
const TOKEN_PATTERN = /^([A-Za-z]*)(\d+)$/

/**
 * The token the next patient to register would be handed: one past the highest
 * number this OPD has issued today.
 *
 * Derived from the live waiting list rather than typed in, so a patient can
 * never claim a token that does not exist or that belongs to someone else.
 * `nowServing` is included because a queue can be seeded — or drained — to the
 * point where it holds no entries at all.
 */
export function nextToken(dept: Department) {
  const base = TOKEN_PATTERN.exec(dept.nowServing)
  const prefix = base ? base[1].toUpperCase() : ''

  const highest = [dept.nowServing, ...dept.queue.map((q) => q.token)].reduce((max, t) => {
    const m = TOKEN_PATTERN.exec(t)
    return m && m[1].toUpperCase() === prefix ? Math.max(max, Number(m[2])) : max
  }, 0)

  return `${prefix}${highest + 1}`
}
