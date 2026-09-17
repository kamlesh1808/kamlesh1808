import type { Post } from '../../server/utils/posts'

export async function setupPostPage() {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  const { data: post, error } = await useFetch<Post>(() => `/api/posts/${route.params.slug}`)
  if (error.value) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  nuxtApp.runWithContext(() => useHead(() => ({ title: post.value?.title || 'Post', meta: [{ name: 'description', content: post.value?.excerpt || '' }] })))
  return { post }
}
