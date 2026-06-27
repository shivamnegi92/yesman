"use strict";

// Patterns grouped by glaze category. Deliberately conservative: we would
// rather miss a borderline phrase than flag honest technical writing.
const PATTERNS = {
  "agreement": [
    /\b(?:you'?re|you are)\s+(?:absolutely\s+|totally\s+|completely\s+)?right\b/gi,
    /\babsolutely\s+right\b/gi,
    /\bspot[\s-]on\b/gi,
    /\bexactly!/gi,
    /\b100%\s*(?:right|correct|agree)?/gi,
    /\byou\s+nailed\s+it\b/gi,
    /\byou\s+crushed\s+it\b/gi,
    /\bcouldn'?t\s+agree\s+more\b/gi,
    /\bwell\s+said\b/gi,
  ],
  "opening-praise": [
    /\bgreat\s+question\b/gi,
    /\bexcellent\s+(?:point|question)\b/gi,
    /\bgreat\s+point\b/gi,
    /\bgood\s+catch\b/gi,
    /\bi\s+love\s+(?:this|that|it)\b/gi,
  ],
  "hype": [
    /\b(?:brilliant|amazing|fantastic|incredible|awesome|genius|stellar|superb|phenomenal)\b/gi,
    /\bgame[\s-]?changer\b/gi,
    /\btop[\s-]notch\b/gi,
    /\bnext[\s-]level\b/gi,
    /\bworld[\s-]class\b/gi,
    /\bchef'?s\s+kiss\b/gi,
  ],
  "apology-padding": [
    /\b(?:i'?m|i am)\s+(?:so|really|deeply|terribly)\s+sorry\b/gi,
    /\bmy\s+(?:sincere\s+)?apolog(?:y|ies)\b/gi,
    /\bi\s+deeply\s+apologize\b/gi,
  ],
  "closing-flattery": [
    /\byou'?ve\s+got\s+this\b/gi,
    /\bgreat\s+work\b/gi,
    /\bkeep\s+up\s+the\s+(?:great|good)\s+work\b/gi,
  ],
  "filler-closer": [
    /\blet\s+me\s+know\s+if\s+you\s+(?:have|need)\b/gi,
    /\bfeel\s+free\s+to\s+(?:ask|reach\s+out|let\s+me\s+know)\b/gi,
    /\bhope\s+this\s+helps\b/gi,
    /\bhappy\s+to\s+help\b/gi,
  ],
  "emoji": [
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu,
  ],
};

/**
 * Find glaze in a string.
 * @param {string} text
 * @returns {{phrase: string, category: string, index: number}[]}
 */
function detectGlaze(text) {
  const hits = [];
  for (const [category, regexes] of Object.entries(PATTERNS)) {
    for (const re of regexes) {
      for (const m of text.matchAll(re)) {
        hits.push({ phrase: m[0].trim(), category, index: m.index });
      }
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

/**
 * 100 = no glaze; each hit costs 15 points, floored at 0.
 * @param {string} text
 * @returns {number}
 */
function deglazeScore(text) {
  return Math.max(0, 100 - detectGlaze(text).length * 15);
}

module.exports = { detectGlaze, deglazeScore, PATTERNS };
