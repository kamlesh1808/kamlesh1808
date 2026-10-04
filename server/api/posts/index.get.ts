import { getPosts } from '../../utils/posts'
import type { PostSummary } from '~/types/post'

export default defineEventHandler(async (): Promise<PostSummary[]> => {
  const posts = await getPosts()
  return posts.map(({ html, ...post }) => post)
})
