<script setup lang="ts">
import { setupToolsIndexPage } from '~/page-scripts/tools'

setupToolsIndexPage()

const { unlocked } = usePrivateAuth()
</script>

<template>
  <!-- Obscurity gate: content hidden until unlocked, not real access control. -->
  <PrivateGate :unlocked="unlocked">
    <PageHero variant="search-hero" eyebrow="PRIVATE" title="Admin">
      <template #copy>Private tools — hidden from navigation.</template>
    </PageHero>
    <section class="container content-section">
      <div class="d-flex flex-wrap gap-2">
        <NuxtLink class="btn btn-dark" to="/tools/write">Write a post</NuxtLink>
        <NuxtLink class="btn btn-outline-dark" to="/tools/drafts">View drafts</NuxtLink>
      </div>
    </section>
  </PrivateGate>
</template>
