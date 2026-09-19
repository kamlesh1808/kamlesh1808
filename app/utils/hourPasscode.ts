// Time-based obscurity passcode: "kamlesh1808" + UTC hour slot (yyyymmddhh).
//
// HONESTY NOTE: on static GitHub Pages hosting this is NOT real access control.
// Anyone can read this source and compute the password. It only hides
// Write/Drafts links in the UI. Do not store truly sensitive data here.
const PREFIX = 'kamlesh1808'
const MS_PER_HOUR = 3600000

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatHourSlot(date: Date): string {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}${pad2(date.getUTCHours())}`
}

export function buildHourPassword(slot: string): string {
  return `${PREFIX}${slot}`
}

export function candidatePasswords(now: Date = new Date()): string[] {
  const current = buildHourPassword(formatHourSlot(now))
  const previous = buildHourPassword(formatHourSlot(new Date(now.getTime() - MS_PER_HOUR)))
  return current === previous ? [current] : [current, previous]
}
