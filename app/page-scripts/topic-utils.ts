export interface TopicGroup {
  name: string
  slug: string
  count: number
}

export interface TopicPost {
  tags?: string[]
}

export function slugifyTopic(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isBlankName(name: string): boolean {
  return name.length === 0
}

function isBlankSlug(slug: string): boolean {
  return slug.length === 0
}

function shouldSkipTopic(name: string, slug: string): boolean {
  return isBlankName(name) || isBlankSlug(slug)
}

function getOrCreateGroup(groups: Map<string, TopicGroup>, name: string, slug: string): TopicGroup {
  const existing = groups.get(slug)
  if (existing) return existing
  const created: TopicGroup = { name, slug, count: 0 }
  groups.set(slug, created)
  return created
}

export function groupTopics(posts: TopicPost[]): TopicGroup[] {
  const groups = new Map<string, TopicGroup>()
  for (const post of posts) {
    for (const raw of post.tags ?? []) {
      const name = raw.trim()
      const slug = slugifyTopic(name)
      if (shouldSkipTopic(name, slug)) continue
      getOrCreateGroup(groups, name, slug).count += 1
    }
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function findTopicBySlug(groups: TopicGroup[], slug: string): TopicGroup | undefined {
  const normalized = slugifyTopic(slug)
  return groups.find(group => group.slug === normalized)
}
