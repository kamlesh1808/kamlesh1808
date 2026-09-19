import { getAllPosts, type Post } from '../../utils/posts'

export default defineEventHandler(async (event): Promise<Post> => {
  const slug = getRouterParam(event, 'slug')
  const post = (await getAllPosts()).find(item => item.slug === slug)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return post
})
