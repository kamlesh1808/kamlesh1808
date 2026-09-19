<script setup lang="ts">
useHead({
  title: 'Admin',
  meta: [{ name: 'description', content: 'Private admin dashboard.' }],
})

const { unlocked } = usePrivateAuth()
</script>

<template>
  <!-- Obscurity gate: content hidden until unlocked, not real access control. -->
  <PrivateLock v-if="!unlocked" />
  <template v-else>
    <section class="hero search-hero">
      <div class="container">
        <p class="eyebrow">PRIVATE</p>
        <h1 class="hero-title">Admin</h1>
        <p class="hero-copy">Private tools — hidden from navigation.</p>
      </div>
    </section>
    <section class="container content-section">
      <div class="d-flex flex-wrap gap-2">
        <NuxtLink class="btn btn-dark" to="/tools/write">Write a post</NuxtLink>
        <NuxtLink class="btn btn-outline-dark" to="/tools/drafts">View drafts</NuxtLink>
      </div>
    </section>
  </template>
</template>
