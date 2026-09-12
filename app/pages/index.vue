<script setup lang="ts">
import { setupIndexPage } from '~/page-scripts/index'

const { posts } = await setupIndexPage()
</script>

<template>
  <section class="hero home-hero">
    <div class="container">
      <p class="eyebrow">HELLO, I’M KAMLESH</p>
      <div class="hero-identity">
        <img src="https://github.com/kamlesh1808.png" alt="Kamlesh Patel" class="hero-avatar">
        <h1 class="hero-title">Building; one commit at a time</h1>
      </div>
    </div>
  </section>
  <section id="posts" class="container content-section">
    <div class="section-title"><div><p class="eyebrow">THE LATEST</p><h2 class="writing-explore">Explore the writing</h2></div><span>{{ posts?.length || 0 }} posts</span></div>
    <div class="row g-4">
      <div v-for="post in posts" :key="post.slug" class="col-md-6"><PostCard :post="post" /></div>
    </div>
    <div v-if="!posts?.length" class="empty-state">No posts yet. Add a blogYYYYMonDD.md file to the content folder.</div>
  </section>
</template>
