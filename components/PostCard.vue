<script setup lang="ts">
defineProps<{ post: { slug: string; title: string; date: string; excerpt?: string; tags?: string[]; readingTime?: string } }>()
</script>

<template>
  <article class="post-card">
    <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
      <time :datetime="post.date">{{ new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</time>
      <span>{{ post.readingTime || '3 min read' }}</span>
    </div>
    <h2 class="post-card-title"><NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink></h2>
    <p class="post-excerpt">{{ post.excerpt }}</p>
    <div class="d-flex justify-content-between align-items-end gap-3">
      <div class="d-flex flex-wrap gap-2"><span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span></div>
      <NuxtLink class="read-link text-nowrap" :to="`/blog/${post.slug}`">Read <i class="fa-solid fa-arrow-right" /></NuxtLink>
    </div>
  </article>
</template>
