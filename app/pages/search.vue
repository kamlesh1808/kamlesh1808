<script setup lang="ts">
import { setupSearchPage } from '~/page-scripts/search'

const { query, results } = await setupSearchPage()

const searchInput = ref<HTMLInputElement | null>(null)
const hasResults = computed(() => query.value.trim().length > 0 && results.value.length > 0)

// Empty @submit.prevent intentionally kept: the form never posts — typing
// updates the `q` query param reactively via the `query` computed setter.
// Preventing default stops a full-page reload on Enter.
function onSubmit(): void {
  // No-op: search is reactive; Enter only blurs to dismiss mobile keyboard.
  searchInput.value?.blur()
}

onMounted(() => {
  searchInput.value?.focus()
})
</script>

<template>
  <PageHero variant="search-hero" eyebrow="SEARCH" title="Search the site" />
  <section class="container content-section search-page">
    <form class="search-form" role="search" @submit.prevent="onSubmit">
      <label class="visually-hidden" for="site-search">Search posts</label>
      <input
        id="site-search"
        ref="searchInput"
        v-model="query"
        class="form-control"
        type="search"
        placeholder="Search posts, topics, and tags"
      >
    </form>

    <PostGrid v-if="hasResults" :posts="results" />
    <EmptyState v-else-if="query" as="p">No posts matched “{{ query }}”.</EmptyState>
    <p v-else class="search-hint">Enter a word or phrase to search the posts.</p>
  </section>
</template>
