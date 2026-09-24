<script setup lang="ts">
import { setupWritingPage } from '~/page-scripts/index'

const { posts } = await setupWritingPage()
</script>

<template>
  <section id="posts" class="container content-section">
    <BlogComp :posts="posts ?? null" />
  </section>
</template>
