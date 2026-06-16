# Video Transcripts — Workstream Runbook (resume in a NEW session)

**Goal:** get the actual content of Cavallo's 153 video pages so we can match each to a
pillar/spoke and link/embed the good ones. Noindex does NOT block internal linking — it only
keeps a page out of search — so the videos can still work FOR the pillars as supporting/social-proof content.

## Where this stands
- **153 video pages** (`type=video`), all `status=publish`. **143 noindex / 10 indexable.**
- AI summaries were skipped by design → `content_format = "(video — not summarized)"`.
- The audit crawl (`fetch_pages.py`, ~line 12) **excluded videos** (`r["type"] != "video"`), so there is
  **no body text and no embed URL** captured — `0/153` have a file in `content/`.
- What we DO have in `cavallo_page_audit.csv`: title (153/153), meta_description (112/153),
  focus_keyword (109/153). **39 videos have neither meta nor focus_keyword** (title only) — those
  are the ones that most need a transcript.

## The blocker (why a new session is required)
Transcripts need outbound network to `cavallo-inc.com` (to read the embed) + the video host
(YouTube/Vimeo). In the session where this was set up, **all egress 403'd via the proxy** — including
`https://www.youtube.com/robots.txt`, which is open to everyone, so it's the environment's **network
policy**, not the sites. A remote environment's network policy is fixed **at creation**; a running
session can't adopt a change. **→ Start a fresh session under an open/expanded network policy.**
Docs: https://code.claude.com/docs/en/claude-code-on-the-web

## Steps to resume
1. **Confirm egress** (expect `200`, not `403`):
   - `curl -sI https://www.youtube.com/robots.txt`
   - `curl -sI https://cavallo-inc.com/`
2. **Run the pull:** `python3 site-audit/fetch_video_transcripts.py`
   - Install deps first: `pip install youtube-transcript-api` (optional fallback: `pip install yt-dlp`)
   - Writes `site-audit/video_transcripts.json` (resumable). It auto-detects the host and prints a
     host/coverage summary — the host mix is itself a finding (we don't yet know if these are YouTube
     or Vimeo, because we never got a page back).
3. **If the container IP still 403s** (Cavallo's WAF / YouTube can block datacenter IPs even with egress
   open), run the SAME script **locally on Mark's Mac** (clean network; the site is local there too) and
   commit `video_transcripts.json` back.
4. **Then, back in-session:**
   - Build the **video→spoke map**: which condition/topic each video supports → which pillar/spoke to
     link or embed it in (use transcript + title + meta).
   - **Decide the 10 indexable videos** (keep-indexed vs. noindex) — they're the only ones that can rank
     or cannibalize; the other 143 are already out of search.

## Notes / gotchas
- Vimeo transcripts often need account/API auth or uploaded captions — the script flags these rather
  than failing silently; extend the `vimeo` branch once the host is confirmed.
- `fetch_video_transcripts.py` was written while egress was blocked → **untested end-to-end.** Validate
  the embed-detection selectors on the first successful page fetch.
- Decision context for the videos (and everything else) lives in `../PILLAR-BUILD-PLAN.md`.
