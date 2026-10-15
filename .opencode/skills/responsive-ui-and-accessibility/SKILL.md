
---
name: responsive-ui-and-accessibility
description: Build responsive, accessible interfaces and preserve keyboard behavior, semantic markup, and interaction quality across the portfolio.
---

# Responsive UI and Accessibility

## Objective

Every interface change must preserve usability across screen sizes, keyboard navigation, and assistive technologies.

A page that looks correct on desktop is not necessarily complete.

## Before changing a component

1. Locate the component, template, or page that renders the interface.
2. Identify its styles, scripts, and shared dependencies.
3. Inspect existing behavior before modifying it.
4. Determine whether the component is reused across multiple pages.
5. Identify relevant keyboard interactions and responsive states.

For Astro, inspect the relevant `.astro` files, layouts, imported components, and any hydrated client-side components.

## Responsive behavior

Test representative mobile, tablet, and desktop widths.

Pay attention to:

- Navigation menus and mobile navigation.
- Long page titles and section headings.
- Project and article cards.
- Tag lists and filter controls.
- Code blocks, tables, and long URLs.
- Footer navigation and grouped links.
- Forms, dialogs, popovers, and expandable content.

Prefer flexible layouts and intrinsic sizing. Avoid fixed widths that assume a particular screen size.

Do not fix horizontal overflow by hiding it globally without finding the underlying cause.

When content requires horizontal scrolling, make that behavior deliberate and preserve access to the content.

## Semantic HTML

- Use anchors for navigation and buttons for actions.
- Use native form controls where possible.
- Maintain a logical heading hierarchy.
- Give icon-only controls accessible names.
- Associate labels with inputs.
- Provide meaningful alternative text for informative images.
- Use empty alternative text for purely decorative images when appropriate.
- Use ARIA only when native HTML semantics are insufficient.

Avoid clickable `div` or `span` elements when a native interactive element is appropriate.

## Keyboard accessibility

- Ensure interactive controls are keyboard reachable.
- Preserve visible focus indicators.
- Avoid positive `tabindex` values.
- Prevent keyboard traps.
- Ensure menus and dialogs can be operated and dismissed appropriately.
- Manage focus when content changes in ways that would otherwise disorient users.
- Avoid removing focused elements unexpectedly during filtering or navigation.

When a control changes state, expose the state accessibly.

## Motion and visual feedback

- Respect `prefers-reduced-motion`.
- Do not rely on animation alone to communicate important changes.
- Make hover, focus, selected, active, and disabled states clear.
- Ensure text and controls remain readable in supported themes.
- Avoid transitions that make state changes difficult to perceive.

## Progressive enhancement

Prefer HTML and CSS for functionality that does not require JavaScript.

When JavaScript is required:

- Ensure the initial HTML remains meaningful.
- Handle initialization failures gracefully where practical.
- Avoid controls that appear functional but do nothing until hydration.
- Preserve navigation and essential content when client-side enhancements fail, where the architecture allows it.

For Astro, use client directives only when browser-side interactivity is needed. Do not hydrate static content without a clear reason.

## Validation

For each meaningful UI change:

1. Inspect the rendered page at relevant viewport widths.
2. Verify keyboard navigation and visible focus.
3. Check semantics and accessible names.
4. Test long content and empty states.
5. Check browser console errors when browser testing is available.
6. Run the relevant project checks and build.

If visual or assistive-technology testing was not performed, state that limitation rather than claiming full accessibility compliance.
