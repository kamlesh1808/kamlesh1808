<script setup lang="ts">
// Legacy redirect: /posts-drafts → /tools/drafts.
// Drafts page moved under /tools; 301 on the server so static
// hosting and search engines pick up the permanent move.
await navigateTo('/tools/drafts', { redirectCode: 301, replace: true })
</script>

<template>
  <p>Redirecting…</p>
</template>
