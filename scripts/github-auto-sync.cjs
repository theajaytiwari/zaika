const { execFileSync } = require("node:child_process");
const { watch } = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const ignoredFolders = new Set([".git", "node_modules", "dist", "coverage", ".vite"]);
let timer;
let syncing = false;
let queued = false;

function runGit(args, options = {}) {
  return execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: options.quiet ? "pipe" : "inherit",
  });
}

function hasOrigin() {
  try {
    return Boolean(execFileSync("git", ["remote", "get-url", "origin"], { cwd: projectRoot, encoding: "utf8", stdio: "pipe" }).trim());
  } catch {
    return false;
  }
}

function isIgnored(filename) {
  if (!filename) return false;
  const parts = filename.split(path.sep);
  return parts.some((part) => ignoredFolders.has(part)) || parts.includes(".env") || filename.endsWith(".log");
}

function scheduleSync() {
  clearTimeout(timer);
  timer = setTimeout(sync, 2500);
}

function sync() {
  if (syncing) { queued = true; return; }
  if (!hasOrigin()) {
    console.log("[Zaika sync] Waiting for a GitHub origin remote before the first push.");
    return;
  }

  syncing = true;
  try {
    runGit(["add", "-A"]);
    try {
      runGit(["diff", "--cached", "--quiet"], { quiet: true });
      return;
    } catch (error) {
      if (error.status !== 1) throw error;
    }

    const stamp = new Date().toLocaleString("en-IN", { hour12: false });
    runGit(["commit", "-m", `chore: auto-sync ${stamp}`]);
    runGit(["push", "origin", "HEAD"]);
    console.log("[Zaika sync] Changes pushed to GitHub.");
  } catch (error) {
    console.error("[Zaika sync] Push failed. Your local changes remain safe; check GitHub authentication or connection.");
  } finally {
    syncing = false;
    if (queued) { queued = false; scheduleSync(); }
  }
}

console.log("[Zaika sync] Watching this project. Every saved change will be committed and pushed after 2.5 seconds.");
console.log("[Zaika sync] Use Ctrl+C in the VS Code task terminal to stop it.");
watch(projectRoot, { recursive: true }, (_event, filename) => {
  if (!isIgnored(filename)) scheduleSync();
});
