import type { PostSummary } from '~/types/post'

type SearchPredicate = (post: PostSummary, term: string) => boolean

// Hard-coded searchable fields (title, excerpt, tags).
const SEARCH_PREDICATES: SearchPredicate[] = [
  (post, term) => (post.title ?? '').toLowerCase().includes(term),
  (post, term) => (post.excerpt ?? '').toLowerCase().includes(term),
  (post, term) => (post.tags ?? []).some(tag => (tag ?? '').toLowerCase().includes(term)),
]

function matchesSearch(post: PostSummary, term: string): boolean {
  return SEARCH_PREDICATES.some(predicate => predicate(post, term))
}

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

    return (posts.value ?? []).filter((post: PostSummary) => matchesSearch(post, term))
  })

  return { query, results }
}
