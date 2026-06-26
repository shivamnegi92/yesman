#!/usr/bin/env python3
"""Build assets/demo.gif: the same question, glazed vs unglazed.

SVG frames -> PNG (rsvg-convert) -> GIF (Pillow). No ffmpeg/gifski.
"""
import os, subprocess, tempfile
from PIL import Image

W, H = 900, 440
BG, CARD, FG, DIM, BORDER = "#0d1117", "#161b22", "#c9d1d9", "#8b949e", "#30363d"
RED, GRN = "#f85149", "#3fb950"
MONO = 'font-family:"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;'
SANS = "font-family:-apple-system,Segoe UI,Roboto,sans-serif;"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def frame(stage):
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
        f'<style>.m{{{MONO}}}.s{{{SANS}}}</style>',
        f'<rect width="{W}" height="{H}" fill="{BG}"/>',
        f'<text x="36" y="40" class="s" font-size="20" font-weight="700" fill="{FG}">unglaze</text>',
        f'<text x="120" y="40" class="m" font-size="13" fill="{DIM}">stop the AI from glazing you</text>',
        # user prompt
        f'<rect x="36" y="60" width="{W-72}" height="48" rx="10" fill="#1f2630"/>',
        f'<text x="52" y="80" class="m" font-size="11" fill="{DIM}">you</text>',
        f'<text x="52" y="99" class="s" font-size="15" fill="{FG}">"I\'ll just store the passwords in plaintext for now, cool?"</text>',
    ]
    # without unglaze (left, red)
    p.append(f'<rect x="36" y="126" width="402" height="270" rx="12" fill="{CARD}" stroke="{RED}"/>')
    p.append(f'<text x="54" y="152" class="m" font-size="13" font-weight="700" fill="{RED}">without unglaze</text>')
    if stage >= 1:
        for i, line in enumerate([
            "You're absolutely right! Storing them",
            "in plaintext is a pragmatic way to",
            "ship fast. Brilliant call -- you can",
            "always add hashing later.",
            "Great thinking!",
        ]):
            p.append(f'<text x="54" y="{188+i*26}" class="s" font-size="15" fill="{FG}">{esc(line)}</text>')
        p.append(f'<text x="54" y="372" class="m" font-size="12" fill="{RED}">glaze score: 40/100</text>')
    # with unglaze (right, green)
    p.append(f'<rect x="462" y="126" width="402" height="270" rx="12" fill="{CARD}" stroke="{GRN}"/>')
    p.append(f'<text x="480" y="152" class="m" font-size="13" font-weight="700" fill="{GRN}">with unglaze</text>')
    if stage >= 2:
        for i, line in enumerate([
            "No. Plaintext passwords are a breach",
            "waiting to happen -- one leaked DB and",
            "every account is owned.",
            "Hash with bcrypt/argon2 (~3 lines).",
            "Do it now, not \"for now\".",
        ]):
            p.append(f'<text x="480" y="{188+i*26}" class="s" font-size="15" fill="{FG}">{esc(line)}</text>')
        p.append(f'<text x="480" y="372" class="m" font-size="12" fill="{GRN}">glaze score: 100/100</text>')
    p.append("</svg>")
    return "\n".join(p)


def main():
    tmp = tempfile.mkdtemp()
    imgs, durs = [], []
    for j, (stage, ms) in enumerate([(0, 1100), (1, 1800), (2, 3200)]):
        path = os.path.join(tmp, f"f{j}.png")
        sp = path + ".svg"
        open(sp, "w").write(frame(stage))
        subprocess.run(["rsvg-convert", "-w", str(W), "-h", str(H), sp, "-o", path], check=True)
        os.remove(sp)
        imgs.append(Image.open(path).convert("RGB"))
        durs.append(ms)
    out = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "demo.gif"))
    imgs[0].save(out, save_all=True, append_images=imgs[1:], duration=durs, loop=0, optimize=True, disposal=2)
    print("wrote", out, f"({len(imgs)} frames, {os.path.getsize(out)//1024} KB)")


if __name__ == "__main__":
    main()
