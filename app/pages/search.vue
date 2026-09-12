<script setup lang="ts">
import { setupSearchPage } from '~/page-scripts/search'

const { query, results } = await setupSearchPage()
</script>

<template>
  <section class="hero search-hero">
    <div class="container">
      <p class="eyebrow">SEARCH</p>
      <h1 class="hero-title">Search the site</h1>
    </div>
  </section>
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

    <div v-if="query && results.length" class="row g-4">
      <div v-for="post in results" :key="post.slug" class="col-md-6">
        <PostCard :post="post" />
      </div>
    </div>
    <p v-else-if="query" class="empty-state">No posts matched “{{ query }}”.</p>
    <p v-else class="search-hint">Enter a word or phrase to search the posts.</p>
  </section>
</template>
