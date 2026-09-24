export interface BuildMarkdownInput {
  title: string
  excerpt: string
  tags: string[]
  date: string
  body: string
}

export interface ComposerInput {
  postName: string
  title: string
  excerpt: string
  tagsInput: string
  body: string
}

export interface ComposerResult {
  errors: Record<string, string>
  tags: string[]
  slug: string
}

const MAX_SLUG_LENGTH = 60
export const MAX_TITLE_WORDS = 16
export const MAX_SUMMARY_WORDS = 32
export const MAX_EXCERPT_WORDS = MAX_SUMMARY_WORDS
export const MAX_BODY_WORDS = 1800
const MAX_TAGS = 8
const MAX_TAG_LENGTH = 30

export function suggestSlug(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '')
  return slug || 'untitled-post'
}

export function buildFilename(slug: string, date: Date = new Date()): string {
  const clean = slug.trim() || 'untitled-post'
  const year = date.getFullYear()
  const rawMonth = date.toLocaleDateString('en-US', { month: 'short' })
  const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1)
  const day = String(date.getDate()).padStart(2, '0')
  return `${clean}-${year}${month}${day}.md`
}

export function parseTags(input: string): string[] {
  const seen = new Set<string>()
  const tags: string[] = []
  for (const raw of input.split(',')) {
    const name = raw.trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    tags.push(name.slice(0, MAX_TAG_LENGTH))
    if (tags.length >= MAX_TAGS) break
  }
  return tags
}

export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function countWords(value: string): number {
  const normalized = singleLine(value)
  if (!normalized) return 0
  return normalized.split(/\s+/).filter(Boolean).length
}

function escapeQuoted(value: string): string {
  return value.replace(/"/g, "'")
}

function formatTag(tag: string): string {
  const clean = tag.replace(/,/g, '').trim()
  if (/[",\[\]:]/.test(clean)) return `"${escapeQuoted(clean)}"`
  return clean
}

export function buildMarkdown(input: BuildMarkdownInput): string {
  const title = singleLine(input.title)
  const excerpt = singleLine(input.excerpt)
  const tags = input.tags.map(formatTag).join(', ')
  return `---\ntitle: "${escapeQuoted(title)}"\ndate: ${input.date}\nexcerpt: "${escapeQuoted(excerpt)}"\ntags: [${tags}]\n---\n\n${input.body}\n`
}

function rawTagList(input: string): string[] {
  const seen = new Set<string>()
  const tags: string[] = []
  for (const raw of input.split(',')) {
    const name = raw.trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    tags.push(name)
  }
  return tags
}

export function validateComposer(input: ComposerInput): ComposerResult {
  const errors: Record<string, string> = {}
  const title = singleLine(input.title)
  const excerpt = singleLine(input.excerpt)
  const body = input.body.trim()

  if (!title) errors.title = 'Title is required.'
  else if (countWords(title) > MAX_TITLE_WORDS) errors.title = 'Title must be 16 words or fewer.'

  if (countWords(excerpt) > MAX_SUMMARY_WORDS) errors.excerpt = 'Summary must be 32 words or fewer.'

  if (!body) errors.body = 'Body is required.'
  else if (countWords(body) > MAX_BODY_WORDS) errors.body = 'Body must be 1800 words or fewer.'

  const rawTags = rawTagList(input.tagsInput)
  if (rawTags.length > MAX_TAGS) errors.tags = 'Maximum 8 tags allowed.'
  else if (rawTags.some(tag => tag.length > MAX_TAG_LENGTH)) errors.tags = 'Each tag must be 30 characters or fewer.'

  return {
    errors,
    tags: parseTags(input.tagsInput),
    slug: suggestSlug(input.postName.trim() || title),
  }
}
