---
name: unglaze-check
description: >
  Scan the last response (or a pasted one) for glazing: opening praise, hype
  adjectives, reflexive "you're absolutely right", apology padding, and closing
  flattery. Returns the offending phrases and a deglazed rewrite. Use when the
  user says "unglaze check", "did you just glaze me", or "rewrite without the
  flattery".
license: MIT
---

# unglaze: check

Audit a response for glazing and hand back a clean version.

1. Scan for the banned patterns:
   - opening praise ("great question", "excellent point", "good catch")
   - reflexive agreement ("you're absolutely right", "exactly", "spot on")
   - hype adjectives (amazing, brilliant, perfect, incredible, awesome, genius)
   - apology padding ("I'm so sorry", "my sincere apologies")
   - closing flattery ("you've got this", "great work")
2. List each hit with the exact phrase.
3. Rewrite the response with every hit removed, leading with the substance.

If there are zero hits, say "clean — no glaze" and stop. Don't manufacture
problems.
