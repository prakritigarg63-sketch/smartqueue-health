import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useAdmin } from '../adminContext'
import type { Toast } from '../types'

const tones = {
  success: { icon: CheckCircle2, className: 'text-sage', ring: 'border-sage/30' },
  warning: { icon: AlertTriangle, className: 'text-gold', ring: 'border-gold/30' },
  info: { icon: Info, className: 'text-ivory-2', ring: 'border-admin-line-2' },
} as const

export function NotificationToast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const tone = tones[toast.tone]
  const Icon = tone.icon

  return (
    <div
      role="status"
      className={`animate-toast flex w-[340px] items-start gap-3 rounded-xl border bg-admin-card-2 px-4 py-3.5 shadow-float ${tone.ring}`}
    >
      <Icon className={`mt-0.5 h-[17px] w-[17px] shrink-0 ${tone.className}`} strokeWidth={1.9} />
      <div className="flex-1">
        <p className="text-[14px] font-medium text-ivory">{toast.title}</p>
        {toast.detail && <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{toast.detail}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-mr-1 -mt-1 rounded p-1 text-muted-2 transition-colors duration-200 hover:text-ivory"
      >
        <X className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  )
}

export function NotificationToasts() {
  const { toasts, dismissToast } = useAdmin()
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed right-5 top-[84px] z-[80] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <NotificationToast toast={t} onDismiss={() => dismissToast(t.id)} />
        </div>
      ))}
    </div>
  )
}
