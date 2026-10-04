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
