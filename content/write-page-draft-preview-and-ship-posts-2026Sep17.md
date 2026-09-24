---
title: "Write Page: Draft, Preview, and Ship Posts"
date: 2026-09-17
excerpt: "How the /tools/write composer drafts markdown, previews as PostCard plus article, and generates a content-ready file"
tags: [Nuxt, Writing, OpenCode]
disabled: true
aiAssisted: true
---

**Drafting in the browser** takes three things: a friendly composer, an honest preview, and a file I can ship. I built `/tools/write` for exactly that.

I run a static site on GitHub Pages. There is no server to POST to in production. I tried a draft flow that needed an API and it went nowhere live. That is why `/tools/write` never saves to disk itself.

It drafts markdown locally, previews it like the real blog, and hands me a content-ready file. I copy or download that file into `content/`. Then I push like any other post.

## Prerequisites

I write with Node 22 LTS, Nuxt 4, and Bootstrap 5.3.8. I preview with the same markdown-it config the server uses. Versions matter because the preview has to match the real render.

```bash
node --version # v22.x — matches my blog repo
npm run dev # open /tools/write — composer lives here, no login needed
```

My repo is a project-site named `kamlesh1808`. Every post is one markdown file under `content/`. That is why the composer ends by generating a filename, not by saving.

## Fields — blog name becomes the slug

I start with a blog name like "Write Page: Draft, Preview, and Ship Posts". The composer runs it through `suggestSlug` to get `write-page-draft-preview-and-ship-posts`. I keep the title separate because the title shows on the card while the slug lives in the filename.

Title, excerpt, and tags map straight to frontmatter. Frontmatter, in my repo, is the metadata block at the top of a markdown file. The body stays plain markdown below it.

Tags come from one comma-separated input. I type `Nuxt, Writing, OpenCode` and `parseTags` dedupes and trims it. I keep it to 8 tags max so the card stays readable.

## Toolbar and live preview

I write the body in a textarea with a small toolbar. Bold, italic, headings, links, code, lists, and quotes each insert around my selection. I barely lift my hands from the keyboard.

The preview renders below as I type. The top half uses the same `PostCard` component as the index. The bottom half renders the article body with markdown-it set to `html:false`.

That `html:false` detail matters. It means raw HTML in my draft shows as text, just like the real post page. I catch an embed mistake here instead of after deploy.

```ts
// app/page-scripts/write.ts — the same helpers the page and my generator use
import { buildFilename, buildMarkdown, suggestSlug } from './app/page-scripts/write.ts'

const slug = suggestSlug('Write Page: Draft, Preview, and Ship Posts')
const filename = buildFilename(slug, new Date('2026-09-17'))
const markdown = buildMarkdown({ title, excerpt, tags, date: '2026-09-17', body })
```

This snippet is the whole shipping contract. Same slug helper, same filename builder, same markdown builder. If the preview looks right, the file will parse right.

## Submit — validate, then Copy or Download

I hit submit and the page validates first. Title and body are required, excerpt caps at 300 chars, tags cap at 8. I see inline errors before any file is generated.

On success I get a filename like `blog2026Sep17-write-page-draft-preview-and-ship-posts.md`. I Copy it or Download it, then move it into `content/`. I push from there like any docs change.

No POST, no database, no draft API. That is on purpose for a static GitHub Pages build. The browser cannot write to `content/` on the live site.

## Gotcha: WRONG vs RIGHT

The symptom is a composer that works locally but silently does nothing live. I expected a Save button to write a file on the server. On GitHub Pages there is no server to receive it.

```ts
// WRONG — expects a server that does not exist on static hosting
await $fetch('/api/posts', { method: 'POST', body: { title, body } })
// live: 404 or method-not-allowed, draft lost on refresh
```

```ts
// RIGHT — generate the file in-browser, ship it with git
const markdown = buildMarkdown({ title, excerpt, tags, date, body })
// Copy/Download blog2026Sep17-write-page-draft-preview-and-ship-posts.md into content/
```

Check: after submit, confirm the preview filename starts with `blog2026Sep17-` and the copied text starts with `---`. If either is missing, I did not go through the composer flow.

## Verify

I verify every `/tools/write` draft the same way. I check the file parses, tests pass, and the route still prerenders. I open the live URL in a fresh tab.

```bash
npm test # page-script + frontmatter + posts suites must pass
npx nuxi typecheck # no new type errors from the draft
npm run generate # prerenders to .output/public
ls .output/public/tools/write # must exist — composer route rendered
```

Stale preview after a green run is usually cache. I hard-refresh with `Ctrl+Shift+R` before assuming the deploy failed.

Small composer, honest preview, shippable file. Thank you for reading — try `/tools/write` for your next post, and thank OpenCode, Nuxt, Bootstrap, and open source for making simple tools like this possible.
