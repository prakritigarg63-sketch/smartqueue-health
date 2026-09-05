import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Base dialog for every operational confirmation. Traps focus, restores it on
 * close, and closes on Escape — these actions change what patients are told,
 * so they should never be dismissed by accident or left un-navigable.
 */
export function Modal({ open, onClose, title, children, footer, width = 'max-w-[480px]' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    restoreRef.current = document.activeElement as HTMLElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      )
      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      restoreRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-scrim p-4"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-modal w-full ${width} rounded-2xl border border-admin-line-2 bg-admin-card-2 shadow-pop`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-admin-line px-6 py-4">
          <h2 className="text-[17px] font-semibold text-ivory">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-0.5 rounded-lg p-1.5 text-muted transition-colors duration-200 hover:bg-admin-card hover:text-ivory"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-admin-line px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  )
}

/** Shared button styles so every dialog confirms the same way. */
export function ModalCancel({ onClick, label = 'Cancel' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-admin-line-2 px-5 py-2.5 text-[14px] font-medium text-muted transition-colors duration-200 hover:text-ivory"
    >
      {label}
    </button>
  )
}

export function ModalConfirm({
  onClick,
  children,
  tone = 'sage',
}: {
  onClick: () => void
  children: ReactNode
  tone?: 'sage' | 'gold' | 'urgent'
}) {
  const tones = {
    sage: 'bg-sage text-on-primary hover:bg-sage-deep',
    gold: 'bg-gold text-on-primary hover:bg-gold-2',
    urgent: 'bg-state-urgent text-on-primary hover:brightness-110',
  } as const

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 ${tones[tone]}`}
    >
      {children}
    </button>
  )
}
