<script setup lang="ts">
// Modern destructured defaults (Vue 3.5+): withDefaults() still works but
// destructuring is the preferred pattern going forward.
const { variant = 'search-hero', eyebrow, title = undefined } = defineProps<{
  variant?: 'search-hero' | 'topics-hero' | 'about-hero'
  eyebrow: string
  title?: string
}>()
</script>

<template>
  <section class="hero" :class="variant">
    <div class="container">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1 v-if="title || $slots.title" class="hero-title"><slot name="title">{{ title }}</slot></h1>
      <p v-if="$slots.copy" class="hero-copy"><slot name="copy" /></p>
      <slot />
    </div>
  </section>
</template>
