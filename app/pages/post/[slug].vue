<script setup lang="ts">
import { setupPostPage } from '~/page-scripts/post'
import { siteLinks } from '~/data/site'

const { post } = await setupPostPage()
const { unlocked } = usePrivateAuth()
const isGated = computed((): boolean => post.value?.disabled === true && !unlocked.value)
</script>

<template>
  <!-- Obscurity gate: disabled post data is fetched but not displayed until unlocked. -->
  <!-- Uses PrivateLock (not PrivateGate): computed isGated + v-else-if="post" chain needs inline branching. -->
  <PrivateLock v-if="isGated" />
  <article v-else-if="post" class="container article-shell">
    <BackLink :to="siteLinks.routes.home">All writing</BackLink>
    <header class="article-header">
      <h1>{{ post.title }}<span v-if="post.aiAssisted" class="article-ai-assisted">AI-assisted</span></h1>
      <TagList :tags="post.tags" wrapper-class="d-flex flex-wrap gap-2 mb-4" />
      <p v-if="post.source" class="article-source">Source: {{ post.source }}</p>
      <p class="article-lede">{{ post.excerpt }}</p>
      <div class="article-meta"><FormattedDate :date="post.date" format="long" /><span>·</span><span>{{ post.readingTime }}</span></div>
    </header>
    <div class="article-body" v-html="post.html" />
  </article>
</template>
