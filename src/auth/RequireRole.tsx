import { Navigate } from 'react-router-dom'
import { useSession, type Role } from './sessionContext'

/**
 * Mock route guard. A patient never lands in the hospital administration
 * system, and an unauthenticated visitor is sent to choose a role first.
 *
 * `/queue` accepts either role: it is the patient view, but the admin
 * dashboard deliberately links to it so staff can see what patients see.
 */
export function RequireRole({
  allow,
  children,
}: {
  allow: Role[]
  children: React.ReactNode
}) {
  const { session } = useSession()

  if (!session.loggedIn || !session.role) return <Navigate to="/login" replace />

  if (!allow.includes(session.role)) {
    return <Navigate to={session.role === 'admin' ? '/admin' : '/queue'} replace />
  }

  return <>{children}</>
}
