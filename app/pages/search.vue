<script setup lang="ts">
import { setupSearchPage } from '~/page-scripts/search'

const { query, results } = await setupSearchPage()
</script>

<template>
  <PageHero variant="search-hero" eyebrow="SEARCH" title="Search the site" />
  <section class="container content-section search-page">
    <form class="search-form" role="search" @submit.prevent>
      <label class="visually-hidden" for="site-search">Search posts</label>
      <input
        id="site-search"
        v-model="query"
        class="form-control"
        type="search"
        placeholder="Search posts, topics, and tags"
        autofocus
      >
    </form>

    <PostGrid v-if="query && results.length" :posts="results" />
    <EmptyState v-else-if="query" as="p">No posts matched “{{ query }}”.</EmptyState>
    <p v-else class="search-hint">Enter a word or phrase to search the posts.</p>
  </section>
</template>
