# Session Log: Blog Overhaul → Certs → Audits → Prod

Date: 2026-10-15/16. Branch `designs` merged into `main` (`3fb3ceb`), deployed to production on Vercel. This file exists so a future LLM (or human) can reconstruct every decision without re-deriving it.

## 0. Repo facts (source of truth)

- Astro 7 static site (`output: static`, `build.format: 'directory'`), pnpm, no framework, no hydration. All JS is tiny progressive-enhancement modules.
- Single live layout: `src/layouts/KineticLayout.astro` + `src/styles/kinetic.css`. Everything else theme-related was deleted.
- Content: 18 Markdown posts in `src/content/blog/` (Astro Content Collections, schema in `src/content.config.ts`).
- Images: `public/images/` is **gitignored** and restored from GHCR (`ghcr.io/maroayman/images@sha256:…`, pin in `scripts/images.pin`) via `scripts/images-pull.sh` (Vercel `buildCommand` runs it with `--force`). Small source assets (`favicon`, `public/icons/*`, `public/fonts/*`, `resume.pdf`, `robots.txt`) are git-tracked. Never route tracked source assets through ORAS.
- Deno site at `~/Projects/deno` shares the image artifact. Its pin was NOT synced (user decision: Astro only).
- Deployment: Vercel, `maroayman.vercel.app`. Deployment Protection (SSO) was ON for previews, turned OFF via API during this session (`ssoProtection: null`). Production custom domains were never protected.
- Skills live in `.opencode/skills/` (8 total, incl. `images-and-oras`, `scripts-and-tooling`). When the user says "run the skills", spawn one agent per skill with the skill file in its prompt; bugfix/content passes may run parallel, validation passes run sequential.

## 1. Blog hybrid archive (kept)

- `src/pages/blog/[...page].astro`: Astro `paginate()`, `PAGE_SIZE = 10` (`src/data/blog.ts`), numbered rows, no descriptions, pagination with `rel`, quiet RSS link, hash-compat snippet (`/blog#tags=<slug>` → `/blog/tags/<slug>/`, slug allow-listed, `#q=` intentionally ignored).
- `src/pages/blog/tags/[tag]/[...page].astro`: one static archive per used tag, no empty archives, no `/1/` routes. Only `linux` (15 posts) spills to page 2.
- `src/components/BlogRows.astro` (number/date/title), `BlogPagination.astro` (44px targets, `aria-current`), `Crumb.astro` (`nav > ol`, `aria-current="page"`, used on all 9 subpages).
- Removed: `blog/index.astro`, `src/scripts/tag-filter.ts`, featured-post machinery, topic nav, search UI, `TagNav.astro`, `getPostsByTag`/`getTagName`/`resolveFeatured`.
- `getPosts()` sorts newest-first with slug tiebreaker (deterministic numbering/RSS/older-newer).
- RSS (`rss.xml.ts`) untouched: full 18 items. Sitemap automatic.
- In-body `/blog/<slug>` links use trailing slashes (canonical form).
- Frontmatter convention: `title → description → date → cover? → tags`.

## 2. Certifications page (current state)

- Flat `klist`; each row is a grid: 72px provider logo + title + issuer/date meta stacked under the title.
- Logos in `public/icons/certs/*.svg` (git-tracked): Microsoft + Google + Huawei from `glincker/thesvg`, LF brand-blue recolored from thesvg mono, AWS + LF-dark from user-provided files/URLs. Swap = replace file, no code change.
- Issuer display names in `src/data/portfolio.ts`: `Microsoft Azure`, `Amazon Web Services`, `Huawei Cloud` (keys in `certifications.astro` providers map must match exactly).
- Dropped per earlier direction: GitLab social, phone/phoneHref, Upwork/Freelancer icons.

## 3. Footer / resume

- Footer has Copy (email) + Resume pills (`.copy`, 44px min-height, `inline-flex`).
- Resume = text + 14px download icon, `margin-right: 12px`, `target="_blank"`.
- `public/resume.pdf` (git-tracked, copied from Deno `src/resume.pdf`): replace file + rebuild to update.

## 4. Homepage (current state)

- Order: giant kinetic `h1.name` → nav (peek line + hover slab intact) → footer. **No intro block** (user deleted it). No `data-key` shortcuts, no `.k` hints (removed as undisclosed key hijacking).
- `chrome.ts` (extracted from layout inline script, fully typed): mail copy w/ hidden `role="status"` announcer + failure message, peek (instant hover/focus, `focusout` reset), kinetic name loop (sleeps when hidden/idle>5s, honors reduced-motion), Cairo clock.

## 5. Performance posture (verified, do not regress)

- Zero third-party requests: Manrope + Roboto Flex variable woff2 self-hosted (85KB, preloaded, `font-display: swap`, immutable 1y cache in `vercel.json`).
- No prefetch runtime, no prefetch hints (both tried, both removed as unnecessary). One declarative speculation-rules block (`prefetch`, document, `/*`, moderate).
- CSS inlined, JS ~2–5KB/page. Covers eager + dims; body images lazy + `decoding=async` (runtime `img-lazy.ts`) + natural dims via local rehype plugin (`src/plugins/image-dims.ts` + generated `src/data/image-dims.json`; requires `@astrojs/markdown-remark` because Astro 7's default processor ignores legacy plugins).
- `vercel.json`: immutable 1y for `/_astro`, `/fonts`, `/icons`; daily revalidate images; HTML revalidates.
- 511KB lossless k8s diagram re-encoded lossy q78 → 37KB (verified legible), pushed to GHCR with pin `sha256:315754039f29770cd9c8ea9283e0f16e1cde6a4ba7358d9c03281956655e7713`.
- Measured prod: homepage 6.6KB transfer / TTFB ~230ms, heaviest post 37KB <0.5s.

## 6. A11y state

- Landmarks: `header`/`main#main`/`footer` siblings (native roles; no explicit role attrs). Skip link, `:focus-visible` paired with every `:hover`, `prefers-reduced-motion` covers transitions + animations + scroll + JS loops.
- Lightbox: `role=button` + labels on images, dialog with focus trap, Esc/backdrop close, focus restore. Code-copy 44px, lightbox close 44px.
- Breadcrumbs, pagination `aria-current`, `time datetime`, alt text on all 96 post images (functional, ≤125 chars), covers intentionally `alt=""`.
- Known limits (no browser/AT available): lightbox trap uses 2-node Tab cycle; `role=button`-on-`img` is non-native; peek live region chatters on rapid hover (debounce was tried and rejected by user).

## 7. Conventions for future work

- Prettier: `kinetic.css` + `KineticLayout.astro` use 2-space legacy style and FAIL `prettier --check` (pre-existing). Edit them surgically with matching indentation; never `--write` them whole. New files use tabs (prettier-clean).
- `astro check` must stay 0 errors. Inline `<script>` in `.astro` gets weak type-checking — prefer `src/scripts/*.ts` modules. JSON-in-script needs `set:html` + `is:inline`.
- `.copy svg` rule sizes footer icons; `--on-acc: #0b0b0b` is the dark-on-lime token (never hardcode).
- Single breakpoint: 760px. `.visually-hidden` utility exists in `kinetic.css`.
- Do not regress: no-JS navigation, no client framework, no Google Fonts, no prefetch runtime, keep canonical/trailing-slash discipline (`KineticLayout` has a `slash()` normalizer for `prev`/`next`).
- User review gates (ask first): any visual change, any perf change with bandwidth/build tradeoffs, touching `~/Projects/deno`, committing.

## 8. Open / parked (not defects)

- Sync images pin into Deno repo if its builds should get the smaller diagram.
- `active` layout prop is accepted but never rendered (dead); `aria-current` nav selectors were removed with it.
- Post pages emit no `<link rel="prev|next">` (index/tag pages do).
- `resume.pdf` in git will bloat history if updated often; consider Releases later.
- No CI (`.github/` absent); Vercel is the only gate. Proposed `ci.yml`: frozen install + `astro check` + `prettier --check` + build.
- `allowedHosts: true` is intentional (tailnet dev binds the Tailscale IP).
- Peek JS `links` const also serves shortcuts removal remnant — harmless.
