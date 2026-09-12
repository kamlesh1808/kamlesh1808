<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const open = ref(false)
const togglerRef = ref<HTMLButtonElement | null>(null)
const links = computed(() => [
  { label: t('nav.writing'), to: '/' },
  { label: t('nav.topics'), to: '/topics' },
  { label: t('nav.about'), to: '/about' },
])

function closeMenu() {
  open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    closeMenu()
    togglerRef.value?.focus()
  }
}

watch(() => route.path, () => {
  closeMenu()
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="site-header sticky-top">
    <nav class="navbar navbar-expand-lg container py-3" aria-label="Main navigation">
      <NuxtLink class="navbar-brand d-flex align-items-center" to="/" @click="closeMenu">
        <img class="brand-avatar" src="https://github.com/kamlesh1808.png" alt="Kamlesh Patel" />
        <span>Kamlesh Patel</span>
      </NuxtLink>
      <button ref="togglerRef" class="navbar-toggler" type="button" aria-controls="main-nav-collapse" :aria-expanded="open ? 'true' : 'false'" :aria-label="open ? t('nav.close') : t('nav.toggle')" @click="open = !open">
        <i :class="open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true" />
      </button>
      <div id="main-nav-collapse" class="collapse navbar-collapse" :class="{ show: open }">
        <ul class="navbar-nav mx-auto align-items-lg-center gap-lg-2">
          <li v-for="link in links" :key="link.to" class="nav-item">
            <NuxtLink class="nav-link" active-class="active" exact-active-class="active" :to="link.to" @click="closeMenu">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
