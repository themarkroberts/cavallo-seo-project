#!/usr/bin/env python3
"""Fetch rendered HTML for all audit target pages from the LIVE site.
Resumable (skips already-downloaded), gentle concurrency."""
import csv, os, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

BASE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(BASE, "html")
os.makedirs(HTML, exist_ok=True)

rows = list(csv.DictReader(open(os.path.join(BASE, "cavallo_page_audit.csv"))))
targets = [(r["id"], r["url_live"]) for r in rows
           if r["type"] != "video" and "(group)" not in r["type"]]

UA = "MRC-SEO-Audit/1.0 (+mark@markroberts.io; site owner content audit)"
done = err = 0

def fetch(item):
    global done, err
    key, url = item
    dest = os.path.join(HTML, f"{key}.html")
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        return ("skip", key)
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            with open(dest, "wb") as f:
                f.write(data)
            time.sleep(0.4)
            return ("ok", key)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 4:
                time.sleep(2 ** (attempt + 1))  # 2,4,8,16s backoff
                continue
            last = e
            break
        except Exception as e:
            last = e
            break
    with open(os.path.join(BASE, "fetch_errors.log"), "a") as f:
        f.write(f"{key}\t{url}\t{last}\n")
    return ("err", key)

with ThreadPoolExecutor(max_workers=2) as ex:
    for i, (status, key) in enumerate(ex.map(fetch, targets), 1):
        if status == "err":
            err += 1
        if i % 100 == 0:
            print(f"{i}/{len(targets)} processed ({err} errors)", flush=True)

print(f"DONE: {len(targets)} targets, {err} errors. HTML in {HTML}", flush=True)
