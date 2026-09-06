# Developer Blog

A responsive Nuxt 3 developer portfolio and blog. It includes markdown-powered posts, Home and About pages (About doubles as Resume), and works cleanly across desktop, tablet, and mobile layouts.

## Run it locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000/kamlesh1808/` — the app serves from the `/kamlesh1808/` base path (`app.baseURL` in `nuxt.config.ts`).

### View it on a phone or iPad

To make the development server available to other devices on your local network, start it with:

```bash
npm run dev -- --host 0.0.0.0
```

Nuxt will print a **Network** URL. Append `/kamlesh1808/` to it and open that URL on your phone or iPad while it is connected to the same Wi-Fi network. If it does not load, check that your computer firewall permits local-network connections to the port Nuxt displays.

## Production and static build

This is a static site deployed to GitHub Pages. Build it with:

```bash
npm run generate
```

This writes the static site to `.output/public` (git-ignored). Preview the built site with:

```bash
npm run preview
```

`nuxt.config.ts` sets the `github-pages` Nitro preset and the `/kamlesh1808/` base URL, so `npm run build` alone is not the deploy path — always use `generate` for production output.

## Write a blog post

Create a markdown file in `content/` named `blogYYYYMonDD*.md`, for example `content/blog2026Sep04-using-claude-code-opencode-codex.md`. Only files beginning with `blog` are published.

Use front matter at the top of each file:

```md
---
title: A useful post title
date: 2026-09-03
excerpt: A short description shown on the post card and in search previews.
tags: [Nuxt, Frontend]
---

Your post content starts here.

## Markdown works as expected

- Lists
- **Bold text**
- [Links](https://nuxt.com)
```

The app calculates reading time automatically. You can optionally set `readingTime: 5 min read` in the front matter to override it.

## Customize it

- Update the name, role, email, location, and social links in `components/SiteHeader.vue` and `components/SiteFooter.vue` (nav and footer labels use `useI18n`).
- Replace the example work history and skills in `pages/about.vue`.
- Adjust the landing content in `pages/index.vue` and the post card in `components/PostCard.vue`.
- Adjust colors, type, spacing, and responsive styling in `assets/css/main.css`.
- Edit English/Spanish copy in `i18n/locales/en.json` and `i18n/locales/es.json` (`@nuxtjs/i18n`, default locale `en`, `prefix_except_default` strategy).

There is no `pages/resume.vue`, no contact page, and no `public/` directory — do not reference `public/resume.pdf`.

## Project structure

```text
content/              Markdown blog posts (only `blog*` published)
components/           SiteHeader.vue, SiteFooter.vue, PostCard.vue
pages/                index.vue, about.vue (doubles as Resume), blog/[slug].vue
server/api/posts/     index.get.ts, [slug].get.ts — APIs that read posts
server/utils/posts.ts Markdown parsing and post metadata
assets/css/main.css   Site design system
i18n/locales/         en.json, es.json
nuxt.config.ts        Base URL, Nitro preset, head links, i18n config
.github/workflows/    deploy.yml — static deploy to GitHub Pages
```

## Styling and dependencies

- Nuxt 3 (`nuxt ^3.13.2`), Bootstrap 5.3.3 bundled via npm and loaded with `@import` as the first line of `assets/css/main.css` (must stay first so Bootstrap loads before custom rules).
- Font Awesome 6.6.0 and Google Fonts (Fira Code) load via `<link>` in `nuxt.config.ts`.
- `assets/css/main.css` (~1300 lines) defines the theme tokens, layout, and responsive rules with WCAG AA contrast targets.

## Deployment

Pushes to `main` (plus manual dispatch) trigger `.github/workflows/deploy.yml`: Node 20, `npm ci`, `npm run generate`, then upload `.output/public` and `deploy-pages`. The live site is `https://kamlesh1808.github.io/kamlesh1808/`.
