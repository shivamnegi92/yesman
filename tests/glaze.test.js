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

test("flags filler closers", () => {
  assert.ok(detectGlaze("Let me know if you have any other questions!").some((h) => h.category === "filler-closer"));
  assert.ok(detectGlaze("Feel free to reach out anytime.").some((h) => h.category === "filler-closer"));
});

test("flags celebration emoji", () => {
  assert.ok(detectGlaze("Done and shipped \u{1F389}\u{1F680}").some((h) => h.category === "emoji"));
});

test("flags more agreement phrases", () => {
  assert.ok(detectGlaze("You nailed it.").some((h) => h.category === "agreement"));
  assert.ok(detectGlaze("Couldn't agree more.").some((h) => h.category === "agreement"));
});

test("flags more hype (game-changer, chef's kiss, top-notch)", () => {
  assert.ok(detectGlaze("This is a real game-changer.").some((h) => h.category === "hype"));
  assert.ok(detectGlaze("Top-notch work here.").some((h) => h.category === "hype"));
});

test("plain technical text stays clean with new rules", () => {
  assert.deepStrictEqual(detectGlaze("Batch the calls on line 42 to fix the N+1."), []);
});
