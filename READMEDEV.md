# Developer Blog

A responsive Nuxt 3 developer portfolio and blog. It includes markdown-powered posts, About, Resume, and Contact pages, and works cleanly across desktop, tablet, and mobile layouts.

## Run it locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL Nuxt prints in your terminal (normally `http://localhost:3000`).

### View it on a phone or iPad

To make the development server available to other devices on your local network, start it with:

```bash
npm run dev -- --host 0.0.0.0
```

Nuxt will print a **Network** URL. Open that URL on your phone or iPad while it is connected to the same Wi-Fi network. If it does not load, check that your computer firewall permits local-network connections to the port Nuxt displays.

To make a production build:

```bash
npm run build
npm run preview
```

## Write a blog post

Create a markdown file in `content/` named `blogYYYYMonDD.md`, for example `content/blog2026Sep03.md`. Only files beginning with `blog` are published.

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

- Update the name, role, email, location, and social links in `components/SiteHeader.vue`, `components/SiteFooter.vue`, and the About/Contact pages.
- Replace the example work history and skills in `pages/resume.vue`.
- Add a `public/resume.pdf` file if you want the Resume page’s download button to serve a real PDF.
- Adjust colors, type, spacing, and responsive styling in `assets/css/main.css`.

## Project structure

```text
content/              Markdown blog posts
components/           Shared header, footer, and post card
pages/                Site pages and dynamic blog detail route
server/api/posts/     APIs that read and render markdown posts
server/utils/posts.ts Markdown parsing and post metadata
assets/css/main.css   Site design system
```

Bootstrap and Font Awesome are loaded from CDNs via `nuxt.config.ts`; the application’s layout and components remain regular Vue/Nuxt code, so they are easy to tailor.
