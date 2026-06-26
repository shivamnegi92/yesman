"use strict";

const BEGIN = "<!-- UNGLAZE:BEGIN -->";
const END = "<!-- UNGLAZE:END -->";

function extractBlock(text) {
  const s = text.indexOf(BEGIN);
  const e = text.indexOf(END);
  if (s === -1 || e === -1 || e < s) return null;
  return text.slice(s + BEGIN.length, e).trim();
}

function checkCopies(canonicalText, copies) {
  const want = extractBlock(canonicalText);
  const mismatches = [];
  for (const [path, text] of Object.entries(copies)) {
    if (extractBlock(text) !== want) mismatches.push(path);
  }
  return { ok: mismatches.length === 0, mismatches };
}

module.exports = { extractBlock, checkCopies, BEGIN, END };
