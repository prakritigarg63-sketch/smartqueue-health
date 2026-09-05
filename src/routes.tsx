import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import QueueDashboard from './pages/QueueDashboard'
import { AdminProvider } from './admin/adminStore'
import { SessionProvider } from './auth/sessionStore'
import { RequireRole } from './auth/RequireRole'
import RoleSelect from './auth/pages/RoleSelect'
import PatientLogin from './auth/pages/PatientLogin'
import PatientRegister from './auth/pages/PatientRegister'
import ConnectQueue from './auth/pages/ConnectQueue'
import AdminLogin from './admin/pages/AdminLogin'
import AdminOverview from './admin/pages/AdminOverview'
import AdminQueueDetail from './admin/pages/AdminQueueDetail'
import {
  AdminAlerts,
  AdminDepartments,
  AdminInsights,
  AdminQueues,
  AdminSettings,
} from './admin/pages/AdminSecondary'

/**
 * Two sides of one product. SessionProvider carries the mock role; the
 * AdminProvider inside it holds the queue state both sides read, so an
 * operational change on the admin side is visible on the patient screen.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AdminProvider>
          <Routes>
            {/* public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<RoleSelect />} />

            {/* patient authentication */}
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/patient/register" element={<PatientRegister />} />
            <Route
              path="/patient/connect-queue"
              element={
                <RequireRole allow={['patient']}>
                  <ConnectQueue />
                </RequireRole>
              }
            />

            {/* patient queue — the admin dashboard links here too */}
            <Route
              path="/queue"
              element={
                <RequireRole allow={['patient', 'admin']}>
                  <QueueDashboard state="live" />
                </RequireRole>
              }
            />
            <Route
              path="/queue/delay"
              element={
                <RequireRole allow={['patient', 'admin']}>
                  <QueueDashboard state="paused" />
                </RequireRole>
              }
            />
            <Route
              path="/queue/approaching"
              element={
                <RequireRole allow={['patient', 'admin']}>
                  <QueueDashboard state="approaching" />
                </RequireRole>
              }
            />
            <Route
              path="/queue/next"
              element={
                <RequireRole allow={['patient', 'admin']}>
                  <QueueDashboard state="next" />
                </RequireRole>
              }
            />
            <Route
              path="/queue/complete"
              element={
                <RequireRole allow={['patient', 'admin']}>
                  <QueueDashboard state="complete" />
                </RequireRole>
              }
            />

            {/* hospital admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireRole allow={['admin']}>
                  <AdminOverview />
                </RequireRole>
              }
            />
            <Route
              path="/admin/queues"
              element={
                <RequireRole allow={['admin']}>
                  <AdminQueues />
                </RequireRole>
              }
            />
            <Route
              path="/admin/queues/:deptId"
              element={
                <RequireRole allow={['admin']}>
                  <AdminQueueDetail />
                </RequireRole>
              }
            />
            <Route
              path="/admin/alerts"
              element={
                <RequireRole allow={['admin']}>
                  <AdminAlerts />
                </RequireRole>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <RequireRole allow={['admin']}>
                  <AdminDepartments />
                </RequireRole>
              }
            />
            <Route
              path="/admin/insights"
              element={
                <RequireRole allow={['admin']}>
                  <AdminInsights />
                </RequireRole>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RequireRole allow={['admin']}>
                  <AdminSettings />
                </RequireRole>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminProvider>
      </SessionProvider>
    </BrowserRouter>
  )
}
