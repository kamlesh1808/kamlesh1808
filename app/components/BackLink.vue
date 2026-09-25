<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <NuxtLink class="back-link" :to="to"><i class="fa-solid fa-arrow-left" aria-hidden="true" /> <slot /></NuxtLink>
</template>
