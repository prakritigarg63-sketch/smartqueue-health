import { useEffect, useState } from 'react'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ThemeChoices, ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'
import { useScrolled } from '../hooks/useScrolled'

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Patients', href: '#patients' },
  { label: 'For Hospitals', href: '#hospitals' },
  { label: 'Features', href: '#features' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact Us', href: '#contact' },
]

export function Navbar() {
  const scrolled = useScrolled(24)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const close = () => mq.matches && setMenuOpen(false)
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [])

  return (
    <header
      className={`animate-rise sticky top-0 z-20 border-b backdrop-blur-[12px] transition-colors duration-500 ${
        scrolled ? "border-line bg-ink/95" : "border-gold/10 bg-ink/90"
      }`}
    >
      <nav className="mx-auto flex h-[88px] max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-8">
        <a href="#top" aria-label="SmartQueue Health home" className="shrink-0">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 xl:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-[15px] text-ivory-2 transition-colors duration-300 hover:text-sage"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:block" />

          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-line-2 px-4 py-2.5 text-[15px] text-ivory-2 transition-colors duration-300 hover:border-gold/40 sm:flex"
          >
            <Globe className="h-[17px] w-[17px] text-muted" strokeWidth={1.6} />
            English
            <ChevronDown className="h-4 w-4 text-muted" strokeWidth={1.6} />
          </button>

          <Link
            to="/login"
            className="hidden rounded-xl bg-gradient-to-b from-sage to-sage-deep px-5 py-3 text-[15px] font-medium text-on-primary transition-[filter] duration-300 hover:brightness-110 sm:block"
          >
            Track My Queue
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="p-2 text-ivory xl:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <div
        className={`overflow-hidden bg-ink transition-[max-height,opacity] duration-400 xl:hidden ${
          menuOpen ? 'max-h-[460px] border-t border-line opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-6 py-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-line py-4 text-[16px] text-ivory-2"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="border-b border-line py-4">
            <p className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-muted-2">
              Appearance
            </p>
            <ThemeChoices />
          </li>
          <li className="flex flex-col gap-3 py-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-line-2 py-3 text-[15px] text-ivory-2"
            >
              <Globe className="h-[17px] w-[17px] text-muted" strokeWidth={1.6} />
              English
            </button>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-xl bg-gradient-to-b from-sage to-sage-deep py-3.5 text-center text-[16px] font-medium text-on-primary"
            >
              Track My Queue
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
