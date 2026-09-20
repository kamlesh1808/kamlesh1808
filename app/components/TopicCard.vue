<script setup lang="ts">
defineProps<{ slug: string; name: string; count: number }>()
</script>

<template>
  <NuxtLink class="post-card d-block" :to="`/topics/${slug}`">
    <div class="topic-card-header">
      <h2 class="post-card-title">{{ name }}</h2>
      <span class="topic-count">{{ count }} posts</span>
    </div>
  </NuxtLink>
</template>
