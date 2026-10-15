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
├── components/      # BlogRows, BlogPagination, Crumb (numbered rows, pagination, breadcrumbs)
├── content/
│   └── blog/            # ← 18 Markdown posts (migrated from ~/Projects/deno/src/blog)
├── content.config.ts    # blog collection schema (Astro Content Collections)
├── data/
│   ├── blog.ts          # PAGE_SIZE for archive pagination
│   └── portfolio.ts     # ← all non-blog content lives here
├── layouts/
│   └── KineticLayout.astro  # <head>, meta/OG tags, header/footer, site script
├── pages/           # index, experience, projects, certifications, contact,
│                    # uses, skills (redirect), blog/[...page], blog/[slug],
│                    # blog/tags/[tag]/[...page], 404, rss.xml
├── scripts/
│   ├── chrome.ts        # mail copy, peek line, kinetic name, Cairo clock
│   ├── code-copy.ts     # copy buttons on post code blocks
│   ├── img-lazy.ts      # lazy-load + async decode for post images
│   ├── lightbox.ts      # click-to-enlarge for post images
│   └── table-wrap.ts    # scrolling frames for wide tables
├── styles/
│   ├── fonts.css        # self-hosted @font-face (Manrope + Roboto Flex)
│   └── kinetic.css      # design tokens + shared site styles
└── utils/
    └── blog.ts          # post sorting, tag slugs, reading time, cover dims
public/
├── fonts/               # Manrope + Roboto Flex variable woff2
├── icons/certs/         # provider logos for the certifications page
├── images/              # blog covers + inline post images (git-ignored, ORAS)
├── resume.pdf           # footer Resume link target
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

- `/blog` — numbered archive, 10 posts per page (`PAGE_SIZE` in `src/data/blog.ts`), no descriptions in rows
- `/blog/[slug]` — post page with reading time, cover, and older/newer nav
- `/blog/tags/<tag>/` — static archive per used tag (paginated past 10 posts)
- `/rss.xml` — feed of all posts

Old shareable filter URLs (`/blog#tags=<slug>`) redirect to the matching tag
archive. Article navigation works without JavaScript.

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

Images referenced as `/images/...` live in `public/images/`. Cover images carry
their natural dimensions (`coverDims` in `src/utils/blog.ts`) so the browser
reserves space, and post images get `loading="lazy"` + `decoding="async"` via
`src/scripts/img-lazy.ts` (both progressive enhancement — no-JS readers get
plain images). Markdown typography lives in `kinetic.css` (`.prose-k`) plus
post extras in `src/pages/blog/[slug].astro`. Code blocks get copy buttons via
`src/scripts/code-copy.ts`, wide tables get scrolling frames via
`src/scripts/table-wrap.ts`, and post images get click-to-enlarge via
`src/scripts/lightbox.ts`.

## 🧭 Sections & breadcrumbs

Nav labels are short on purpose — every subpage carries a breadcrumb that maps
the label to the page:

| Nav label    | Breadcrumb          | Page                 |
| :----------- | :------------------ | :------------------- |
| Experience   | Home / Experience   | Experience           |
| Projects     | Home / Projects     | Projects             |
| Certifications | Home / Certifications | Certifications     |
| Blog         | Home / Blog         | Blog                 |
| Uses         | Home / Uses         | Uses                 |
| Contact      | Home / Contact      | Contact              |

Breadcrumbs render via `src/components/Crumb.astro` (`nav > ol` with
`aria-current="page"`). Blog posts and tag archives extend it one level:
Home / Blog / Post.

To change the domain (canonical URLs, sitemap, `robots.txt`), set `site` in
`astro.config.mjs` and update `public/robots.txt`. Current domain:
`https://maroayman.vercel.app`.

## 🎨 Design system

**Kinetic** — minimal editorial. One giant variable display face for names and
titles, mono labels, hairline rules, numbered archive rows, and one lime accent.

| Token role       | Dark                  | Light                 |
| :--------------- | :-------------------- | :-------------------- |
| background       | `#0b0b0b`             | `#f2f1ec`             |
| text / muted     | `#f2f1ec` / `#8e8e87` | `#0b0b0b` / `#63635c` |
| accent (lime)    | `#d4ff3a`             | `#d4ff3a`             |
| on-accent text   | `#0b0b0b`             | `#0b0b0b`             |

Type: **Roboto Flex** (variable width + weight) for display, **Manrope**
(variable, self-hosted) for body. Theme follows `prefers-color-scheme` via
`@media` overrides in `src/styles/kinetic.css` — no toggle, no flash, no
`localStorage`. `prefers-reduced-motion` kills transitions/animations and the
kinetic-name loop skips reduced-motion and coarse pointers.

## ⚡ Performance notes

No third-party requests on any page: both fonts are self-hosted variable files
(`public/fonts/`, 85 KB total, preloaded with `font-display: swap`), and
navigation prefetching uses declarative speculation rules instead of a JS
runtime.

- CSS is inlined into the HTML (`build.inlineStylesheets: 'always'`) — no
  render-blocking stylesheet request.
- JS is ~2–5 KB per page, all progressive enhancement (copy buttons, table
  wraps, lightbox, lazy images, clock/peek). No framework, no hydration.
- Cover images carry `width`/`height` + eager loading; body images lazy-load.
- Fonts, icons: immutable 1-year `Cache-Control`; images revalidate daily;
  HTML revalidates always (see `vercel.json`).

If you add a font, add the file, the `@font-face`, and the preload entry —
nothing else needs to change.

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

Light and dark follow the OS `prefers-color-scheme` setting via `@media`
overrides on the tokens in `src/styles/kinetic.css`. There is no theme toggle
and nothing persisted — no flash, no `localStorage`.

`prefers-reduced-motion` disables transitions and animations, and the
kinetic-name pointer loop in `src/scripts/chrome.ts` stays off for
reduced-motion and coarse pointers.
