<script setup lang="ts">
import { setupDraftsPage } from '~/page-scripts/drafts'

const { posts } = await setupDraftsPage()
const { unlocked } = usePrivateAuth()
</script>

<template>
  <!-- Obscurity gate: drafts are fetched but not displayed until unlocked. -->
  <PrivateGate :unlocked="unlocked">
    <PageHero variant="search-hero" eyebrow="PRIVATE" title="Drafts"><template #copy>Unlisted — hidden posts only</template></PageHero>
    <section id="drafts" class="container content-section">
      <SectionHeader :count="posts?.length || 0" eyebrow="UNLISTED DRAFTS" title="Unlisted draft posts" title-class="writing-explore" />
      <PostGrid :posts="posts ?? []" />
      <EmptyState v-if="!posts?.length">No drafts yet.</EmptyState>
    </section>
  </PrivateGate>
</template>
