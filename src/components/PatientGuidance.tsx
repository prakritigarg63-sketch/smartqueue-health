import { Armchair, BellRing, MapPin, Navigation, PauseCircle } from 'lucide-react'
import { visit } from '../data/mock'
import type { QueueTone } from './QueueStatus'

export type GuidanceState = 'paused' | 'next' | 'nearby' | 'return' | 'wait'

/**
 * What the patient should physically do, right now.
 *
 * Each state has its own icon, its own heading and its own wording — no two
 * are separated by colour. Printed in black and white, "Safe to wait
 * elsewhere" and "Start heading back" remain unmistakably different
 * instructions, which is the whole point of the screen.
 */
const states: Record<
  GuidanceState,
  { icon: typeof Armchair; heading: string; tone: 'normal' | 'next' | 'paused' }
> = {
  paused: { icon: PauseCircle, heading: 'Queue temporarily paused', tone: 'paused' },
  next: { icon: BellRing, heading: "You're next", tone: 'next' },
  nearby: { icon: MapPin, heading: `Please stay near ${visit.room}`, tone: 'next' },
  return: { icon: Navigation, heading: 'Start heading back', tone: 'next' },
  wait: { icon: Armchair, heading: 'Safe to wait elsewhere', tone: 'normal' },
}

const toneClasses = {
  normal: { text: 'text-status-normal', border: 'border-status-normal/30', bg: 'bg-status-normal-bg' },
  next: { text: 'text-status-next', border: 'border-status-next/35', bg: 'bg-status-next-bg' },
  paused: { text: 'text-status-paused', border: 'border-status-paused/35', bg: 'bg-status-paused-bg' },
} as const

/** Derive the instruction from how far away the turn actually is. */
function guidanceFor(tone: QueueTone, ahead: number | null | undefined): GuidanceState {
  if (tone === 'urgent' || tone === 'idle') return 'paused'
  if (ahead === null || ahead === undefined) return 'wait'
  if (ahead <= 1) return 'next'
  if (ahead <= 2) return 'nearby'
  if (ahead <= visit.alertThreshold) return 'return'
  return 'wait'
}

function instructionFor(state: GuidanceState, ahead: number | null | undefined, room: string) {
  const n = ahead ?? 0
  const people = `${n} ${n === 1 ? 'patient is' : 'patients are'} ahead`

  switch (state) {
    case 'paused':
      return `You don't need to return yet. We'll notify you when consultations resume.`
    case 'next':
      return `Please be ready outside ${room}.`
    case 'nearby':
      return `Only ${people}.`
    case 'return':
      return `${people}. Please start returning to ${room}.`
    default:
      return `${people} of you. We'll alert you when ${visit.alertThreshold} remain.`
  }
}

interface PatientGuidanceProps {
  tone: QueueTone
  ahead: number | null | undefined
  room?: string
  /** Overrides the derived instruction; the heading and icon still apply. */
  instruction?: string
  className?: string
}

export function PatientGuidance({
  tone,
  ahead,
  room = visit.room,
  instruction,
  className = '',
}: PatientGuidanceProps) {
  const state = guidanceFor(tone, ahead)
  const { icon: Icon, heading, tone: t } = states[state]
  const c = toneClasses[t]
  const body = instruction ?? instructionFor(state, ahead, room)

  return (
    <div className={`status-chip flex gap-3 rounded-2xl border px-4 py-3.5 ${c.border} ${c.bg} ${className}`}>
      <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${c.text}`} strokeWidth={2} aria-hidden />
      <div>
        <p className={`text-[13.5px] font-semibold leading-tight ${c.text}`}>{heading}</p>
        <p className="mt-1 text-[12.5px] leading-[1.5] text-ivory-2">{body}</p>
      </div>
    </div>
  )
}
