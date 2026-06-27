const { test } = require("node:test");
const assert = require("node:assert");
const { extractBlock, checkCopies } = require("../scripts/lib.js");

test("extractBlock pulls trimmed text between sentinels", () => {
  const s = "x\n<!-- YESMAN:BEGIN -->\n  body  \n<!-- YESMAN:END -->\ny";
  assert.strictEqual(extractBlock(s), "body");
});

test("extractBlock returns null without sentinels", () => {
  assert.strictEqual(extractBlock("nope"), null);
});

test("checkCopies passes when blocks match", () => {
  const c = "<!-- YESMAN:BEGIN -->\nR\n<!-- YESMAN:END -->";
  const copies = { "a": "p\n" + c + "\nq", "b": c };
  assert.deepStrictEqual(checkCopies(c, copies), { ok: true, mismatches: [] });
});

test("checkCopies reports drift", () => {
  const c = "<!-- YESMAN:BEGIN -->\nR\n<!-- YESMAN:END -->";
  const copies = { "drift": "<!-- YESMAN:BEGIN -->\nWRONG\n<!-- YESMAN:END -->" };
  assert.deepStrictEqual(checkCopies(c, copies), { ok: false, mismatches: ["drift"] });
});
