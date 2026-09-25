<script setup lang="ts">
import type { Contact, Profile } from '~/types/about'

defineProps<{ profile: Profile; contact: Contact }>()
</script>

<template>
  <PageHero variant="about-hero" eyebrow="ABOUT">
    <div class="profile-card">
      <p class="mb-1 fw-semibold profile-name">{{ profile.name }}</p>
      <p class="mb-3 profile-subtitle">{{ profile.subtitle }}</p>
      <p class="resume-contact mb-0">
        <a :href="contact.locationUrl" target="_blank" rel="noreferrer noopener">{{ contact.location }}</a>, {{ contact.region }}
        <span class="contact-links">
          <a
            v-for="link in contact.links"
            :key="link.ariaLabel"
            :href="link.url"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noreferrer noopener' : undefined"
            :aria-label="link.ariaLabel"
          ><i :class="link.iconClass" aria-hidden="true" /></a>
        </span>
      </p>
    </div>
  </PageHero>
</template>
