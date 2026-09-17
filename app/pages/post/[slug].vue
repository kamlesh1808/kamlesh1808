<script setup lang="ts">
import { setupPostPage } from '~/page-scripts/post'
import { slugifyTopic } from '~/page-scripts/topic-utils'

const { post } = await setupPostPage()
const { unlocked } = usePrivateAuth()
const isGated = computed((): boolean => post.value?.disabled === true && !unlocked.value)
</script>

<template>
  <!-- Obscurity gate: disabled post data is fetched but not displayed until unlocked. -->
  <PrivateLock v-if="isGated" />
  <article v-else-if="post" class="container article-shell">
    <NuxtLink class="back-link" to="/"><i class="fa-solid fa-arrow-left" /> All writing</NuxtLink>
    <header class="article-header">
      <h1>{{ post.title }}<span v-if="post.aiAssisted" class="article-ai-assisted">AI-assisted</span></h1>
      <div class="d-flex flex-wrap gap-2 mb-4"><NuxtLink v-for="tag in post.tags" :key="tag" class="tag" :to="`/topics/${slugifyTopic(tag)}`">{{ tag }}</NuxtLink></div>
      <p v-if="post.source" class="article-source">Source: {{ post.source }}</p>
      <p class="article-lede">{{ post.excerpt }}</p>
      <div class="article-meta"><time :datetime="post.date">{{ new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</time><span>·</span><span>{{ post.readingTime }}</span></div>
    </header>
    <div class="article-body" v-html="post.html" />
  </article>
</template>
