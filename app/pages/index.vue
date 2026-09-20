<script setup lang="ts">
import { setupIndexPage } from '~/page-scripts/index'
import { siteLinks } from '~/data/site'

const { posts } = await setupIndexPage()
</script>

<template>
  <section id="posts" class="container content-section">
    <div class="hero-identity">
      <img :src="siteLinks.profile.avatarUrl" alt="Kamlesh Patel" class="hero-avatar">
      <h1 class="hero-title">Building; one commit at a time</h1>
    </div>
    <SectionHeader :count="posts?.length || 0" eyebrow="THE LATEST" title="Explore the writing" title-class="writing-explore" />
    <PostGrid :posts="posts ?? []" />
    <EmptyState v-if="!posts?.length">No posts yet. Add a postYYYYMonDD.md file to the content folder.</EmptyState>
  </section>
</template>
