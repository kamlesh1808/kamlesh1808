<script setup lang="ts">
const { theme } = useTheme()

useHead(() => ({
  htmlAttrs: {
    'data-theme': theme.value,
  },
}))
</script>

<template>
  <div>
    <SiteHeader />
    <main><NuxtPage /></main>
    <SiteFooter />
  </div>
</template>
