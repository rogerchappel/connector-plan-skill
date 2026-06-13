import test from "node:test";
import assert from "node:assert/strict";
import { loadConnectors, loadPolicy, loadTask } from "../src/manifest.js";
import { buildDryRun, routeTask } from "../src/planner.js";
import { renderMarkdownDryRun } from "../src/render.js";

test("routes to the preferred safe connector and blocks denied scopes", async () => {
  const task = await loadTask("fixtures/follow-up-task.json");
  const connectors = await loadConnectors("fixtures/connectors");
  const policy = await loadPolicy("fixtures/policy.json");
  const route = routeTask(task, connectors, policy);

  assert.equal(route.selected, "crm-safe");
  const blocked = route.candidates.find((candidate) => candidate.connector.id === "admin-sync");
  assert.match(blocked.blockers.join(" "), /Denied scope/);
});

test("builds an approval-aware dry-run plan", async () => {
  const task = await loadTask("fixtures/follow-up-task.json");
  const connectors = await loadConnectors("fixtures/connectors");
  const policy = await loadPolicy("fixtures/policy.json");
  const route = routeTask(task, connectors, policy);
  const plan = buildDryRun(route, policy);

  assert.equal(plan.connector, "crm-safe");
  assert.equal(plan.approval.required, true);
  assert.match(renderMarkdownDryRun(plan), /Intended Writes/);
});
