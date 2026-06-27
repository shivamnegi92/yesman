#!/usr/bin/env node
"use strict";

// yesman CLI: score text (or files, or stdin) for glaze.
//   echo "You're absolutely right!" | npx yesman
//   npx yesman README.md
const fs = require("fs");
const { detectGlaze, deglazeScore } = require("./glaze.js");

function report(label, text) {
  const hits = detectGlaze(text);
  const score = deglazeScore(text);
  console.log(`\n${label}  deglaze score: ${score}/100`);
  if (hits.length === 0) {
    console.log("  clean -- no glaze detected.");
    return hits.length;
  }
  for (const h of hits) console.log(`  [${h.category}] "${h.phrase}"`);
  return hits.length;
}

function main() {
  const args = process.argv.slice(2);
  let total = 0;
  if (args.length === 0) {
    const stdin = fs.readFileSync(0, "utf8");
    total += report("(stdin)", stdin);
  } else {
    for (const f of args) total += report(f, fs.readFileSync(f, "utf8"));
  }
  console.log("");
  process.exit(total === 0 ? 0 : 1);
}

main();
