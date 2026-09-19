<script setup lang="ts">
// Legacy redirect: /write → /tools/write.
// Composer page moved to /tools/write; 301 on the server so static
// hosting and search engines pick up the permanent move.
await navigateTo('/tools/write', { redirectCode: 301, replace: true })
</script>

<template>
  <p>Redirecting…</p>
</template>
