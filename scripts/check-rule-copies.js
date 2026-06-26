#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { checkCopies } = require("./lib.js");
const { listAdapterFiles, CANONICAL, ROOT } = require("./sync-rules.js");

const canonicalText = fs.readFileSync(CANONICAL, "utf8");
const copies = {};
for (const rel of listAdapterFiles()) {
  const full = path.join(ROOT, rel);
  copies[rel] = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : "";
}

const { ok, mismatches } = checkCopies(canonicalText, copies);
if (ok) {
  console.log(`OK: all ${Object.keys(copies).length} rule copies match the canonical block`);
  process.exit(0);
}
console.error("DRIFT: these copies no longer match rules/unglaze.md:");
for (const m of mismatches) console.error("  - " + m);
console.error('\nRun "npm run sync" to regenerate them.');
process.exit(1);
