<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{ posts: PostSummary[] | null }>()
</script>

<template>
  <SectionHeader :count="posts?.length || 0" />
  <PostGrid v-if="posts?.length" :posts="posts ?? []" />
  <EmptyState v-else>No posts yet. Add a my-slug-YYYYMonDD.md file to the content folder.</EmptyState>
</template>
