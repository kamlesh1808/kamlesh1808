<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { buildFilename, buildMarkdown, parseTags, suggestSlug, validateComposer } from '~/page-scripts/write'

useHead({
  title: 'Write a post',
  meta: [{ name: 'description', content: 'Draft a new post with live preview, then copy or download the markdown file.' }],
})

const { unlocked } = usePrivateAuth()

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

const postName = ref('')
const slugInput = ref('')
const title = ref('')
const excerpt = ref('')
const tagsInput = ref('')
const body = ref('')
const submitted = ref(false)
const result = ref<{ filename: string; markdown: string } | null>(null)
const copyStatus = ref('')
const bodyRef = ref<HTMLTextAreaElement | null>(null)

const suggestedSlug = computed(() => suggestSlug(postName.value.trim() || title.value.trim()))
const effectiveSlug = computed(() => (slugInput.value.trim() ? suggestSlug(slugInput.value) : suggestedSlug.value))
const tags = computed(() => parseTags(tagsInput.value))
const today = computed(() => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
})
const words = computed(() => body.value.trim().split(/\s+/).filter(Boolean).length)
const readingTime = computed(() => `${Math.max(1, Math.ceil(words.value / 200))} min read`)
const renderedHtml = computed(() => md.render(body.value))
const previewPost = computed(() => ({
  slug: 'preview',
  title: title.value.trim() || 'Untitled preview',
  date: today.value,
  excerpt: excerpt.value.trim(),
  tags: tags.value,
  readingTime: readingTime.value,
}))
const errors = computed(() => validateComposer({
  postName: postName.value,
  title: title.value,
  excerpt: excerpt.value,
  tagsInput: tagsInput.value,
  body: body.value,
}).errors)

function focusSelection(start: number, end: number): void {
  const el = bodyRef.value
  if (!el) return
  el.focus()
  el.setSelectionRange(start, end)
}

function surround(before: string, after: string, placeholder = 'text'): void {
  const el = bodyRef.value
  const current = body.value
  const start = el?.selectionStart ?? current.length
  const end = el?.selectionEnd ?? current.length
  const selected = current.slice(start, end) || placeholder
  body.value = current.slice(0, start) + before + selected + after + current.slice(end)
  nextTick(() => focusSelection(start + before.length, start + before.length + selected.length))
}

function prefixSelectedLines(prefix: string | ((index: number) => string)): void {
  const el = bodyRef.value
  const current = body.value
  const start = el?.selectionStart ?? current.length
  const end = el?.selectionEnd ?? current.length
  const lineStart = current.lastIndexOf('\n', start - 1) + 1
  const lineEnd = current.indexOf('\n', end)
  const blockEnd = lineEnd === -1 ? current.length : lineEnd
  const block = current.slice(lineStart, blockEnd)
  const lines = block.split('\n')
  const prefixed = lines.map((line, index) => {
    const marker = typeof prefix === 'function' ? prefix(index) : prefix
    return line.startsWith(marker) ? line : marker + line.replace(/^([#>\-\d.]+\s)*/, '')
  }).join('\n')
  body.value = current.slice(0, lineStart) + prefixed + current.slice(blockEnd)
  nextTick(() => {
    const elAfter = bodyRef.value
    if (!elAfter) return
    elAfter.focus()
    elAfter.setSelectionRange(lineStart, lineStart + prefixed.length)
  })
}

function applyToolbar(action: string): void {
  switch (action) {
    case 'bold': surround('**', '**'); break
    case 'italic': surround('*', '*'); break
    case 'h2': prefixSelectedLines('## '); break
    case 'h3': prefixSelectedLines('### '); break
    case 'ul': prefixSelectedLines('- '); break
    case 'ol': prefixSelectedLines(index => `${index + 1}. `); break
    case 'quote': prefixSelectedLines('> '); break
    case 'code': surround('`', '`', 'code'); break
    case 'link': surround('[', '](https://)', 'text'); break
  }
}

function onSubmit(): void {
  submitted.value = true
  copyStatus.value = ''
  const validation = validateComposer({
    postName: postName.value,
    title: title.value,
    excerpt: excerpt.value,
    tagsInput: tagsInput.value,
    body: body.value,
  })
  if (Object.keys(validation.errors).length > 0) {
    result.value = null
    return
  }
  const [todayYear, todayMonth, todayDay] = today.value.split('-').map(Number) as [number, number, number]
  const filename = buildFilename(effectiveSlug.value, new Date(todayYear, todayMonth - 1, todayDay))
  const markdown = buildMarkdown({
    title: title.value.trim(),
    excerpt: excerpt.value.trim(),
    tags: validation.tags,
    date: today.value,
    body: body.value,
  })
  result.value = { filename, markdown }
}

async function copyMarkdown(): Promise<void> {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.markdown)
    copyStatus.value = 'Copied to clipboard.'
  }
  catch {
    const area = document.createElement('textarea')
    area.value = result.value.markdown
    document.body.appendChild(area)
    area.select()
    try {
      document.execCommand('copy')
      copyStatus.value = 'Copied to clipboard.'
    }
    catch {
      copyStatus.value = 'Copy failed — select the text manually.'
    }
    document.body.removeChild(area)
  }
}

function downloadMarkdown(): void {
  if (!result.value) return
  const blob = new Blob([result.value.markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = result.value.filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <!-- Obscurity gate: content hidden until unlocked, not real access control. -->
  <PrivateLock v-if="!unlocked" />
  <template v-else>
  <section class="hero search-hero">
    <div class="container">
      <p class="eyebrow">WRITE</p>
      <h1 class="hero-title">Write a post</h1>
      <p class="hero-copy">Draft in markdown, preview instantly, then add the file to <code>content/</code> and push.</p>
    </div>
  </section>
  <section class="container content-section">
    <form novalidate @submit.prevent="onSubmit">
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <label class="form-label" for="write-post-name">Post name</label>
          <input
            id="write-post-name"
            v-model="postName"
            class="form-control"
            type="text"
            placeholder="My new post idea"
          >
          <div class="form-text">Used for the slug suggestion below.</div>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="write-slug">Slug (editable)</label>
          <input
            id="write-slug"
            v-model="slugInput"
            class="form-control"
            type="text"
            :placeholder="suggestedSlug"
          >
          <div class="form-text">Final slug: <code>{{ effectiveSlug }}</code></div>
        </div>
        <div class="col-12">
          <label class="form-label" for="write-title">Title (required, max 120)</label>
          <input
            id="write-title"
            v-model="title"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.title }"
            type="text"
            maxlength="120"
            placeholder="Post title"
          >
          <div v-if="submitted && errors.title" class="invalid-feedback">{{ errors.title }}</div>
        </div>
        <div class="col-12">
          <label class="form-label" for="write-excerpt">Excerpt (max 300)</label>
          <textarea
            id="write-excerpt"
            v-model="excerpt"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.excerpt }"
            rows="2"
            maxlength="300"
            placeholder="One or two sentences shown on cards and in search."
          />
          <div v-if="submitted && errors.excerpt" class="invalid-feedback">{{ errors.excerpt }}</div>
        </div>
        <div class="col-12">
          <label class="form-label" for="write-tags">Tags (comma-separated, max 8)</label>
          <input
            id="write-tags"
            v-model="tagsInput"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.tags }"
            type="text"
            placeholder="Nuxt, Writing"
          >
          <div v-if="submitted && errors.tags" class="invalid-feedback">{{ errors.tags }}</div>
          <div v-else-if="tags.length" class="d-flex flex-wrap gap-2 mt-2">
            <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <ClientOnly>
        <div class="btn-toolbar gap-2 mb-2" role="toolbar" aria-label="Markdown formatting">
          <button type="button" class="btn btn-sm btn-outline-dark" title="Bold" aria-label="Bold" @click="applyToolbar('bold')"><i class="fa-solid fa-bold" aria-hidden="true" /></button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Italic" aria-label="Italic" @click="applyToolbar('italic')"><i class="fa-solid fa-italic" aria-hidden="true" /></button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Heading 2" aria-label="Heading 2" @click="applyToolbar('h2')"><i class="fa-solid fa-heading" aria-hidden="true" />2</button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Heading 3" aria-label="Heading 3" @click="applyToolbar('h3')"><i class="fa-solid fa-heading" aria-hidden="true" />3</button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Bullet list" aria-label="Bullet list" @click="applyToolbar('ul')"><i class="fa-solid fa-list-ul" aria-hidden="true" /></button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Numbered list" aria-label="Numbered list" @click="applyToolbar('ol')"><i class="fa-solid fa-list-ol" aria-hidden="true" /></button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Quote" aria-label="Quote" @click="applyToolbar('quote')"><i class="fa-solid fa-quote-left" aria-hidden="true" /></button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Code" aria-label="Code" @click="applyToolbar('code')"><i class="fa-solid fa-code" aria-hidden="true" /></button>
          <button type="button" class="btn btn-sm btn-outline-dark" title="Link" aria-label="Link" @click="applyToolbar('link')"><i class="fa-solid fa-link" aria-hidden="true" /></button>
        </div>
        <label class="form-label" for="write-body">Body markdown (required)</label>
        <textarea
          id="write-body"
          ref="bodyRef"
          v-model="body"
          class="form-control write-body"
          :class="{ 'is-invalid': submitted && errors.body }"
          rows="14"
          placeholder="Write your post in markdown…"
        />
        <div v-if="submitted && errors.body" class="invalid-feedback d-block">{{ errors.body }}</div>

        <h2 class="mt-4">Preview</h2>
        <PostCard :post="previewPost" />
        <div v-if="body.trim()" class="article-body" v-html="renderedHtml" />
        <p v-else class="empty-state mt-3">Nothing to preview yet — start writing above.</p>
      </ClientOnly>

      <div class="d-flex gap-2 mt-4">
        <button class="btn btn-dark" type="submit">Generate markdown</button>
      </div>
    </form>

    <div v-if="result" class="alert alert-success mt-4" role="status">
      <h2 class="h5">Ready to publish</h2>
      <p class="mb-1">Save this file as <code>{{ result.filename }}</code> inside <code>content/</code>, then commit and push.</p>
      <pre class="write-output"><code>{{ result.markdown }}</code></pre>
      <div class="d-flex flex-wrap gap-2 mt-2">
        <button class="btn btn-dark btn-sm" type="button" @click="copyMarkdown"><i class="fa-solid fa-copy me-1" aria-hidden="true" />Copy</button>
        <button class="btn btn-outline-dark btn-sm" type="button" @click="downloadMarkdown"><i class="fa-solid fa-download me-1" aria-hidden="true" />Download</button>
      </div>
      <p v-if="copyStatus" class="mb-0 mt-2 small">{{ copyStatus }}</p>
    </div>
  </section>
  </template>
</template>

<style scoped>
.write-body {
  min-height: 16rem;
}
.write-output {
  max-height: 24rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
