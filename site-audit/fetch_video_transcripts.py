#!/usr/bin/env python3
"""
Fetch transcripts for Cavallo video pages so they can be matched to pillar/spoke
pages for internal linking & embedding. (Noindex videos can still be linked from
spokes — noindex only removes a page from search, not from internal navigation.)

WHY THIS EXISTS
  The original audit crawl (fetch_pages.py) deliberately SKIPPED video pages
  (`r["type"] != "video"`), so the audit has NO embed URLs or body text for the
  153 videos — only title / meta_description / focus_keyword in the CSV
  (title 153/153, meta 112/153, focus_kw 109/153; 39 have neither meta nor focus).

WHAT IT DOES
  1. Reads the 153 video rows from cavallo_page_audit.csv.
  2. Fetches each LIVE page and detects the embed host (YouTube / Vimeo / other).
  3. Pulls the transcript (YouTube via youtube-transcript-api).
  4. Writes site-audit/video_transcripts.json (resumable).

STATUS — IMPORTANT
  Written while this repo's container had NO outbound network (every request 403'd
  through the egress proxy), so it is UNTESTED end-to-end. Before running, confirm
  egress works:  curl -sI https://www.youtube.com/robots.txt  -> 200.
  The video HOST is currently UNKNOWN (we never got a page back); the summary this
  prints reveals the host mix — adjust the Vimeo/other branches accordingly.

REQUIREMENTS
  pip install youtube-transcript-api        # primary path (YouTube)
  pip install yt-dlp                         # optional: better coverage / fallback

USAGE
  python3 site-audit/fetch_video_transcripts.py
"""
import csv
import json
import os
import re
import time
import urllib.error
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE, "cavallo_page_audit.csv")
OUT_PATH = os.path.join(BASE, "video_transcripts.json")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def fetch_html(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "ignore")


def load_video_rows():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        return [r for r in csv.DictReader(f)
                if (r.get("type") or "").strip().lower() == "video"]


def detect_embed(html):
    """Return (host, video_id_or_src)."""
    m = re.search(r'(?:youtube\.com/embed/|youtu\.be/|youtube\.com/watch\?v=)([\w-]{11})', html)
    if m:
        return "youtube", m.group(1)
    m = re.search(r'(?:player\.)?vimeo\.com/(?:video/)?(\d+)', html)
    if m:
        return "vimeo", m.group(1)
    m = re.search(r'<iframe[^>]+src=["\']([^"\']+)["\']', html, re.I)
    if m:
        return "iframe", m.group(1)
    return None, None


def youtube_transcript(video_id):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        return None, "missing-dep: pip install youtube-transcript-api"
    try:
        parts = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join(p["text"] for p in parts).strip(), "youtube-transcript-api"
    except Exception as e:  # NoTranscriptFound / TranscriptsDisabled / network
        return None, f"yt-error: {type(e).__name__}: {str(e)[:120]}"


def main():
    rows = load_video_rows()
    out = {}
    if os.path.exists(OUT_PATH):
        out = json.load(open(OUT_PATH, encoding="utf-8"))
    print(f"{len(rows)} video rows; {len(out)} already in {os.path.basename(OUT_PATH)}.")

    for i, r in enumerate(rows, 1):
        vid = (r.get("id") or "").strip()
        url = (r.get("url_live") or "").strip()
        if not vid or not url:
            continue
        if out.get(vid, {}).get("transcript"):
            continue  # resume: skip ones that already have a transcript

        rec = {"url": url, "title": r.get("title"), "host": None,
               "video_id": None, "transcript": None, "source": None, "error": None}
        try:
            html = fetch_html(url)
        except Exception as e:
            rec["error"] = f"page-fetch: {type(e).__name__}: {str(e)[:120]}"
            out[vid] = rec
            continue

        host, ident = detect_embed(html)
        rec["host"], rec["video_id"] = host, ident
        if host == "youtube":
            rec["transcript"], rec["source"] = youtube_transcript(ident)
            if not rec["transcript"]:
                rec["error"] = rec["source"]
        elif host == "vimeo":
            # Vimeo transcripts usually need account/API auth or uploaded captions.
            # Record the id; extend this branch once Vimeo is confirmed as the host.
            rec["error"] = "vimeo: transcript not pulled (needs API/captions); see VIDEO-TRANSCRIPTS.md"
        else:
            rec["error"] = f"unhandled host: {host} ({ident})"

        out[vid] = rec
        if i % 10 == 0:
            json.dump(out, open(OUT_PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
            print(f"  {i}/{len(rows)} processed ...")
        time.sleep(0.5)

    json.dump(out, open(OUT_PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    from collections import Counter
    hosts = Counter(v.get("host") or "none" for v in out.values())
    got = sum(1 for v in out.values() if v.get("transcript"))
    print(f"\nDONE -> {OUT_PATH}")
    print(f"  host mix: {dict(hosts)}")
    print(f"  transcripts obtained: {got}/{len(out)}")


if __name__ == "__main__":
    main()
