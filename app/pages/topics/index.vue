<script setup lang="ts">
const { t } = useI18n()
useHead({ title: t('topics.title') })
const { data: posts } = await useFetch('/api/posts')
const topics = computed(() => groupTopics(posts.value ?? []))
</script>

<template>
  <section class="hero topics-hero">
    <div class="container">
      <p class="eyebrow">{{ t('topics.title') }}</p>
      <h1 class="hero-title">{{ t('topics.title') }}</h1>
      <p class="hero-copy">{{ t('topics.subtitle') }}</p>
    </div>
  </section>
  <section class="container content-section">
    <div class="section-title"><span>{{ t('topics.posts_count', { count: posts?.length || 0 }) }}</span></div>
    <div v-if="topics.length" class="row g-4">
      <div v-for="topic in topics" :key="topic.slug" class="col-md-6">
        <NuxtLink class="post-card d-block" :to="`/topics/${topic.slug}`">
          <h2 class="post-card-title">{{ topic.name }}</h2>
          <p class="post-excerpt">{{ t('topics.posts_count', { count: topic.count }) }}</p>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="empty-state">{{ t('topics.empty') }}</div>
  </section>
</template>
