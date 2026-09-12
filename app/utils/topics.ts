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

export function groupTopics(posts: TopicPost[]): TopicGroup[] {
  const groups = new Map<string, TopicGroup>()
  for (const post of posts) {
    for (const raw of post.tags ?? []) {
      const name = raw.trim()
      if (!name) continue
      const slug = slugifyTopic(name)
      if (!slug) continue
      const existing = groups.get(slug)
      if (existing) {
        existing.count += 1
      }
      else {
        groups.set(slug, { name, slug, count: 1 })
      }
    }
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function findTopicBySlug(groups: TopicGroup[], slug: string): TopicGroup | undefined {
  const normalized = slugifyTopic(slug)
  return groups.find(group => group.slug === normalized)
}
