export interface TomlArray extends Array<TomlValue> {}

export interface TomlTable {
  [key: string]: TomlValue
}

export type TomlValue = string | number | boolean | TomlArray | TomlTable

const TOML_NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/

interface TomlScanHooks {
  onHash?: (index: number) => boolean | void
  onOpenBracket?: () => void
  onCloseBracket?: () => void
  onComma?: (index: number, depth: number) => void
}

interface TomlScanResult {
  inString: boolean
  depth: number
}

function scanTomlChars(text: string, hooks: TomlScanHooks = {}): TomlScanResult {
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = 0; index < text.length; index++) {
    const character = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }
    if (character === '"') inString = true
    else if (character === '[') {
      depth++
      hooks.onOpenBracket?.()
    } else if (character === ']') {
      depth--
      hooks.onCloseBracket?.()
    } else if (character === ',') {
      hooks.onComma?.(index, depth)
    } else if (character === '#') {
      if (hooks.onHash?.(index)) break
    }
  }

  return { inString, depth }
}

function parseTomlStringValue(value: string, lineNumber: number): TomlValue {
  if (!value.endsWith('"')) throw new Error(`Unterminated TOML string on line ${lineNumber}`)
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed !== 'string') throw new Error()
    return parsed
  } catch {
    throw new Error(`Invalid TOML string on line ${lineNumber}`)
  }
}

function parseTomlArrayValue(value: string, lineNumber: number): TomlValue {
  if (!value.endsWith(']')) throw new Error(`Unterminated TOML array on line ${lineNumber}`)
  const contents = value.slice(1, -1).trim()
  if (!contents) return []
  return splitTomlList(contents, lineNumber).map(item => parseTomlValue(item, lineNumber))
}

interface TomlValueHandler {
  matches: (value: string) => boolean
  parse: (value: string, lineNumber: number) => TomlValue
}

const TOML_VALUE_HANDLERS: TomlValueHandler[] = [
  { matches: value => value.startsWith('"'), parse: parseTomlStringValue },
  { matches: value => value.startsWith('['), parse: parseTomlArrayValue },
  { matches: value => value === 'true' || value === 'false', parse: value => value === 'true' },
  { matches: value => TOML_NUMBER_PATTERN.test(value), parse: value => Number(value) },
]

function parseTomlValue(rawValue: string, lineNumber: number): TomlValue {
  const value = rawValue.trim()
  if (!value) throw new Error(`Missing TOML value on line ${lineNumber}`)

  for (const handler of TOML_VALUE_HANDLERS) {
    if (handler.matches(value)) return handler.parse(value, lineNumber)
  }
  throw new Error(`Unsupported TOML value on line ${lineNumber}`)
}

function splitTomlList(value: string, lineNumber: number): string[] {
  const parts: string[] = []
  let start = 0

  const { inString, depth } = scanTomlChars(value, {
    onComma: (index, commaDepth) => {
      if (commaDepth !== 0) return
      const part = value.slice(start, index).trim()
      if (!part) throw new Error(`Empty TOML array item on line ${lineNumber}`)
      parts.push(part)
      start = index + 1
    },
  })

  if (inString || depth !== 0) throw new Error(`Unterminated TOML value on line ${lineNumber}`)
  const last = value.slice(start).trim()
  if (!last) throw new Error(`Trailing comma in TOML array on line ${lineNumber}`)
  parts.push(last)
  return parts
}

function stripTomlComment(line: string): string {
  let hashIndex = -1
  scanTomlChars(line, {
    onHash: index => {
      hashIndex = index
      return true
    },
  })
  return hashIndex < 0 ? line : line.slice(0, hashIndex)
}

function parseTomlPath(rawPath: string, lineNumber: number): string[] {
  const path = rawPath.split('.').map(part => part.trim())
  if (path.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) {
    throw new Error(`Invalid TOML key on line ${lineNumber}`)
  }
  return path
}

type TomlSlotKind = 'missing' | 'array' | 'table' | 'scalar'

function getTomlSlotKind(value: TomlValue | undefined): TomlSlotKind {
  if (value === undefined) return 'missing'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'table'
  return 'scalar'
}

type TomlSlotEnter = (table: TomlTable, key: string, lineNumber: number) => TomlTable

const TOML_TABLE_SLOT_HANDLERS: Record<TomlSlotKind, TomlSlotEnter> = {
  missing: (table, key) => {
    const child: TomlTable = {}
    table[key] = child
    return child
  },
  array: (table, key, lineNumber) => {
    const existing = table[key] as TomlArray
    const last = existing[existing.length - 1]
    if (!last || typeof last !== 'object' || Array.isArray(last)) {
      throw new Error(`Invalid TOML table path on line ${lineNumber}`)
    }
    return last as TomlTable
  },
  table: (table, key) => table[key] as TomlTable,
  scalar: (_table, _key, lineNumber) => {
    throw new Error(`TOML key is not a table on line ${lineNumber}`)
  },
}

function resolveTomlTable(root: TomlTable, path: string[], lineNumber: number): TomlTable {
  let table = root
  for (const key of path) {
    table = TOML_TABLE_SLOT_HANDLERS[getTomlSlotKind(table[key])](table, key, lineNumber)
  }
  return table
}

function tomlBracketDepth(line: string): number {
  return scanTomlChars(line).depth
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

function appendTomlArrayTable(root: TomlTable, path: string[], lineNumber: number): TomlTable {
  const parent = resolveTomlTable(root, path.slice(0, -1), lineNumber)
  const key = path[path.length - 1]
  if (!key) throw new Error(`Empty TOML table key on line ${lineNumber}`)
  const existing = parent[key]
  if (existing !== undefined && !Array.isArray(existing)) {
    throw new Error(`TOML table cannot become an array on line ${lineNumber}`)
  }
  const entries = (existing ?? []) as TomlArray
  if (entries.some(entry => typeof entry !== 'object' || Array.isArray(entry))) {
    throw new Error(`Invalid TOML array table on line ${lineNumber}`)
  }
  const entry: TomlTable = {}
  entries.push(entry)
  parent[key] = entries
  return entry
}

interface TomlHeaderHandler {
  matches: (line: string) => boolean
  prefix: string
  closing: string
  enter: (root: TomlTable, path: string[], lineNumber: number) => TomlTable
}

const TOML_HEADER_HANDLERS: TomlHeaderHandler[] = [
  { matches: line => line.startsWith('[['), prefix: '[[', closing: ']]', enter: appendTomlArrayTable },
  {
    matches: line => line.startsWith('['),
    prefix: '[',
    closing: ']',
    enter: (root, path, lineNumber) => resolveTomlTable(root, path, lineNumber),
  },
]

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
    const header = TOML_HEADER_HANDLERS.find(handler => handler.matches(line))
    if (header) {
      if (!line.endsWith(header.closing)) throw new Error(`Invalid TOML table header on line ${lineNumber}`)
      const rawPath = line.slice(header.prefix.length, -header.closing.length).trim()
      const path = parseTomlPath(rawPath, lineNumber)
      if (!path.length) throw new Error(`Empty TOML table header on line ${lineNumber}`)
      current = header.enter(root, path, lineNumber)
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
