#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { loadConnectors, loadPolicy, loadTask, readJson } from "./manifest.js";
import { buildDryRun, routeTask } from "./planner.js";
import { renderJson, renderMarkdownDryRun, renderMarkdownRoute } from "./render.js";

async function main(argv) {
  const [command, ...rest] = argv;
  const args = parseArgs(rest);
  if (!command || args.help) return usage();

  if (command === "route") {
    const task = await loadTask(required(args, "task"));
    const connectors = await loadConnectors(required(args, "connectors"));
    const policy = await loadPolicy(args.policy);
    const route = routeTask(task, connectors, policy);
    return output(args, args.format === "markdown" ? renderMarkdownRoute(route) : renderJson(route));
  }

  if (command === "dry-run") {
    const route = await readJson(required(args, "route"));
    const policy = await loadPolicy(args.policy);
    const plan = buildDryRun(route, policy);
    return output(args, args.format === "json" ? renderJson(plan) : renderMarkdownDryRun(plan));
  }

  if (command === "explain") {
    const route = await readJson(required(args, "route"));
    return output(args, args.format === "json" ? renderJson(route) : renderMarkdownRoute(route));
  }

  throw new Error(`Unknown command: ${command}`);
}

function parseArgs(values) {
  const args = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    if (key === "help") {
      args.help = true;
    } else {
      args[key] = values[index + 1];
      index += 1;
    }
  }
  return args;
}

function required(args, key) {
  if (!args[key]) throw new Error(`Missing --${key}`);
  return args[key];
}

async function output(args, text) {
  if (args.out) await writeFile(args.out, text, "utf8");
  else process.stdout.write(text);
}

function usage() {
  process.stdout.write(`connector-plan

Commands:
  route --task task.json --connectors dir [--policy policy.json] [--format json|markdown]
  dry-run --route route.json [--policy policy.json] [--format markdown|json]
  explain --route route.json [--format markdown|json]
`);
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
