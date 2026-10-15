
---
name: images-and-oras
description: Manage image assets stored outside Git and distributed through OCI registries using ORAS. Use when adding, updating, publishing, pulling, or referencing image assets.
---

# Images and ORAS

## Core principles

- Store image assets in a directory named `images/`.
- Keep image binaries out of Git when the repository's existing workflow uses ORAS to distribute them.
- Use ORAS to package and publish image assets as OCI artifacts in the configured container registry.
- Keep the workflow independent of any particular framework, static site generator, or build tool.
- Follow the repository's existing naming conventions, scripts, registry paths, and release process.
- Reuse the existing asset-management workflow instead of introducing a competing one.

## Before making changes

1. Inspect the repository structure and locate the current `images/` directory.
2. Read the existing ORAS scripts, configuration, documentation, and CI/CD workflows.
3. Identify the artifact registry, repository name, tag conventions, and digest-pinning strategy.
4. Determine when and how assets are downloaded or restored for use.
5. Inspect existing conventions before assuming paths, commands, environment variables, or registry names.

## Asset organization

- Use `images/` as the canonical image asset directory, respecting the repository's existing directory structure.
- Preserve meaningful filenames and organize assets consistently.
- Update references when moving or renaming files.
- Follow the project's existing asset-path and URL conventions.
- Avoid temporary filesystem paths, machine-specific locations, and hardcoded credentials.

## ORAS workflow

- Use ORAS to publish and retrieve image assets as OCI artifacts.
- Preserve existing artifact naming, tagging, media-type, and authentication conventions.
- Prefer immutable digest references when reproducible builds require a specific asset version.
- Ensure assets are available before any process that consumes them.
- Never commit registry credentials, access tokens, or other secrets.
- Do not overwrite or delete published artifacts unless explicitly required.
- Avoid unnecessary dependencies or replacing working scripts without a clear reason.

## Scripts and automation

- Extend existing scripts instead of duplicating functionality.
- Keep publishing and retrieval steps repeatable and safe to run more than once.
- Provide clear errors when ORAS is unavailable, authentication fails, or asset retrieval fails.
- Preserve existing options such as dry-run or digest pinning when available.
- Validate that expected assets exist before continuing.
- Ensure automation works in the environments the repository supports.

## Validation

After changing the workflow:

1. Verify that `images/` and all asset references are correct.
2. Check that publishing and retrieval commands match the installed ORAS version.
3. Confirm that downloaded assets are available at the expected paths.
4. Run the repository's relevant validation and build commands.
5. Check that no unintended image binaries, credentials, or generated files have entered Git.
6. Update documentation when the workflow or its requirements change.

## Constraints

- Do not assume a particular framework, language, hosting provider, or CI platform.
- Do not assume a registry path or artifact tag; inspect the repository configuration.
- Do not introduce framework-specific image components or optimization systems unless requested.
- Do not rewrite the existing asset pipeline merely to fit this skill.
- Prefer the smallest reliable change that preserves existing behavior.
