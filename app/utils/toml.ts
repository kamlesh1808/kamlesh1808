export interface TomlArray extends Array<TomlValue> {}

export interface TomlTable {
  [key: string]: TomlValue
}

export type TomlValue = string | number | boolean | TomlArray | TomlTable

function parseTomlValue(rawValue: string, lineNumber: number): TomlValue {
  const value = rawValue.trim()
  if (!value) throw new Error(`Missing TOML value on line ${lineNumber}`)

  if (value.startsWith('"')) {
    if (!value.endsWith('"')) throw new Error(`Unterminated TOML string on line ${lineNumber}`)
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed !== 'string') throw new Error()
      return parsed
    } catch {
      throw new Error(`Invalid TOML string on line ${lineNumber}`)
    }
  }

  if (value.startsWith('[')) {
    if (!value.endsWith(']')) throw new Error(`Unterminated TOML array on line ${lineNumber}`)
    const contents = value.slice(1, -1).trim()
    if (!contents) return []
    return splitTomlList(contents, lineNumber).map(item => parseTomlValue(item, lineNumber))
  }

  if (value === 'true' || value === 'false') return value === 'true'
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) return Number(value)
  throw new Error(`Unsupported TOML value on line ${lineNumber}`)
}

function splitTomlList(value: string, lineNumber: number): string[] {
  const parts: string[] = []
  let start = 0
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = 0; index < value.length; index++) {
    const character = value[index]
    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }
    if (character === '"') inString = true
    else if (character === '[') depth++
    else if (character === ']') depth--
    else if (character === ',' && depth === 0) {
      const part = value.slice(start, index).trim()
      if (!part) throw new Error(`Empty TOML array item on line ${lineNumber}`)
      parts.push(part)
      start = index + 1
    }
  }

  if (inString || depth !== 0) throw new Error(`Unterminated TOML value on line ${lineNumber}`)
  const last = value.slice(start).trim()
  if (!last) throw new Error(`Trailing comma in TOML array on line ${lineNumber}`)
  parts.push(last)
  return parts
}

function stripTomlComment(line: string): string {
  let inString = false
  let escaped = false
  for (let index = 0; index < line.length; index++) {
    const character = line[index]
    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
    } else if (character === '"') {
      inString = true
    } else if (character === '#') {
      return line.slice(0, index)
    }
  }
  return line
}

function parseTomlPath(rawPath: string, lineNumber: number): string[] {
  const path = rawPath.split('.').map(part => part.trim())
  if (path.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) {
    throw new Error(`Invalid TOML key on line ${lineNumber}`)
  }
  return path
}

function resolveTomlTable(root: TomlTable, path: string[], lineNumber: number): TomlTable {
  let table = root
  for (const key of path) {
    const existing = table[key]
    if (existing === undefined) {
      const child: TomlTable = {}
      table[key] = child
      table = child
    } else if (Array.isArray(existing)) {
      const last = existing[existing.length - 1]
      if (!last || typeof last !== 'object' || Array.isArray(last)) {
        throw new Error(`Invalid TOML table path on line ${lineNumber}`)
      }
      table = last
    } else if (typeof existing === 'object') {
      table = existing
    } else {
      throw new Error(`TOML key is not a table on line ${lineNumber}`)
    }
  }
  return table
}

function tomlBracketDepth(line: string): number {
  let depth = 0
  let inString = false
  let escaped = false
  for (const character of line) {
    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
    } else if (character === '"') {
      inString = true
    } else if (character === '[') {
      depth++
    } else if (character === ']') {
      depth--
    }
  }
  return depth
}

function parseTomlKey(rawKey: string, lineNumber: number): string {
  const key = rawKey.trim()
  if (key.startsWith('"')) {
    try {
      const parsed = JSON.parse(key)
      if (typeof parsed === 'string' && parsed) return parsed
    } catch {
      // Fall through to the strict key error below.
    }
  }
  if (/^[A-Za-z0-9_-]+$/.test(key)) return key
  throw new Error(`Invalid TOML key on line ${lineNumber}`)
}

export function parseToml(input: string): TomlTable {
  const root: TomlTable = {}
  let current = root
  const logicalLines: Array<{ line: string; lineNumber: number }> = []
  let pending = ''
  let pendingLineNumber = 0
  let bracketDepth = 0

  input.split(/\r?\n/).forEach((rawLine, index) => {
    const lineNumber = index + 1
    const line = stripTomlComment(rawLine).trim()
    if (!line) return

    if (!pending) pendingLineNumber = lineNumber
    pending = pending ? `${pending} ${line}` : line
    bracketDepth += tomlBracketDepth(line)
    if (bracketDepth < 0) throw new Error(`Unexpected closing bracket on line ${lineNumber}`)
    if (bracketDepth === 0) {
      logicalLines.push({ line: pending, lineNumber: pendingLineNumber })
      pending = ''
    }
  })

  if (pending) throw new Error(`Unterminated TOML array on line ${pendingLineNumber}`)

  logicalLines.forEach(({ line, lineNumber }) => {
    if (line.startsWith('[[') || line.startsWith('[')) {
      const arrayTable = line.startsWith('[[')
      const closing = arrayTable ? ']]' : ']'
      if (!line.endsWith(closing)) throw new Error(`Invalid TOML table header on line ${lineNumber}`)
      const rawPath = line.slice(arrayTable ? 2 : 1, -closing.length).trim()
      const path = parseTomlPath(rawPath, lineNumber)
      if (!path.length) throw new Error(`Empty TOML table header on line ${lineNumber}`)

      if (arrayTable) {
        const parent = resolveTomlTable(root, path.slice(0, -1), lineNumber)
        const key = path[path.length - 1]
        if (!key) throw new Error(`Empty TOML table key on line ${lineNumber}`)
        const existing = parent[key]
        if (existing !== undefined && !Array.isArray(existing)) {
          throw new Error(`TOML table cannot become an array on line ${lineNumber}`)
        }
        const entries = existing ?? []
        if (entries.some(entry => typeof entry !== 'object' || Array.isArray(entry))) {
          throw new Error(`Invalid TOML array table on line ${lineNumber}`)
        }
        const entry: TomlTable = {}
        entries.push(entry)
        parent[key] = entries
        current = entry
      } else {
        current = resolveTomlTable(root, path, lineNumber)
      }
      return
    }

    const equals = line.indexOf('=')
    if (equals <= 0) throw new Error(`Invalid TOML assignment on line ${lineNumber}`)
    const key = parseTomlKey(line.slice(0, equals), lineNumber)
    if (current[key] !== undefined) throw new Error(`Duplicate TOML key on line ${lineNumber}`)
    current[key] = parseTomlValue(line.slice(equals + 1), lineNumber)
  })

  return root
}
