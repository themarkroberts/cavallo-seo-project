# Cavallo SEO Site Map — Continuation Guide

## Status
- **DONE:** Full page-level audit → `cavallo_page_audit.csv` (1,154 rows × 37 cols). Every page classified + summarized.
- **REMAINING:** Build the **interactive site map** from that CSV. (Original goal; CSV was the agreed interim.)

## Location
This lives in the `cavallo-seo-project` repo under `site-audit/`. The repo root is reserved for the Next.js dashboard app (see repo `CLAUDE.md`). Run all pipeline commands from `site-audit/`.

## What exists in `site-audit/`
| File | Purpose |
|---|---|
| `cavallo_page_audit.csv` | **The deliverable data** — 1,154 pages, all fields |
| `build_csv.py` | Assembles the CSV from spine + extraction + AI + Ahrefs. Re-run to rebuild. |
| `extract.py` | Deterministic signals (image/word/heading counts, video/table/form flags) + builds `batches/` |
| `out_ai/batch_*.json` | AI content_format + summary + key_components + primary_cta per page |
| `extracted_all.json` | Per-page structural signals |
| `ahrefs_overlay.json` | Per-page organic traffic / top keyword / position |
| `spine_singular.tsv`, `spine_terms.tsv`, `product_meta.tsv` | DB exports |
| `content/` | Raw post_content (+ recovered ACF) per page |

## CSV columns
`id, type, status, indexable, cornerstone, site_section, title, url_live, content_format, summary, key_components, primary_cta, image_count, word_count, n_sections, has_video, seo_title, meta_description, focus_keyword, h1, org_traffic_est, traffic_value_usd, top_keyword, serp_position, ranking_keywords, links_in, links_out, price, sku, stock, reading_time_min, editor, parent_id, url_local, last_modified, audit_action, notes`

## Build the interactive site map (main remaining task)
Produce **one self-contained HTML file** (`cavallo_sitemap.html`) — opens in a browser, no server. Embed the CSV as inline JSON (parse `cavallo_page_audit.csv` at build time and inject; do NOT fetch at runtime — file:// can't fetch).

Recommended layout (Mark had no strong preference — pick the most useful, lean toward **"Both combined"**):
- **Left:** collapsible tree by `site_section` → page title (counts per section).
- **Right:** click a page → detail panel (summary, content_format, key_components, primary CTA, SEO meta, traffic, links in/out, word/image counts, live-URL link).
- **Top:** search box + filters (section, content_format, indexable, "has traffic", "orphan = links_in 0", "thin = word_count<300", "no meta description").
- Color-code rows by issue flags (orphan / thin / no-meta / noindex) and by `org_traffic_est`.
Alternatives if preferred: filterable dashboard table only; or a traffic **treemap** (blocks sized by `org_traffic_est`, grouped by section).

Keep it dependency-light (vanilla JS or a single CDN-free lib). Group/sort/filter must be instant on 1,154 rows.

## Gotchas to preserve
- **Videos (153 rows, type=video)** have no AI summary by design — show them in the tree but don't treat blank summary as an error.
- `image_count` = in-content images only; featured/ACF/product-gallery images aren't counted (components still list "Product gallery").
- Organic data is **Ahrefs current-snapshot estimate**, not GSC (GSC is 403 for this property — see memory `cavallo-gsc-blocked`).
- Product body content comes from ACF, not post_content (memory `cavallo-acf-products`) — already handled in the CSV.

## To rebuild the CSV from scratch (if data changes)
LocalWP mysql socket: `/Users/markreaction/Library/Application Support/Local/run/WGPQps-6k/mysql/mysqld.sock` (root/root, db `local`).
Order: (1) re-export spine TSVs + content_dump (see git history / build_csv comments), (2) `tr -d '\r' < content_dump.tsv` then split into `content/`, (3) `python3 extract.py`, (4) re-run the summary workflow over `batches/` writing `out_ai/`, (5) `python3 build_csv.py`.

## Optional follow-ons
- Grant the marketing-MCP service account access to GSC `cavallo-inc.com`, then swap `org_traffic_est` for real GSC clicks/impressions (12-mo).
- Local front-end is broken (500 + redirect-to-home, `b-carousel-block` fatal) — a background task chip was spawned to fix it. Once up, it's an unlimited local crawl target for rendered-HTML cross-checks.
- Enrich the 153 video pages and 64 taxonomy archives with AI summaries if you want full coverage.
