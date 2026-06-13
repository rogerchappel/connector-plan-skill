# connector-plan-skill

Use this skill when an agent needs to choose a connector or prepare an external action plan before performing writes, sends, deletes, or other side effects.

## Required Inputs

- Task JSON with `intent`, `actions`, and optional `target`.
- Local connector manifest directory.
- Optional policy JSON with approval gates, denied scopes, preferred connectors, and max risk.

## Boundaries

- Do not execute live external actions from this skill.
- Do not store credentials or request OAuth tokens.
- Treat connector manifests as evidence, not proof of remote authorization.
- Ask for explicit human approval before using a downstream connector when `approval.required` is true.

## Workflow

1. Run `connector-plan route --task task.json --connectors connectors --policy policy.json --out route.json`.
2. Inspect candidate scores and blockers.
3. Run `connector-plan dry-run --route route.json --policy policy.json --format markdown`.
4. Present the dry-run plan before invoking any separate external connector.
5. Record the approved plan with the agent run notes.

## Validation

- Run `npm test` after code changes.
- Run `npm run smoke` against fixtures before using the skill in a workflow.
- Confirm intended writes, rollback notes, and approval reasons are present for side-effecting tasks.
