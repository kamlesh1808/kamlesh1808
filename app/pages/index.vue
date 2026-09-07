<script setup lang="ts">
useHead({ title: 'Developer notes' })
const { data: posts } = await useFetch('/api/posts')
</script>

<template>
  <section class="hero">
    <div class="container">
      <p class="eyebrow">HELLO, I’M KAMLESH</p>
      <h1 class="hero-title">Building; one commit at a time</h1>
      <p class="hero-copy"><img src="https://github.com/kamlesh1808.png" alt="Kamlesh Patel" class="hero-avatar"></p>
      <a class="btn btn-dark rounded-pill px-4 py-2" href="#posts">Explore the writing <i class="fa-solid fa-arrow-down ms-2" /></a>
    </div>
  </section>
  <section id="posts" class="container content-section">
    <div class="section-title"><div><p class="eyebrow">THE LATEST</p><h2>Recent writing</h2></div><span>{{ posts?.length || 0 }} posts</span></div>
    <div class="row g-4">
      <div v-for="post in posts" :key="post.slug" class="col-md-6"><PostCard :post="post" /></div>
    </div>
    <div v-if="!posts?.length" class="empty-state">No posts yet. Add a <code>blogYYYYMonDD.md</code> file to the <code>content</code> folder.</div>
  </section>
</template>
