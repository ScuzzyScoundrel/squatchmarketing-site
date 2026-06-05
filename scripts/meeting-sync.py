#!/usr/bin/env python3
"""
meeting-sync.py — turn Gemini meeting .docx notes into Clerri hub tasks.

Scans a folder of Gemini-exported .docx meeting notes, extracts each meeting's
"Next steps" into checkable, owner-tagged task items, and AUTO-APPENDS an Astro
card into src/pages/clerri/meetings.astro — skipping any doc already imported
(idempotent, tracked by a `<!-- doc:FILENAME -->` marker in the page).

Usage:
    python3 scripts/meeting-sync.py             # append new docs to meetings.astro
    python3 scripts/meeting-sync.py --dry-run   # show what WOULD be added, write nothing

Env:
    MEETING_DOCS_DIR   override the docs folder (default: /home/jerris/Clerri/meeting docs)

No third-party deps — stdlib zipfile + xml only. A .docx is a zip of XML.
"""
import sys, os, re, html, zipfile, glob
import xml.etree.ElementTree as ET

DOCS_DIR = os.environ.get("MEETING_DOCS_DIR", "/home/jerris/Clerri/meeting docs")
PAGE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "src", "pages", "clerri", "meetings.astro"))
ANCHOR = "<!-- AUTO-APPEND ANCHOR"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
TASK_RE = re.compile(r'^\[(?P<owner>[^\]]+)\]\s*(?P<title>[^:]+):\s*(?P<desc>.+)$')


def docx_paragraphs(path):
    """Return the document's paragraphs as a list of strings (blanks kept)."""
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    return ["".join(t.text or "" for t in p.iter(W + "t")).strip() for p in root.iter(W + "p")]


def section(paras, name, stops):
    """Lines under heading `name` until any heading in `stops`."""
    out, capturing = [], False
    for line in paras:
        if line.lower() == name.lower():
            capturing = True
            continue
        if capturing and line in stops:
            break
        if capturing and line:
            out.append(line)
    return out


def slugify(s):
    return (re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40]) or "mtg"


def parse_meeting(path):
    paras = docx_paragraphs(path)
    nonblank = [p for p in paras if p]
    date = nonblank[0] if nonblank else ""
    title = nonblank[1] if len(nonblank) > 1 else os.path.basename(path)
    invited = next((l for l in nonblank if l.startswith("Invited")), "").replace("Invited", "").strip()
    tasks = []
    for l in section(paras, "Next steps", {"Details", "Summary", "Decisions"}):
        m = TASK_RE.match(l)
        if m:
            tasks.append((m.group("owner").strip(), m.group("title").strip(), m.group("desc").strip()))
    return {"date": date, "title": title, "invited": invited, "tasks": tasks}


def render(meeting, fname):
    slug = slugify(meeting["title"])
    rows = []
    for i, (owner, title, desc) in enumerate(meeting["tasks"], 1):
        rows.append(
            f'      <label class="task"><input type="checkbox" data-track="{slug}-{i:02d}" data-section="meetings" />'
            f'<div class="task-content"><div class="task-title">{html.escape(title)}</div>'
            f'<div class="task-meta">{html.escape(desc)}</div>'
            f'<div class="task-tags"><span class="pill pill-grey">{html.escape(owner)}</span></div></div></label>'
        )
    body = "\n".join(rows) or '      <p class="mono muted" style="font-size:0.8rem">No action items detected.</p>'
    return (
        f'  <!-- doc:{fname} -->\n'
        f'  <h2>\U0001F4E5 {html.escape(meeting["title"])} <em>— auto-imported.</em></h2>\n'
        f'  <p class="mono muted" style="font-size:0.78rem">{html.escape(meeting["date"])} · '
        f'{html.escape(meeting["invited"])} · auto-extracted from Gemini notes</p>\n'
        f'  <div class="card">\n'
        f'    <h4 style="margin-top:0">Action items</h4>\n'
        f'    <div data-section="meetings">\n{body}\n    </div>\n'
        f'  </div>\n\n'
    )


def main():
    dry = "--dry-run" in sys.argv
    with open(PAGE, encoding="utf-8") as f:
        page = f.read()
    if ANCHOR not in page:
        sys.exit(f"ERROR: anchor not found in {PAGE}. Add a '{ANCHOR} ... -->' marker first.")
    new_blocks, added = [], []
    for path in sorted(glob.glob(os.path.join(DOCS_DIR, "*.docx"))):
        fname = os.path.basename(path)
        if f"doc:{fname}" in page or any(f"doc:{fname}" in b for b in new_blocks):
            continue
        m = parse_meeting(path)
        new_blocks.append(render(m, fname))
        added.append((fname, len(m["tasks"])))
    scanned = len(glob.glob(os.path.join(DOCS_DIR, "*.docx")))
    if not added:
        print(f"Up to date — {scanned} docs scanned, 0 new.")
        return
    verb = "would append" if dry else "Appended"
    print(f"{verb} {len(added)} meeting(s), {sum(n for _, n in added)} tasks:")
    for fn, n in added:
        print(f"  + {fn} ({n} tasks)")
    if dry:
        return
    page = page.replace(ANCHOR, "".join(new_blocks) + ANCHOR, 1)
    with open(PAGE, "w", encoding="utf-8") as f:
        f.write(page)
    print("Wrote meetings.astro — run `npm run build` to validate.")


if __name__ == "__main__":
    main()
