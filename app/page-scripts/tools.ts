// Head rule: call useHead BEFORE the first await when the head content is static
// (see index.ts, drafts.ts, topics.ts). Keep nuxtApp.runWithContext(() => useHead(...))
// ONLY when the head depends on fetched data (see topic.ts, post.ts).

export function setupToolsIndexPage() {
  useHead({
    title: 'Tools',
    meta: [{ name: 'description', content: 'Private tools dashboard.' }],
  })
}

export function setupToolsWritePage() {
  useHead({
    title: 'Write a post',
    meta: [{ name: 'description', content: 'Draft a new post with live preview, then copy or download the markdown file.' }],
  })
}
