#!/usr/bin/env python3
"""Deterministic structural extraction from post_content (clean editor markup).
Produces extracted_all.json (factual signals + text) and batches/batch_NNN.json for the AI workflow."""
import os, re, json, csv, math

BASE = os.path.dirname(os.path.abspath(__file__))
CON = os.path.join(BASE, "content")
BATCHDIR = os.path.join(BASE, "batches")
os.makedirs(BATCHDIR, exist_ok=True)

# type/title/url per id from the CSV spine
types, titles, urls = {}, {}, {}
for r in csv.DictReader(open(os.path.join(BASE, "cavallo_page_audit.csv"))):
    types[r["id"]] = r["type"]; titles[r["id"]] = r["title"]; urls[r["id"]] = r["url_live"]

BLOCK_COMMENT = re.compile(r"<!--.*?-->", re.S)
DATA_URI = re.compile(r'src="data:[^"]*"')
TAG = re.compile(r"<[^>]+>")
WS = re.compile(r"\s+")
H1 = re.compile(r"<h1[^>]*>(.*?)</h1>", re.S | re.I)

def clean_text(raw):
    t = BLOCK_COMMENT.sub(" ", raw)
    t = DATA_URI.sub('src=""', t)
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", t, flags=re.S | re.I)
    t = TAG.sub(" ", t)
    t = (t.replace("&nbsp;", " ").replace("&amp;", "&").replace("&#8217;", "'")
          .replace("&#8211;", "-").replace("&quot;", '"').replace("&#8230;", "..."))
    return WS.sub(" ", t).strip()

def signals(raw):
    low = raw.lower()
    img = len(re.findall(r"<img\b", low))
    return {
        "image_count": img,
        "n_h2": len(re.findall(r"<h2\b", low)),
        "n_h3": len(re.findall(r"<h3\b", low)),
        "video": bool(re.search(r"youtube\.com|youtu\.be|vimeo\.com|wp:video|wp:embed|\.mp4", low)),
        "table": bool(re.search(r"<table\b|wp:table", low)),
        "accordion": bool(re.search(r"accordion|<details\b|<summary\b|toggle", low)),
        "form": bool(re.search(r"<form\b|gravityform|gform|wp:.*form|\[contact", low)),
        "buttons": bool(re.search(r"wp:button|wp-block-button|<a[^>]+class=\"[^\"]*button", low)),
        "list": bool(re.search(r"<ol\b|<ul\b|wp:list\b", low)),
        "blockquote": bool(re.search(r"<blockquote\b|wp:quote|wp:pullquote", low)),
    }

records = {}
for fn in os.listdir(CON):
    if not fn.endswith(".txt"):
        continue
    pid = fn[:-4]
    raw = open(os.path.join(CON, fn), encoding="utf-8", errors="replace").read()
    sig = signals(raw)
    text = clean_text(raw)
    wc = len(text.split())
    h1m = H1.search(raw)
    h1 = clean_text(h1m.group(1)) if h1m else ""
    records[pid] = {
        "id": pid, "type": types.get(pid, ""), "title": titles.get(pid, ""),
        "url": urls.get(pid, ""),
        "h1": h1[:160], "word_count": wc, **sig,
        "text": text[:1400],
    }

json.dump(records, open(os.path.join(BASE, "extracted_all.json"), "w"))

# Build batches of 12 for the AI workflow
ids = sorted(records.keys(), key=lambda x: int(x))
SIZE = 12
batches = [ids[i:i+SIZE] for i in range(0, len(ids), SIZE)]
for bi, batch in enumerate(batches):
    payload = [records[pid] for pid in batch]
    json.dump(payload, open(os.path.join(BATCHDIR, f"batch_{bi:03d}.json"), "w"))

print(f"extracted {len(records)} pages -> {len(batches)} batches of {SIZE}")
# quick distribution sanity
import collections
imgc = collections.Counter()
for r in records.values():
    b = "0" if r["image_count"]==0 else "1-3" if r["image_count"]<=3 else "4-9" if r["image_count"]<=9 else "10+"
    imgc[b]+=1
print("image_count buckets:", dict(imgc))
print("with video:", sum(1 for r in records.values() if r["video"]))
print("with table:", sum(1 for r in records.values() if r["table"]))
print("with form (in-content):", sum(1 for r in records.values() if r["form"]))
wcs=sorted(r["word_count"] for r in records.values())
print(f"word_count median={wcs[len(wcs)//2]} min={wcs[0]} max={wcs[-1]}")
print(f"batch count = {len(batches)}")
