<script setup lang="ts">
import { slugifyTopic } from '~/page-scripts/topic-utils'

defineProps<{ post: { slug: string; title: string; date: string; excerpt?: string; tags?: string[]; readingTime?: string } }>()
</script>

<template>
  <article class="post-card">
    <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
      <time :datetime="post.date">{{ new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</time>
      <span>{{ post.readingTime || '3 min read' }}</span>
    </div>
    <h2 class="post-card-title"><NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink></h2>
    <div class="d-flex flex-wrap gap-2 mb-3"><NuxtLink v-for="tag in post.tags" :key="tag" class="tag" :to="`/topics/${slugifyTopic(tag)}`">{{ tag }}</NuxtLink></div>
    <p class="post-excerpt">{{ post.excerpt }}</p>
    <div class="d-flex justify-content-end align-items-center">
      <NuxtLink class="read-link text-nowrap" :to="`/blog/${post.slug}`">Read <i class="fa-solid fa-arrow-right" /></NuxtLink>
    </div>
  </article>
</template>
