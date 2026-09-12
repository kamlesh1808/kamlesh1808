export async function setupBlogPage() {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  const { data: post, error } = await useFetch(() => `/api/posts/${route.params.slug}`)
  if (error.value) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  nuxtApp.runWithContext(() => useHead(() => ({ title: post.value?.title || 'Post', meta: [{ name: 'description', content: post.value?.excerpt || '' }] })))
  return { post }
}
