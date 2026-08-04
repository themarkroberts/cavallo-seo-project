> **Imported 2026-08-04** from the Notion export `cavallo-seo-export.zip` — `themarkroberts/cavallo @ seo:docs/seo/cavallo-seo-pillar-project.md`.
> Notion is now an archive; this file is authoritative. Figures inside may be Ahrefs
> **ESTIMATES** — check each label before trusting a number.
>
> ⚠️ **STALENESS WARNING.** The source doc is dated **2026-06-27** and parts are superseded.
> Confirmed: it lists DSLD as IN scope, reversing `state/decisions.md` (2026-06-16); and its
> "GSC API is blocked → use Ahrefs" line is **false** — Search Console works, see
> `state/gsc.json`. Where this conflicts with the `seo` branch, **the branch wins**.

# Cavallo SEO Pillar-Page Project — Project Memory

> Version-controlled, cross-session copy of the project context. The **detailed source of truth is Notion** (page IDs at the bottom); this file is the "get up to speed fast" summary so any session (or contractor) can resume without re-deriving everything.
>
> Last updated: **2026-06-27**. Market: **US**. Live domain: **cavallo-inc.com** (dev: cavallo.dev.markroberts.io; local: cavallo.local).

## Goal

Six-month SEO + shop-restructure engagement (June–Nov 2026). Reverse a multi-year organic decline, build topical authority via a **pillar-and-spoke** model, restructure shop nav, and — explicitly — **get cited in AI search** (AI Overviews, ChatGPT, Perplexity). Validated against competitor **Scoot Boots** (comparable Domain Rating, ~DR 48–49, but pulls more US organic through educational content, not product pages).

## The three pillars

- **Pillar 1 — Hoof Boot Guide (Commercial Hub).** ENRICH the existing `/product-category/hoof-boot/` category page — it is *not* a new blog page. Guide copy wraps the product grid; copy lives in the **WooCommerce term description** (verified the theme renders it). Already #1 for "hoof boots" / "boots for horses". Add `horse hoof boots` (900/KD4); pursue a **Scoot Boots comparison** page (scoot boots 1,300/KD0).
- **Pillar 2 — Hoof Health & Conditions.** NET-NEW pillar page; recommended slug **`/horse-hoof-care/`** (`/hoof-health/` is taken by an attachment). Primary heads: horse hoof anatomy (2,400/KD3) + horse hoof care (600/KD6). **Hub family (added in audit, secondary heads):** hooves (9,300/KD10), horse hoof (5,500/KD13), horse hooves (3,300/KD8), horse feet (1,400/KD5) — ~triples the volume ceiling. Condition spokes: laminitis, navicular, white line (+seedy toe), abscess, **thrush (new)**, **DSLD (new)**, heel bulbs, contracted/underrun heels, thin soles, hoof moisture.
- **Pillar 3 — Barefoot Horse Care.** ⚠️ **PLAN CHANGED (Mark, 2026-06-27): build a NET-NEW standalone Page at `/barefoot-horse-care/` (slug verified free), NOT a conversion of the `/category/the-barefoot-horse/` archive.** Mark's call — "free up the term, make our own page." So P3 now uses the **same mechanism as Pillar 2** (standalone Page → `page.php` `the_content()`, zero theme change), which retires the old "copy in the term description, convert in place" plan. The category term 1379 (empty desc, ~253 posts) stays as a taxonomy for post organisation; **301 the old archive → `/barefoot-horse-care/`** to pass its small equity (#8 "horse barefoot" vol 10, #7 "barefoot horse" 60/mo). Meta set via Yoast page fields (a regular `category` term never fed the theme meta fallback, which is `is_product_taxonomy()`-only). **Re-anchored** off "barefoot horse" (only 60/mo) onto the KD-0 spoke cluster: **wild-horse hooves** (how do wild horses maintain their hooves 600 + how do wild horses trim their hooves 700 + wild horse hooves 500) and **trimming** (horse hoof trimming 200, barefoot trimming 90, barefoot horse trim 80). **Build the 2 KD-0 spokes FIRST** (the pillar Page is gated on them — two of its H2s point to them).

## Roadmap (one phase ≈ one month)

1. **Phase 1 (June) — all three pillar PAGES live.** ← current. Pillar pages are net-new/enrichment and touch no live ranking; the risky merges are later phases.
2. Phase 2 (July) — laminitis guide optimize + connect; shop categories locked.
3. Phase 3 (Aug) — shop nav funnel (5 category landing pages; gated on Carole locking the scheme).
4. Phase 4 (Sep) — product-page overhaul.
5. Phase 5 (Oct) — hoof-health condition spokes (team writes from briefs; Mark does SEO pass).
6. Phase 6 (Nov) — remaining spoke sets + measurement vs June baseline.

## Audit findings (2026-06-26, validated vs live Ahrefs)

- **Keyword corrections:** horse hoof care = **600** (Notion had 1,000); laminitis **KD 14**, laminitis in horses **KD 13** (drifted up); "barefoot horse" only **60/mo**.
- **Ranking reality:** the domain ranks for only **~2 of 10** medical head terms. "Optimize existing" is really **2 optimizations** (laminitis ~3,300w, navicular ~1,900w — both FAQ/testimonial-framed, need restructure) **+ 2 near-rewrites** (white line ~700w, abscess ~1,100w). Several "already ranking" claims in the original docs were wrong/stale and have been corrected in Notion.
- **Winnability tiers (DR-49 brand):**
  - *Winnable (top-5 + AI-Overview citation):* how-do-wild-horses-maintain-their-hooves (Scoot ranks #4), horse hoof trimming, **DSLD**, horse hoof abscess, white line disease, navicular (lower page 1); plus **horse boots** (already #5/#8).
  - *Aspirational (page-1 + AI-citation only, NOT top-5):* laminitis in horses, thrush in horses, horse hoof — walled by Merck/ACVS/NIH/vet-school/Wikipedia (DR 76–97).
- **AI search:** 10 of 12 priority terms trigger AI Overviews that **already cite competitor hoof brands** (Scoot Boots, Mad Barn, Hoof Boss) — Cavallo is absent. The citation gap is **format + E-E-A-T, not content volume.** Ahrefs Brand Radar is **not configured** (recommend creating: Cavallo vs Scoot/Mad Barn/Hoof Boss).

## AI-Citation & E-E-A-T build standard (every pillar + spoke)

1. **Answer-first 40–60 word definition block** under the H1 (plain, declarative, entity-dense; no brand framing in sentence one).
2. **FAQPage JSON-LD** + **MedicalWebPage/Article schema** (`author`, `reviewedBy`, `datePublished`, `dateModified`).
3. **DVM-reviewed byline — DESIGN FOR IT, NON-BLOCKING (Mark, June 2026).** Build every page review-ready and reserve the byline slot, but **never publish a "medically reviewed by" claim until a real named vet has signed off** (a claimed-but-absent review is a false E-E-A-T signal). Reviewer sourcing → ask Carole; anchor on **Dr. Jennifer Gill / the WKU hoof-boot study**.
4. **Symptom / stage / treatment as TABLES**, not prose (AI Overviews lift tables).
5. **Inline citations to authoritative vet sources** (Merck Veterinary Manual, AAEP, vet-school extensions, peer-reviewed studies).
6. **Labeled hoof-anatomy diagram** with entity-rich alt text.
7. **Visible "last reviewed" date** (dateModified schema).
8. **Commercial CTA below the fold** — first 1–2 screens stay answer-only or AI engines skip the page as ad-like.

## Decisions log

- **Founder** → a section within the laminitis canonical, not its own spoke (Carole).
- **Diet** → OUT of scope (Carole: Cavallo is not a nutrition authority). The 3 diet articles stay live but unlinked from the hub; the diet cluster is not built.
- **DSLD** → IN scope (Mark): net-new spoke targeting dsld in horses (3,900/KD1), framed in the comfort/protection lane with the cosmetic-vs-clinical guardrail explicit.
- **Vet review** → non-blocking, design-for (Mark, June 2026) — see build standard #3.
- **Commercial/informational laminitis split:** `/faq/cavallo-hoof-boots-for-laminitis/` stays the COMMERCIAL page (#1 organic only on low-volume terms; #2 via AI Overview for "horse boots for laminitis"). Do NOT move that URL. Educational laminitis lives on `/your-cavallo-laminitis-healing-plan/`. The boots-for-laminitis buying intent stays OFF the educational page.

## Build mechanism & guardrails

- ⚠️ **CORRECTION (verified live 2026-06-27): the term description does NOT render on category/archive pages.** The theme **removes** the WooCommerce archive-description hooks — `app/public/wp-content/themes/cavallo/includes/woocommerce/archive/content.php` lines 6-7 (`remove_action('woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10)` + the product-archive variant). The earlier playbook claim that "the theme renders a category term description" is **wrong**. The term description IS still consumed as the **SEO meta description** (`includes/functions-a11y-seo.php`, trimmed ~25 words), but nothing shows on-page. **This affects Pillar 3 too** (the barefoot pillar also relies on a category term description).
- **Render mechanism differs per pillar (verified live 2026-06-27):**
  - **Pillar 1** (product_cat archive) — **Option A:** ACF fields on the term (`hub_intro`, `hub_guide`, `hub_faqs` repeater); render `hub_intro` on `woocommerce_before_shop_loop` (above grid), `hub_guide` + FAQ on `woocommerce_after_shop_loop` (below grid); emit **FAQPage JSON-LD** from the repeater; save the field group as **acf-json in the theme** so it deploys with code. Leaves the term description free for the meta description.
  - **Pillars 2 & 3** (both NET-NEW standalone Pages) — **no theme change.** `page.php` renders `the_content()`, so copy is the page body HTML. FAQPage JSON-LD + Article schema via a Yoast FAQ block or a `wp_head` hook keyed to the page slug; meta via Yoast page fields. ~~The old "Option A for Pillar 3" no longer applies~~ — P3 is a standalone Page, not a converted `category` archive. (Note: `category.php` renders via `renderNewsArchive()` and never outputs `term_description()`, so the old archive could never have shown pillar copy anyway.)
- **Global archive blocks are shared.** Testimonials ("Voices from the Field"), the "Submit Your Review" CTA, and the newsletter render from a *global* ACF option (`archive_page_settings` → `content_blocks`, `woocommerce_after_main_content` pri 20) on **every** archive. To drop one from a single hub, add a **per-term conditional** — do not toggle the global setting. *(Pillar 1 decision: keep testimonials + newsletter, cut the Submit-Review CTA.)*
- **H1 stays broad — don't narrow it to the keyword.** Pillar 1 H1 stayed "Hoof Boots" (not "Hoof Boots for Horses"): the page sells donkey/mule boots too, and it already ranks #1 on the current H1. The keyword lives in the **title tag + intro + body**, not the H1. No term rename → no breadcrumb change, no redirect.
- **Deploy is two-track (never push the live DB).** Code (theme PHP render hooks + acf-json field group) → **git push live** (CavalloHttps/origin; SSH remote is broken). Content (term name, ACF field values = the actual copy, FAQ entries, meta-description fixes) lives in the **DB → re-enter on live by hand/wp-cli**. Build + screenshot as a **DRAFT on LocalWP** first; nothing publishes without explicit approval. Adding only HTML copy (no new JS/CSS) avoids the Breeze combined-bundle foot-gun.
- **Never push the live DB.** Content/DB changes happen on LocalWP only and are replicated separately. Theme is performance-tuned — avoid page-builder plugins. `wp-cavallo.sh` lives outside the repo (site root) so it never deploys.

## Source of truth (Notion) & data tools

- **Notion pages** (Cavallo connector; detailed strategy lives here):
  - Portal `1e3a93e0-42de-83f1-a651-8112eaa85904`
  - Content Strategy parent `374a93e0-42de-818b-9032-feab64916672` (carries the AI-Citation build standard + cross-pillar audit notes)
  - Pillar 1 hub `381a93e0-42de-8193-9e58-f28593355935`
  - Pillar 2 hoof-health `381a93e0-42de-81ae-9fc3-cd26e8c65806`
  - Pillar 3 barefoot `381a93e0-42de-81ef-a88e-e24794d8269f`
  - Tasks DB data source `collection://ff3ec7b0-97d8-42a0-b323-5eb8badc3a1e`
  - Each playbook carries a **🔨 Build-Ready Spec** + a **🔧 June-26-2026 audit-corrections** block.
- **Tool gotchas:** Notion `query-data-sources` is **Business-plan gated** → use `search` (with `data_source_url`) + `fetch` to read DB rows. GSC API is **blocked** for cavallo-inc.com → use **Ahrefs** for ranking/keyword/SERP data. Product body content lives in **ACF tab fields**, not `post_content`.
