# Release Candidate Notes

## Scope

Initial public build with local connector routing, dry-run planning, examples, tests, and agent-facing skill instructions.

## Verification

- `npm test`
- `npm run check`
- `npm run smoke`

## Residual Risks

- Scoring is intentionally simple and should be tuned against real connector catalogs.
- JSON schema validation is lightweight in V1.
- The tool does not verify that remote connector permissions match local manifest claims.
