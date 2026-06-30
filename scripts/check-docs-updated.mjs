#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const staged = args.has("--staged");

function runGit(gitArgs) {
  return execFileSync("git", gitArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryGit(gitArgs) {
  try {
    return runGit(gitArgs);
  } catch {
    return "";
  }
}

function splitFiles(output) {
  return output
    .split("\n")
    .map((file) => file.trim().replaceAll("\\", "/"))
    .filter(Boolean);
}

function baseRef() {
  if (process.env.DOCS_CHECK_BASE) return process.env.DOCS_CHECK_BASE;
  if (process.env.GITHUB_BASE_REF) return `origin/${process.env.GITHUB_BASE_REF}`;
  return "origin/main";
}

function changedFiles() {
  if (staged) {
    return splitFiles(runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]));
  }

  const base = baseRef();
  let mergeBase = tryGit(["merge-base", "HEAD", base]);
  if (!mergeBase && base.startsWith("origin/")) {
    tryGit(["fetch", "origin", base.slice("origin/".length), "--depth=1"]);
    mergeBase = tryGit(["merge-base", "HEAD", base]);
  }

  if (!mergeBase) {
    console.error(`Unable to resolve docs check base '${base}'.`);
    console.error("Set DOCS_CHECK_BASE to a valid git ref and retry.");
    process.exit(2);
  }

  return [
    ...new Set([
      ...splitFiles(runGit(["diff", "--name-only", "--diff-filter=ACMR", `${mergeBase}...HEAD`])),
      ...splitFiles(runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"])),
      ...splitFiles(runGit(["diff", "--name-only", "--diff-filter=ACMR"])),
      ...splitFiles(runGit(["ls-files", "--others", "--exclude-standard"])),
    ]),
  ];
}

function isDocumentationFile(file) {
  return (
    file === "README.md" ||
    /^README\.[\w-]+\.md$/.test(file) ||
    file === "CONTRIBUTING.md" ||
    file === "CLAUDE.md" ||
    file === ".github/pull_request_template.md" ||
    file.startsWith("docs/") ||
    file.endsWith("/AGENTS.md") ||
    file === "AGENTS.md"
  );
}

function isMaterialSourceFile(file) {
  return (
    file.startsWith("app/") ||
    file.startsWith("components/") ||
    file.startsWith("lib/") ||
    file.startsWith("prisma/") ||
    file.startsWith("scripts/") ||
    file.startsWith(".github/workflows/") ||
    [
      "middleware.ts",
      "next.config.js",
      "tailwind.config.ts",
      "postcss.config.js",
      "package.json",
      "package-lock.json",
      "Dockerfile",
      "docker-compose.yml",
    ].includes(file)
  );
}

const files = changedFiles();
const sourceFiles = files.filter(isMaterialSourceFile);
const documentationFiles = files.filter(isDocumentationFile);

if (!files.length) {
  console.log("Docs check: no changed files.");
  process.exit(0);
}

if (!sourceFiles.length) {
  console.log("Docs check: no material source changes detected.");
  process.exit(0);
}

if (documentationFiles.length) {
  console.log("Docs check: documentation touched for material changes.");
  console.log(documentationFiles.map((file) => `- ${file}`).join("\n"));
  process.exit(0);
}

console.error("Docs check failed: material source changes need a documentation update.");
console.error("");
console.error("Material files:");
console.error(sourceFiles.map((file) => `- ${file}`).join("\n"));
console.error("");
console.error("Update one of these when behavior, workflow, setup, or agent expectations change:");
console.error("- README.md or README.zh-CN.md");
console.error("- CONTRIBUTING.md");
console.error("- AGENTS.md / nested AGENTS.md / CLAUDE.md");
console.error("- docs/**");
console.error("- .github/pull_request_template.md");
process.exit(1);
