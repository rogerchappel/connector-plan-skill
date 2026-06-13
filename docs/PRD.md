# Product Requirements: connector-plan-skill

`connector-plan-skill` helps agents choose between local connector manifests before touching systems with side effects.

## Goals

- Rank connectors for a requested task using local manifest evidence.
- Produce dry-run plans with preconditions, intended writes, rollback notes, and approval gates.
- Keep V1 fully local with no credentials, OAuth, network calls, or live writes.

## Non-Goals

- Executing connector actions.
- Managing secrets.
- Claiming policy compliance beyond the supplied manifests and policy file.

## Users

- Agent builders preparing external action handoffs.
- Maintainers reviewing whether an agent should use a connector.
- Operators who need a clear approval packet before a write.

## Acceptance Criteria

- `connector-plan route` ranks fixtures deterministically.
- `connector-plan dry-run` renders Markdown and JSON plans.
- Tests cover manifest parsing, policy blockers, ranking, and rendering.
- `SKILL.md` documents side-effect boundaries and validation steps.
