
---
name: css-conventions
description: Maintain consistent, responsive, accessible, and performant CSS across the portfolio without introducing unnecessary styling dependencies.
---

# CSS Conventions

## Objective

Maintain a clean, professional, minimal, accessible, and performant interface. Prefer improving existing styles over introducing a parallel styling system.

These guidelines apply across frameworks. For Astro projects, also inspect `.astro` component styles, global stylesheets, and the configured CSS processing pipeline.

## Before editing

1. Inspect the relevant stylesheet and the component or template that uses it.
2. Search for existing custom properties, design tokens, selectors, and reusable patterns.
3. Determine whether the issue originates in CSS, markup, JavaScript, or generated content.
4. Check the existing build configuration before changing CSS processing.
5. Review related styles and shared components to identify possible regressions.

Do not assume that a class or selector is unused just because it is absent from a single stylesheet.

## Design conventions

- Reuse existing custom properties for colors, spacing, typography, borders, shadows, and layout.
- Prefer consistent design tokens over scattered arbitrary values.
- Use clear, purpose-based class names.
- Keep selector specificity as low as practical.
- Avoid deeply nested selectors and unnecessarily complex selector chains.
- Avoid `!important` unless a specific cascade constraint justifies it.
- Do not add a CSS framework or styling dependency for a small isolated change.
- Avoid duplicating styles that can be handled by an existing shared component.
- Preserve the established visual identity unless a redesign is explicitly requested.

## Component and global styles

- Keep global styles limited to genuinely site-wide concerns.
- Scope component styles where appropriate.
- Check whether styles are global, scoped, imported, or generated before changing their behavior.
- Avoid accidentally leaking component-specific rules into unrelated pages.
- Avoid duplicating reset rules or design tokens across components.
- When using Astro, remember that component-scoped styles and global styles have different behavior. Check the relevant component and imports before moving CSS between them.

## Responsive design

- Follow the existing breakpoint strategy unless there is a clear reason to change it.
- Prefer flexible layouts, intrinsic sizing, fluid spacing, and sensible minimum sizes.
- Check mobile, tablet, and desktop layouts.
- Prevent horizontal overflow, clipped text, and inaccessible controls.
- Pay attention to long headings, navigation items, tags, code blocks, project cards, and footer links.
- Do not solve overflow by hiding meaningful content.
- Avoid fixed dimensions when content needs to adapt to different viewport sizes.

## Accessibility

- Preserve visible keyboard focus indicators.
- Maintain sufficient text and control contrast.
- Do not communicate state using color alone.
- Respect `prefers-reduced-motion` for nonessential animation.
- Ensure hover-based interactions have an appropriate keyboard equivalent.
- Do not remove outlines without an equivalent focus treatment.
- Ensure interactive elements have distinguishable hover, focus, active, and disabled states where relevant.

## Performance

- Keep CSS focused and avoid unnecessary global selectors.
- Avoid excessive animation, expensive visual effects, and unnecessary external assets.
- Do not add font or styling dependencies without a clear benefit.
- Remove unused rules only after checking templates, scripts, dynamic class names, and generated pages.
- Verify whether the project's CSS optimizer or purger recognizes dynamically generated classes.
- Do not add broad safelists as a substitute for understanding why a selector is removed.

## Framework-specific considerations

For Astro:

- Inspect the relevant `.astro` component and its style block.
- Understand whether a stylesheet is scoped or global before moving rules.
- Preserve the current CSS import order and build configuration.
- Avoid introducing client-side JavaScript to solve a styling-only problem.
- Check whether a shared layout or component is the correct place for the change.

For other frameworks, follow their established styling and component conventions.

## Validation

After making changes:

1. Run relevant formatting, linting, and build checks.
2. Confirm that the CSS compiles.
3. Check mobile and desktop layouts.
4. Inspect affected interactive states.
5. Check for selector conflicts and unintended global effects.
6. Review the final diff for unrelated changes.

Never claim a check passed unless it actually ran successfully.
