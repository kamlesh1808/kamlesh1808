<script setup lang="ts">
const { theme } = useTheme()

useHead(() => ({
  titleTemplate: (title) => title && title !== 'Kamlesh Patel' ? `${title} · Kamlesh Patel` : 'Kamlesh Patel',
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
