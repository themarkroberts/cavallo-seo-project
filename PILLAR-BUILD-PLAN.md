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

## 4 open decisions (Mark to confirm — recommendations)
1. **Founder** → *fold into the Laminitis spoke* (chronic laminitis; same intent; one "Laminitis & Founder" guide).
2. **DSLD** → *leave out* (ligament disorder, off-topic for hoof authority; don't dilute the pillar).
3. **Navicular two URLs** → *MERGE+301 `/cavallo-boots-for-navicular/` into the educational navicular spoke* (commercial one is ~1 visit).
4. **Diet/nutrition** → *in scope as spokes only* (consolidate duplicates, link under pillar; pillar page itself targets anatomy/care).

---

## Key facts / gotchas
- **GSC is permission-blocked** for cavallo-inc.com → use Ahrefs for per-page organic. (Only ~72 of 1,154 pages get any organic traffic; 723 orphans w/ zero internal inbound links; 632 missing meta descriptions.)
- **Products store content in ACF** flexible-content fields, not post_content (already handled in the audit CSV).
- **Local site:** front-end was broken (b-carousel-block fatal); DB is reachable via the LocalWP MySQL socket. Audit pulls from the DB directly.
- **Vercel plugin disabled** globally (`~/.claude/settings.json`) — the irrelevant "best practices" injections are off.

## ▶️ Immediate next action
Confirm the 4 decisions above, then build the **Content Disposition Map** (Step 2) and write it into Notion.
