<script setup lang="ts">
// Legacy redirect: /write → /admin.
// Composer page moved to /admin; 301 on the server so static
// hosting and search engines pick up the permanent move.
await navigateTo('/admin', { redirectCode: 301, replace: true })
</script>

<template>
  <p>Redirecting…</p>
</template>
