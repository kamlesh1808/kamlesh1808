import { getPosts, type PostSummary } from '../../utils/posts'

export default defineEventHandler(async (): Promise<PostSummary[]> => {
  const posts = await getPosts()
  return posts.map(({ html, ...post }) => post)
})
