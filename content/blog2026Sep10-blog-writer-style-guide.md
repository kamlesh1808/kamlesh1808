---
title: "How I Write Simple Teaching Blogs"
date: 2026-09-10
excerpt: My blog-writer.md system for simple teaching posts with code and gratitude
tags: [Writing, Blogging, OpenCode]
disabled: true
---

**Good tech writing** takes three things: simple words, working code, and a thankful close. I keep all three in a file called `blog-writer.md`.

I write short how-to posts with Nuxt 4, Nuxt Content, and OpenCode. Nuxt Content is a file-based system where each markdown file in `content/` becomes a page. I tried this guide after my early posts drifted in tone and length.

The guide exists to keep posts consistent, simple, and helpful. I open it before I draft. I check each box as I go.

## Prerequisites

You need the guide file, one example post, and Node 22 LTS. I use Nuxt 4, Bootstrap 5.3.8, and OpenCode to write and preview. Versions matter because snippets and checks below assume them.

```bash
node --version # v22.x — matches my blog repo
ls content/blog-writer.md # must exist — this is the checklist I follow
ls content/blog2026Sep06*.md # must exist — my reference example
```

My blog lives in a project-site repo named `kamlesh1808`. Every post is one markdown file under `content/`. That is why frontmatter comes first.

## Pillar 1: Tone — warm, humble, grateful

I write in first person as someone learning in public. I say "I tried this" instead of "you should do this". I lost a deploy cycle to exactly this kind of silent config bug, so I write like I remember it.

I thank readers, tools, and open source in every post. It keeps me honest. It also reminds me I built nothing alone.

## Pillar 2: Style — simplistic on purpose

I keep paragraphs to 3-4 sentences, then a list, heading, or code block. If a senior could cut a sentence, I cut it. One idea per sentence helps me too.

I define jargon where I first use it. Frontmatter, for example, is the metadata block at the top of a markdown file. No hype words, no cleverness for its own sake.

## Pillar 3: Teaching style — intent first

I start with intent, not steps. Why this exists comes before how it works. Then I list prerequisites with pinned versions before any steps.

I explain WHY, then HOW. One paragraph of cause, then the snippet. Each how-to ends with a check the reader can run.

## Pillar 4: Code examples — required in every how-to

Every how-to needs fenced code with a label like `yaml`, `ts`, or `bash`. I pin versions so the reader knows what I tested with. I say what each snippet does in one line.

Frontmatter is the first snippet in every post:

```yaml
---
title: "How I Write Simple Teaching Blogs"
date: 2026-09-10
excerpt: My blog-writer.md system for simple teaching posts with code and gratitude
tags: [Writing, Blogging, OpenCode]
---
```

This block sets the title, date, and tags for Nuxt Content. If the date format is wrong, the post sorts wrong. I keep `YYYY-MM-DD` always.

## Pillar 5: Gratitude-driven closing

I end warm and short. I thank the reader for their time. I name the tools that helped — OpenCode, Nuxt, Bootstrap, and open source.

## Gotcha: WRONG vs RIGHT

A gotcha, in my guide, is a silent failure with a symptom, a cause, and a fix. I show the broken version, then the fixed version, then a check. Here is the example from my own site.

I nested `nitro` under `app:` once and lost a deploy:

```ts
// WRONG — silently ignored, no .nojekyll generated
app: { baseURL: '/kamlesh1808/', nitro: { preset: 'github-pages' } }
```

```ts
// RIGHT — nitro is top-level, Pages gets its .nojekyll file
nitro: { preset: 'github-pages' }
```

Check: `ls .output/public/.nojekyll` after `npm run generate`. If it is missing, the preset is in the wrong place.

## Verify

I verify every post the same way. I check the file renders locally, then I push and watch Actions. I open the live URL in a fresh tab.

```bash
npm run generate # prerenders to .output/public
ls .output/public/blog2026Sep10-blog-writer-style-guide # must exist — post rendered
git add content/blog2026Sep10-blog-writer-style-guide.md
git commit -m "docs(blog): add blog-writer style guide post"
git push origin main # then check Actions tab, hard-refresh live page
```

Stale content after a green run is usually cache. I hard-refresh with `Ctrl+Shift+R` before assuming the deploy failed.

Small guide, simple words, working code. Thank you for reading — try the checklist on your next post, and thank the tools that helped you ship it.
