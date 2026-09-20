<template>
  <footer class="site-footer mt-5">
    <div class="container d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 py-4">
      <p class="mb-0">© {{ new Date().getFullYear() }} Kamlesh Patel · v{{ APP_VERSION }}</p>
      <GoogleTranslate />
      <div class="d-flex gap-3">
        <a v-for="link in siteLinks.social" :key="link.ariaLabel" :href="link.url" target="_blank" rel="noreferrer" :aria-label="link.ariaLabel"><i :class="link.iconClass" aria-hidden="true"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { APP_VERSION } from '~/data/app-version'
import { siteLinks } from '~/data/site'
</script>
