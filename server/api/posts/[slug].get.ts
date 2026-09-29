import { NOT_FOUND_ERRORS, assertFound, getAllPosts, type Post } from '../../utils/posts'

export default defineEventHandler(async (event): Promise<Post> => {
  const slug = getRouterParam(event, 'slug')
  const post = (await getAllPosts()).find(item => item.slug === slug)
  assertFound(post, NOT_FOUND_ERRORS.post)
  return post
})
