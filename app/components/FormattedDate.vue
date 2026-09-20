<script setup lang="ts">
const props = withDefaults(defineProps<{ date: string; format?: 'short' | 'long' }>(), { format: 'short' })

const formatted = computed(() => new Date(`${props.date}T12:00:00`).toLocaleDateString('en-US', props.format === 'long'
  ? { month: 'long', day: 'numeric', year: 'numeric' }
  : { month: 'short', day: 'numeric', year: 'numeric' }))
</script>

<template>
  <time :datetime="date">{{ formatted }}</time>
</template>
