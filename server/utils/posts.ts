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
let productionPostsCache: Post[] | undefined
let productionDraftPostsCache: Post[] | undefined

function parsePost(filename: string, rawSource: string): Post {
  const { fields, body } = parseFrontmatter(rawSource)
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const title = frontmatterString(fields, 'title')
  const date = frontmatterString(fields, 'date')
  const excerpt = frontmatterString(fields, 'excerpt')
  const source = frontmatterString(fields, 'source')
  const aiAssisted = frontmatterBoolean(fields, 'aiAssisted')
  const readingTime = frontmatterString(fields, 'readingTime')
  return {
    slug: filename.replace(/\.md$/, ''),
    title: title || filename.replace(/\.md$/, ''),
    date: date || '2026-01-01',
    excerpt: excerpt || '',
    tags: frontmatterStringArray(fields, 'tags'),
    source,
    aiAssisted,
    readingTime: readingTime || `${Math.max(1, Math.ceil(words / 200))} min read`,
    html: markdown.render(body),
    disabled: frontmatterBoolean(fields, 'disabled'),
  }
}

export async function getPosts(): Promise<Post[]> {
  if (process.env.NODE_ENV === 'production' && productionPostsCache) return productionPostsCache

  let files: string[]
  try {
    files = await fs.readdir(contentDir)
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return []
    throw error
  }

  const markdownFiles = files.filter(file => /^post.*\.md$/i.test(file))
  const posts = await Promise.all(markdownFiles.map(async (file) => parsePost(file, await fs.readFile(join(contentDir, file), 'utf8'))))
  const visiblePosts = posts.filter(post => !post.disabled).sort((a, b) => b.date.localeCompare(a.date))
  if (process.env.NODE_ENV === 'production') productionPostsCache = visiblePosts
  return visiblePosts
}

export async function getDraftPosts(): Promise<Post[]> {
  if (process.env.NODE_ENV === 'production' && productionDraftPostsCache) return productionDraftPostsCache

  let files: string[]
  try {
    files = await fs.readdir(contentDir)
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return []
    throw error
  }

  const markdownFiles = files.filter(file => /^post.*\.md$/i.test(file))
  const posts = await Promise.all(markdownFiles.map(async (file) => parsePost(file, await fs.readFile(join(contentDir, file), 'utf8'))))
  const draftPosts = posts.filter(post => post.disabled && post.aiAssisted).sort((a, b) => b.date.localeCompare(a.date))
  if (process.env.NODE_ENV === 'production') productionDraftPostsCache = draftPosts
  return draftPosts
}
