export async function setupIndexPage() {
  useHead({
    title: 'Kamlesh Patel',
    meta: [{ name: 'description', content: 'Notes on software engineering, modernization, and building reliable systems.' }],
  })
  const { data: posts } = await useFetch('/api/posts')
  return { posts }
}

export async function setupWritingPage() {
  useHead({
    title: 'Writing',
    meta: [{ name: 'description', content: 'Browse Kamlesh Patel’s software engineering notes and articles.' }],
  })
  const { data: posts } = await useFetch('/api/posts')
  return { posts }
}
