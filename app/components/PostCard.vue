<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{ post: PostSummary }>()
</script>

<template>
  <article class="post-card">
    <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
      <FormattedDate :date="post.date" />
      <span>{{ post.readingTime || '3 min read' }}</span>
    </div>
    <h2 class="post-card-title"><NuxtLink :to="`/post/${post.slug}`">{{ post.title }}</NuxtLink></h2>
    <TagList :tags="post.tags" />
    <p v-if="post.source" class="post-source">Source: {{ post.source }}</p>
    <p class="post-excerpt">{{ post.excerpt }}</p>
    <div class="d-flex justify-content-end align-items-center">
      <NuxtLink class="read-link text-nowrap" :to="`/post/${post.slug}`">Read <i class="fa-solid fa-arrow-right" /></NuxtLink>
    </div>
  </article>
</template>
