import { NOT_FOUND_ERRORS, assertFound, type Post } from '../../server/utils/posts'

export async function setupPostPage() {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  const { data: post, error } = await useFetch<Post>(() => `/api/posts/${route.params.slug}`)
  if (error.value) throw createError(NOT_FOUND_ERRORS.post)
  assertFound(post.value, NOT_FOUND_ERRORS.post)
  nuxtApp.runWithContext(() => useHead(() => ({ title: post.value?.title || 'Post', meta: [{ name: 'description', content: post.value?.excerpt || '' }] })))
  return { post }
}
