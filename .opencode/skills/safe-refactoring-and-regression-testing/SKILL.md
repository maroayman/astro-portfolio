
---
name: safe-refactoring-and-regression-testing
description: Refactor existing code incrementally while preserving public behavior, routes, content, accessibility, and performance.
---

# Safe Refactoring and Regression Testing

## Objective

Improve maintainability without introducing regressions.

A shorter implementation is not automatically better. Optimize for correctness, clarity, consistency, and ease of maintenance.

## Before refactoring

1. Inspect the target file and its callers.
2. Search for all references to the symbols, classes, routes, and data fields being changed.
3. Read relevant templates, components, and configuration.
4. Identify existing tests and validation commands.
5. List externally observable behavior that must remain unchanged.
6. Inspect the working tree and preserve unrelated changes.

Do not rewrite an entire file just because it could be shorter.

## Make small, reversible changes

- Make one conceptual change at a time.
- Preserve public interfaces unless a breaking change is intended.
- Avoid unrelated formatting changes in the same patch.
- Do not combine dependency upgrades with unrelated refactoring.
- Avoid abstractions that make simple code harder to understand.
- Reuse existing helpers rather than duplicating their behavior.
- Follow the repository's established naming and architectural conventions.

When a change is large, divide it into stages that can be validated independently.

## Preserve observable behavior

Identify which behaviors must remain unchanged before editing.

Depending on the project, these may include:

- Public URLs and generated routes.
- Navigation and browser history.
- Page metadata and canonical URLs.
- Content ordering and filtering.
- Forms and interactive controls.
- Theme behavior and persistence.
- Keyboard accessibility.
- Image dimensions and loading behavior.
- RSS feeds and sitemap output.
- CSS selectors referenced by JavaScript.
- Deployment and build behavior.

Do not assume a refactor is behavior-preserving merely because the application compiles.

## Components and templates

When extracting, merging, or replacing components:

- Preserve inputs, props, data contracts, and default values.
- Check all call sites.
- Preserve HTML semantics and metadata.
- Confirm that shared components work on every page that uses them.
- Avoid unnecessary client-side hydration.
- Check styling scope and inherited layout behavior.

For Astro, verify the distinction between `.astro` components, framework components, and hydrated client-side components before moving logic between them.

## Data and content

When changing content models, collections, or data helpers:

- Preserve ordering and filtering semantics.
- Handle missing metadata deliberately.
- Avoid unintended mutation.
- Keep transformations deterministic.
- Update all consumers when changing a data contract.
- Check generated pages, links, and feeds.

For Astro content collections, check schemas, collection queries, and front matter before changing the data model.

## CSS and JavaScript regressions

Be careful when renaming CSS classes or moving markup. Stylesheets, scripts, and optimization tools may depend on existing names.

For JavaScript changes:

- Check initialization and cleanup.
- Avoid duplicate event handlers.
- Preserve browser history and hash behavior.
- Check empty states and repeated interactions.
- Verify that errors do not leave the interface unusable.

## Regression testing

Choose checks according to the change.

| Change | Validation |
|---|---|
| CSS and layout | CSS checks, production build, responsive review |
| Content and metadata | Content validation, generated pages, routes |
| Data helpers | Sorting, filtering, missing data, consumers |
| Navigation | Direct links, browser history, keyboard behavior |
| Client-side scripts | Initialization, repeated interactions, console errors |
| Images | Asset existence, dimensions, layout stability |
| Build configuration | Type checks, production build, preview |
| Dependencies and CI | Lockfile consistency, validation scripts, workflow checks |

If tests do not exist, add focused tests when reasonable or identify the manual verification still needed.

## Avoid false confidence

- A successful type check does not prove that rendered pages are correct.
- A successful build does not prove that browser interactions work.
- A passing accessibility audit does not prove complete accessibility.
- A passing Lighthouse score does not prove that performance is optimal.
- A local build does not prove that deployment succeeded.

Clearly distinguish verified results from assumptions.

## Final review

Before finishing:

1. Inspect the full diff.
2. Check for accidental deletions and unrelated changes.
3. Confirm that user modifications remain intact.
4. Verify affected routes and generated assets.
5. Run relevant validation.
6. Report what changed and what remains unverified.

Prefer a small, verifiable improvement over a broad rewrite with uncertain behavior.
