<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { data: posts } = await useFetch('/api/posts')
const topicSlug = computed(() => slugifyTopic(String(route.params.topic ?? '')))
const topics = computed(() => groupTopics(posts.value ?? []))
const topic = computed(() => findTopicBySlug(topics.value, topicSlug.value))
const filtered = computed(() =>
  (posts.value ?? [])
    .filter(post => (post.tags ?? []).some(tag => slugifyTopic(tag) === topicSlug.value))
    .sort((a, b) => b.date.localeCompare(a.date)),
)
useHead(() => ({ title: topic.value?.name || t('topics.not_found') }))
</script>

<template>
  <article v-if="topic" class="container article-shell topics-shell">
    <NuxtLink class="back-link" to="/topics"><i class="fa-solid fa-arrow-left" /> {{ t('topics.title') }}</NuxtLink>
    <header class="article-header">
      <h1>{{ topic.name }}</h1>
      <p class="article-lede">{{ t('topics.posts_count', { count: topic.count }) }}</p>
    </header>
    <div class="row g-4">
      <div v-for="post in filtered" :key="post.slug" class="col-md-6">
        <div class="post-card">
          <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
            <time :datetime="post.date">{{ new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</time>
          </div>
          <h2 class="post-card-title"><NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink></h2>
        </div>
      </div>
    </div>
  </article>
  <section v-else class="container content-section topics-missing">
    <NuxtLink class="back-link" to="/topics"><i class="fa-solid fa-arrow-left" /> {{ t('topics.title') }}</NuxtLink>
    <div class="empty-state">{{ t('topics.not_found') }}</div>
  </section>
</template>
