<!-- Use EmptyState for zero-results / missing content (e.g. no search matches, unknown topic).
     Do NOT replace the standalone `p.search-hint` in search.vue with EmptyState:
     the hint is pre-search idle guidance, not an empty result. -->
<script setup lang="ts">
withDefaults(defineProps<{ as?: 'div' | 'p'; extraClass?: string }>(), { as: 'div', extraClass: undefined })
</script>

<template>
  <component :is="as" class="empty-state" :class="extraClass"><slot /></component>
</template>
