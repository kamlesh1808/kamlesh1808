<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{ posts: PostSummary[] }>()
</script>

<template>
  <div class="row g-4">
    <div v-for="post in posts" :key="post.slug" class="col-md-6">
      <slot name="card" :post="post"><PostCard :post="post" /></slot>
    </div>
  </div>
</template>
