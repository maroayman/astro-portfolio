
---
name: performance-and-navigation
description: Improve loading speed, runtime performance, navigation, image delivery, and Core Web Vitals without sacrificing features or accessibility.
---

# Performance and Navigation

## Objective

Improve measurable performance while preserving functionality, accessibility, maintainability, and visual quality.

Prefer small, evidence-based improvements over unnecessary rewrites or optimizations aimed only at scoring tools.

## Before optimizing

1. Identify the actual performance problem.
2. Inspect the relevant page, components, scripts, assets, and build configuration.
3. Measure the baseline when suitable tooling is available.
4. Determine whether the issue is build-time, network-related, rendering-related, or caused by runtime JavaScript.
5. Choose the smallest change likely to address the bottleneck.

Do not assume a framework migration or additional dependency will make the site faster.

## Static rendering and JavaScript

Prefer static HTML when it satisfies the requirement.

- Avoid client-side JavaScript for functionality that HTML or CSS can handle.
- Avoid hydrating static components unnecessarily.
- Reuse existing dependencies and utilities.
- Keep client-side scripts focused.
- Avoid duplicate event handlers, unnecessary DOM scans, and repeated initialization.
- Avoid expensive synchronous work on the main thread.
- Use event delegation when it simplifies handling many similar elements.
- Manage event listeners, observers, and other resources according to their lifecycle.

For Astro, prefer static rendering by default and add client-side hydration only for genuinely interactive components.

Do not introduce a client-rendered framework for a small isolated interaction without a clear architectural reason.

## Navigation and browser history

Before changing navigation:

1. Inspect the current routing and navigation implementation.
2. Determine whether transitions are full-page loads or client-side navigations.
3. Check how scripts initialize and whether they are re-executed.
4. Inspect hash handling, browser history, and scroll restoration.
5. Check how theme state and interactive controls behave during navigation.

Preserve direct navigation, deep links, browser back/forward behavior, and accessible focus handling.

For Astro projects, check any configured view transitions or client-side navigation features before changing lifecycle-dependent scripts.

Do not add SPA-style navigation just to make the site appear more modern.

## Images and layout stability

- Use appropriately sized image assets.
- Preserve image dimensions or aspect ratios.
- Avoid layout shifts while images load.
- Use responsive image techniques when beneficial.
- Lazy-load suitable below-the-fold images.
- Avoid lazy-loading critical images by default.
- Avoid shipping unnecessarily large image formats or assets.
- Follow the existing image pipeline before adding a competing one.

For Astro, inspect the installed image tools, existing image components, and build configuration before changing asset handling.

## CSS and rendering

- Avoid large render-blocking additions.
- Keep critical rendering paths simple.
- Avoid expensive effects and continuous animations when simpler alternatives work.
- Avoid unnecessary font downloads and external requests.
- Preserve CSS optimization and import-order assumptions.
- Check whether dynamic class names survive any configured CSS purging or optimization.

Do not remove useful styles or interactions just to reduce stylesheet size.

## Caching and service workers

Before modifying caching behavior:

- Inspect the existing cache strategy and invalidation process.
- Understand how deployments update HTML and assets.
- Check offline behavior and navigation fallbacks where implemented.
- Avoid caching responses that should not be cached.
- Consider how stale assets affect users after deployment.

Do not add a service worker or complicated cache strategy without a concrete requirement.

## Astro-specific considerations

- Check `astro.config.*` and the installed Astro version.
- Review configured integrations before introducing alternatives.
- Use static generation where appropriate.
- Avoid unnecessary hydration directives.
- Verify that server-only code does not leak into browser bundles.
- Follow current APIs for the installed version rather than assuming documentation for another version applies.

## Measurement and validation

Distinguish between:

- Build duration.
- Initial page-load performance.
- JavaScript execution and interaction responsiveness.
- Network transfer size.
- Layout stability.
- Lighthouse lab results.
- Real-user performance data, if available.

Compare measurements under similar conditions.

A single Lighthouse score does not prove that every performance issue is solved. Investigate environment-specific browser warnings before changing application code to suppress them.

After changes, run relevant checks and a production build. Test navigation and interactive features as well as performance.

Report what was measured and what remains unverified.
