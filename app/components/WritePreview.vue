<script setup lang="ts">
// Shared preview branch for tools/write.vue: rendered markdown when the body
// has content, EmptyState placeholder otherwise. The html prop must come from
// the shared MarkdownIt instance (~/utils/markdown, html:false) — never raw HTML.
defineProps<{ hasContent: boolean; html: string }>()
</script>

<template>
  <div v-if="hasContent" class="article-body" v-html="html" />
  <EmptyState v-else as="p" extra-class="mt-3">Nothing to preview yet — start writing above.</EmptyState>
</template>
