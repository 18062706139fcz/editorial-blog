#!/usr/bin/env node
import { chmodSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

function runGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

if (process.env.CI) {
  console.log("Skipping git hook installation in CI.");
  process.exit(0);
}

try {
  runGit(["rev-parse", "--is-inside-work-tree"]);
} catch {
  console.log("Skipping git hook installation outside a git worktree.");
  process.exit(0);
}

if (!existsSync(".githooks/pre-commit")) {
  console.log("Skipping git hook installation: .githooks/pre-commit not found.");
  process.exit(0);
}

chmodSync(".githooks/pre-commit", 0o755);

const current = (() => {
  try {
    return runGit(["config", "--get", "core.hooksPath"]);
  } catch {
    return "";
  }
})();

if (current !== ".githooks") {
  runGit(["config", "core.hooksPath", ".githooks"]);
  console.log("Configured git hooks path: .githooks");
} else {
  console.log("Git hooks path already configured: .githooks");
}
