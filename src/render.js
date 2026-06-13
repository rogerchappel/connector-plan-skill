export function renderMarkdownRoute(route) {
  const lines = [
    `# Connector Route: ${route.task.intent}`,
    "",
    `Selected connector: ${route.selected ?? "none"}`,
    "",
    "## Candidates",
    ""
  ];
  for (const candidate of route.candidates) {
    lines.push(`- ${candidate.connector.id}: score ${candidate.score}`);
    if (candidate.capabilityMatches.length > 0) {
      lines.push(`  - matches: ${candidate.capabilityMatches.join(", ")}`);
    }
    if (candidate.blockers.length > 0) {
      lines.push(`  - blockers: ${candidate.blockers.join("; ")}`);
    }
    lines.push(`  - approval required: ${candidate.approvalRequired ? "yes" : "no"}`);
  }
  return `${lines.join("\n")}\n`;
}

export function renderMarkdownDryRun(plan) {
  const lines = [
    `# Dry-Run Plan: ${plan.task.intent}`,
    "",
    `Connector: ${plan.connectorName} (${plan.connector})`,
    "",
    "## Preconditions",
    ...plan.preconditions.map((item) => `- ${item}`),
    "",
    "## Intended Writes",
    ...(plan.intendedWrites.length ? plan.intendedWrites.map((item) => `- ${item}`) : ["- None"]),
    "",
    "## Read-Only Evidence",
    ...(plan.readOnlyEvidence.length ? plan.readOnlyEvidence.map((item) => `- ${item}`) : ["- None recorded"]),
    "",
    "## Approval",
    `Required: ${plan.approval.required ? "yes" : "no"}`,
    ...(plan.approval.reasons.length ? plan.approval.reasons.map((item) => `- ${item}`) : ["- No gated side effects"]),
    "",
    "## Rollback",
    plan.rollback
  ];
  return `${lines.join("\n")}\n`;
}

export function renderJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
