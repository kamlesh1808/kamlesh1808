---
title: Building kamlesh18dev with OpenCode
date: 2026-09-04
excerpt: Building a portfolio with Nuxt and OpenCode
tags: [Nuxt, OpenCode, Portfolio, Design]
---

**kamlesh18dev** is a portfolio that feels like a termina.  Built with [OpenCode](https://opencode.ai) as a pair programmer, iteration was faster and more focused than a solo build.

## Starting with intent, not pixels

The guiding principle was pragmatism: clear defaults, small pieces, no cleverness for its own sake.

The brief was simple: one page to introduce, one to write, one to reach out. No CMS. Markdown in `content/`, rendered by Nuxt. If adding a post is just creating a `blog2026Sep04.md` file, writing stays frictionless.

**Nuxt 3** for file-based routing, `useFetch` for `server/api/posts` and `markdown-it` in `server/utils/posts.ts`. **Fira Code** everywhere, **Bootstrap** + **Font Awesome 6.6.0**
## Iteration is the build

Iteration-driven engineering is built on small loops, fast feedback, and continuous improvement. Each change was scoped narrowly, shipped quickly, and refined based on what we learned. Progress came from steady iteration, not big leaps.