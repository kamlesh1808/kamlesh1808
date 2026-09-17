export async function setupDraftsPage() {
  useHead({
    title: 'Private drafts',
    meta: [
      { name: 'robots', content: 'noindex,nofollow' },
      { name: 'description', content: 'Unlisted AI-assisted draft posts, hidden from the public index.' },
    ],
  })
  const { data: posts } = await useFetch('/api/posts/drafts')
  return { posts }
}
