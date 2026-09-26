<script setup lang="ts">
import { setupTopicsPage } from '~/page-scripts/topics'

const { posts, topics } = await setupTopicsPage()
</script>

<template>
  <PageHero variant="topics-hero" eyebrow="TOPICS">
    <template #copy>Browse posts by topic.</template>
  </PageHero>
  <section class="container content-section">
    <SectionHeader :count="posts?.length || 0" />
    <div v-if="topics.length" class="row g-4">
      <div v-for="topic in topics" :key="topic.slug" class="col-md-4">
        <TopicCard :slug="topic.slug" :name="topic.name" :count="topic.count" />
      </div>
    </div>
    <EmptyState v-else>No topics yet.</EmptyState>
  </section>
</template>
