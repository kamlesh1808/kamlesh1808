import { getPosts } from '../../utils/posts'

export default defineEventHandler(async () => {
  const posts = await getPosts()
  return posts.map(({ html, ...post }) => post)
})
