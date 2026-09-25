<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ date: string; format?: 'short' | 'long' }>(), { format: 'short' })

// Noon hack: parse as noon local time to avoid TZ shifts pushing the date
// back/forward a day when the frontmatter date has no time component.
const formatted = computed(() => new Date(`${props.date}T12:00:00`).toLocaleDateString('en-US', props.format === 'long'
  ? { month: 'long', day: 'numeric', year: 'numeric' }
  : { month: 'short', day: 'numeric', year: 'numeric' }))
</script>

<template>
  <time :datetime="date">{{ formatted }}</time>
</template>
