<script setup lang="ts">
import { setupDraftsPage } from '~/page-scripts/drafts'

const { posts } = await setupDraftsPage()
const { unlocked } = usePrivateAuth()
</script>

<template>
  <!-- Obscurity gate: drafts are fetched but not displayed until unlocked. -->
  <PrivateLock v-if="!unlocked" />
  <section v-else id="drafts" class="container content-section">
    <div class="private-header">
      <p class="eyebrow">PRIVATE</p>
      <h1>Drafts</h1>
      <p>Unlisted — hidden posts only</p>
    </div>
    <div class="section-title"><div><p class="eyebrow">UNLISTED DRAFTS</p><h2 class="writing-explore">AI-assisted disabled posts</h2></div><span>{{ posts?.length || 0 }} posts</span></div>
    <div class="row g-4">
      <div v-for="post in posts" :key="post.slug" class="col-md-6"><PostCard :post="post" /></div>
    </div>
    <div v-if="!posts?.length" class="empty-state">No drafts yet.</div>
  </section>
</template>
