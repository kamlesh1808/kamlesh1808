<script setup lang="ts">
import { setupIndexPage } from '~/page-scripts/index'

const { posts } = await setupIndexPage()
</script>

<template>
  <section id="posts" class="container content-section">
    <BlogComp :posts="posts ?? null" />
  </section>
</template>
