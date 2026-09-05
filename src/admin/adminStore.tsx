import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Department, PatientAlert, QueueEntry, Toast } from './types'
import { AdminContext, waitingCount } from './adminContext'

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

function entry(token: string, status: QueueEntry['status'], waitingMin: number | null): QueueEntry {
  return { token, status, waitingMin }
}

// A57 in consultation, A58 next, then A59–A72 waiting: 15 still to be seen.
// A72 is deliberately the last token — it is the one the patient-facing
// screens follow, so both sides of the product describe the same visit.
const medicineQueue: QueueEntry[] = [
  entry('A57', 'consulting', null),
  entry('A58', 'next', null),
  ...Array.from({ length: 14 }, (_, i) => entry(`A${59 + i}`, 'waiting', 12 + i * 13)),
]

const seedDepartments: Department[] = [
  {
    id: 'medicine',
    name: 'Medicine',
    fullName: 'Medicine OPD',
    doctor: 'Dr. Sharma',
    room: 'Room 12',
    state: 'normal',
    nowServing: 'A57',
    queue: medicineQueue,
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics',
    fullName: 'Orthopaedics OPD',
    doctor: 'Dr. Mehta',
    room: 'Room 4',
    state: 'delayed',
    nowServing: 'B31',
    queue: [
      entry('B31', 'consulting', null),
      entry('B32', 'next', null),
      ...Array.from({ length: 21 }, (_, i) => entry(`B${33 + i}`, 'waiting', 14 + i * 4)),
    ],
    delay: { reason: 'Consultation running slower than expected', window: '20–40 min' },
  },
  {
    id: 'ent',
    name: 'ENT',
    fullName: 'ENT OPD',
    doctor: 'Dr. Rao',
    room: 'Room 7',
    state: 'normal',
    nowServing: 'C18',
    queue: [
      entry('C18', 'consulting', null),
      entry('C19', 'next', null),
      ...Array.from({ length: 7 }, (_, i) => entry(`C${20 + i}`, 'waiting', 9 + i * 6)),
    ],
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    fullName: 'Dermatology OPD',
    doctor: 'Dr. Singh',
    room: 'Room 9',
    state: 'closed',
    nowServing: 'D14',
    queue: [],
  },
  {
    id: 'paediatrics',
    name: 'Paediatrics',
    fullName: 'Paediatrics OPD',
    doctor: 'Dr. Nair',
    room: 'Room 3',
    state: 'normal',
    nowServing: 'E25',
    queue: [
      entry('E25', 'consulting', null),
      entry('E26', 'next', null),
      ...Array.from({ length: 18 }, (_, i) => entry(`E${27 + i}`, 'waiting', 8 + i * 5)),
    ],
  },
]

const seedAlerts: PatientAlert[] = [
  {
    id: 'seed-1',
    token: 'A72',
    kind: 'turn',
    title: 'Turn approaching',
    detail: '5 patients ahead',
    message:
      'SmartQueue: Your turn is close. 5 patients ahead. Please return to Medicine OPD, Room 12.',
    department: 'Medicine OPD',
    sentAt: '10:12 AM',
    recipients: 1,
  },
  {
    id: 'seed-2',
    token: 'B44',
    kind: 'delay',
    title: 'Queue delayed',
    detail: 'Consultation running slower than expected · 20–40 min',
    message:
      'SmartQueue: Orthopaedics OPD is running late. Expected delay 20–40 min. You do not need to return yet.',
    department: 'Orthopaedics OPD',
    sentAt: '09:54 AM',
    recipients: 22,
  },
  {
    id: 'seed-3',
    token: 'C21',
    kind: 'turn',
    title: 'Turn approaching',
    detail: '5 patients ahead',
    message: 'SmartQueue: Your turn is close. 5 patients ahead. Please return to ENT OPD, Room 7.',
    department: 'ENT OPD',
    sentAt: '09:31 AM',
    recipients: 1,
  },
  {
    id: 'seed-4',
    token: 'E30',
    kind: 'missed',
    title: 'Token held',
    detail: 'Patient not present when called',
    message:
      'SmartQueue: Your token was called, but you were not present. Please return to the OPD help desk.',
    department: 'Paediatrics OPD',
    sentAt: '09:18 AM',
    recipients: 1,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function now() {
  return new Date()
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase()
}

let seq = 0
const nextId = () => `alert-${++seq}`

// ---------------------------------------------------------------------------
// Persistence
//
// The admin app and the patient screen are separate documents — the patient
// view opens in its own tab. Mirroring only means something if the state
// survives that, so it is persisted and changes are broadcast between tabs.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'smartqueue.admin.v1'

interface Persisted {
  departments: Department[]
  alerts: PatientAlert[]
}

function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Persisted) : null
  } catch {
    return null
  }
}

function save(data: Persisted) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* private mode, quota — the prototype still works in-memory */
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export function AdminProvider({ children }: { children: ReactNode }) {
  const restored = typeof window === 'undefined' ? null : load()
  const [departments, setDepartments] = useState<Department[]>(
    restored?.departments ?? seedDepartments,
  )
  const [alerts, setAlerts] = useState<PatientAlert[]>(restored?.alerts ?? seedAlerts)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [signedIn, setSignedIn] = useState(false)

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((t) => [...t, { ...toast, id }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000)
  }, [])

  const pushAlert = useCallback(
    (a: Omit<PatientAlert, 'id' | 'sentAt'>) =>
      setAlerts((list) => [{ ...a, id: nextId(), sentAt: now() }, ...list]),
    [],
  )

  const dismissToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  )

  const update = useCallback(
    (id: string, fn: (d: Department) => Department) =>
      setDepartments((list) => list.map((d) => (d.id === id ? fn(d) : d))),
    [],
  )

  const getDepartment = useCallback(
    (id: string) => departments.find((d) => d.id === id),
    [departments],
  )

  // -- operational actions -------------------------------------------------
  // Each one changes queue state, then lets SmartQueue derive the patient
  // messaging. Staff never compose a notification or renumber a queue.

  const callNext = useCallback(
    (id: string) => {
      const dept = departments.find((d) => d.id === id)
      if (!dept) return

      const nextEntry = dept.queue.find((q) => q.status === 'next')
      if (!nextEntry) return

      // Recalculated automatically: consulting completes, next starts, the
      // following waiting token becomes next.
      let promoted = false
      const queue = dept.queue.map((q) => {
        if (q.status === 'consulting') return { ...q, status: 'completed' as const }
        if (q.token === nextEntry.token) return { ...q, status: 'consulting' as const, waitingMin: null }
        if (!promoted && q.status === 'waiting') {
          promoted = true
          return { ...q, status: 'next' as const, waitingMin: null }
        }
        return q
      })

      update(id, (d) => ({ ...d, queue, nowServing: nextEntry.token }))

      const remaining = queue.filter((q) => q.status === 'waiting' || q.status === 'next').length
      const approaching = queue.filter((q) => q.status === 'waiting').slice(0, 5).pop()

      if (approaching) {
        pushAlert({
          token: approaching.token,
          kind: 'turn',
          title: 'Turn approaching',
          detail: '5 patients ahead',
          message: `SmartQueue: Your turn is close. 5 patients ahead. Please return to ${dept.fullName}, ${dept.room}.`,
          department: dept.fullName,
          recipients: 1,
        })
      }

      pushToast({
        tone: 'success',
        title: `${nextEntry.token} called successfully.`,
        detail: `Patient queue positions have been updated. ${remaining} waiting.`,
      })
    },
    [departments, update, pushAlert, pushToast],
  )

  const reportDelay = useCallback(
    (id: string, reason: string, window: string) => {
      const dept = departments.find((d) => d.id === id)
      if (!dept) return
      const count = waitingCount(dept)

      update(id, (d) => ({ ...d, state: 'delayed', delay: { reason, window } }))

      pushAlert({
        token: `${count} patients`,
        kind: 'delay',
        title: 'Queue delayed',
        detail: `${reason} · ${window}`,
        message: `SmartQueue: ${dept.fullName} is running late. Reason: ${reason}. Expected delay ${window}. You do not need to return yet — we will tell you when the queue moves again.`,
        department: dept.fullName,
        recipients: count,
      })

      pushToast({
        tone: 'warning',
        title: 'Delay reported.',
        detail: `${count} waiting patients notified.`,
      })
    },
    [departments, update, pushAlert, pushToast],
  )

  const pauseQueue = useCallback(
    (id: string, reason: string) => {
      const dept = departments.find((d) => d.id === id)
      if (!dept) return
      const count = waitingCount(dept)
      const at = now()

      // Positions are frozen: the consulting token goes on hold, nothing advances.
      update(id, (d) => ({
        ...d,
        state: 'paused',
        pause: { reason, at },
        queue: d.queue.map((q) =>
          q.status === 'consulting' ? { ...q, status: 'onhold' as const } : q,
        ),
      }))

      pushAlert({
        token: `${count} patients`,
        kind: 'paused',
        title: 'Queue paused',
        detail: reason,
        message: `SmartQueue: ${dept.fullName} queue is temporarily paused. ${reason}. You don't need to return yet. We'll notify you when consultations resume.`,
        department: dept.fullName,
        recipients: count,
      })

      pushToast({
        tone: 'warning',
        title: 'Queue paused.',
        detail: `${count} waiting patients notified.`,
      })
    },
    [departments, update, pushAlert, pushToast],
  )

  const resumeQueue = useCallback(
    (id: string) => {
      const dept = departments.find((d) => d.id === id)
      if (!dept) return
      const count = waitingCount(dept)
      const at = now()

      update(id, (d) => ({
        ...d,
        state: 'resumed',
        pause: undefined,
        delay: undefined,
        resumedAt: at,
        queue: d.queue.map((q) =>
          q.status === 'onhold' ? { ...q, status: 'consulting' as const } : q,
        ),
      }))

      pushAlert({
        token: `${count} patients`,
        kind: 'resumed',
        title: 'Consultations resumed',
        detail: `Resumed at ${at}`,
        message: `SmartQueue: ${dept.fullName} consultations have resumed. Your queue is moving again. Your current position has been updated.`,
        department: dept.fullName,
        recipients: count,
      })

      pushToast({
        tone: 'success',
        title: 'Consultations resumed.',
        detail: `${count} waiting patients notified.`,
      })
    },
    [departments, update, pushAlert, pushToast],
  )

  const changeRoom = useCallback(
    (id: string, room: string) => {
      const dept = departments.find((d) => d.id === id)
      if (!dept || room === dept.room) return
      const count = waitingCount(dept)
      const from = dept.room

      update(id, (d) => ({ ...d, room }))

      pushAlert({
        token: `${count} patients`,
        kind: 'room',
        title: 'Room changed',
        detail: `${from} → ${room}`,
        message: `SmartQueue: Room update. Your ${dept.fullName} consultation has moved. ${from} → ${room}. Your token remains the same.`,
        department: dept.fullName,
        recipients: count,
      })

      pushToast({
        tone: 'info',
        title: 'Room updated.',
        detail: `${count} waiting patients notified.`,
      })
    },
    [departments, update, pushAlert, pushToast],
  )

  const markAbsent = useCallback(
    (id: string, token: string, action: 'hold' | 'helpdesk') => {
      const dept = departments.find((d) => d.id === id)
      if (!dept) return

      // The token is held, never cancelled — the patient keeps their place.
      update(id, (d) => ({
        ...d,
        queue: d.queue.map((q) => (q.token === token ? { ...q, status: 'held' as const } : q)),
      }))

      pushAlert({
        token,
        kind: 'missed',
        title: action === 'hold' ? 'Token held' : 'Sent to help desk',
        detail: 'Patient not present when called',
        message: `SmartQueue: Your token was called, but you were not present. Your token is being held. Please return to the ${dept.fullName} help desk.`,
        department: dept.fullName,
        recipients: 1,
      })

      pushToast({
        tone: 'info',
        title: `${token} held.`,
        detail: 'The patient keeps their place and has been asked to visit the help desk.',
      })
    },
    [departments, update, pushAlert, pushToast],
  )

  // Write through on every change, and follow changes made in another tab so
  // an open patient screen updates the moment staff act.
  useEffect(() => {
    save({ departments, alerts })
  }, [departments, alerts])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try {
        const next = JSON.parse(e.newValue) as Persisted
        setDepartments(next.departments)
        setAlerts(next.alerts)
      } catch {
        /* ignore malformed payloads */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({
      departments,
      alerts,
      toasts,
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
      getDepartment,
      callNext,
      reportDelay,
      pauseQueue,
      resumeQueue,
      changeRoom,
      markAbsent,
      dismissToast,
    }),
    [
      departments,
      alerts,
      toasts,
      signedIn,
      getDepartment,
      callNext,
      reportDelay,
      pauseQueue,
      resumeQueue,
      changeRoom,
      markAbsent,
      dismissToast,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

