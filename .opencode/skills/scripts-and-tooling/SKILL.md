
---
name: scripts-and-tooling
description: Create, maintain, and debug project scripts, CLI utilities, automation, validation tools, and repository maintenance workflows.
---

# Scripts and Tooling

## Objective

Keep project scripts reliable, maintainable, predictable, and easy to run. Prefer simple tools that solve a specific problem without introducing unnecessary dependencies or complexity.

These guidelines apply to JavaScript, TypeScript, shell scripts, Node.js utilities, and other scripting languages used by the repository.

## Before editing

1. Inspect the existing script and its callers.
2. Read `package.json` and identify how the script is invoked.
3. Check the package manager and lockfile.
4. Inspect related configuration, environment variables, and generated files.
5. Search for existing utilities that already solve the problem.
6. Check whether CI, pre-commit hooks, or documentation depend on the script.

Do not assume a script is unused just because it is not called by application code.

## Script design

- Give each script a clear, limited responsibility.
- Prefer readable control flow over clever abstractions.
- Use descriptive function and variable names.
- Avoid unnecessary dependencies for small utilities.
- Reuse shared helpers when doing so reduces duplication without creating excessive coupling.
- Keep configuration separate from implementation when appropriate.
- Avoid hardcoded absolute paths and machine-specific assumptions.
- Make scripts work from the repository root or resolve paths reliably.
- Follow the conventions of the language and runtime already used by the project.

## Package scripts

When adding or changing scripts in `package.json`:

- Follow existing naming conventions.
- Use the repository's established package manager.
- Preserve existing script behavior unless a change is intentional.
- Avoid duplicate scripts that differ only superficially.
- Prefer explicit commands with understandable names.
- Check that referenced files and executables exist.
- Ensure commands work in CI as well as in local development.

Do not replace the project's package manager or lockfile as part of an unrelated script change.

## Filesystem and generated output

Before a script creates, edits, or deletes files:

- Identify the exact target paths.
- Keep modifications within the intended project directories.
- Avoid destructive defaults.
- Do not delete user files or unrelated generated assets.
- Handle missing files and directories deliberately.
- Avoid broad cleanup patterns that could remove source files.
- Make repeated execution safe when practical.

For generated files, follow the repository's existing output and ignore conventions.

If a script modifies tracked files, make that behavior clear in its name, documentation, or output.

## Error handling and exit codes

- Fail with a nonzero exit code when a required operation fails.
- Do not silently ignore errors that affect correctness.
- Print actionable error messages.
- Avoid reporting success before the operation has completed.
- Handle expected missing files, invalid arguments, and unavailable dependencies.
- Avoid catching exceptions merely to suppress them.
- Ensure CI can detect failures reliably.

If partial failure is possible, explain which operations succeeded and which failed.

## Inputs and environment variables

- Validate command-line arguments.
- Document required environment variables.
- Provide useful messages for missing configuration.
- Avoid embedding credentials, access tokens, or private values in source code.
- Never print secrets in logs.
- Avoid relying on undocumented local environment state.
- Use safe defaults when possible, but fail clearly when required configuration is missing.

## Shell scripts

For shell scripts:

- Follow the shell declared by the script's shebang.
- Quote variable expansions where appropriate.
- Use explicit paths and safe handling of filenames.
- Avoid `eval` and other unnecessary execution of dynamically constructed commands.
- Check command failures and propagate meaningful exit codes.
- Be especially careful with recursive deletion, wildcard expansion, and pipelines.
- Avoid assuming GNU-specific command options when portability matters.
- Preserve executable permissions when a script is intended to be executed directly.

Do not rewrite a script for another shell without a clear requirement.

## JavaScript and TypeScript scripts

- Follow the project's existing runtime and module conventions.
- Use the appropriate APIs for the installed runtime.
- Prefer built-in functionality when it is sufficient.
- Handle asynchronous operations and rejected promises correctly.
- Avoid unnecessary dependencies and complex abstractions.
- Keep type definitions accurate when TypeScript is used.
- Avoid executing arbitrary input or dynamically constructing commands from untrusted values.

For Astro projects, do not confuse build-time scripts with browser-side code. Keep filesystem access, secret handling, and build-only logic out of client bundles.

## Automation and maintenance

For scripts that validate content, generate assets, inspect links, or maintain project files:

- Make output deterministic where possible.
- Report failures clearly.
- Avoid network requests unless the task requires them.
- Handle network failures and rate limits when applicable.
- Avoid changing files when running a check-only operation.
- Provide a clear distinction between checking, generating, and modifying.
- Document unusual prerequisites and side effects.

Do not make CI scripts depend on undocumented state from a developer's machine.

## Security

- Treat external input and downloaded content as untrusted.
- Avoid shell injection and unsafe command construction.
- Use least privilege when interacting with APIs or deployment systems.
- Keep secrets out of logs and generated artifacts.
- Verify downloaded artifacts when integrity checks are available.
- Do not weaken security checks just to make automation pass.

## Testing and validation

After changing a script:

1. Run formatting or lint checks where configured.
2. Run the script with representative valid input.
3. Test relevant invalid-input and failure cases.
4. Verify exit codes.
5. Check whether generated or modified files are correct.
6. Run the relevant project checks and production build when appropriate.
7. Review the final diff.

Do not claim a script works in environments or scenarios that were not tested.

## Documentation

Document scripts that are not self-explanatory.

Include:

- Purpose.
- Invocation command.
- Required arguments or environment variables.
- Files created or modified.
- Important side effects.
- Relevant limitations.

Keep documentation consistent with the actual implementation.
