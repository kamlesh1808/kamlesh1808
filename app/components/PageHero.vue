<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'search-hero' | 'topics-hero' | 'about-hero'; eyebrow: string; title?: string }>(), {
  variant: 'search-hero',
  title: undefined,
})
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
