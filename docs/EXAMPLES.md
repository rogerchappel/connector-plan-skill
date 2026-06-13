# Examples

## Route a Connector

```bash
connector-plan route \
  --task fixtures/follow-up-task.json \
  --connectors fixtures/connectors \
  --policy fixtures/policy.json \
  --format markdown
```

## Save and Review a Dry Run

```bash
connector-plan route \
  --task fixtures/follow-up-task.json \
  --connectors fixtures/connectors \
  --policy fixtures/policy.json \
  --out route.json

connector-plan dry-run --route route.json --policy fixtures/policy.json
```

Use the dry-run output as an approval packet before a separate connector execution step.
