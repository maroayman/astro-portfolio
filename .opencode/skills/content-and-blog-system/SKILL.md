
---
name: content-and-blog-system
description: Maintain blog content, front matter, metadata, URLs, feeds, navigation, and content-driven pages without breaking existing routes.
---

# Content and Blog System

## Objective

Preserve the integrity of content, metadata, generated pages, and URLs while making content easier to maintain.

These guidelines apply to static sites and content-driven applications. Adapt the implementation to the framework and content system actually used by the repository.

## Before editing content infrastructure

1. Inspect existing content files and their front matter.
2. Read the project's content authoring documentation.
3. Locate the code that loads and transforms content.
4. Trace how content becomes rendered pages.
5. Identify how URLs, tags, dates, images, feeds, and navigation are generated.

Do not invent metadata fields or assume that source filenames directly determine public URLs.

## Content conventions

- Follow existing front-matter conventions.
- Preserve the author's intended meaning and tone.
- Keep titles, descriptions, dates, tags, and image references consistent.
- Preserve Markdown syntax, code fences, and language identifiers.
- Use meaningful heading structures.
- Avoid unsupported factual claims and fabricated references.
- Check internal links and image references when editing content.

## URLs and routing

- Preserve existing public URLs unless a migration is explicitly requested.
- Check trailing-slash and output-directory conventions.
- Avoid duplicate routes and conflicting generated pages.
- Update internal links and references when a route intentionally changes.
- Check redirects, feeds, sitemap entries, and canonical URLs where applicable.
- Do not assume a framework's default routing behavior matches the existing site.

For Astro, inspect `src/pages/`, dynamic route files, content collections, and the configured site and trailing-slash settings as applicable.

## Content models and collections

When changing a content schema or helper:

- Find all consumers of the affected fields.
- Check how missing or malformed metadata is handled.
- Preserve existing ordering and filtering semantics.
- Avoid unintended mutation of shared collections.
- Keep transformations deterministic.
- Update validation and documentation when the content contract changes.

For Astro content collections, inspect the collection configuration and schemas before modifying front matter or query logic. Preserve compatibility with existing content files.

Do not migrate the entire content system to a new API without a clear need.

## Client-side content interactions

If the site includes search, filters, tags, bookmarks, reading history, or interactive navigation, identify their current contracts before making changes.

Preserve:

- Direct links and deep links.
- Browser back and forward behavior.
- Sorting and filtering semantics.
- Empty states.
- Existing persistence behavior.
- Internal links between related content.
- Keyboard accessibility.
- Behavior when JavaScript is unavailable, where supported.

Do not replace an existing feature with a superficially similar implementation that removes capabilities.

## Images and assets

- Verify that referenced assets exist.
- Follow the repository's image naming and processing conventions.
- Preserve intrinsic dimensions or equivalent layout-stability mechanisms.
- Use appropriately sized assets.
- Avoid unnecessary eager loading of below-the-fold images.
- Avoid lazy loading critical above-the-fold images without justification.
- Do not commit generated assets or large downloaded files unless the repository workflow requires them.

For Astro, check existing image integrations and use the project's established image-processing approach before introducing a new one.

## Feeds and discovery

When changing content metadata or routes, check the impact on applicable features:

- RSS or Atom feeds.
- Sitemap generation.
- Canonical URLs.
- Tag and category pages.
- Search indexes.
- Related-content links.
- Structured metadata.
- Social sharing metadata.

A change that works on the main listing page can still break other generated outputs.

## Validation

Run the relevant content validation and production build.

For structural changes, inspect generated pages, URLs, feeds, and metadata as applicable.

Do not report content validation as successful unless the relevant checks actually ran.
