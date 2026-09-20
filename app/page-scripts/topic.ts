import type { PostSummary } from '~/types/post'
import { findTopicBySlug, groupTopics, slugifyTopic } from './topic-utils'

export async function setupTopicPage() {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  const { data: posts } = await useFetch('/api/posts')
  const topicSlug = computed(() => slugifyTopic(String(route.params.topic ?? '')))
  const topics = computed(() => groupTopics(posts.value ?? []))
  const topic = computed(() => findTopicBySlug(topics.value, topicSlug.value))
  const filtered = computed(() =>
    (posts.value ?? [])
      .filter((post: PostSummary) => (post.tags ?? []).some(tag => slugifyTopic(tag) === topicSlug.value))
      .sort((a: PostSummary, b: PostSummary) => b.date.localeCompare(a.date)),
  )
  nuxtApp.runWithContext(() => useHead(() => ({
    title: topic.value?.name || 'Topic not found',
    meta: [{ name: 'description', content: topic.value ? `Software engineering articles about ${topic.value.name}.` : 'Topic not found.' }],
  })))
  return { topic, filtered }
}
