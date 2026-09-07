---
title: Building GitHub Pages with Nuxt, Bootstrap and GitHub Action
date: 2026-09-06
excerpt: How to ship a Nuxt 4 site to GitHub Pages with the right baseURL, the app/ directory, bundled Bootstrap, and a clean deploy workflow
tags: [Nuxt, GitHub Pages, Bootstrap]
---

**Shipping Nuxt to GitHub Pages** takes three things: the right `baseURL`, Bootstrap bundled in the correct order, and a small deploy workflow. Get any one wrong and the site looks fine locally but breaks live.

This is how you ship it — Nuxt 4, Bootstrap 5.3.8, and GitHub Actions to `https://<username>.github.io/<repo>/`.

## Prerequisites

You need a project-site repo (not a `username.github.io` user site), Node 22 LTS, and Nuxt 4. You will use `nuxt@^4.5.2` and `bootstrap@^5.3.8` — the versions matter because Nuxt 4 is what generates the `.output/public` layout and `.nojekyll` behavior described below:

```bash
node --version # v22.x
npm i bootstrap@5.3.8
npm run generate # prerenders to .output/public
```

Your repo name matters because it becomes the live subpath. If your repo is `<repo>`, your live URL is `https://<username>.github.io/<repo>/`. Every asset must render under `/<repo>/` — that is why you set `baseURL` next.

## Nuxt 4 project structure: the app/ directory

A key architectural shift in Nuxt 4 is isolating application code into an `app/` directory. In Nuxt 3, `pages/`, `components/`, `assets/`, and `app.vue` sat directly at the project root. Nuxt 4 organizes them cleanly:

```text
├── app/                              # Application source (Nuxt 4 default)
│   ├── assets/css/main.css           # Custom theme & Bootstrap import
│   ├── components/                   # Vue components (SiteHeader, PostCard)
│   ├── pages/                        # File-based routes (index, about, blog)
│   └── app.vue                       # Root layout wrapper
├── content/                          # Markdown blog posts
├── i18n/                             # i18n locales (en.json, es.json)
├── server/                           # Nitro server endpoints & utils
├── .github/workflows/deploy.yml      # GitHub Actions CI/CD
├── nuxt.config.ts                    # Root Nuxt config
├── tsconfig.json                     # TypeScript config
└── package.json
```

In Nuxt 4, the `~` and `@` path aliases resolve directly to `app/`. That means `~/assets/css/main.css` maps to `<rootDir>/app/assets/css/main.css` without requiring manual alias overrides. Files outside the frontend application context — like `server/`, `content/`, and `i18n/` — remain at the root where Nitro and Nuxt modules expect them.

## Nuxt config: baseURL, nitro preset, and compatibilityDate

Three settings do the heavy lifting in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  css: ['~/assets/css/main.css'],
  app: {
    // Replace with your exact GitHub repository name, keeping the slashes
    baseURL: '/<repo>/'
  },
  nitro: {
    preset: 'github-pages'
  }
})
```

- `compatibilityDate`: Required in Nuxt 4. Pinning a compatibility date (like `'2026-09-07'`) locks in framework defaults and silences the `[NUXT_B5001]` build warning.
- `app.baseURL`: Prefixes every route and asset with `/<repo>/`. Without it, your live site 404s on JS, CSS, and images while `npm run dev` looks perfect — because locally you serve from `/`, but Pages serves from the subpath.
- `nitro.preset: 'github-pages'`: Must be **top-level**. That preset generates the `.nojekyll` file that stops GitHub Pages from running Jekyll processing (which would ignore files starting with `_`, including Nuxt's `_nuxt` directory).

The gotcha: nest `nitro` under `app:` and Nuxt silently ignores it. No error, no warning — just a deploy with no `.nojekyll` and a broken site. I lost a deploy cycle to exactly this:

```ts
// WRONG — silently ignored, no .nojekyll generated
app: {
  baseURL: '/kamlesh1808/',
  nitro: { preset: 'github-pages' }
}
```

If your Pages deploy serves a blank page, check that `.output/public/.nojekyll` exists after `npm run generate`. If it is missing, your preset is in the wrong place.

## Bootstrap: bundle it, don't CDN it

This is the centerpiece lesson. The site originally loaded Bootstrap from a CDN `<link>` in `app.head`, with custom CSS in `~/assets/css/main.css`. Dev looked right. Live did not — buttons, nav pills, and cards reverted to Bootstrap defaults.

The cause is CSS order. Nuxt inlines custom CSS into the prerendered HTML `<style>` block, and the CDN `<link>` lands **after** it. When two rules have equal specificity, the later one wins — so Bootstrap beat the custom theme on every tie, but only in the prerendered output. Dev serves styles differently, which is why the bug never showed locally.

The fix: install Bootstrap and import it as line 1 of the single CSS file:

```bash
npm i bootstrap@5.3.8
```

```css
@import "bootstrap/dist/css/bootstrap.min.css";
/* ===== IMPORTS ===== */
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
/* ...your theme below — it now always wins ties... */
```

`nuxt.config.ts` keeps a single entry — `css: ['~/assets/css/main.css']` — so ordering is explicit in one file. Splitting Bootstrap and theme into separate `css:` array entries does **not** guarantee order once Nuxt inlines styles for SSR (`inlineSSRStyles`), which is why the single-file `@import` matters.

Font Awesome stays on CDN — it has no colliding rules with the theme, so the extra request is harmless:

```ts
link: [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css' }
]
```

## TypeScript and npm scripts

In Nuxt 4, add `"postinstall": "nuxt prepare"` to `package.json`. This ensures that `.nuxt/tsconfig.json` and auto-generated types exist immediately after running `npm install` or `npm ci`, avoiding missing module types in CI:

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck"
  }
}
```

Keep `tsconfig.json` at the project root extending `./.nuxt/tsconfig.json` so IDEs and `vue-tsc` can resolve types cleanly:

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

## The deploy workflow

`.github/workflows/deploy.yml` is the entire pipeline — build on `main`, publish `.output/public`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Generate static site
        run: npm run generate

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .output/public

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

What each part does:
- `push: main` plus `workflow_dispatch` gives automatic deploys on merge with a manual retry button in the Actions tab.
- Node 22 with `cache: npm` matches modern LTS environments and accelerates repeated installs.
- `npm ci` (not `npm install`) guarantees clean builds against the exact `package-lock.json`.
- `npm run typecheck` validates Vue and TypeScript types before building.
- `npm run generate` prerenders the static site into `.output/public`.
- `upload-pages-artifact` packages `.output/public` as the Pages artifact.
- `deploy-pages` publishes the artifact to GitHub Pages with `pages: write` and `id-token: write` permissions.

One repo setting is mandatory: **Settings → Pages → Source must be "GitHub Actions"** (build type `workflow`). If it still points at a legacy `gh-pages` branch, the workflow succeeds but nothing goes live.

## Push, watch, verify

```bash
git add content/blog2026Sep06-building-github-pages-with-nuxt-bootstrap-and-github-action.md
git commit -m "docs(blog): add Nuxt GitHub Pages deploy guide"
git push origin main
```

Watch the run under **Actions → Deploy to GitHub Pages**. Build takes roughly a minute; the deploy job follows. Then open `https://kamlesh1808.github.io/kamlesh1808/` in a fresh tab.

## Troubleshooting

- **Stale content after a green run.** The Pages CDN caches HTML for about 10 minutes. Hard-refresh (`Ctrl+Shift+R`) before assuming the deploy failed.
- **Blank page or missing `_nuxt` assets.** Check `baseURL` matches the repo name exactly with leading and trailing slashes, and confirm `.nojekyll` exists in `.output/public` after generate.
- **`[NUXT_B5001]` compatibility warning.** Add `compatibilityDate: 'YYYY-MM-DD'` to `nuxt.config.ts`.
- **`npm ci` fails in Actions but install works locally.** The lockfile is out of sync — run `npm install` locally, commit the updated `package-lock.json`, and push again.
- **`.output/` shows up in git status.** It should not — `.output/` is git-ignored. Only `.output/public` leaves the runner via `upload-pages-artifact`.
- **`dist` symlink showing as untracked in git.** In `.gitignore`, use `dist` instead of only `dist/` so symlinks as well as directories are ignored.
- **Path aliases in Nuxt 4.** In Nuxt 4, `~` and `@` point to `app/`. If you have server code or assets outside `app/`, reference them using `#server`, `#shared`, or `~~/` (root directory).

Small config, bundled CSS, tiny workflow. That is the whole recipe.
