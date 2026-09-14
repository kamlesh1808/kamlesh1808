<script setup lang="ts">
import { setupTopicsPage } from '~/page-scripts/topics'

const { posts, topics } = await setupTopicsPage()
</script>

<template>
  <section class="hero topics-hero">
    <div class="container">
      <p class="eyebrow">TOPICS</p>
      <p class="hero-copy">Browse posts by topic.</p>
    </div>
  </section>
  <section class="container content-section">
    <div class="section-title"><span>{{ posts?.length || 0 }} posts</span></div>
    <div v-if="topics.length" class="row g-4">
      <div v-for="topic in topics" :key="topic.slug" class="col-md-4">
        <NuxtLink class="post-card d-block" :to="`/topics/${topic.slug}`">
          <div class="topic-card-header">
            <h2 class="post-card-title">{{ topic.name }}</h2>
            <span class="topic-count">{{ topic.count }} posts</span>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="empty-state">No topics yet.</div>
  </section>
</template>
