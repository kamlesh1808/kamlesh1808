---
disabled: true
---

# Blog Writer Guide — kamlesh1808

How to write every post on this blog. Follow this. No exceptions.

## Tone — how you sound

- [ ] Warm, humble, pragmatic, grateful. First person.
- [ ] Learning in public. Say "I tried this" not "you should do this".
- [ ] Short sentences. Plain words. One idea per sentence.
- [ ] Clear defaults, small pieces. No cleverness for its own sake.
- [ ] Thank readers, tools, and open source in every post.

Example voice: "I lost a deploy cycle to exactly this. Here is what fixed it."

## Style — how you write

- [ ] Simplistic on purpose. If a senior could cut it, cut it.
- [ ] Max 3–4 sentences per paragraph. Then a list, heading, or code block.
- [ ] Define jargon where first used. Never assume the reader knows it.
- [ ] No hype. No "revolutionary", "blazing", "game-changer".
- [ ] Small loops: one change, one explanation, one verification.

## Teaching style — intent first

- [ ] Start with intent, not pixels. Why this exists before how it works.
- [ ] List prerequisites with pinned versions before any steps.
- [ ] Explain WHY, then HOW. One paragraph of cause, then the snippet.
- [ ] Show project structure with a `text` block when files matter.
- [ ] Every gotcha gets WRONG vs RIGHT code. Show what breaks if wrong.
- [ ] Every how-to ends with a verification check the reader can run.

Verification example:

```bash
ls .output/public/.nojekyll # must exist — Pages needs it
```

## Code examples — required in every how-to

- [ ] Use fenced blocks with labels: `bash`, `ts`, `css`, `json`, `text`, `yaml`.
- [ ] Pin versions: Nuxt 4, Bootstrap 5.3.8, Node 22, Font Awesome 6.7.2.
- [ ] Explain what each snippet does in one line above or below it.
- [ ] State what breaks if wrong. Be specific.

```bash
node --version # v22.x — Nuxt 4 needs modern LTS
npm i bootstrap@5.3.8 # bundle it, don't CDN it (see below)
```

```ts
// nuxt.config.ts — baseURL must match repo name with slashes
export default defineNuxtConfig({
  app: { baseURL: '/<repo>/' }, // WRONG without slashes = 404s live
  nitro: { preset: 'github-pages' } // must be top-level, not under app:
})
```

```css
/* main.css — line 1. Theme below wins ties. CDN link would lose. */
@import "bootstrap/dist/css/bootstrap.min.css";
```

```json
{
  "scripts": {
    "generate": "nuxt generate",
    "postinstall": "nuxt prepare"
  }
}
```

```text
app/assets/css/main.css # single CSS entry — order explicit in one file
.output/public/.nojekyll # proves nitro preset worked
```

## Gotcha format — copy this

- [ ] Name the symptom. Name the cause. Show WRONG, show RIGHT, give check.

```ts
// WRONG — silently ignored, no .nojekyll generated
app: { baseURL: '/kamlesh1808/', nitro: { preset: 'github-pages' } }
```

```ts
// RIGHT — nitro is top-level
nitro: { preset: 'github-pages' }
```

Check: `ls .output/public/.nojekyll` after `npm run generate`.

## CDN vs bundle rule — never ambiguous

- [ ] Bootstrap: always bundle via `@import` in `main.css`. Never CDN.
- [ ] Say why: CDN `<link>` lands after inlined theme CSS, loses ties.
- [ ] Font Awesome: CDN is fine. No colliding rules. Say so explicitly.

## Structure template — use for every post

- [ ] Frontmatter: `title`, `date`, `excerpt`, `tags`.
- [ ] Hook: one bold line. The takeaway. (e.g. **Shipping Nuxt to GitHub Pages** takes three things...)
- [ ] Context: what you built, with what tools, and why.
- [ ] Prerequisites: versions, repo type, commands to confirm setup.
- [ ] Steps with code: one concept per heading, snippet + explanation.
- [ ] Gotcha: WRONG vs RIGHT + verification command.
- [ ] Verify: push, watch Actions, open live URL, hard-refresh.
- [ ] Closing gratitude: thank readers, OpenCode, Nuxt, Bootstrap, open source. End with encouragement.

Frontmatter example:

```yaml
---
title: Building GitHub Pages with Nuxt, Bootstrap and GitHub Action
date: 2026-09-06
excerpt: How to ship a Nuxt 4 site to GitHub Pages
tags: [Nuxt, GitHub Pages, Bootstrap]
---
```

## What to avoid

- [ ] Jargon without explanation.
- [ ] Long paragraphs (5+ sentences).
- [ ] Hype words.
- [ ] Missing versions. Every tool gets a number.
- [ ] CDN vs bundle ambiguity. State which, where, and why.
- [ ] Dev-only testing. If it works locally but not live, say so.

## Closing line rule

- [ ] End warm. Thank you. Invite the reader to try it.

> Small config, bundled CSS, tiny workflow. Thank you for reading.
