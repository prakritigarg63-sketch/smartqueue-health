/**
 * Single source of truth for the prototype's mock visit.
 * Everything the UI shows about "this patient" comes from here so the
 * queue screens can be extended without hunting through components.
 */

export const visit = {
  hospital: 'City Government Hospital',
  department: 'Medicine OPD',
  room: 'Room 12',
  doctor: 'Dr. Sharma',
  patientToken: 'A72',
  startingToken: 'A57',
  startingAhead: 15,
  alertThreshold: 5,
} as const

export const hospitals = [
  'City Government Hospital',
  'District General Hospital',
  'Government Medical College Hospital',
  'Taluk Government Hospital',
] as const

/** The queue conditions SmartQueue can express, used by /queue/* routes. */
export type QueueState = 'normal' | 'approaching' | 'next' | 'paused' | 'complete'

export interface QueueStatePreset {
  tone: 'ok' | 'warn' | 'urgent' | 'idle'
  label: string
  ahead: number | null
  nowServing: string
  guidance: string
}

export const queueStatePresets: Record<QueueState, QueueStatePreset> = {
  normal: {
    tone: 'ok',
    label: 'Queue moving normally',
    ahead: 15,
    nowServing: 'A57',
    guidance: 'You can wait elsewhere for now.',
  },
  approaching: {
    tone: 'warn',
    label: 'Turn approaching',
    ahead: 5,
    nowServing: 'A67',
    guidance: 'Please start returning to Room 12.',
  },
  next: {
    tone: 'urgent',
    label: "You're almost next",
    ahead: 2,
    nowServing: 'A70',
    guidance: 'Please remain near the consultation room.',
  },
  paused: {
    tone: 'idle',
    label: 'Queue temporarily paused',
    ahead: 12,
    nowServing: 'A60',
    guidance: "We'll notify you when consultations resume.",
  },
  complete: {
    tone: 'ok',
    label: 'Consultation completed',
    ahead: null,
    nowServing: 'A72',
    guidance: 'Your consultation is done. Please collect medicines from the pharmacy.',
  },
}
