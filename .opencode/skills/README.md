
# Portfolio Project Skills

Project-specific guidance for maintaining a fast, accessible, and maintainable portfolio.

The skills are designed to be framework-agnostic, with additional guidance for Astro where appropriate.

## Available skills

| Skill | Use when |
|---|---|
| `css-conventions` | Editing stylesheets, design tokens, responsive layouts, or CSS optimization |
| `responsive-ui-and-accessibility` | Changing navigation, mobile layouts, interactive controls, or accessibility |
| `content-and-blog-system` | Editing articles, metadata, routes, content collections, feeds, or content-driven pages |
| `performance-and-navigation` | Improving loading speed, navigation, image delivery, caching, or runtime performance |
| `build-and-release-safety` | Changing dependencies, build scripts, CI, deployment, or generated assets |
| `safe-refactoring-and-regression-testing` | Refactoring existing code while preserving behavior |

## Project-wide principles

1. Inspect the existing implementation before making assumptions.
2. Preserve existing features, URLs, content, and visual identity unless explicitly asked to change them.
3. Prefer small, focused changes over unnecessary rewrites.
4. Reuse existing dependencies, helpers, and conventions.
5. Never overwrite unrelated user modifications.
6. Follow the package manager, lockfile, and validation commands used by the repository.
7. Validate changes using relevant checks and a production build.
8. Do not claim a check passed unless it actually ran successfully.
9. Distinguish verified results from assumptions and untested behavior.
10. Prefer measurable improvements over optimizations based on guesses.

## Astro-specific guidance

When the repository uses Astro:

- Inspect `astro.config.*`, `package.json`, and the lockfile.
- Follow the existing routing and rendering strategy.
- Prefer static rendering unless server-side rendering is required.
- Hydrate interactive components only when needed.
- Inspect content collections and schemas before changing content metadata.
- Preserve existing integrations and asset-processing conventions.
- Follow the installed Astro version's APIs.

Do not assume every project is an Astro project. If the framework changes, follow the current source code and configuration.

## Maintenance

Update these skills when the architecture, build process, content model, or project conventions change.

If a skill conflicts with the actual repository, investigate the discrepancy and follow the current implementation and explicit user requirements rather than blindly following outdated guidance.
