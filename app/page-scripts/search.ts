import type { PostSummary } from '~/types/post'

export async function setupSearchPage() {
  useHead({
    title: 'Search the site',
    meta: [{ name: 'description', content: 'Search Kamlesh Patel’s software engineering notes and articles.' }],
  })
  const route = useRoute()
  const router = useRouter()
  const { data: posts } = await useFetch('/api/posts')

  const query = computed({
    get: () => typeof route.query.q === 'string' ? route.query.q : '',
    set: value => router.replace({ query: value ? { q: value } : {} }),
  })

  const results = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return []

    return (posts.value ?? []).filter((post: PostSummary) => {
      const searchableText = [post.title, post.excerpt, ...(post.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return searchableText.includes(term)
    })
  })

  return { query, results }
}
