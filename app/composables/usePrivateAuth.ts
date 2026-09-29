// Client-side obscurity gate for private pages (/tools/*).
//
// HONESTY NOTE: on static GitHub Pages hosting this is NOT real access control.
// The /api/posts/drafts JSON and prerendered payloads remain fetchable by URL
// to anyone who knows/guesses the path. This gate only hides content in the UI
// until the visitor enters the passcode. Do not store truly sensitive data here.
import { candidatePasswords } from '~/utils/hourPasscode'

const STORAGE_KEY = 'private-unlocked'
const TIMESTAMP_KEY = 'private-unlocked-at'
const UNLOCK_TTL_MS = 60 * 60 * 1000

let expiryTimer: ReturnType<typeof setTimeout> | null = null
let activityListenersAttached = false

function parseStoredAt(raw: string | null): number | null {
  if (raw === null) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function clearExpiryTimer(): void {
  if (expiryTimer !== null) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

function requireClient(): boolean {
  return import.meta.client
}

type AuthStatus = 'idle' | 'missing' | 'expired' | 'active'

const AUTH_STATUS: Record<AuthStatus, { active: boolean; needsLock: boolean }> = {
  idle: { active: false, needsLock: false },
  missing: { active: false, needsLock: true },
  expired: { active: false, needsLock: true },
  active: { active: true, needsLock: false },
}

function resolveAuthStatus(
  flagged: boolean,
  storedAt: number | null,
  isUnlocked: boolean,
  nowMs: number,
): AuthStatus {
  if (!flagged && !isUnlocked) return 'idle'
  if (!flagged || storedAt === null) return 'missing'
  if (nowMs - storedAt > UNLOCK_TTL_MS) return 'expired'
  return 'active'
}

export function usePrivateAuth() {
  const unlocked = useState<boolean>('private-unlocked', () => false)

  function lock(): void {
    unlocked.value = false
    clearExpiryTimer()
    if (requireClient()) {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
        sessionStorage.removeItem(TIMESTAMP_KEY)
      } catch {
        // Ignore storage errors on lock.
      }
    }
  }

  function scheduleAutoLock(remainingMs: number): void {
    clearExpiryTimer()
    if (!requireClient() || remainingMs <= 0) return
    expiryTimer = setTimeout(lock, remainingMs)
    const maybeUnref = expiryTimer as unknown as { unref?: () => void }
    if (typeof maybeUnref.unref === 'function') {
      maybeUnref.unref()
    }
  }

  // Re-read storage and enforce the 60-minute expiry. Returns current state.
  // Safe to call on page mount, on focus/visibility, and before verifying.
  function refreshAuthState(nowMs: number = Date.now()): boolean {
    if (!requireClient()) {
      return unlocked.value
    }
    let flagged = false
    let storedAt: number | null = null
    try {
      flagged = sessionStorage.getItem(STORAGE_KEY) === '1'
      storedAt = parseStoredAt(sessionStorage.getItem(TIMESTAMP_KEY))
    } catch {
      unlocked.value = false
      clearExpiryTimer()
      return false
    }
    const status = resolveAuthStatus(flagged, storedAt, unlocked.value, nowMs)
    const entry = AUTH_STATUS[status]
    if (!entry.active) {
      if (entry.needsLock) {
        lock()
      } else {
        clearExpiryTimer()
      }
      return false
    }
    unlocked.value = true
    scheduleAutoLock(UNLOCK_TTL_MS - (nowMs - (storedAt as number)))
    return true
  }

  function unlock(): void {
    const nowMs = Date.now()
    unlocked.value = true
    if (requireClient()) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
        sessionStorage.setItem(TIMESTAMP_KEY, nowMs.toString())
      } catch {
        // Storage unavailable (private mode) — keep in-memory state only.
      }
    }
    scheduleAutoLock(UNLOCK_TTL_MS)
  }

  if (requireClient()) {
    refreshAuthState()
    if (!activityListenersAttached) {
      activityListenersAttached = true
      window.addEventListener('focus', () => {
        refreshAuthState()
      })
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          refreshAuthState()
        }
      })
    }
  }

  async function verifyPasscode(input: string, now: Date = new Date()): Promise<boolean> {
    const trimmed = input.trim()
    if (!trimmed) return false
    refreshAuthState()
    if (!candidatePasswords(now).includes(trimmed)) {
      return false
    }
    unlock()
    return true
  }

  return { unlocked, verifyPasscode, unlock, lock, refreshAuthState }
}
