import MarkdownIt from 'markdown-it'

// Shared MarkdownIt instance for the write tool.
// html: false keeps raw HTML out of previews. The validateLink override
// blocks javascript:/vbscript:/data: URLs — no dompurify in package.json,
// so this allowlist is our XSS boundary (see tools/write.vue comment).
// javascript: filtering is defense-in-depth: v-html renders md output.
const UNSAFE_PROTOCOLS = ['javascript:', 'vbscript:', 'data:']

function isSafeLink(url: string): boolean {
  const normalized = url.trim().toLowerCase()
  return !UNSAFE_PROTOCOLS.some(protocol => normalized.startsWith(protocol))
}

function createMarkdown(): InstanceType<typeof MarkdownIt> {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
  const defaultValidate = md.validateLink.bind(md)
  md.validateLink = (url: string): boolean => {
    try {
      if (!isSafeLink(url)) return false
    }
    catch {
      return false
    }
    return defaultValidate(url)
  }
  return md
}

export const markdown = createMarkdown()
export { isSafeLink }
