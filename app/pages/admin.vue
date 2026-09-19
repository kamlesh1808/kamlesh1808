<script setup lang="ts">
// Legacy redirect: /admin → /tools.
// Private pages moved to /tools; 301 on the server so static
// hosting and search engines pick up the permanent move.
await navigateTo('/tools', { redirectCode: 301, replace: true })
</script>

<template>
  <p>Redirecting…</p>
</template>
