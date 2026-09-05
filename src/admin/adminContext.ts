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
