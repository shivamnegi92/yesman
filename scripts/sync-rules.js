"use strict";

const fs = require("fs");
const path = require("path");

const ADAPTERS = [
  { file: "AGENTS.md", pre: "# unglaze — stop the AI from glazing you\n\n", post: "\n\n(Yes, this applies to agents working on the unglaze repo itself.)\n" },
  { file: ".cursor/rules/unglaze.mdc", pre: "---\ndescription: unglaze — no flattery, no sycophancy\nalwaysApply: true\n---\n\n", post: "\n" },
  { file: ".windsurf/rules/unglaze.md", pre: "---\ntrigger: always_on\n---\n\n# unglaze\n\n", post: "\n" },
  { file: ".clinerules/unglaze.md", pre: "# unglaze\n\n", post: "\n" },
  { file: ".kiro/steering/unglaze.md", pre: "---\ninclusion: always\n---\n\n# unglaze\n\n", post: "\n" },
  { file: ".github/copilot-instructions.md", pre: "# unglaze — stop the AI from glazing you\n\n", post: "\n" },
];

const ROOT = path.join(__dirname, "..");
const CANONICAL = path.join(ROOT, "rules", "unglaze.md");

function listAdapterFiles() {
  return ADAPTERS.map((a) => a.file);
}

function blockWithSentinels() {
  const { extractBlock, BEGIN, END } = require("./lib.js");
  const body = extractBlock(fs.readFileSync(CANONICAL, "utf8"));
  if (body === null) throw new Error("canonical rules/unglaze.md has no block");
  return `${BEGIN}\n${body}\n${END}`;
}

function sync() {
  const block = blockWithSentinels();
  for (const a of ADAPTERS) {
    const target = path.join(ROOT, a.file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, a.pre + block + a.post);
    console.log("wrote", a.file);
  }
}

module.exports = { ADAPTERS, listAdapterFiles, CANONICAL, ROOT };

if (require.main === module) sync();
