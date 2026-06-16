# Contributing

Thanks for improving `connector-plan-skill`.

## Local Setup

```bash
npm install
npm run release:check
```

## Pull Requests

- Keep changes small and focused.
- Add or update fixtures when routing or dry-run output changes.
- Run `npm run release:check` before opening a PR.
- Document user-facing behavior changes in `README.md` or `docs/`.

## Safety Expectations

The package must remain local-first. Do not add live connector execution, credential storage, or network calls to the planner path without explicit design review.
