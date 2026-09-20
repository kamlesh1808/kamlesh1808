<script setup lang="ts">
withDefaults(defineProps<{ count: number; noun?: string; eyebrow?: string; title?: string; titleClass?: string }>(), {
  noun: 'posts',
  eyebrow: undefined,
  title: undefined,
  titleClass: undefined,
})
</script>

<template>
  <div class="section-title">
    <div v-if="eyebrow || title">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2 v-if="title" :class="titleClass">{{ title }}</h2>
    </div>
    <span>{{ count }} {{ noun }}</span>
  </div>
</template>
