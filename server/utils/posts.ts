import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: string
  html: string
  disabled: boolean
}

const contentDir = join(process.cwd(), 'content')
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })

function parsePost(filename: string, source: string): Post {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  const frontmatter = match?.[1] || ''
  const body = match?.[2] || source
  const fields = Object.fromEntries(frontmatter.split('\n').map((line) => {
    const index = line.indexOf(':')
    return index > -1 ? [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')] : ['', '']
  }))
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const disabledKey = Object.keys(fields).find(key => key.toLowerCase() === 'disabled')
  const disabledValue = (disabledKey ? (fields[disabledKey] ?? '') : '').trim().toLowerCase()
  const disabled = disabledValue === 'true' || disabledValue === '1' || disabledValue === 'yes'
  return {
    slug: filename.replace(/\.md$/, ''),
    title: fields.title || filename.replace(/\.md$/, ''),
    date: fields.date || '2026-01-01',
    excerpt: fields.excerpt || '',
    tags: (fields.tags || '').replace(/[\[\]]/g, '').split(',').map(tag => tag.trim()).filter(Boolean),
    readingTime: fields.readingTime || `${Math.max(1, Math.ceil(words / 200))} min read`,
    html: markdown.render(body),
    disabled
  }
}

export async function getPosts() {
  try {
    const files = await fs.readdir(contentDir)
    const markdownFiles = files.filter(file => /^blog.*\.md$/i.test(file))
    const posts = await Promise.all(markdownFiles.map(async (file) => parsePost(file, await fs.readFile(join(contentDir, file), 'utf8'))))
    return posts.filter(post => !post.disabled).sort((a, b) => b.date.localeCompare(a.date))
  } catch (error: any) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}
