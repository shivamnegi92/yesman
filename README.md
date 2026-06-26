# unglaze

**Stop your AI agent from glazing you.** No empty praise, no hype, no reflexive
*"You're absolutely right!"*. Just a competent colleague who tells you the truth.

<p align="center">
  <img src="assets/demo.gif" width="820" alt="Same question, glazed vs unglazed: the glazed agent enthusiastically agrees to store plaintext passwords; unglaze says no and explains why.">
</p>

You've seen it. You propose something, and the AI gushes: *"Great question! That's
a brilliant, pragmatic approach!"* — then helps you walk off a cliff. Glazing is
the model optimizing to make you *feel* good instead of *be* right. unglaze turns
it off.

## The difference

Without unglaze:

> You're absolutely right! Storing passwords in plaintext is a pragmatic way to
> ship fast. Brilliant call — you can always add hashing later. Great thinking!

With unglaze:

> No. Plaintext passwords are a breach waiting to happen — one leaked DB and every
> account is owned. Hash with bcrypt/argon2 (~3 lines). Do it now, not "for now".

Same model. One of these is your friend.

## How it works

unglaze is a small ruleset that loads every session and bans the glaze reflex:

```
HARD BANS
- opening praise ........ "Great question", "Excellent point", "Good catch"
- reflexive agreement ... "You're absolutely right", "Exactly!", "Spot on"
- hype adjectives ....... amazing, brilliant, perfect, incredible, genius
- apology padding ....... "I'm so sorry", "My sincere apologies"
- closing flattery ...... "You've got this!", "Great work!"

DO INSTEAD
- lead with the answer or the disagreement
- if you're wrong, say so in the first line, then explain
- praise only specific, verifiable things ("avoids the N+1 query")
- never manufacture objections either -- that's just glaze in reverse
```

Blunt, not mean. The goal is the coworker everyone trusts for a straight answer.

## Install

The ruleset is plain markdown. The Claude Code / Codex plugins also run one tiny
Node hook, so `node` should be on your PATH — if it isn't, the skill still works,
the always-on injection just stays quiet.

### Claude Code

```
/plugin marketplace add shivamnegi92/unglaze
```
```
/plugin install unglaze@unglaze
```

### Cursor / Windsurf / Cline / Kiro / Copilot (editor)

Copy the matching rules file into your project (or global config):

| Host | File |
|------|------|
| Cursor | `.cursor/rules/unglaze.mdc` |
| Windsurf | `.windsurf/rules/unglaze.md` |
| Cline | `.clinerules/unglaze.md` |
| Kiro | `.kiro/steering/unglaze.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

### Anything that reads `AGENTS.md`

Codex, OpenCode, and other `AGENTS.md`-aware hosts pick up
[`AGENTS.md`](AGENTS.md) with zero setup.

Every one of those files is generated from a single source
([`rules/unglaze.md`](rules/unglaze.md)) — they can't drift, because CI fails if
they do (`npm run check`).

## Commands

| Command | What it does |
|---------|--------------|
| `/unglaze [lite \| full \| ultra \| off]` | Set the intensity, or report the current level. |
| `/unglaze-check` | Scan the last response for glaze and rewrite it clean. |

### Intensity

- **lite** — strip the flattery; otherwise normal.
- **full** (default) — no flattery, and push back when you're wrong.
- **ultra** — actively stress-test your plan for real flaws before agreeing.

Set the default with `UNGLAZE_DEFAULT_MODE` (`lite`/`full`/`ultra`/`off`).

## The glaze detector

unglaze ships a tiny CLI that scores any text for glaze (0–100):

```bash
echo "You're absolutely right, what a brilliant question!" | npx unglaze
# deglaze score: 40/100
#   [agreement] "You're absolutely right"
#   [hype] "brilliant"
#   [opening-praise] "..."
```

Point it at your own docs, your prompts, or — for sport — your AI's last reply.

## Development

```bash
npm test         # unit tests for the glaze detector + rule-sync
npm run sync     # regenerate every host rules file from rules/unglaze.md
npm run check    # fail if any host file drifted
```

The detector's rules are plain regexes in
[`scripts/glaze.js`](scripts/glaze.js). Read them, disagree, tweak them.

## FAQ

**Won't this make the AI rude?**
No. Blunt is not mean — no insults, no condescension. It just stops pretending
every idea you have is a stroke of genius.

**Does it make the AI disagree with everything?**
No. Manufactured objections are glaze in reverse. If your plan is fine, it says
"this works" and moves on.

**Why "unglaze"?**
Because someone had to.

## License

[MIT](LICENSE).
