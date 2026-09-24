<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{ posts: PostSummary[] | null }>()
</script>

<template>
  <SectionHeader :count="posts?.length || 0" eyebrow="THE LATEST" title="Explore the writing" title-class="writing-explore" />
  <PostGrid :posts="posts ?? []" />
  <EmptyState v-if="!posts?.length">No posts yet. Add a my-slug-YYYYMonDD.md file to the content folder.</EmptyState>
</template>
