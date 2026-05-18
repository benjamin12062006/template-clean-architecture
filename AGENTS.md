# AGENTS

This file defines guidance for coding agents working in this repository.

## Scope

- Applies to the entire repository unless a deeper `AGENTS.md` overrides it.

## Goals

- Keep changes minimal, correct, and aligned with existing architecture.
- Prefer small, verifiable edits over broad refactors.
- Preserve behavior unless the task explicitly requires changes.

## Workflow

1. Understand the task and inspect relevant code paths first.
2. Propose or implement the smallest viable change.
3. Run relevant checks/tests for impacted areas.
4. Summarize what changed, why, and any follow-up needed.

## Coding Conventions

- Follow existing project patterns and naming.
- Avoid adding dependencies unless necessary.
- Keep functions/modules focused and readable.
- Add comments only when intent is non-obvious.

## Safety Rules

- Do not delete or rewrite unrelated code.
- Do not perform destructive git operations without explicit instruction.
- Flag uncertainty early and state assumptions clearly.

## Validation

- Run lint/typecheck/tests relevant to the modified scope.
- If validation cannot run, state exactly what was not executed and why.

## Deliverables

- Concise change summary.
- List of touched files.
- Verification results.
- Open risks or assumptions, if any.
