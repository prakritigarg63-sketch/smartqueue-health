import { createContext, useContext } from 'react'

export type Role = 'patient' | 'admin'

export interface ConnectedQueue {
  deptId: string
  token: string
  /** Whose visit this is — the same account serves patients and attendants. */
  trackingFor: 'self' | 'accompanying'
  patientName?: string
}

export interface Session {
  role: Role | null
  loggedIn: boolean
  name?: string
  mobile?: string
  email?: string
  connectedQueue?: ConnectedQueue
}

export const emptySession: Session = { role: null, loggedIn: false }

export interface SessionContextValue {
  session: Session
  signInPatient: (mobile: string, opts?: { name?: string }) => void
  registerPatient: (details: { name: string; mobile: string; email?: string }) => void
  signInAdmin: (email: string) => void
  connectQueue: (queue: ConnectedQueue) => void
  signOut: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside a SessionProvider')
  return ctx
}

/** Indian mobile numbers: ten digits, first one 6–9. */
export function isValidMobile(value: string) {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))
}
