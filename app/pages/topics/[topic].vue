<script setup lang="ts">
import { setupTopicPage } from '~/page-scripts/topic'
import { siteLinks } from '~/data/site'
import { plural } from '~/utils/plural'
import { NOT_FOUND_ERRORS, assertFound } from '~/utils/post-errors'

const { topic, filtered } = await setupTopicPage()

// Surface a proper 404 status for crawlers/readers on unknown slugs while
// keeping the EmptyState fallback below for client-side navigation.
assertFound(topic.value, { ...NOT_FOUND_ERRORS.topic, fatal: true })
</script>

<template>
  <article v-if="topic" class="container article-shell topics-shell">
    <BackLink :to="siteLinks.routes.topics">Topics</BackLink>
    <header class="article-header">
      <h1>{{ topic.name }}</h1>
      <p class="article-lede">{{ topic.count }} {{ plural(topic.count, 'post', 'posts') }}</p>
    </header>
    <PostGrid :posts="filtered" />
  </article>
  <section v-else class="container content-section topics-missing">
    <BackLink :to="siteLinks.routes.topics">Topics</BackLink>
    <EmptyState>Topic not found.</EmptyState>
  </section>
</template>
