<script setup lang="ts">
import { setupToolsIndexPage } from '~/page-scripts/tools'
import { siteLinks } from '~/data/site'

setupToolsIndexPage()

const { unlocked } = usePrivateAuth()
</script>

<template>
  <!-- Obscurity gate: content hidden until unlocked, not real access control. -->
  <PrivateGate :unlocked="unlocked">
    <PageHero variant="search-hero" eyebrow="PRIVATE" title="Tools">
      <template #copy>Private tools — hidden from navigation.</template>
    </PageHero>
    <section class="container content-section">
      <div class="d-flex flex-wrap gap-2">
        <NuxtLink class="btn btn-dark" :to="siteLinks.routes.toolsWrite">Write a post</NuxtLink>
        <NuxtLink class="btn btn-outline-dark" :to="siteLinks.routes.toolsDrafts">View drafts</NuxtLink>
      </div>
    </section>
  </PrivateGate>
</template>
