export interface Frontmatter {
  [key: string]: string | boolean | string[]
}

function splitList(value: string): string[] {
  const contents = value.slice(1, -1).trim()
  if (!contents) return []
  return contents.split(',').map(item => (item ?? '').trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
}

function parseValue(value: string): string | boolean | string[] {
  const trimmed = value.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return splitList(trimmed)
  if (trimmed === 'true' || trimmed === 'false') return trimmed === 'true'
  return trimmed.replace(/^['"]|['"]$/g, '')
}

export function parseFrontmatter(source: string): { fields: Frontmatter; body: string } {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)
  if (!match) return { fields: {}, body: source }

  const fields: Frontmatter = {}
  const frontmatter = match[1] ?? ''
  const body = match[2] ?? ''
  for (const [index, line] of frontmatter.split(/\r?\n/).entries()) {
    const separator = line.indexOf(':')
    if (separator < 1) throw new Error(`Invalid frontmatter on line ${index + 1}: ${line}`)
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
