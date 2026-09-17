// Client-side obscurity gate for private pages (/admin, /posts-drafts, disabled drafts).
//
// HONESTY NOTE: on static GitHub Pages hosting this is NOT real access control.
// The /api/posts/drafts JSON and prerendered payloads remain fetchable by URL
// to anyone who knows/guesses the path. This gate only hides content in the UI
// until the visitor enters the passcode. Do not store truly sensitive data here.
const STORAGE_KEY = 'private-unlocked'

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function usePrivateAuth() {
  const config = useRuntimeConfig()
  const expectedHash = computed((): string => {
    const raw = config.public.privatePasscodeHash
    return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  })
  const isConfigured = computed((): boolean => expectedHash.value.length > 0)
  const unlocked = useState<boolean>('private-unlocked', () => false)

  if (import.meta.client && !unlocked.value) {
    try {
      unlocked.value = sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      unlocked.value = false
    }
  }

  function unlock(): void {
    unlocked.value = true
    if (import.meta.client) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Storage unavailable (private mode) — keep in-memory state only.
      }
    }
  }

  function lock(): void {
    unlocked.value = false
    if (import.meta.client) {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // Ignore storage errors on lock.
      }
    }
  }

  async function verifyPasscode(input: string): Promise<boolean> {
    if (!isConfigured.value) return false
    if (!import.meta.client || typeof crypto?.subtle === 'undefined') return false
    const candidate = await sha256Hex(input)
    // Both strings are fixed-length lowercase hex digests; === avoids leaking
    // length info beyond the boolean result.
    if (candidate === expectedHash.value) {
      unlock()
      return true
    }
    return false
  }

  return { unlocked, isConfigured, verifyPasscode, unlock, lock }
}
