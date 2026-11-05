#!/usr/bin/env python3
"""Statische controles op de zelfstandige WiHTML-proefversie."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

class Extract(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_script = False
        self.scripts = []
    def handle_starttag(self, tag, attrs):
        if tag == "script" and not dict(attrs).get("src"):
            self.in_script = True
    def handle_endtag(self, tag):
        if tag == "script":
            self.in_script = False
    def handle_data(self, data):
        if self.in_script:
            self.scripts.append(data)

p = Extract()
p.feed(HTML)
assert p.scripts, "Geen JavaScript gevonden"
script = "\n".join(p.scripts)
with tempfile.TemporaryDirectory() as d:
    f = Path(d) / "site.js"
    f.write_text(script, encoding="utf-8")
    subprocess.run(["node", "--check", str(f)], check=True)

for part in ('id="viewer"', 'id="preview"', 'id="export"', 'id="toolbtn"', 'id="draw"', 'id="slidecontent"'):
    assert part in HTML, f"Ontbrekende component: {part}"
assert "aspect-ratio:16/9" in HTML, "Presentatie mist vaste beeldverhouding"
assert "const SAMPLE=" in HTML, "Voorbeeldles ontbreekt"
assert "window.LESSON" not in HTML, "Onverwachte afhankelijkheid"
assert "const source=document.documentElement.outerHTML" in HTML, "HTML-export ontbreekt"
assert "EAI" in HTML or "EAI" in (ROOT / "docs/ontwerpafspraken.md").read_text()
print("Statische HTML- en JavaScript-controles geslaagd.")
