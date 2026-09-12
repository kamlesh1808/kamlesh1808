<script setup lang="ts">
import { setupTopicPage } from '~/page-scripts/topic'

const { topic, filtered } = await setupTopicPage()
</script>

<template>
  <article v-if="topic" class="container article-shell topics-shell">
    <NuxtLink class="back-link" to="/topics"><i class="fa-solid fa-arrow-left" /> Topics</NuxtLink>
    <header class="article-header">
      <h1>{{ topic.name }}</h1>
      <p class="article-lede">{{ topic.count }} posts</p>
    </header>
    <div class="row g-4">
      <div v-for="post in filtered" :key="post.slug" class="col-md-6">
        <div class="post-card">
          <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
            <time :datetime="post.date">{{ new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</time>
          </div>
          <h2 class="post-card-title"><NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink></h2>
        </div>
      </div>
    </div>
  </article>
  <section v-else class="container content-section topics-missing">
    <NuxtLink class="back-link" to="/topics"><i class="fa-solid fa-arrow-left" /> Topics</NuxtLink>
    <div class="empty-state">Topic not found.</div>
  </section>
</template>
