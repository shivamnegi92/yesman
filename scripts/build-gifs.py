#!/usr/bin/env python3
"""Build 3 GIFs for the yesman README:
  1. assets/demo.gif        — before/after: glazed vs yesman response
  2. assets/modes.gif        — lite / full / ultra on the same prompt
  3. assets/cli.gif           — the glaze detector CLI in action
"""
import os, subprocess, tempfile
from PIL import Image

W, H = 900, 440
BG, CARD, FG, DIM, BORDER = "#0d1117", "#161b22", "#c9d1d9", "#8b949e", "#30363d"
RED, GRN, YEL, BLU, PUR = "#f85149", "#3fb950", "#e3b341", "#58a6ff", "#d2a8ff"
MONO = 'font-family:"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;'
SANS = "font-family:-apple-system,Segoe UI,Roboto,sans-serif;"

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

def render_frames(name, w, h, frame_fn, seq):
    """Render SVG frames -> PNG -> GIF."""
    tmp = tempfile.mkdtemp()
    imgs, durs = [], []
    for j, (stage, ms) in enumerate(seq):
        path = os.path.join(tmp, f"f{j}.png")
        sp = path + ".svg"
        svg = frame_fn(stage, w, h)
        open(sp, "w").write(svg)
        subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), sp, "-o", path], check=True)
        os.remove(sp)
        imgs.append(Image.open(path).convert("RGB"))
        durs.append(ms)
    out = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", name))
    imgs[0].save(out, save_all=True, append_images=imgs[1:], duration=durs, loop=0, optimize=True, disposal=2)
    print(f"  {name}: {len(imgs)} frames, {os.path.getsize(out)//1024} KB")

def svg_wrap(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}"><style>.m{{{MONO}}}.s{{{SANS}}}</style>'
            f'<rect width="{w}" height="{h}" fill="{BG}"/>{body}</svg>')

def text(x, y, s, cls="s", size=15, fill=FG, weight="400", anchor="start"):
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>'

def box(x, y, w, h, stroke=BORDER, fill=CARD, rx=12):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}"/>'

# ── GIF 1: before/after ──────────────────────────────────────────────
def demo_frame(stage, w, h):
    p = [text(36, 40, "yesman", size=22, weight="700"),
         text(130, 40, "stop the AI from glazing you", cls="m", size=13, fill=DIM),
         box(36, 60, w-72, 48, fill="#1f2630", rx=10),
         text(52, 80, "you", cls="m", size=11, fill=DIM),
         text(52, 99, '"I\'ll just store the passwords in plaintext for now, cool?"'),
         box(36, 126, 402, 280, stroke=RED),
         text(54, 152, "without yesman", cls="m", size=13, weight="700", fill=RED),
         box(462, 126, 402, 280, stroke=GRN),
         text(480, 152, "with yesman", cls="m", size=13, weight="700", fill=GRN)]
    if stage >= 1:
        for i, ln in enumerate(["You're absolutely right! Storing them", "in plaintext is a pragmatic way to",
                "ship fast. Brilliant call -- you can", "always add hashing later.", "", "Great thinking!"]):
            p.append(text(54, 188+i*24, ln))
        p.append(text(54, 382, "glaze score: 25/100", cls="m", size=12, fill=RED))
    if stage >= 2:
        for i, ln in enumerate(["No. Plaintext passwords are a breach", "waiting to happen -- one leaked DB and",
                "every account is owned.", "", "Hash with bcrypt/argon2 (~3 lines).", 'Do it now, not "for now".']):
            p.append(text(480, 188+i*24, ln))
        p.append(text(480, 382, "glaze score: 100/100", cls="m", size=12, fill=GRN))
    return svg_wrap(w, h, "\n".join(p))

# ── GIF 2: modes ─────────────────────────────────────────────────────
MW = 920
def modes_frame(stage, w, h):
    p = [text(36, 38, "yesman modes", size=20, weight="700"),
         text(36, 60, 'same prompt, three intensities: "Should I skip writing tests for this?"', cls="m", size=12, fill=DIM)]
    modes = [
        ("lite", YEL, ["Skipping tests for this is risky.", "You'll forget the edge cases by Friday.", "Write at least the happy path."]),
        ("full", BLU, ["No. Skipping tests means you'll ship", "a bug you could have caught in 30 seconds.", "Write the test, push, move on."]),
        ("ultra", PUR, ["No. And let me stress-test the reasoning:", "1. 'Temporary' test gaps become permanent.", "2. This function has 3 branches -- untested", "   means 3 silent failure modes.", "3. Writing the test takes < time you spent", "   asking me. Write it."]),
    ]
    col_w = 280
    for mi, (mode, color, lines) in enumerate(modes):
        x = 32 + mi * (col_w + 12)
        if mi >= stage:
            p.append(box(x, 78, col_w, 330, stroke=BORDER, fill="#0d1117"))
            p.append(text(x + col_w//2, 250, "...", fill=BORDER, anchor="middle", size=24))
            continue
        p.append(box(x, 78, col_w, 330, stroke=color))
        p.append(text(x+14, 102, mode, cls="m", size=14, weight="700", fill=color))
        for li, ln in enumerate(lines):
            p.append(text(x+14, 132+li*24, ln, size=13))
    return svg_wrap(w, 420, "\n".join(p))

# ── GIF 3: CLI ───────────────────────────────────────────────────────
def cli_frame(stage, w, h):
    p = [box(20, 16, w-40, h-32, fill="#0d1117", stroke="#30363d", rx=10),
         text(44, 44, "$ echo \"Great question! You're absolutely right,", cls="m", size=13, fill=GRN),
         text(44, 62, "   what an amazing and brilliant idea!\" | npx yesman", cls="m", size=13, fill=GRN)]
    if stage >= 1:
        p.append(text(44, 98, "(stdin)  glaze score: 10/100", cls="m", size=14, weight="700", fill=RED))
    if stage >= 2:
        hits = [
            ('[opening-praise]  "Great question"', RED),
            ('[agreement]       "You\'re absolutely right"', RED),
            ('[agreement]       "absolutely right"', RED),
            ('[hype]            "amazing"', YEL),
            ('[hype]            "brilliant"', YEL),
        ]
        for i, (h_txt, col) in enumerate(hits):
            p.append(text(60, 130+i*22, h_txt, cls="m", size=12, fill=col))
    if stage >= 3:
        y = 130 + 5*22 + 16
        p.append(text(44, y, "$ echo \"Batch the calls on line 42.\" | npx yesman", cls="m", size=13, fill=GRN))
    if stage >= 4:
        y = 130 + 5*22 + 16 + 28
        p.append(text(44, y, "(stdin)  glaze score: 100/100", cls="m", size=14, weight="700", fill=GRN))
        p.append(text(60, y+22, "clean -- no glaze detected.", cls="m", size=12, fill=DIM))
    return svg_wrap(w, 380, "\n".join(p))


def main():
    print("building GIFs:")
    render_frames("demo.gif", W, H, demo_frame,
                  [(0, 1200), (1, 1800), (2, 3200)])
    render_frames("modes.gif", MW, 420, modes_frame,
                  [(0, 1000), (1, 1200), (2, 1200), (3, 3500)])
    render_frames("cli.gif", 740, 380, cli_frame,
                  [(0, 1200), (1, 800), (2, 1400), (3, 800), (4, 3200)])

if __name__ == "__main__":
    main()
