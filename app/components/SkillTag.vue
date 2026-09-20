<script setup lang="ts">
withDefaults(defineProps<{ name: string; href?: string | null; className?: string; title?: string }>(), {
  href: null,
  className: 'tag text-wrap me-1 mb-1',
  title: undefined,
})
</script>

<template>
  <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer"><span :class="className" :title="title || undefined">{{ name }}</span></a>
  <span v-else :class="className" :title="title || undefined">{{ name }}</span>
</template>
