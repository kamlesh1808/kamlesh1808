<script setup lang="ts">
import { setupTopicsPage } from '~/page-scripts/topics'

const { posts, topics } = await setupTopicsPage()
</script>

<template>
  <section class="hero topics-hero">
    <div class="container">
      <p class="eyebrow">Topics</p>
      <h1 class="hero-title">Topics</h1>
      <p class="hero-copy">Browse posts by topic.</p>
    </div>
  </section>
  <section class="container content-section">
    <div class="section-title"><span>{{ posts?.length || 0 }} posts</span></div>
    <div v-if="topics.length" class="row g-4">
      <div v-for="topic in topics" :key="topic.slug" class="col-md-6">
        <NuxtLink class="post-card d-block" :to="`/topics/${topic.slug}`">
          <h2 class="post-card-title">{{ topic.name }}</h2>
          <p class="post-excerpt">{{ topic.count }} posts</p>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="empty-state">No topics yet.</div>
  </section>
</template>
