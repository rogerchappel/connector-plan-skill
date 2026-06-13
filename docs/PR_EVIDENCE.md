# PR Evidence: connector-plan-skill

## Summary

- Built a local-first connector routing and dry-run planning CLI.
- Added agent-facing `SKILL.md`, product docs, fixtures, tests, and validation script.
- Kept V1 side-effect free: no credentials, no OAuth, no live connector execution.

## Verification

- `npm test`: pass, 2 tests.
- `npm run check`: pass.
- `npm run smoke`: pass, rendered ranked connector route.
- `bash scripts/validate.sh`: pass, includes `npm pack --dry-run`.

## Package Contents

- `src/cli.js`
- `src/manifest.js`
- `src/planner.js`
- `src/render.js`
- `fixtures/`
- `docs/`
- `SKILL.md`
- `README.md`

## Residual Risks

- Scoring is simple and should be tuned against real connector catalogs.
- Manifest claims are local evidence only and are not verified against remote systems.
- YAML schemas and richer scoring explanations are future work.
