<script setup lang="ts">
import { slugifyTopic } from '~/page-scripts/topic-utils'

// wrapperClass is kept for backward compatibility: callers (e.g. tools/write.vue)
// override the flex layout for inline tag previews. Default preserves the
// card-meta layout used by PostCard.
withDefaults(defineProps<{ tags?: string[]; variant?: 'link' | 'span'; wrapperClass?: string }>(), {
  tags: () => [],
  variant: 'link',
  wrapperClass: 'd-flex flex-wrap gap-2 mb-3',
})
</script>

<template>
  <div :class="wrapperClass">
    <template v-if="variant === 'span'">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </template>
    <template v-else>
      <NuxtLink v-for="tag in tags" :key="tag" class="tag" :to="`/topics/${slugifyTopic(tag)}`">{{ tag }}</NuxtLink>
    </template>
  </div>
</template>
