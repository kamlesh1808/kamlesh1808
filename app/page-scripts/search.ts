export async function setupSearchPage() {
  const route = useRoute()
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  const { data: posts } = await useFetch('/api/posts')

  const query = computed({
    get: () => typeof route.query.q === 'string' ? route.query.q : '',
    set: value => router.replace({ query: value ? { q: value } : {} }),
  })

  const results = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return []

    return (posts.value ?? []).filter((post) => {
      const searchableText = [post.title, post.excerpt, ...(post.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return searchableText.includes(term)
    })
  })

  nuxtApp.runWithContext(() => useHead({
    title: 'Search the site',
    meta: [{ name: 'description', content: 'Search Kamlesh Patel’s software engineering notes and articles.' }],
  }))
  return { query, results }
}
