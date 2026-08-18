# Audit — Notion task "Combine our laminitis articles into one complete guide"

**Date:** 2026-08-11 · **Notion page:** `387a93e042de81a0b2badf0c4ace1490`

**Trigger:** Mark asked what the task covers, whether it is redundant now the guide is authored and
built, and finally: *"why would we want any other competing laminitis pages when we publish this new
SEO content?"* Nothing is published — the guide is on staging only.

**Answer in one line:** you wouldn't — you want exactly **two**, because "all laminitis results" is
two different searches. The cannibalization is worse than `state/pages.csv` records, but it is
**commercial** cannibalization, not educational, and that changes where the consolidation points.

⚠️ **The task body was not readable from this machine.** `NOTION_TOKEN` is blank and the Project
Tasks database lives in the client's workspace (`docs/HANDOFF-2026-08-04.md` §5). Everything else is
verified against the owners declared in `state/decisions.md`: the `seo` branch for execution, `state/`
for analysis, `reference/` for strategy.

---

## 1. Query-level GSC — the finding that changes the plan

Pulled 2026-08-11, 12 months, `dimensions:["query"]` filtered per page. Google anonymises long-tail
queries, so only ~19–30% of clicks are attributable — but the split within that share is unambiguous.

| Page | 12mo clicks | Attributable | **Commercial** | **Informational** |
|---|---|---|---|---|
| `/your-cavallo-laminitis-healing-plan/` — the "educational" canonical | 597 | 112 | **105 (94%)** | **7** |
| `/faq/cavallo-hoof-boots-for-laminitis/` — the commercial page | 484 | 154 | 143 | 11 |
| `/cavallo-laminitis-guide/hoof-rehab-page/` — unclassified attachment | 202 | 107 | **107 (100%)** | 0 |

**Today all three URLs are commercial boot pages as far as Google is concerned.** Head-to-head on
identical queries:

| Query | canonical | FAQ page | hoof-rehab-page |
|---|---|---|---|
| cavallo boots for laminitis | 43c · **pos 2.0** | 18c · pos 2.8 | — |
| horse boots for laminitis | 4c · pos 11.3 | 15c · pos 4.6 | 17c · pos 4.5 |
| hoof boots for laminitis | 3c · pos 12.8 | 13c · pos 3.8 | 10c · pos 4.9 |
| laminitis boots | 2c · pos 15.1 | 14c · pos 6.9 | 13c · pos 4.4 |
| boots for laminitic horses | 2c · pos 10.3 | 3c · pos 3.9 | 6c · pos 4.1 |
| best hoof boots for laminitis | — | 7c · pos 3.8 | 9c · pos 4.4 |

Three of Cavallo's own URLs stacked in positions 2–15 on the same commercial cluster. That is
textbook cannibalization, measured — and `/cavallo-laminitis-guide/hoof-rehab-page/`, the page with
**zero** informational clicks and the strongest average position of the three, has **no row in
`state/pages.csv` at all.**

**Correcting the justification I gave earlier, not the conclusion.** I first said the commercial FAQ
page should stay separate because it serves different intent *today*. That reason is wrong — the
canonical is commercial in practice, earning 7 informational clicks a year. Keeping the FAQ separate
still holds, but for a different reason: it is the **best-positioned home for the commercial cluster**
once the canonical goes fully educational. Nobody currently owns the educational cluster at all.

## 2. Sequencing note — the canonical's boot queries need somewhere to land

The new guide is purely educational: 8,841 words, **zero internal links in the body** (all 13 hrefs
are external citations — Merck ×4, ACVS, AAEP, Oregon State, a DOI), no product links, no commercial
CTA. Verified in both the authored file and the rendered staging page.

Publishing it at `/your-cavallo-laminitis-healing-plan/` replaces the content currently earning **105
commercial clicks, including 43 at position 2.0 for "cavallo boots for laminitis."** Those clicks
will most likely migrate **within the domain** rather than vanish — the FAQ page already sits at 2.8
and hoof-rehab at 4.5 on the same queries. So this is not a loss warning; it is a reason to
consolidate the commercial cluster onto one deliberate URL *around* publish time, so the traffic lands
where it was aimed instead of drifting. It is an argument **for** the consolidation work, not against.

Nothing in `state/` or the `seo` branch records this trade-off being considered.

## 3. Why keep any other laminitis page? Two clusters, not one

Measured demand splits in two, and one page cannot rank for both:

**Cluster A — commercial ("boots for laminitis", ~355 attributable clicks).** Should be **one** page.
Today it is split three ways: the FAQ page (484 total clicks, best-positioned on most terms), the
unclassified attachment (202), and the canonical's own commercial tail (105). Consolidating these is
the biggest measurable win available, and it is **not in the map**.

**Cluster B — educational ("what is laminitis", causes, signs, recovery).** Owned by nobody: 7 clicks
across 3,290 impressions. Exactly what the new 8,841-word guide is built for — and why it is worth
publishing. But it is net-new territory, not a consolidation of existing traffic.

**Everything else redirects into one of those two.** The 58 rows in the map are topically related but
thin — founder-voice posts and customer stories being 301'd for equity. That is correct work; it just
is not where the traffic is.

## 4. Consolidation ceiling as currently mapped

MEASURED clicks, 12 months, every URL whose path contains `laminitis` or `founder` — 1,787 total:

| Bucket | Clicks | Share |
|---|---|---|
| The guide (canonical) | 597 | 33.4% |
| Commercial FAQ pages | 484 | 27.1% |
| MERGE+301 sources → the guide | 330 | 18.5% |
| **No role in `pages.csv`** | **295** | **16.5%** |
| Stay-live rows (OPTIMIZE / KEEP-SPOKE) | 58 | 3.2% |
| PRUNE sources → the guide | 23 | 1.3% |

Run every 301 in the map and the guide holds 950 clicks — **53.2%**. The rest is the commercial
cluster plus the 295 clicks with no role, led by the 202-click attachment page and the **2023
laminitis-guide PDF** (12 clicks, 4,087 impressions), which competes with the new guide for the same
intent.

## 5. Decisions this needs — none of them mine to make

1. **Where does the commercial cluster land?** One URL. The FAQ page is best-positioned today. That
   means the canonical either sheds its commercial tail deliberately or carries a boots section.
   Currently the guide has neither.
2. **Does the educational guide publish at `/your-cavallo-laminitis-healing-plan/`?** If yes, pair it
   with the cluster-A consolidation so the boot queries land on the FAQ page.
3. **Role for `/cavallo-laminitis-guide/hoof-rehab-page/`** (202 clicks, best positions, parent 404s)
   and the other 295 unclassified clicks.
4. **`/laminitis-plan-series-part-1/` and `-part-2/`** — OPTIMIZE + Needs Review while `-part-3/`
   merges. Query data shows part-1 at pos 11–65 on boot terms and part-2 ranking only for apple cider
   vinegar. Neither competes meaningfully; both are merge candidates. A classifier artifact.
5. **Fold-in of merge-source copy** — Mark said 2026-08-11 it does not matter, and for ranking signal
   he is correct. If skipped, 23 MERGE+301 rows become de facto PRUNEs; record it in `decisions.md`
   so the map matches reality.

## Supporting detail

### Scope in `state/pages.csv`
Canonical plus **58 rows** naming `/your-cavallo-laminitis-healing-plan/` as destination:
1 KEEP-CANONICAL · 23 MERGE+301 · 35 PRUNE. "Combine" is literally true for 23, overstates 35.
Never merge into laminitis: `/contracted-heels-101/` (146 clicks) and
`/sustaining-the-hoof-managing-underrun-heels/` (125) — Mark reversed those on 2026-08-05, mechanical
not metabolic. Excluded per Decision #1: 9 videos (already NOINDEX) and
`/newsletter/may-2-journal-founders-insights/` (company founder, not the disease).

### Rows whose evidence is Ahrefs-era and wrong
153 clicks `/laminitis-navicular-and-founder/` (Seed row, evidence reads "~0 traffic/links") ·
88 `/new-cavallo-laminitis-plan/` · 78 `/a-winter-laminitis-saga/` — all MERGE+301, roles still hold
since 301 preserves equity, but the stated reasons are wrong. Plus four PRUNE rows already flagged
Needs Review: 78 / 45 / 23 / 11 clicks.

### No 301s have run
Five representative merge sources all return **200** on staging:
`/hoof-boots-save-foundered-mare/`, `/two-year-anniversary-in-founder-valley/`,
`/new-cavallo-laminitis-plan/`, `/laminitis-navicular-and-founder/`, `/a-winter-laminitis-saga/`.

### The build, on `seo`
Commit series all dated 2026-08-05, ending `9665f5ec`.
`functions-laminitis-guide.php` is scoped by `is_page('your-cavallo-laminitis-healing-plan')` — the
same slug every merge destination already points at. Plus `laminitis-guide.css`, `laminitis-guide.js`
(TOC scroll-spy), `laminitis-guide-faq.json`, Article + FAQPage JSON-LD, Yoast breadcrumb to Pillar 2.
**MedicalWebPage schema not observed on staging** — check `reference/04-build-standard.md`.

| URL | staging | production |
|---|---|---|
| `/your-cavallo-laminitis-healing-plan/` | new guide, FAQPage schema | old page, no FAQPage |
| `/horse-hoof-care/` (Pillar 2) | 200, 3 "coming soon" links | **404** |

### `state/phases.json` is stale
Phase 2 records "Laminitis guide SEO-optimized and published" as **not-started**, measured against
production on 2026-08-05 — but every laminitis-guide commit landed on `seo` later that same day. By
the convention used for Pillar 2 ("built", evidence "404 on cavallo-inc.com") it should read **built**.
Flagged, not edited.

### Reproducing the query data
Throwaway read-only scripts, `/tmp/gsc-queries.ts` and `/tmp/gsc-tail.ts`, run with
`node --env-file-if-exists=../mrc-marketing/.env --env-file-if-exists=.env.local`. `lib/gsc.ts` has no
query dimension and `state/gsc.json` holds page-level data only, which is why
`state/next-actions.md` item 1 records query intent as unsettled. Worth promoting into `scripts/` if
query-level pulls become routine.
