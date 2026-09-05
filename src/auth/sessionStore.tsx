import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  SessionContext,
  emptySession,
  type ConnectedQueue,
  type Session,
} from './sessionContext'

const STORAGE_KEY = 'smartqueue.session.v1'

function load(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : emptySession
  } catch {
    return emptySession
  }
}

/**
 * Mock authentication for the prototype. No backend, no credential checking —
 * the point is the routing and the role split, not the security model.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() =>
    typeof window === 'undefined' ? emptySession : load(),
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      /* private mode — the prototype still works in memory */
    }
  }, [session])

  const signInPatient = useCallback((mobile: string, opts?: { name?: string }) => {
    // Returning patients keep whatever queue they had connected.
    setSession((s) => ({
      ...s,
      role: 'patient',
      loggedIn: true,
      mobile,
      name: opts?.name ?? s.name,
    }))
  }, [])

  const registerPatient = useCallback(
    (details: { name: string; mobile: string; email?: string }) =>
      setSession({
        role: 'patient',
        loggedIn: true,
        name: details.name,
        mobile: details.mobile,
        email: details.email,
      }),
    [],
  )

  const signInAdmin = useCallback(
    (email: string) => setSession({ role: 'admin', loggedIn: true, email, name: 'Admin' }),
    [],
  )

  const connectQueue = useCallback(
    (queue: ConnectedQueue) => setSession((s) => ({ ...s, connectedQueue: queue })),
    [],
  )

  /**
   * Clears storage synchronously as well as state. Callers follow this with a
   * real navigation to `/`: clearing the session while still sitting on a
   * guarded route otherwise re-renders that route's guard, which redirects to
   * `/login` and beats any client-side navigation to the landing page.
   */
  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* private mode */
    }
    setSession(emptySession)
  }, [])

  const value = useMemo(
    () => ({ session, signInPatient, registerPatient, signInAdmin, connectQueue, signOut }),
    [session, signInPatient, registerPatient, signInAdmin, connectQueue, signOut],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
