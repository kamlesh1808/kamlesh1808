# Developer Blog

A responsive Nuxt 4 developer portfolio and blog. It includes markdown-powered posts, Home and About pages (About doubles as Resume), and works cleanly across desktop, tablet, and mobile layouts.

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

## Code organization

This is a Nuxt 4 application using Vue and TypeScript. Nuxt's file-based routing maps files in `app/pages/` to site routes.

### Application shell

- `app/app.vue` is the root application component.
- `SiteHeader` provides navigation, the search icon, mobile menu, and theme toggle.
- `<NuxtPage />` renders the active route.
- `SiteFooter` renders the shared footer.
- `app/composables/useTheme.ts` manages the persistent dark/light theme selection. Dark is the default and the selection is stored in `localStorage`.

### Pages and routes

| File | Route | Purpose |
| --- | --- | --- |
| `app/pages/index.vue` | `/` | Home page and latest posts |
| `app/pages/about.vue` | `/about` | Profile, experience, education, and skills |
| `app/pages/search.vue` | `/search` | Client-side post search |
| `app/pages/blog/[slug].vue` | `/blog/:slug` | Individual blog post |
| `app/pages/topics/index.vue` | `/topics` | Topic listing |
| `app/pages/topics/[topic].vue` | `/topics/:topic` | Posts filtered by topic |

### Shared UI and utilities

- `app/components/PostCard.vue` renders reusable post previews.
- `app/components/SiteHeader.vue` and `app/components/SiteFooter.vue` are shared across all pages.
- `app/page-scripts/` contains route-specific setup functions and client-side topic helpers.
- `app/data/*.toml` stores About page content; `app/data/about.ts` validates and maps it into typed data.
- `app/utils/toml.ts` contains the strict dependency-free TOML parser used by About data.
- `app/assets/css/main.css` contains the global reset, theme tokens, component styles, page layouts, and responsive rules.

### Content and server API

Markdown posts live in `content/`. Files matching `blog*.md` are loaded by `server/utils/posts.ts`, which parses front matter, calculates reading time, converts Markdown to HTML, filters disabled posts, and sorts posts by date.

`content/LinkedInPosts/` is an archive of source documents and is intentionally not published. Only Markdown files whose names begin with `blog` are treated as blog posts.

- `server/api/posts/index.get.ts` exposes the post collection at `/api/posts`.
- `server/api/posts/[slug].get.ts` exposes an individual post at `/api/posts/:slug`.

### Configuration and deployment

- `nuxt.config.ts` configures the base URL, GitHub Pages Nitro preset, global CSS, and strict TypeScript.
- `app/components/GoogleTranslate.vue` loads the Google Website Translator widget on the client only.
- `.github/workflows/deploy.yml` builds and deploys the static site to GitHub Pages.

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

- Update About profile, experience, education, and skills in `app/data/*.toml`.
- Update navigation and footer labels in `app/components/SiteHeader.vue` and `app/components/SiteFooter.vue`.
- Adjust the landing content in `app/pages/index.vue` and the post card in `app/components/PostCard.vue`.
- Adjust colors, type, spacing, and responsive styling in `app/assets/css/main.css`.
- Google Website Translator is loaded dynamically in the footer and requires network access to `translate.google.com`; the site remains usable if the external widget is unavailable.

There is no `pages/resume.vue`, no contact page, and no `public/` directory — do not reference `public/resume.pdf`.

## Project structure

```text
app/                         Application source (Nuxt 4 convention)
  app.vue                    Root application component
  assets/css/main.css        Global design system and theme styles
  components/                Shared header, footer, and post card components
  composables/useTheme.ts    Persistent dark/light theme state
  data/                     Validated About-page TOML content
  pages/                     File-based routes
  page-scripts/             Route setup and client-side topic helpers
  utils/toml.ts              Strict TOML parser
content/                     Markdown blog posts (only `blog*` published)
  LinkedInPosts/             Unpublished source archive
server/api/posts/            Post collection and single-post APIs
server/utils/posts.ts        Markdown parsing and post metadata
server/utils/frontmatter.ts Frontmatter parsing and typed field access
nuxt.config.ts               Base URL, Nitro preset, and head links
.github/workflows/           Static deployment to GitHub Pages
```

## Styling and dependencies

- Nuxt 4 (`nuxt ^4.5.2`), Bootstrap 5.3.8 bundled via npm and loaded with `@import` as the first line of `assets/css/main.css` (must stay first so Bootstrap loads before custom rules).
- Font Awesome 6.7.2 and Google Fonts (Fira Code) load via `<link>` in `nuxt.config.ts`.
- `app/assets/css/main.css` defines the light/dark theme tokens, layout, and responsive rules with WCAG AA contrast targets.

## Deployment

Pushes to `main` (plus manual dispatch) trigger `.github/workflows/deploy.yml`: Node 22, `npm ci`, `npm run typecheck`, `npm run generate`, then upload `.output/public` and `deploy-pages`. The live site is `https://kamlesh1808.github.io/kamlesh1808/`.
