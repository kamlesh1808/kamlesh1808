export interface Frontmatter {
  [key: string]: string | boolean | string[]
}

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, '')
}

function splitList(value: string): string[] {
  const contents = value.slice(1, -1).trim()
  if (!contents) return []
  return contents.split(',').map(item => stripQuotes((item ?? '').trim())).filter(Boolean)
}

interface ValueParser {
  test: (trimmed: string) => boolean
  parse: (trimmed: string) => string | boolean | string[]
}

// Hard-coded value shapes (list, boolean); anything else falls through to unquoted string.
const VALUE_PARSERS: ValueParser[] = [
  { test: trimmed => trimmed.startsWith('[') && trimmed.endsWith(']'), parse: trimmed => splitList(trimmed) },
  { test: trimmed => trimmed === 'true' || trimmed === 'false', parse: trimmed => trimmed === 'true' },
]

function parseValue(value: string): string | boolean | string[] {
  const trimmed = value.trim()
  return VALUE_PARSERS.find(({ test }) => test(trimmed))?.parse(trimmed) ?? stripQuotes(trimmed)
}

export function parseFrontmatter(source: string): { fields: Frontmatter; body: string } {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)
  if (!match) return { fields: {}, body: source }

  const fields: Frontmatter = {}
  const frontmatter = match[1] ?? ''
  const body = match[2] ?? ''
  const entries = frontmatter
    .split(/\r?\n/)
    .map((rawLine, index) => ({ rawLine, index, line: rawLine.trim() }))
    .filter(({ line }) => line !== '' && !line.startsWith('#'))
  for (const { rawLine, index, line } of entries) {
    const separator = line.indexOf(':')
    if (separator < 1) throw new Error(`Invalid frontmatter on line ${index + 1}: ${rawLine}`)
    const key = line.slice(0, separator).trim()
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(key)) throw new Error(`Invalid frontmatter key: ${key}`)
    if (fields[key] !== undefined) throw new Error(`Duplicate frontmatter key: ${key}`)
    fields[key] = parseValue(line.slice(separator + 1))
  }
  return { fields, body }
}

export function frontmatterString(fields: Frontmatter, key: string): string | undefined {
  const value = fields[key]
  return typeof value === 'string' ? value : undefined
}

export function frontmatterBoolean(fields: Frontmatter, key: string): boolean {
  return fields[key] === true
}

export function frontmatterStringArray(fields: Frontmatter, key: string): string[] {
  const value = fields[key]
  return Array.isArray(value) ? value : []
}
