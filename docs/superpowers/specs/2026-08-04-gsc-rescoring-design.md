# Search Console re-scoring (design)

**Date:** 2026-08-04
**Status:** approved, implementing
**Corrects:** the "GSC is permission-blocked" claim in `PILLAR-BUILD-PLAN.md:89`,
`site-audit/CONTINUE.md:40`, and the `cavallo-gsc-blocked` memory note — all three are wrong.

---

## The discovery

Google Search Console is **not** blocked for cavallo-inc.com. The Google account behind
`mrc-marketing/.env`'s `GOOGLE_ADS_REFRESH_TOKEN` holds `siteOwner` on
`sc-domain:cavallo-inc.com`, and the token's consent covers `webmasters.readonly`. Verified
2026-08-04 by listing 16 Search Console properties, Cavallo among them.

Whatever produced the original 403 used different credentials — most likely the empty
`GOOGLE_SERVICE_ACCOUNT_JSON` in the same file.

## Why it matters

The entire disposition map was scored on **Ahrefs traffic estimates**. Real measured data
differs by more than an order of magnitude:

| | Ahrefs estimate | Search Console (measured, 12mo) |
|---|---|---|
| Pages with any organic traffic | ~72 | **1,024 with clicks**, 4,651 with impressions |
| Clicks | not measured | **52,453** |
| Impressions | not measured | **5,059,440** |

The project was deciding the fate of 1,154 pages while seeing roughly 7% of the pages that
actually earn clicks.

## What the real data says about the existing decisions

```
role            rows   w/impr   >=1clk  >=10clk  >=50clk   total clicks
PRUNE           552      524      219       43        5          1,904
NOINDEX         235      226       65        4        0            222
KEEP-SPOKE      230      214      181      116       53         27,464
MERGE+301        99       99       70       38       20          3,600
OPTIMIZE         18       18       17       13        7          4,273
REWRITE          15       15        6        1        0             17
KEEP-CANONICAL    5        5        5        3        3          5,837
```

**The classifier was directionally correct.** The 787 PRUNE+NOINDEX rows hold 2,126 clicks —
about 4% of the total — across 68% of the pages. The 253-row keep-set holds ~37,500 clicks.

An earlier version of this analysis framed Step 4 as traffic-destroying. That was overstated:
mass-noindexing 235 pages risks 222 clicks/year, only 4 pages above 10 clicks. Step 4 is a
reasonable trade and is **not** blocked.

**What is real** is a thin tail of wrong calls concentrated at the high-click end —
`/natural-remedies-for-your-horse/` earns 245 clicks/year and is marked PRUNE; 5 PRUNE pages
exceed 50 clicks. Cheap to find now, expensive to discover after the redirects run.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Apply mode | **Flag for review. Change no roles.** | A heuristic silently overriding human judgement is exactly what retiring `build_disposition_map.py` prevented. |
| Threshold | **≥10 clicks / 12 months → 47 rows** | 284 rows (≥1 click) is more review than gets done, and 1–9 clicks/year is noise. 47 matches the already-accepted review load. Every row still carries its real click count, so a lower cut needs no re-run. |
| Where GSC data lives | **`state/gsc.json`, not columns in `pages.csv`** | `pages.csv` holds permanent human decisions; GSC changes every refresh. Merging them dirties the decisions file on every refresh and destroys `git log` as a record of what was decided. |
| Ahrefs | **Stays** | It uniquely provides competitor traffic and keyword-gap data — terms the site does *not* rank for, which GSC structurally cannot show. |
| Traffic labelling | GSC = measured clicks. Ahrefs = estimate. **Never merged into one figure.** | Conflating them is how the original error became invisible. |

## Non-goals

- No role changes. Every reclassification stays Mark's call.
- No keyword-gap research — separate project, separate spec. Shares no code or data.
- No re-run of `build_disposition_map.py`. It stays retired.
- Ahrefs is not removed or replaced.

## Architecture

| Piece | Responsibility |
|---|---|
| `lib/gsc.ts` | Fetch page-level clicks/impressions (12mo) and monthly click totals. Throws on failure. Network — verified live, not unit-tested. |
| `lib/gsc-join.ts` | Pure logic: URL normalisation, joining GSC rows to `PageRow[]`, finding contradictions. Unit-tested. |
| `state/gsc.json` | Refreshed page-level data keyed by normalised URL. Committed — its diffs show traffic moving over time. |
| `scripts/refresh.ts` | Gains GSC alongside Ahrefs and GA4. |
| `scripts/flag-gsc-review.ts` | **One-time.** Reports contradictions; with `--apply`, sets `needs_review` and appends the click count to `evidence`. |
| `lib/render.ts` | Page table gains measured clicks and impressions, sortable. Existing review toggle picks up new flags. |

### URL matching

GSC returns absolute URLs with inconsistent trailing slashes and a `www.` variant
(`https://www.cavallo-inc.com/` appears separately from `https://cavallo-inc.com/`). Normalise
both sides: strip protocol, strip leading `www.`, strip trailing slash, lowercase. Sum clicks
where two GSC rows normalise to the same key.

### Re-run safety

`flag-gsc-review.ts --apply` **aborts if its own evidence marker (`GSC:`) already appears** in
`pages.csv`, unless `--force` is passed. Re-running after Mark has cleared rows would re-flag
decisions he deliberately made — the same class of error as re-running the classifier.

## Risks

- **Date range is fixed at 12 months.** Traffic older than that is invisible; a page seasonal
  outside the window could look dead. Accepted: the window is stated in the evidence string.
- **GSC page-level data is capped at 25,000 rows** per query. Cavallo returns 4,651, so there is
  ample headroom, but the fetcher must fail loudly rather than silently truncate if that changes.
- **`state/gsc.json` adds churn to commits.** Accepted deliberately — that churn is the record of
  traffic moving, and it is isolated from the decisions file.

## Success criteria

1. `npm run refresh` writes `state/gsc.json` with measured clicks for ~4,651 pages.
2. The dashboard shows real clicks and impressions per page, labelled as measured, alongside
   Ahrefs figures labelled as estimates.
3. `scripts/flag-gsc-review.ts` reports 48 contradictions at the ≥10 threshold (47 was estimated from a slightly different date window) and flags them
   only when `--apply` is passed.
4. No page's `role` changes as a result of this work.
5. Re-running the flagging script without `--force` aborts.
6. The three stale "GSC is blocked" claims are corrected in the docs.
