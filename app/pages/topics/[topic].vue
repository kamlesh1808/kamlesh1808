<script setup lang="ts">
import { setupTopicPage } from '~/page-scripts/topic'
import { siteLinks } from '~/data/site'

const { topic, filtered } = await setupTopicPage()

// Surface a proper 404 status for crawlers/readers on unknown slugs while
// keeping the EmptyState fallback below for client-side navigation.
if (!topic.value) {
  throw createError({ statusCode: 404, statusMessage: 'Topic not found', fatal: true })
}
</script>

<template>
  <article v-if="topic" class="container article-shell topics-shell">
    <BackLink :to="siteLinks.routes.topics">Topics</BackLink>
    <header class="article-header">
      <h1>{{ topic.name }}</h1>
      <p class="article-lede">{{ topic.count }} {{ topic.count === 1 ? 'post' : 'posts' }}</p>
    </header>
    <PostGrid :posts="filtered" />
  </article>
  <section v-else class="container content-section topics-missing">
    <BackLink :to="siteLinks.routes.topics">Topics</BackLink>
    <EmptyState>Topic not found.</EmptyState>
  </section>
</template>
