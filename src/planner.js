const RISK_ORDER = ["none", "low", "medium", "high"];

export function routeTask(task, connectors, policy = {}) {
  const ranked = connectors
    .map((connector) => scoreConnector(task, connector, policy))
    .sort((a, b) => b.score - a.score || a.connector.id.localeCompare(b.connector.id));

  const viable = ranked.filter((item) => item.blockers.length === 0);
  const selected = viable[0] ?? ranked[0];
  return {
    task: {
      intent: task.intent,
      actions: task.actions,
      target: task.target ?? null
    },
    selected: selected?.connector.id ?? null,
    candidates: ranked,
    approvalRequired: selected ? approvalRequired(selected.connector, policy) : false
  };
}

export function scoreConnector(task, connector, policy = {}) {
  const taskWords = normalize([...task.actions, task.intent, task.target ?? ""]);
  const capabilityMatches = connector.capabilities.filter((capability) =>
    taskWords.some((word) => capability.toLowerCase().includes(word) || word.includes(capability.toLowerCase()))
  );
  const blockers = [];
  const deniedScopes = policy.deniedScopes ?? [];
  const maxRisk = policy.maxRisk ?? "high";
  const risk = connector.risk ?? "medium";

  for (const scope of connector.scopes ?? []) {
    if (deniedScopes.includes(scope)) blockers.push(`Denied scope: ${scope}`);
  }
  if (RISK_ORDER.indexOf(risk) > RISK_ORDER.indexOf(maxRisk)) {
    blockers.push(`Risk ${risk} exceeds policy max ${maxRisk}`);
  }

  let score = capabilityMatches.length * 25;
  if ((policy.preferredConnectors ?? []).includes(connector.id)) score += 10;
  if (connector.sideEffects.length === 0) score += 8;
  if (connector.dryRun === true) score += 12;
  score -= RISK_ORDER.indexOf(risk) * 4;
  score -= blockers.length * 100;

  return {
    connector,
    score,
    capabilityMatches,
    blockers,
    approvalRequired: approvalRequired(connector, policy)
  };
}

export function buildDryRun(route, policy = {}) {
  const selected = route.candidates.find((candidate) => candidate.connector.id === route.selected);
  if (!selected) throw new Error("Cannot build dry run without a selected connector");
  const connector = selected.connector;
  const writes = connector.sideEffects.filter((effect) => effect.type !== "read");
  return {
    connector: connector.id,
    connectorName: connector.name,
    task: route.task,
    preconditions: [
      "Confirm the task target and recipient list are correct.",
      "Confirm local manifest evidence is current.",
      ...(connector.preconditions ?? [])
    ],
    intendedWrites: writes.map((effect) => effect.description),
    readOnlyEvidence: connector.sideEffects
      .filter((effect) => effect.type === "read")
      .map((effect) => effect.description),
    approval: {
      required: selected.approvalRequired,
      reasons: approvalReasons(connector, policy)
    },
    rollback: connector.rollback ?? "No live action is executed by connector-plan; rollback belongs to the eventual connector operator.",
    notes: connector.rateLimitNotes ? [connector.rateLimitNotes] : []
  };
}

function approvalRequired(connector, policy = {}) {
  const gated = policy.requireApprovalFor ?? ["write", "delete"];
  return connector.sideEffects.some((effect) => gated.includes(effect.type));
}

function approvalReasons(connector, policy = {}) {
  const gated = policy.requireApprovalFor ?? ["write", "delete"];
  return connector.sideEffects
    .filter((effect) => gated.includes(effect.type))
    .map((effect) => `${effect.type}: ${effect.description}`);
}

function normalize(values) {
  return values
    .flatMap((value) => String(value).toLowerCase().split(/[^a-z0-9]+/))
    .filter((value) => value.length > 2);
}
