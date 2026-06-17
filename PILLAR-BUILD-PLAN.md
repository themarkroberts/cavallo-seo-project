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
**4 of 4 locked.** Detail below is audit-verified and becomes the first rows of the Content Disposition Map (Step 2).

1. ✅ **Founder → MERGE+301 into the Laminitis spoke** (`/your-cavallo-laminitis-healing-plan/`). Audit reality: there is NO single "Founder" page to absorb — it's a scatter of thin posts (all ~0 traffic / ~0 links):
   - `/laminitis-navicular-and-founder/` (278w) · `/hoof-boots-save-foundered-mare/` (761w) · `/update-hoof-boots-save-foundered-mare/` (246w) · `/update-hoof-boots-save-foundered-mare-2/` (525w) · `/update-hoof-boots-save-foundered-mare-3/` (258w) · `/two-year-anniversary-in-founder-valley/` (2,014w narrative)
   - Repurpose the "foundered mare" customer stories as social-proof blocks inside the combined "Laminitis & Founder" guide.
   - LEAVE OUT: the 2 founder videos (already noindex) + `/newsletter/may-2-journal-founders-insights/` (FALSE POSITIVE — "founder" = company founder, not the disease).
2. ✅ **DSLD → leave out.** Degenerative Suspensory Ligament Desmitis is a connective-tissue / ligament disease, NOT hoof-seated → off-topic; including it dilutes the pillar's topical authority. No page.
3. ✅ **Navicular → consolidate to ONE educational spoke** (max consolidation, Mark's call). Canonical = `/is-navicular-disease-always-the-beginning-of-the-end/` (1,936w, 129 visits, already ranks "when to euthanize a horse with navicular"); add a "best boots for navicular" section + product CTA to carry commercial intent. **MERGE+301 into it:**
   - Both commercial pages: `/cavallo-boots-for-navicular/` (983w, 1 visit) + `/faq/cavallo-hoof-boots-for-navicular/` (1,549w, 3 links)
   - Thin posts: `/give-navicular-the-boot/` (307w) · `/kicking-naviculars-butt/` (593w) · `/navicular-seek-truth/` (671w) · `/from-navicular-to-prancing/` (128w) · `/wrestling-navicular-trust-your-gut/` (127w) · `/laminitis-navicular-and-founder/` (278w, shared with #1)
   - KEEP SEPARATE: `/faq/cavallo-hoof-boots-for-therapy-and-rehabilitation/` (1,808w, 7 links) — only *mentions* navicular; it's a therapy/rehab page → its own Pillar 1 spoke.
4. ✅ **Diet / nutrition → ONE educational spoke under Pillar 2** (Mark's call, 2026-06-16). Demand reality (Ahrefs, US): the literal *hoof-nutrition* angle is ~0 volume (`hoof nutrition` 30, `minerals for horse hooves` 0), so the spoke targets the broader informational terms — `horse diet` (800, KD21) + `equine nutrition` (400, KD21) — and stays **educational** ("diet → healthy hoof"), not commercial. Deliberately **skip** the easy commercial supplement terms (`horse hoof supplement` KD0/TP600, `biotin for horses` KD1): Cavallo sells boots, not supplements, and they'd dilute the pillar's topical focus. The Pillar 2 page itself stays on anatomy/care; this is a supporting spoke.
   - **Canonical = `/equine-nutrition/`** (411w; best slug). Expand into the diet→hoof spoke; soft-link to boot products, no hard commercial CTA.
   - **MERGE+301 into it** (all thin, ~0 traffic, ~0 links, founder-voice): `/balancing-minerals-to-build-the-best-hoof/` (979w) · `/hay-facts/` (631w) · `/a-balanced-diet-creates-a-healthy-hoof/` (380w) · `/are-you-feeding-your-horse-like-a-cow/` (408w, 9 visits)
   - **Re-home (diet-adjacent → belongs elsewhere):** `/all-things-barefoot-4/` → Pillar 3 (Barefoot); `/spring-is-here/` + `/two-year-anniversary-in-founder-valley/` → Decision #1 Laminitis spoke (diet-as-trigger / social proof); `/dr-robert-bowker-talks-holistic-care/` + `/herbs-for-horses/` → Pillar 3 / holistic supporting content.
   - **PRUNE (off-topic → 301 to nearest relevant page):** `/fall-pasture-maintenance-chores-add-list/` (land/field maintenance, not equine diet) · `/cavallo-now-offers-natural-solutions-natural-stride-joint-supplements/` (old joint-supplement promo).

---

## Key facts / gotchas
- **GSC is permission-blocked** for cavallo-inc.com → use Ahrefs for per-page organic. (Only ~72 of 1,154 pages get any organic traffic; 723 orphans w/ zero internal inbound links; 632 missing meta descriptions.)
- **Products store content in ACF** flexible-content fields, not post_content (already handled in the audit CSV).
- **Local site:** front-end was broken (b-carousel-block fatal); DB is reachable via the LocalWP MySQL socket. Audit pulls from the DB directly.
- **Vercel plugin disabled** globally (`~/.claude/settings.json`) — the irrelevant "best practices" injections are off.

## ✅ Step 2 DONE — Content Disposition Map built (2026-06-16)
The keystone is live in Notion. One row per URL → exactly one role = no cannibalization.
- **Database:** [Content Disposition Map](https://app.notion.com/p/0c6d0227282049adad764f480c674679) — central, under the SEO Project Portal (next to the Keyword Map). Data source ID `e5279df5-8d9c-40b5-8159-cfb34dbf3dd0`.
- **Schema:** `Page URL` (title) · `Pillar` · `Role` · `Destination URL` · `Evidence` · `Source` (Seed/Auto) · `Needs Review` (checkbox).
  - ⚠️ Notion gotcha: a title property literally named **"URL"** breaks `notion-create-pages` (server can't resolve it). That's why the title column is **"Page URL"**.
- **Rows: 1,154** (every audited URL). **30 Seed** (locked from decisions #1–#4, never auto-touched) + **1,124 Auto**.
- **Role mix:** PRUNE 552 · NOINDEX 235 · KEEP-SPOKE 230 · MERGE+301 99 · OPTIMIZE 18 · REWRITE 15 · KEEP-CANONICAL 5.
- **Pillar mix:** None 480 · P1 350 · P2 169 · P3 155.
- **Views:** a filtered linked view embedded in each of the 3 pillar playbooks (Pillar = that pillar), plus a **"Step 3 — Needs Review"** tab on the DB (47 flagged rows).
- **Rebuild (deterministic, re-runnable):** `python3 site-audit/build_disposition_map.py` → `site-audit/content_disposition_map.csv`. Seed table + topic/metric heuristics live in that script. Notion load batches were generated into `site-audit/notion_batches/` and pushed via the Notion MCP.

## ▶️ RESUME HERE (updated 2026-06-16)
**Step 3 — Mark reviews the 47 judgment calls.** Open the **"Step 3 — Needs Review"** view in the [Content Disposition Map](https://app.notion.com/p/0c6d0227282049adad764f480c674679) and confirm/correct Pillar + Role for each. These are the equity-bearing posts/pages (don't mis-redirect a page that gets traffic) and the REWRITE candidates (substantial off-topic — repurpose vs prune). The other ~1,107 rows are mechanical. After review, **uncheck Needs Review** as you clear each.
- **Auto-classifier caveats to sanity-check during review:** "boots" appears on most posts (it's a boot company), so some Pillar 1 tags are loose; MERGE+301 destinations that read `(NEW) …` point to spoke pages that don't exist yet — those merges can't run until the destination is built (301 safety rule).
- Then **Step 4** (global quick wins): noindex the tag/auto archives (Yoast taxonomy setting — covers the 235 NOINDEX rows) and prune obvious dead weight.
- Then **Step 5**: build pillars in waves (Pillar 1 → 2 → 3); publish each pillar/spoke **before** running its 301s.

**Still-open thread — Video transcripts (blocked here; needs a different environment).** Re-tested egress on 2026-06-16: `https://www.youtube.com/robots.txt` and `https://cavallo-inc.com/` both still return **403 via the proxy** (policy, not the sites). A remote env's network policy is fixed **at creation**, so this workstream must run in an environment created under an **open/expanded network policy** — or locally on Mark's Mac. Full runbook: `site-audit/VIDEO-TRANSCRIPTS.md`. Docs: https://code.claude.com/docs/en/claude-code-on-the-web
