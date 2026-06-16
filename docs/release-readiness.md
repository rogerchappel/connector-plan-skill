# Release Readiness

Use this checklist before publishing, tagging, or asking reviewers to trust the package surface.

## Package Surface

- Package: `connector-plan-skill`
- Repository: `https://github.com/rogerchappel/connector-plan-skill`
- Pack contents are constrained by the `files` allowlist in `package.json`.

## CLI Surface

- `connector-plan` -> `./src/cli.js`

## Verification Commands

- `npm run check`: `node --check src/*.js test/*.test.js`
- `npm run test`: `node --test`
- `npm run smoke`: `node src/cli.js route --task fixtures/follow-up-task.json --connectors fixtures/connectors --policy fixtures/policy.json --format markdown`
- `npm run package:smoke`: `node scripts/package-smoke.js`
- `npm run release:check`: `npm run check && npm test && npm run smoke && npm run package:smoke`

Run `npm run release:check` before opening a release PR. Record any skipped command and the reason in the PR body.

## Reviewer Notes

- Compare README examples with the current CLI bins or module exports.
- Inspect `npm pack --dry-run` output for generated logs, caches, or private fixtures.
- Confirm CI exercises the same release check path used locally.
