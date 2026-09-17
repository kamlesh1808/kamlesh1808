import { getDraftPosts, type PostSummary } from '../../utils/posts'

export default defineEventHandler(async (): Promise<PostSummary[]> => {
  const posts = await getDraftPosts()
  return posts.map(({ html, ...post }) => post)
})
