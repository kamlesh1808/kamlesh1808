<script setup lang="ts">
const route = useRoute()
const open = ref(false)
const links = [
  { label: 'Writing', to: '/' },
  { label: 'About', to: '/about' },]
</script>

<template>
  <header class="site-header sticky-top">
    <nav class="navbar navbar-expand-lg container py-3" aria-label="Main navigation">
      <NuxtLink class="navbar-brand d-flex align-items-center" to="/" @click="open = false">
        <img class="brand-avatar" src="https://github.com/kamlesh1808.png" alt="Kamlesh Patel" />
        <span>Kamlesh Patel</span>
      </NuxtLink>
      <button class="navbar-toggler" type="button" aria-label="Toggle navigation" :aria-expanded="open" @click="open = !open">
        <i class="fa-solid fa-bars" />
      </button>
      <div class="collapse navbar-collapse" :class="{ show: open }">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li v-for="link in links" :key="link.to" class="nav-item">
            <NuxtLink class="nav-link" :class="{ active: route.path === link.to }" :to="link.to" @click="open = false">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
