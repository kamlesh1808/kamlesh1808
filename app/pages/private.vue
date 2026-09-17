<script setup lang="ts">
// Legacy redirect: /private → /posts-drafts.
// Drafts page moved to /posts-drafts; 301 on the server so static
// hosting and search engines pick up the permanent move.
await navigateTo('/posts-drafts', { redirectCode: 301, replace: true })
</script>

<template>
  <p>Redirecting…</p>
</template>
