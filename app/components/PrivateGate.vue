<script setup lang="ts">
defineProps<{ unlocked: boolean }>()
</script>

<template>
  <PrivateLock v-if="!unlocked" />
  <slot v-else />
</template>
