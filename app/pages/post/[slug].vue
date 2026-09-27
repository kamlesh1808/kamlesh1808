<script setup lang="ts">
import { setupPostPage } from '~/page-scripts/post'
import { siteLinks } from '~/data/site'
import type { Post } from '~~/server/utils/posts'

const { post } = await setupPostPage()

// Early return: missing post is a 404 (setupPostPage throws on fetch error;
// this covers a null payload without an error).
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

// Hard-coded page fallback data (server Post shape is read-only).
const fallbackPost: Post = {
  slug: 'post-not-found',
  title: 'Post not found',
  date: '2026-01-01',
  excerpt: '',
  tags: [],
  aiAssisted: false,
  readingTime: '1 min read',
  html: '',
  disabled: false,
}
const displayPost = computed((): Post => post.value ?? fallbackPost)
const { unlocked } = usePrivateAuth()
const isGated = computed((): boolean => displayPost.value.disabled === true && !unlocked.value)
</script>

<template>
  <!-- Obscurity gate: single gate + early return; disabled post data is fetched but not displayed until unlocked. -->
  <PrivateLock v-if="isGated" />
  <article v-else class="container article-shell">
    <BackLink :to="siteLinks.routes.home">All writing</BackLink>
    <header class="article-header">
      <h1>{{ displayPost.title }}<span v-if="displayPost.aiAssisted" class="article-ai-assisted">AI-assisted</span></h1>
      <TagList v-if="displayPost.tags?.length" :tags="displayPost.tags" wrapper-class="d-flex flex-wrap gap-2 mb-4" />
      <p v-if="displayPost.source" class="article-source">Source: {{ displayPost.source }}</p>
      <p class="article-lede">{{ displayPost.excerpt }}</p>
      <div class="article-meta"><FormattedDate :date="displayPost.date" format="long" /><span>·</span><span>{{ displayPost.readingTime }}</span></div>
    </header>
    <div class="article-body" v-html="displayPost.html" />
  </article>
</template>
