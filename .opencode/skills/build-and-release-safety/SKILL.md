
---
name: build-and-release-safety
description: Safely manage project dependencies, build commands, validation, CI, deployment configuration, and generated assets.
---

# Build and Release Safety

## Objective

Keep development and release workflows reproducible, secure, and consistent with the repository's existing conventions.

Never weaken meaningful validation or modify deployment configuration without understanding its effects.

## Discover the project first

Before running or changing commands, inspect the relevant files.

For Astro projects, commonly relevant files include:

- `package.json` and the lockfile.
- `astro.config.*`.
- `tsconfig.json`.
- `.github/workflows/`.
- Deployment configuration.
- Scripts under `scripts/`.
- Content and asset configuration.

The exact files and package manager may differ. Follow the repository rather than assuming a standard layout.

## Dependencies and package managers

- Use the package manager indicated by the repository and lockfile.
- Preserve lockfile consistency.
- Avoid unnecessary dependencies.
- Do not casually upgrade the framework or integrations during unrelated changes.
- Inspect package versions before using version-specific APIs.
- Prefer existing utilities when they already solve the problem.
- Avoid introducing unpinned dependencies when the project requires reproducible versions.

Do not delete or regenerate a lockfile without understanding why it is needed.

## Build and validation workflow

Inspect the existing scripts before executing commands.

For an Astro project, typical scripts may include development, build, preview, type checking, linting, formatting, or tests. Use only scripts actually defined in the project.

A safe workflow is:

1. Inspect the working tree and current changes.
2. Run the narrowest relevant validation.
3. Run formatting, linting, type checking, or tests as applicable.
4. Run the production build.
5. Review generated output or preview the production build when relevant.
6. Inspect the final diff.

Use the repository's established commands rather than inventing new task names.

If a check fails, investigate the failure instead of disabling the check to obtain a passing result.

## Build artifacts and user changes

- Identify generated files before editing or deleting them.
- Follow existing ignore rules.
- Avoid committing build output unless the repository intentionally tracks it.
- Avoid broad cleanup commands that could remove user work.
- Inspect `git status` before and after changes.
- Never overwrite unrelated user modifications.
- Do not reset, clean, or discard changes without explicit authorization.

## Configuration changes

Before modifying build or deployment configuration:

1. Understand the existing configuration.
2. Identify affected integrations and scripts.
3. Check whether environment variables or secrets are involved.
4. Review relevant documentation for the installed version.
5. Make the smallest justified change.
6. Run the appropriate validation.

For Astro, pay attention to:

- Site URL and base path.
- Output mode and adapter configuration.
- Integrations.
- Trailing-slash behavior.
- Asset paths and public files.
- Image processing.
- Build output directory.
- Type checking and environment variables.

Do not change static output to server output, or introduce an adapter, without a requirement.

## CI and security

When editing CI workflows:

- Preserve required validation steps.
- Use restrictive permissions where practical.
- Avoid exposing secrets to untrusted code.
- Keep dependency installation reproducible.
- Ensure workflow commands exist.
- Avoid skipping meaningful checks merely to make CI pass.

Never put credentials, access tokens, or private environment values in source code, logs, or commits.

## Deployment

Distinguish between a successful local build and a successful deployment.

Do not claim that a deployment succeeded unless it actually completed.

If deployment testing is unavailable, state that the local checks passed and deployment remains unverified.

## Completion report

Summarize:

- What changed.
- Which checks ran.
- Which checks passed or failed.
- Which checks could not run.
- Any remaining risks or follow-up actions.

Be precise about what was verified.
