# connector-plan-skill

Local-first connector routing and dry-run planning for agent workflows.

`connector-plan-skill` turns connector manifests into reviewable action plans. It helps an agent explain why a connector was selected, which alternatives were blocked, what writes are intended, and when human approval is required.

## Quickstart

```bash
npm install
npm test
npm run smoke
```

Route a task:

```bash
node src/cli.js route \
  --task fixtures/follow-up-task.json \
  --connectors fixtures/connectors \
  --policy fixtures/policy.json \
  --format markdown
```

Save a route and render a dry-run plan:

```bash
node src/cli.js route --task fixtures/follow-up-task.json --connectors fixtures/connectors --policy fixtures/policy.json --out route.json
node src/cli.js dry-run --route route.json --policy fixtures/policy.json --format markdown
```

## Connector Manifest

Each connector is a JSON file with capabilities, scopes, risk, dry-run support, and side effects.

```json
{
  "id": "crm-safe",
  "capabilities": ["read contact", "update project"],
  "scopes": ["contacts:read", "projects:write"],
  "risk": "medium",
  "dryRun": true,
  "sideEffects": [
    { "type": "write", "description": "Update project status." }
  ]
}
```

## Safety Notes

- V1 never executes live connector actions.
- V1 never stores credentials.
- Approval output is based on local manifests and policy files.
- Treat the dry-run plan as a review packet for a separate connector operator.

## Limitations

- JSON only; YAML support is future work.
- Scoring is transparent but simple.
- Manifest claims are not verified against remote systems.

## Release Verification

Before publishing or tagging a release, run the same verification path used by CI:

- `npm run release:check`
- `npm run package:smoke`

See `docs/release-readiness.md` for the package surface, CLI bins, and reviewer checklist.
`package:smoke` runs a dry-run package build and confirms the CLI, planner
modules, connector fixtures, examples, skill file, README, and license are
present in the tarball.
