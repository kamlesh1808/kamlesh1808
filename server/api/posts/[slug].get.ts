import { getPosts, type Post } from '../../utils/posts'

export default defineEventHandler(async (event): Promise<Post> => {
  const post = (await getPosts()).find(item => item.slug === getRouterParam(event, 'slug'))
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return post
})
