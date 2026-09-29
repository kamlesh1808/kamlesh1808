import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import { frontmatterBoolean, frontmatterString, frontmatterStringArray, parseFrontmatter } from './frontmatter'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  source?: string
  aiAssisted: boolean
  readingTime: string
  html: string
  disabled: boolean
}

export type PostSummary = Omit<Post, 'html'>

const contentDir = join(process.cwd(), 'content')
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })
let productionAllPostsCache: Post[] | undefined

export const POST_DEFAULTS = {
  date: '2026-01-01',
  excerpt: '',
  wordsPerMinute: 200,
} as const

export const NOT_FOUND_ERRORS = {
  post: { statusCode: 404, statusMessage: 'Post not found' },
  topic: { statusCode: 404, statusMessage: 'Topic not found' },
} as const

export type NotFoundError = {
  statusCode: number
  statusMessage: string
  fatal?: boolean
}

export function assertFound<T>(value: T | null | undefined, notFound: NotFoundError = NOT_FOUND_ERRORS.post): asserts value is T {
  if (!value) throw createError(notFound)
}

const FS_ERROR_HANDLERS: Record<string, () => Post[]> = {
  ENOENT: () => [],
}

function parsePost(filename: string, rawSource: string): Post {
  const { fields, body } = parseFrontmatter(rawSource)
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const slug = filename.replace(/\.md$/, '')
  const title = frontmatterString(fields, 'title')
  const date = frontmatterString(fields, 'date')
  const excerpt = frontmatterString(fields, 'excerpt')
  const source = frontmatterString(fields, 'source')
  const aiAssisted = frontmatterBoolean(fields, 'aiAssisted')
  const readingTime = frontmatterString(fields, 'readingTime')
  return {
    slug,
    title: title ?? slug,
    date: date ?? POST_DEFAULTS.date,
    excerpt: excerpt ?? POST_DEFAULTS.excerpt,
    tags: frontmatterStringArray(fields, 'tags'),
    source,
    aiAssisted,
    readingTime: readingTime ?? `${Math.max(1, Math.ceil(words / POST_DEFAULTS.wordsPerMinute))} min read`,
    html: markdown.render(body),
    disabled: frontmatterBoolean(fields, 'disabled'),
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (process.env.NODE_ENV === 'production' && productionAllPostsCache) return productionAllPostsCache

  let files: string[]
  try {
    files = await fs.readdir(contentDir)
  } catch (error: unknown) {
    const code = error instanceof Error && 'code' in error ? (error as { code?: unknown }).code : undefined
    const handler = typeof code === 'string' ? FS_ERROR_HANDLERS[code] : undefined
    if (handler) return handler()
    throw error
  }

  const markdownFiles = files.filter(file => /\.md$/i.test(file))
  const posts = await Promise.all(markdownFiles.map(async (file) => parsePost(file, await fs.readFile(join(contentDir, file), 'utf8'))))
  if (process.env.NODE_ENV === 'production') productionAllPostsCache = posts
  return posts
}

export async function queryPosts(predicate: (post: Post) => boolean = () => true): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter(predicate).sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPosts(): Promise<Post[]> {
  return queryPosts(post => !post.disabled)
}

export async function getDraftPosts(): Promise<Post[]> {
  return queryPosts(post => post.disabled)
}
