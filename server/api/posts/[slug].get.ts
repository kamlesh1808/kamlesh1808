import { getPosts } from '../../utils/posts'

export default defineEventHandler(async (event) => {
  const post = (await getPosts()).find(item => item.slug === getRouterParam(event, 'slug'))
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return post
})
