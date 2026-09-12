import { groupTopics } from './topic-utils'

export async function setupTopicsPage() {
  useHead({
    title: 'Topics',
    meta: [{ name: 'description', content: 'Browse software engineering articles by topic.' }],
  })
  const { data: posts } = await useFetch('/api/posts')
  const topics = computed(() => groupTopics(posts.value ?? []))
  return { posts, topics }
}
