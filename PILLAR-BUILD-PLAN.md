# Cavallo SEO — Pillar Build Plan (resume here)

**Goal:** build 3 pillar pages and consolidate the existing ~600 blog posts into them without cannibalization.
**Deliverables go to Notion**, not code. The only files in this repo are the audit data + these plan docs. (The Next.js dashboard in `CLAUDE.md` is a separate, deprioritized track.)

---

## Where everything lives
- **Page audit (every URL + content):** `site-audit/cavallo_page_audit.csv` (1,154 rows × 37 cols). Rebuild scripts + guide: `site-audit/CONTINUE.md`.
- **Strategy in Notion (the source of truth):**
  - [Content Strategy — Pillar Pages](https://app.notion.com/p/374a93e042de818b9032feab64916672)
  - [🛒 Hoof Boot Guide — Pillar Playbook](https://app.notion.com/p/381a93e042de81939e58f28593355935)
  - [🐎 Hoof Health & Conditions — Pillar Playbook](https://app.notion.com/p/381a93e042de81ae9fc3cd26e8c65806)
  - [🐴 Barefoot Horse Care — Pillar Playbook](https://app.notion.com/p/381a93e042de81efa88ee24794d8269f)
  - [SEO Project Portal](https://app.notion.com/p/1e3a93e042de83f1a6518112eaa85904) · Resources & Documents holds the 86-keyword Pillar Keyword Map.

---

## The principle: noindex is NOT the cannibalization fix — 301 is
- **301 redirect (merge)** passes ranking signals/link equity into the page you keep. This is how you consolidate duplicates.
- **Noindex** just hides a page; its equity is **stranded/wasted**. Use it ONLY to keep a page live for users but out of search.

| Situation | Action |
|---|---|
| Duplicate/overlapping content competing for a term | **MERGE + 301** into the canonical |
| Distinct, useful, different-intent content | **KEEP as spoke**, optimize, link to pillar |
| Outdated but URL worth keeping | **REWRITE in place** |
| Thin auto-archives (the ~1,150 tag archives) | **NOINDEX** (one Yoast taxonomy setting) |
| Dead weight (no traffic, no links, off-topic) | **PRUNE** → 301 to nearest page (or 410) |

---

## The path (in order)

**Step 1 — Lock 4 architecture decisions** (recommendations below). Nothing gets a destination until these are set.

**Step 2 — Build the Content Disposition Map** (the keystone). One row per URL → `pillar` · `role` (KEEP-CANONICAL / OPTIMIZE / KEEP-SPOKE / MERGE+301 / REWRITE / NOINDEX / PRUNE) · `destination URL`. Auto-classify the long tail from the audit (traffic, inbound links, word count, topic) + inherit playbook decisions for in-cluster pages. Output → Notion. This is what guarantees every URL has exactly one role = no cannibalization.

**Step 3 — Mark reviews ~30–50 judgment calls** (only the uncertain ones; the rest are mechanical).

**Step 4 — Global quick wins:** noindex the tag/auto archives (Yoast); prune obvious dead weight.

**Step 5 — Build pillars in waves, one at a time.** Per pillar: I write the page brief → Mark builds & **publishes the pillar first** → *then* run that pillar's 301s → add spoke internal links. Order: **Pillar 1 → 2 → 3**.

> ⚠️ **301 safety rule:** never 301 a page before its destination has the content live. Publish the canonical first, confirm it covers the topic, *then* redirect the old URLs in.

---

## The 3 pillar pages (build spec)

### 🛒 Pillar 1 — Hoof Boot Guide (commercial hub) — *enrich, don't create*
- **Page:** `/product-category/hoof-boot/` (your #1 asset; ~1,286 visits/mo). Add buyer's-guide copy to the category page; stays transactional.
- **Cluster (head):** hoof boots · horse boots · hoof boots for horses · boots for horses (push to top 3). **+ re-home cluster** stuck on homepage (horse hoof shoes 400, cavalier boots 500, pony boots 150, rubber boots for horses, protective boots for horses…) via internal links/anchors.
- **Sections:** what hoof boots are → types & use cases (→ subcategory pages) → how to choose (→ /12-important-points.../ + /how-to-measure/) → use cases incl. laminitis (→ /faq/cavallo-hoof-boots-for-laminitis/) → FAQ.

### 🐎 Pillar 2 — Hoof Health & Conditions (NEW page; authority engine)
- **Page:** NEW pillar. **Cluster:** horse hoof anatomy (2,300, KD2) · horse hoof care (1,000, KD6). Targets ONLY these head terms — no condition head terms, no commercial boot terms.
- **Sections:** hoof anatomy & structure → what a healthy hoof looks like → how problems develop → condition directory (links to spokes) → comfort/support angle (never treatment/cure claims) → FAQ schema.
- **Spokes (each owns its head term):** Laminitis (/your-cavallo-laminitis-healing-plan/ — 5,500) · Navicular (/is-navicular.../ — 1,600) · White line disease (1,200) · Hoof abscess (350) · **Thrush (NEW, 800)** · heel bulbs · contracted heels · thin soles · hoof moisture · anatomy/nerves.

### 🐴 Pillar 3 — Barefoot Horse Care (convert archive → pillar; differentiation)
- **Page:** `/category/the-barefoot-horse/` (convert thin archive → real pillar). **Cluster:** barefoot horse.
- **Sections:** barefoot philosophy → transitioning out of metal shoes → "booted barefoot" (bridge to boots as terrain protection) → wild-horse self-trimming model → links to spokes.
- **Spokes:** **Wild horse hooves (NEW** — how do wild horses maintain their hooves 600 / wild horse hooves 500, KD0 = easiest wins**)** · **Barefoot trimming (NEW** — horse hoof trimming 200 / barefoot trimming 90, replaces the ranking PDF**)** · transition out of shoes (/cavallo-the-top-choice.../) · going-barefoot program (/6-things.../).

---

## 4 architecture decisions — STATUS (updated 2026-06-16)
**3 of 4 locked.** Detail below is audit-verified and becomes the first rows of the Content Disposition Map (Step 2).

1. ✅ **Founder → MERGE+301 into the Laminitis spoke** (`/your-cavallo-laminitis-healing-plan/`). Audit reality: there is NO single "Founder" page to absorb — it's a scatter of thin posts (all ~0 traffic / ~0 links):
   - `/laminitis-navicular-and-founder/` (278w) · `/hoof-boots-save-foundered-mare/` (761w) · `/update-hoof-boots-save-foundered-mare/` (246w) · `/update-hoof-boots-save-foundered-mare-2/` (525w) · `/update-hoof-boots-save-foundered-mare-3/` (258w) · `/two-year-anniversary-in-founder-valley/` (2,014w narrative)
   - Repurpose the "foundered mare" customer stories as social-proof blocks inside the combined "Laminitis & Founder" guide.
   - LEAVE OUT: the 2 founder videos (already noindex) + `/newsletter/may-2-journal-founders-insights/` (FALSE POSITIVE — "founder" = company founder, not the disease).
2. ✅ **DSLD → leave out.** Degenerative Suspensory Ligament Desmitis is a connective-tissue / ligament disease, NOT hoof-seated → off-topic; including it dilutes the pillar's topical authority. No page.
3. ✅ **Navicular → consolidate to ONE educational spoke** (max consolidation, Mark's call). Canonical = `/is-navicular-disease-always-the-beginning-of-the-end/` (1,936w, 129 visits, already ranks "when to euthanize a horse with navicular"); add a "best boots for navicular" section + product CTA to carry commercial intent. **MERGE+301 into it:**
   - Both commercial pages: `/cavallo-boots-for-navicular/` (983w, 1 visit) + `/faq/cavallo-hoof-boots-for-navicular/` (1,549w, 3 links)
   - Thin posts: `/give-navicular-the-boot/` (307w) · `/kicking-naviculars-butt/` (593w) · `/navicular-seek-truth/` (671w) · `/from-navicular-to-prancing/` (128w) · `/wrestling-navicular-trust-your-gut/` (127w) · `/laminitis-navicular-and-founder/` (278w, shared with #1)
   - KEEP SEPARATE: `/faq/cavallo-hoof-boots-for-therapy-and-rehabilitation/` (1,808w, 7 links) — only *mentions* navicular; it's a therapy/rehab page → its own Pillar 1 spoke.
4. ⬜ **Diet / nutrition → OPEN** (recommendation, not yet confirmed): in scope as **spokes only** — consolidate duplicate nutrition posts into one canonical spoke (or two), link under Pillar 2; the pillar page itself stays on anatomy/care. NEXT: pull all diet/nutrition pages from the audit, then confirm.

---

## Key facts / gotchas
- **GSC is permission-blocked** for cavallo-inc.com → use Ahrefs for per-page organic. (Only ~72 of 1,154 pages get any organic traffic; 723 orphans w/ zero internal inbound links; 632 missing meta descriptions.)
- **Products store content in ACF** flexible-content fields, not post_content (already handled in the audit CSV).
- **Local site:** front-end was broken (b-carousel-block fatal); DB is reachable via the LocalWP MySQL socket. Audit pulls from the DB directly.
- **Vercel plugin disabled** globally (`~/.claude/settings.json`) — the irrelevant "best practices" injections are off.

## ▶️ RESUME HERE — new session required (updated 2026-06-16)
**Why a new session:** the next workstream (video transcripts) needs outbound network to `cavallo-inc.com` + YouTube/Vimeo. This environment's egress is blocked — every request 403s via the proxy (confirmed even on `youtube.com/robots.txt`, which is open to the whole internet, so it's the policy, not the sites) — and a remote environment's network policy is fixed **at creation**, so a running session can't pick up a change. **Start a fresh Claude Code web session under an open/expanded network policy.**

**Two threads open — full video runbook in `site-audit/VIDEO-TRANSCRIPTS.md`:**
1. **Video transcripts** — Mark wants to link/embed the (mostly noindex) videos from spokes. New session → (a) verify egress (`https://www.youtube.com/robots.txt` → expect 200), (b) run `python3 site-audit/fetch_video_transcripts.py` → `video_transcripts.json`, (c) build the video→spoke map + decide the **10 indexable** videos (keep-index vs noindex). If the container's datacenter IP still 403s (Cavallo WAF / YouTube), run the script locally on Mark's Mac.
2. **Decision #4 (diet/nutrition)** — last architecture decision; pull the diet pages from the audit, confirm, then build the **Content Disposition Map** (Step 2) in Notion. Decisions #1–#3 above are locked and ready to become its first rows.
