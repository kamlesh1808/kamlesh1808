import { getDraftPosts } from '../../utils/posts'
import type { PostSummary } from '~/types/post'

export default defineEventHandler(async (): Promise<PostSummary[]> => {
  const posts = await getDraftPosts()
  return posts.map(({ html, ...post }) => post)
})
