<script setup lang="ts">
import { setupAboutPage } from '~/page-scripts/about'
import { siteLinks } from '~/data/site'

const about = setupAboutPage()
</script>

<template>
  <section id="posts" class="container content-section">
    <div class="hero-identity">
      <img :src="siteLinks.profile.avatarUrl" alt="Kamlesh Patel" class="hero-avatar">
      <h1 class="hero-title">Building; one commit at a time</h1>
    </div>
    <AboutComp v-bind="about" />
  </section>
</template>
