import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Ticket, User } from 'lucide-react'
import { useSession } from '../auth/sessionContext'
import { ThemeChoices } from './ThemeToggle'

/** Account menu on the patient queue screen: who is signed in, and log out. */
export function PatientAccountMenu() {
  const { session, signOut } = useSession()
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

  const initial = (session.name ?? 'P').trim().charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2 text-[13.5px] text-ivory-2 transition-colors duration-300 hover:border-sage/45"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/20 text-[13px] font-semibold text-sage-ink">
          {initial}
        </span>
        <span className="hidden sm:inline">{session.name ?? 'My account'}</span>
        <ChevronDown className="h-4 w-4 text-muted" strokeWidth={1.7} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-modal absolute right-0 top-[calc(100%+8px)] z-50 w-[268px] rounded-xl border border-line-2 bg-ink-2 p-2 shadow-float"
        >
          <div className="border-b border-line px-3 py-2.5">
            <p className="flex items-center gap-2 text-[13.5px] text-ivory">
              <User className="h-[15px] w-[15px] text-muted" strokeWidth={1.7} aria-hidden />
              {session.name ?? 'Patient'}
            </p>
            {session.mobile && (
              <p className="mt-1 pl-[23px] text-[12.5px] text-muted-2">+91 {session.mobile}</p>
            )}
            {session.connectedQueue && (
              <p className="mt-2 flex items-center gap-2 pl-[1px] text-[12.5px] text-muted">
                <Ticket className="h-[14px] w-[14px] text-gold" strokeWidth={1.7} aria-hidden />
                Token {session.connectedQueue.token}
              </p>
            )}
          </div>

          <div className="border-b border-line px-3 py-3">
            <p className="mb-2.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-2">
              Appearance
            </p>
            <ThemeChoices />
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut()
              // A real navigation, not a client-side one: clearing the session
              // re-renders this guarded route, and its guard would otherwise
              // redirect to /login before the router reached the landing page.
              window.location.assign('/')
            }}
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] text-ivory-2 transition-colors duration-200 hover:bg-surface hover:text-ivory"
          >
            <LogOut className="h-[15px] w-[15px] text-muted" strokeWidth={1.7} aria-hidden />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
