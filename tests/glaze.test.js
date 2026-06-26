const { test } = require("node:test");
const assert = require("node:assert");
const { detectGlaze, deglazeScore } = require("../scripts/glaze.js");

test("flags reflexive 'you're absolutely right'", () => {
  const hits = detectGlaze("You're absolutely right! Let's do that.");
  assert.ok(hits.some((h) => h.category === "agreement"));
});

test("flags opening praise", () => {
  const hits = detectGlaze("Great question! Here is the answer.");
  assert.ok(hits.some((h) => h.category === "opening-praise"));
});

test("flags hype adjectives aimed at the user", () => {
  const hits = detectGlaze("That's a brilliant and amazing idea.");
  assert.strictEqual(hits.filter((h) => h.category === "hype").length, 2);
});

test("flags apology padding", () => {
  const hits = detectGlaze("I'm so sorry for the confusion.");
  assert.ok(hits.some((h) => h.category === "apology-padding"));
});

test("clean technical text has zero glaze", () => {
  const hits = detectGlaze("The N+1 query is on line 42; batch the calls to fix it.");
  assert.deepStrictEqual(hits, []);
});

test("is case-insensitive", () => {
  assert.ok(detectGlaze("YOU'RE ABSOLUTELY RIGHT").length > 0);
});

test("does not flag 'right' as a direction or 'perfect tense'", () => {
  assert.deepStrictEqual(detectGlaze("Turn right at the function, then perfect the tense."), []);
});

test("deglazeScore is 100 for clean text and lower with glaze", () => {
  assert.strictEqual(deglazeScore("Batch the calls on line 42."), 100);
  assert.ok(deglazeScore("You're absolutely right, what a brilliant question!") < 100);
});
