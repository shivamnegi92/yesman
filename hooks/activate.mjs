#!/usr/bin/env node
// Inject the unglaze ruleset at session start. Best-effort, dependency-free.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const BEGIN = "<!-- UNGLAZE:BEGIN -->";
const END = "<!-- UNGLAZE:END -->";
const VALID = new Set(["lite", "full", "ultra", "off"]);
let mode = (process.env.UNGLAZE_DEFAULT_MODE || "full").toLowerCase();
if (!VALID.has(mode)) mode = "full";

try {
  if (mode === "off") process.exit(0);
  const text = readFileSync(join(here, "..", "rules", "unglaze.md"), "utf8");
  const s = text.indexOf(BEGIN);
  const e = text.indexOf(END);
  if (s === -1 || e === -1) process.exit(0);
  const block = text.slice(s + BEGIN.length, e).trim();
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: `unglaze is active (mode: ${mode}).\n\n${block}`,
    },
  }));
} catch {
  // stay quiet; never break a session over an optional nudge
}
process.exit(0);
