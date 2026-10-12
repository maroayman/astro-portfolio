# DevOps Portfolio

A multi-page personal portfolio for a DevOps / Platform Engineer. Static Astro site,
no client framework, one small inline script.

## 🧞 Commands

| Command            | Action                                                                             |
| :----------------- | :--------------------------------------------------------------------------------- |
| `pnpm install`     | Installs dependencies                                                              |
| `pnpm dev`         | Starts local dev server at `localhost:4321`                                        |
| `pnpm dev:tailnet` | Starts it on your Tailscale IP, for testing on your phone or other tailnet devices |
| `pnpm build`       | Build your production site to `./dist/`                                            |
| `pnpm preview`     | Preview your build locally, before deploying                                       |
| `pnpm check`       | Type-checks `.astro` and `.ts` files                                               |
| `pnpm format`      | Formats the repo with Prettier                                                     |
| `pnpm verify`      | `check` + `format:check` — run this in CI                                          |

## 📁 Structure

```text
src/
├── components/    # Astro components (Header, Hero, Ticker, Timeline, Cta, …)
├── content/
│   └── blog/          # ← 18 Markdown posts (migrated from ~/Projects/deno/src/blog)
├── content.config.ts  # blog collection schema (Astro Content Collections)
├── data/
│   └── portfolio.ts   # ← all non-blog content lives here
├── layouts/
│   └── Layout.astro   # <head>, meta/OG tags, theme script
├── pages/         # index, skills, experience, projects, contact, blog, 404, rss.xml
├── scripts/
│   └── reveal.ts      # scroll-reveal observer (imported once in Layout)
├── styles/
│   ├── fonts.css      # self-hosted @font-face declarations
│   ├── global.css     # design tokens + shared primitives
│   └── prose.css      # Markdown typography — post pages only
└── utils/
    └── blog.ts        # post sorting, tag slugs, reading time
public/
├── fonts/             # woff2 subsets
├── images/            # blog covers + inline post images
└── robots.txt
```

## ✏️ Editing content

Everything you are likely to change is in **`src/data/portfolio.ts`** — name, role,
links, stats, skills, experience, projects, certifications, education. No component edits needed.
Availability is a single value (`availabilityStatus`: `'open'` | `'selective'` |
`'unavailable'`) that drives the green/yellow/red indicator in the header, hero,
and contact page.

The data mirrors the Deno/Lume site at `~/Projects/deno` (`src/_data/*.yml`):
experience, projects, certifications, and links were migrated from there, and the
stack section condenses its `uses.yml` (hardware and site-meta groups left out).
If you update one site, port the change to the other — or ask to automate it.

## 📝 Blog

Posts are an Astro Content Collection: Markdown files in `src/content/blog/`
with `title`, `description`, `date`, optional `cover`, and `tags`. Adding a post
is just adding a file — post routes, prev/next links, RSS, and the sitemap
generate automatically:

- `/blog` — in-page tag filtering (multi-select, shareable `#tags=` URLs), text search over titles/descriptions/tags, + full list
- `/blog/[slug]` — post page with reading time, cover, and older/newer nav
- `/rss.xml` — feed of all posts

There are deliberately no per-tag pages: 19 near-duplicate archives would bloat
the sitemap for zero benefit. Filtering happens in place via
`src/scripts/tag-filter.ts` (also progressive enhancement — no-JS readers see
all posts).

## 🖼️ Images (GHCR, not git)

Blog images live in `public/images/` on disk but are **git-ignored** — same ORAS +
GHCR method as the Deno site, sharing one package so the repo stays lean:

- Artifact: `ghcr.io/maroayman/images` (public, anonymous pull — shared with
  the Deno site; artifact paths are `src/public/images/...`, remapped to
  `public/images/...` on restore)
- Pin: `scripts/images.pin` holds the exact `…@sha256:…` ref builds restore
  (same digest as the Deno repo — keep both pins in sync after any push)
- `pnpm images push --pin` — overlay current `public/images` onto the
  shared artifact without touching Deno-only art (`push --dry-run` previews,
  plain `push` without `--pin` uploads but keeps the old digest; use `--pin`
  after adding/removing images so builds pick up the new digest, then update
  the Deno repo's pin too)
- `pnpm images pull` — force re-pull (plain `pnpm dev` / `pnpm build` pull
  automatically, skipping when images already exist)
- Vercel builds pull via `buildCommand` in `vercel.json`, bootstrapping its own
  `oras` binary — no tokens needed since the package is public

Images referenced as `/images/...` live in `public/images/`. Shared helpers
(sorting, tag slugs, reading time) are in `src/utils/blog.ts`, and Markdown
typography in `src/styles/prose.css` ships on post pages only. Code blocks get
copy buttons via `src/scripts/code-copy.ts`, and wide tables get scrolling
frames via `src/scripts/table-wrap.ts` (both progressive enhancement — no-JS
readers get plain blocks and tables). Cover images carry their natural dimensions
(`coverDims` in `src/utils/blog.ts`) so small covers never upscale into blur.

## 🧭 Sections & breadcrumbs

Nav labels are short on purpose — every subpage carries a breadcrumb that maps
the label to the page, so the name always presents in context:

| Nav label | Breadcrumb     | Page title                 |
| :-------- | :------------- | :------------------------- |
| Stack     | Home / Stack   | Stack & tooling            |
| Track     | Home / Track   | Experience                 |
| Builds    | Home / Builds  | Projects & open source     |
| Blog      | Home / Blog    | Blog                       |
| Contact   | Home / Contact | Let's talk infrastructure. |

Blog posts extend it one level: Home / Blog / Post.

To change the domain (canonical URLs, sitemap, `robots.txt`), set `site` in
`astro.config.mjs` and update `public/robots.txt`. Current domain:
`https://maroayman.vercel.app`.

## 🎨 Design system

**Freight** — brutalist-Swiss. No cards, no gradients, no orbs. Ink rules, giant
800-weight grotesk type (with an outlined-word treatment in the hero), hard offset
shadows on everything interactive, and one loud orange.

| Token role     | Light                 | Dark                  |
| :------------- | :-------------------- | :-------------------- |
| background     | `#faf6ef`             | `#0f0d0a`             |
| text / muted   | `#16130d` / `#4d4739` | `#f2ecdf` / `#b3ab97` |
| accent (blaze) | `#b23a00`             | `#ff6b2c`             |

Type: **Inter** for everything (400/500/600/800, self-hosted), **JetBrains Mono**
for labels and metadata. Instrument Serif files remain in `public/fonts/` but are
no longer referenced — safe to delete if you want the repo slimmer.

## ⚡ Performance notes

The Google Fonts `<link>` was removed. It was a render-blocking third-party
request that pulled 17 files across 3 origins behind a 16.6 KB stylesheet.

- Fonts are declared in `src/styles/fonts.css`, same-origin, no extra DNS/TLS.
- Only the weights actually used are shipped (400/500/600/800 for Inter,
  400/500 for JetBrains Mono).
- `inter-500.woff2` and `instrument-serif-400.woff2` are preloaded in
  `Layout.astro` since they paint the first screen; everything else loads lazily.
- CSS is inlined into the HTML (`build.inlineStylesheets: 'always'`) — the whole
  stylesheet is ~5 KB gzipped, so this removes the last render-blocking request
  at the cost of ~4 KB per page.
- Font stacks fall back to a close system face, so a blocked font request can't
  leave text invisible.
- `body` deliberately does **not** transition `background-color`/`color` — that
  repaints the whole document, grid and grain overlays included, on every theme
  flip. Theme is set pre-paint anyway, so there is nothing to animate on load.

If you add a font weight, add the `@font-face` and the preload entry — nothing
else needs to change.

Both themes are contrast-verified: body text ≥ 4.5:1 (WCAG AA) and interactive
borders ≥ 3:1 (WCAG 1.4.11) against every surface they sit on. If you change the
palette, re-check those two numbers.

`--signal-wash` caps how strongly lime tints a chip per theme — at higher mixes the
dark theme drops below 4.5:1 for text sitting on top.

## 📱 Tailnet preview

`pnpm dev` binds to localhost only. To preview on a phone or another machine
signed into your tailnet:

```sh
pnpm dev:tailnet
```

This reads your Tailscale IPv4 address and binds Astro to that interface, so the
server is reachable from your tailnet **but not from the local LAN and not from
the public internet** — verified by the socket binding. Traffic travels inside
the encrypted WireGuard tunnel, so plain HTTP here is fine.

It falls back to plain `astro dev` if Tailscale isn't running.

`tailscale serve` (HTTPS + a `*.tailnet.ts.net` name) was not used because it
requires one-time tailnet admin approval.

## 🌗 Theming

Light and dark are driven by CSS custom properties on `[data-theme]` in
`src/styles/global.css`. The theme is resolved before first paint (see the inline
script in `Layout.astro`) so there is no flash, and is persisted in `localStorage`
with a graceful fallback when storage is blocked.

`prefers-reduced-motion` disables the topology packets, marquee, reveal animations
and hover transitions. Reveal animations are additionally scoped to `.js` so content
stays visible when scripting is unavailable.
