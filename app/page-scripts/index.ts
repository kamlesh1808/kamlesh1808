export async function setupIndexPage() {
  useHead({
    title: 'Developer notes',
    meta: [{ name: 'description', content: 'Notes on software engineering, modernization, and building reliable systems.' }],
  })
  const { data: posts } = await useFetch('/api/posts')
  return { posts }
}
