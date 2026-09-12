import { aboutData } from '~/data/about'

export function setupAboutPage() {
  useHead({ title: 'About', meta: [{ name: 'description', content: 'Learn about Kamlesh Patel, a software engineering leader building reliable systems.' }] })
  return { ...aboutData }
}
