<script setup lang="ts">
const route = useRoute()
const { data: post, error } = await useFetch(() => `/api/posts/${route.params.slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
useHead(() => ({ title: post.value?.title || 'Post', meta: [{ name: 'description', content: post.value?.excerpt || '' }] }))
</script>

<template>
  <article v-if="post" class="container article-shell">
    <NuxtLink class="back-link" to="/"><i class="fa-solid fa-arrow-left" /> All writing</NuxtLink>
    <header class="article-header">
      <div class="d-flex flex-wrap gap-2 mb-4"><span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span></div>
      <h1>{{ post.title }}</h1>
      <p class="article-lede">{{ post.excerpt }}</p>
      <div class="article-meta"><time :datetime="post.date">{{ new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</time><span>·</span><span>{{ post.readingTime }}</span></div>
    </header>
    <div class="article-body" v-html="post.html" />
  </article>
</template>
