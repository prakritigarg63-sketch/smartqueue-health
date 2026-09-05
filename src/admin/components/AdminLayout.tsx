import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Bell,
  Building2,
  ChartNoAxesColumn,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { LogoMark } from '../../components/Logo'
import { useAdmin } from '../adminContext'
import { useSession } from '../../auth/sessionContext'
import { NotificationToasts } from './NotificationToast'
import { ThemeToggle } from '../../components/ThemeToggle'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/queues', label: 'Live Queues', icon: ListOrdered, end: false },
  { to: '/admin/alerts', label: 'Alerts', icon: Bell, end: false },
  { to: '/admin/departments', label: 'Departments', icon: Building2, end: false },
  { to: '/admin/insights', label: 'Insights', icon: ChartNoAxesColumn, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col border-r border-admin-line bg-admin-bg-2">
      <Link
        to="/admin"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-6"
        aria-label="SmartQueue Health admin home"
      >
        <LogoMark className="h-7 w-7 text-sage" />
        <span className="leading-none">
          <span className="display block text-[19px] text-ivory">SmartQueue</span>
          <span className="mt-1 block text-[9px] font-medium tracking-[0.3em] text-sage">
            HEALTH
          </span>
        </span>
      </Link>

      <nav className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] transition-colors duration-200 ${
                    isActive
                      ? 'bg-sage/15 font-medium text-sage-ink'
                      : 'text-muted hover:bg-admin-card hover:text-ivory'
                  }`
                }
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-admin-line px-5 py-4">
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <Building2 className="h-4 w-4 text-gold" strokeWidth={1.7} aria-hidden />
          City Government Hospital
        </p>
      </div>
    </div>
  )
}

export function AdminHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { signOut, alerts } = useAdmin()
  const { signOut: endSession } = useSession()

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-4 border-b border-admin-line bg-admin-bg/95 px-5 backdrop-blur-[10px] lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-ivory lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle variant="bordered" />

        <button
          type="button"
          aria-label="Search"
          className="rounded-lg p-2.5 text-muted transition-colors duration-200 hover:bg-admin-card hover:text-ivory"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </button>

        <Link
          to="/admin/alerts"
          aria-label={`Alerts, ${alerts.length} recent`}
          className="relative rounded-lg p-2.5 text-muted transition-colors duration-200 hover:bg-admin-card hover:text-ivory"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.7} />
          {alerts.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-gold" />
          )}
        </Link>

        <div className="ml-2 flex items-center gap-3 border-l border-admin-line pl-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/20 text-[14px] font-semibold text-sage-ink">
            A
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[14px] font-medium text-ivory">Admin</span>
            <span className="block text-[12px] text-muted-2">Hospital Admin</span>
          </span>
          <button
            type="button"
            onClick={() => {
              signOut()
              endSession()
              // Real navigation: the admin guard would otherwise redirect to
              // /login the moment the session clears.
              window.location.assign('/')
            }}
            aria-label="Log out"
            title="Log out"
            className="rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-admin-card hover:text-ivory"
          >
            <LogOut className="h-[17px] w-[17px]" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </header>
  )
}

/** Fixed sidebar on desktop, off-canvas below it. */
export function AdminLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-admin-bg text-ivory">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] lg:block">
        <AdminSidebar />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-scrim"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-[260px]">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-5 z-10 rounded-lg p-2 text-muted"
            >
              <X className="h-5 w-5" />
            </button>
            <AdminSidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[236px]">
        <AdminHeader onOpenMenu={() => setMenuOpen(true)} />
        <main className="px-5 py-7 lg:px-8">{children}</main>
      </div>

      <NotificationToasts />
    </div>
  )
}
