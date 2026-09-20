<script setup lang="ts">
import { setupTopicPage } from '~/page-scripts/topic'
import { siteLinks } from '~/data/site'

const { topic, filtered } = await setupTopicPage()
</script>

<template>
  <article v-if="topic" class="container article-shell topics-shell">
    <BackLink :to="siteLinks.routes.topics">Topics</BackLink>
    <header class="article-header">
      <h1>{{ topic.name }} <span class="article-lede">{{ topic.count }} posts</span></h1>
    </header>
    <PostGrid :posts="filtered" />
  </article>
  <section v-else class="container content-section topics-missing">
    <BackLink :to="siteLinks.routes.topics">Topics</BackLink>
    <EmptyState>Topic not found.</EmptyState>
  </section>
</template>
