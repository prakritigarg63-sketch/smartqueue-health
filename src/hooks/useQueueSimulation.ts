import { useEffect, useState } from 'react'
import { visit } from '../data/mock'

/** Hospital pace, not demo pace: one token roughly every seven seconds. */
const ADVANCE_MS = 7000
/** A57 -> A58 -> A59, then the queue holds. */
const MAX_ADVANCES = 2

function tokenAt(offset: number) {
  const base = Number(visit.startingToken.slice(1))
  return `${visit.startingToken[0]}${base + offset}`
}

/**
 * Advances the hero queue a couple of times so the screen reads as a live
 * hospital queue rather than a screenshot, then settles.
 */
export function useQueueSimulation() {
  const [advances, setAdvances] = useState(0)

  useEffect(() => {
    if (advances >= MAX_ADVANCES) return
    const id = window.setTimeout(() => setAdvances((n) => n + 1), ADVANCE_MS)
    return () => window.clearTimeout(id)
  }, [advances])

  return {
    nowServing: tokenAt(advances),
    ahead: visit.startingAhead - advances,
    /** Fraction of the way from the current token to the patient's token. */
    progress: advances / (visit.startingAhead || 1),
  }
}
