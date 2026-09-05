/** The five conditions an OPD queue can be in. Never shown by colour alone. */
export type QueueState = 'normal' | 'delayed' | 'paused' | 'resumed' | 'closed'

/** Where a single token sits in the day. */
export type TokenStatus =
  | 'consulting'
  | 'next'
  | 'waiting'
  | 'held'
  | 'missed'
  | 'completed'
  | 'onhold'

export interface QueueEntry {
  token: string
  status: TokenStatus
  /** Minutes waited so far; null once the patient is being seen. */
  waitingMin: number | null
}

export interface DelayInfo {
  reason: string
  window: string
}

export interface PauseInfo {
  reason: string
  at: string
}

export interface Department {
  id: string
  name: string
  fullName: string
  doctor: string
  room: string
  state: QueueState
  nowServing: string
  queue: QueueEntry[]
  delay?: DelayInfo
  pause?: PauseInfo
  resumedAt?: string
}

export type AlertKind = 'turn' | 'delay' | 'room' | 'resumed' | 'missed' | 'paused'

export interface PatientAlert {
  id: string
  token: string
  kind: AlertKind
  title: string
  detail: string
  /** The message SmartQueue generated — staff never write these. */
  message: string
  department: string
  sentAt: string
  recipients: number
}

export interface Toast {
  id: string
  title: string
  detail?: string
  tone: 'success' | 'warning' | 'info'
}
