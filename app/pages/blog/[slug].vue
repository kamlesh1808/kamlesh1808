<script setup lang="ts">
// Legacy redirect: /blog/:slug → /post/:slug.
// Content slugs were mechanically renamed (leading "blog" → "post"),
// so map the old slug the same way. 301 on the server so static
// hosting and search engines pick up the permanent move.
const slug = String(useRoute().params.slug ?? '')
const newSlug = slug.replace(/^blog/i, 'post')
await navigateTo(`/post/${newSlug}`, { redirectCode: 301, replace: true })
</script>

<template>
  <p>Redirecting…</p>
</template>
