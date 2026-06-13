import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

export async function loadTask(filePath) {
  const task = await readJson(filePath);
  if (!task.intent || !Array.isArray(task.actions)) {
    throw new Error("Task must include intent and actions[]");
  }
  return task;
}

export async function loadPolicy(filePath) {
  if (!filePath) return { requireApprovalFor: ["write", "delete"], deniedScopes: [] };
  const policy = await readJson(filePath);
  return {
    requireApprovalFor: policy.requireApprovalFor ?? ["write", "delete"],
    deniedScopes: policy.deniedScopes ?? [],
    preferredConnectors: policy.preferredConnectors ?? [],
    maxRisk: policy.maxRisk ?? "high"
  };
}

export async function loadConnectors(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dirPath, entry.name))
    .sort();
  const connectors = await Promise.all(files.map(readJson));
  for (const connector of connectors) validateConnector(connector);
  return connectors;
}

export function validateConnector(connector) {
  const required = ["id", "name", "capabilities", "scopes", "sideEffects"];
  for (const key of required) {
    if (connector[key] === undefined) throw new Error(`Connector missing ${key}`);
  }
  if (!Array.isArray(connector.capabilities) || connector.capabilities.length === 0) {
    throw new Error(`Connector ${connector.id} must declare capabilities`);
  }
  if (!Array.isArray(connector.sideEffects)) {
    throw new Error(`Connector ${connector.id} sideEffects must be an array`);
  }
}
