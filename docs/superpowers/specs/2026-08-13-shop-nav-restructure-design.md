# Cavallo shop nav restructure — Phase 3 (design)

**Date:** 2026-08-13
**Status:** awaiting Carole's lock — this document is the artifact to send her for it
**Phase:** 3 of 6 (August 2026), **due this month** per `reference/01-roadmap.md`

---

## Problem

The shop nav is organized by product model — Trek, Simple, Sport, Mini, BFB, LEB, ELB, Bling under
"Hoof Boots"; Pads/Straps/Studs under "Accessories" — three levels deep. A first-time buyer doesn't
know what a "Trek" or an "ELB" is. The home page (15,385 measured clicks/12mo, the #1 page on the
site) and the hoof-boot hub `/product-category/hoof-boot/` (4,333 clicks, #2) are the two busiest
pages on the site, and neither funnels a new visitor by the thing they actually know — what animal
they have, or what condition they're solving for.

This is exactly what Phase 3 of the roadmap already calls for and has never been built: "rebuild
shop navigation around how buyers actually think — by animal type and by condition, not by product
name." Gated on Carole locking the category scheme. Per `state/phases.json`, nothing in this repo
or on the `seo` branch evidences that lock has happened — it's recorded as the single highest-leverage
unknown in the project.

## The five categories

Confirmed 2026-08-13 (Mark): **Horse, Donkey, Mini, Draft, Acute Laminitis.** Four by animal type,
one by condition — matches the June placeholder in `reference/10-pillar-1-hoof-boot-guide.md:271`.

| Category | Existing product line | Notes |
|---|---|---|
| Horse | Trek, Simple, Sport, ELB, Bling | General riding horse — the largest, most generic bucket |
| Donkey | LEB (long-ear boot) | Cavallo-exclusive |
| Mini | CLB (Cute Little Boots / mini) | |
| Draft | BFB (Big Foot Boot) | Cavallo-exclusive |
| Acute Laminitis | EquiFloat (patented floating-toe) | Condition, not animal — cuts across all four above |

**Acute Laminitis is not a new build.** It is `state/next-actions.md` item 2's
`/hoof-boots-for-laminitis/`, already in flight as its own workstream with its own sequencing
(build → cross-link → settle `pages.csv` rows → publish → 301 the FAQ page in). This document treats
it as the 5th nav slot and does not duplicate that build plan — see item 2 for the actual sequence.
Building a *second* laminitis landing page here would recreate the four-way cannibalization item 2
exists to fix.

## Nav structure

Desktop dropdown is plain CSS `:hover`, no JS, no depth limit — but the **mobile drawer is already
hard-capped at one level of children** (`'depth' => 2` in `header.php`, with a code comment explaining
why). Today that means Trek/Simple/Sport/etc. are already invisible on mobile; only "Hoof Boots" is
reachable. The one-hover-level request isn't a new constraint — it's already true on mobile. Fixing
desktop to match is a wp-admin menu edit, not a theme change.

| | Before | After |
|---|---|---|
| Top level | Shop | Shop |
| Level 1 (under Shop) | Hoof Boots · Saddle Pads · Other Products · **Best Boot Warranty** | Horse · Donkey · Mini · Draft · Acute Laminitis · Accessories |
| Level 2 | Trek · Simple · Sport · Mini · BFB · LEB · ELB · Bling (under Hoof Boots) | *(none — collapsed)* |

`Best Boot Warranty` is currently a content link mixed into the category tier — move it out (footer,
or a link inside category pages) while this nav gets touched anyway.

**Accessories keeps its own nav slot** rather than folding entirely into the 5 categories: it earns
real independent search traffic (`hoof-boot-pads` alone: 434 clicks/12mo, more than several boot
models) from people who already know they want a pad, not an animal. It is *also* cross-sold
contextually within each of the 5 category pages — both, not either/or.

## Homepage changes

Homepage is a plain WP Page (`page.php`, `the_content()` only — no `front-page.php`), built from
ACF/Gutenberg blocks. Current shop-relevant blocks, top to bottom:

1. **Hero** — CTA "Shop Hoof Boots" → `/product-category/hoof-boot/`
2. **Featured Products** — CTA "Shop All" → `/shop-cavallo/` **(retiring this cycle — repoint, see Redirects)**
3. **Product Categories carousel** ("Shop by Style") — a reusable `acf/product-categories` block: a
   taxonomy-picker rendering any chosen `product_cat` terms as a Swiper carousel. Currently shows the
   8 boot-model + Accessories terms. **This is already the exact mechanism this project needs** — no
   new engineering, just re-pointing the picker from the 8 old terms to the 4 new animal categories +
   Accessories (5 tiles), and renaming the heading (e.g., "Shop by Horse Type").
4. Featured Guides, brand/testimonial/newsletter content — untouched, no shop entry points.

**One gap:** the `acf/product-categories` block is a taxonomy picker — it can only hold real
`product_cat` terms. Acute Laminitis is a standalone Page, not a category term, so it can't go in
that carousel. Recommendation: keep the carousel at 5 tiles (Horse/Donkey/Mini/Draft/Accessories) and
give Acute Laminitis its own small callout elsewhere on the homepage near the hero — it's a
condition/patented-differentiator story that arguably deserves distinct treatment anyway (this also
sets up the Phase 4 goal of properly differentiating the floating-toe design). Alternative: extend the
block to mix in a manual link tile — real dev work, not required to hit the Phase 3 goal.

Hero and Featured-Products CTAs both need repointing once `/shop-cavallo/` retires (see Redirects).

## Build mechanism

**Recommended, per Mark's decision:** the 4 animal categories become new WooCommerce `product_cat`
terms, layered onto existing products as a *second* category tag — a Trek boot stays in
`hoof-boot > trek-hoof-boots` (keeps its URL, its rankings, its 1,233 clicks/12mo) and additionally
gets tagged into the new `horse-boots` term. No existing product URLs move. Acute Laminitis stays a
standalone Page with a small hand-curated product grid (mostly the EquiFloat boot + compatible
accessories) — matching the mechanism already used for Pillars 2 and 3, and already the plan for
`/hoof-boots-for-laminitis/`.

**One real piece of dev work.** The hub's rich editorial layout — comparison table, "By Horse Type"
grid, accessories cross-links, FAQ — lives in `pillar-hub.php` and is gated strictly on
`$term->slug === 'hoof-boot'` (`cavallo_is_hoofboot_hub()`). It will not appear on the new categories
by default. To give Horse/Donkey/Mini/Draft the same built-out treatment as the hub rather than bare
product grids, that gate needs to widen. **Recommended: a term-meta boolean flag**, settable per
category from wp-admin, so future categories can opt into the hub layout without another code deploy.
A hardcoded slug allowlist is the faster fallback if the term-meta version doesn't fit the sprint —
functionally equivalent, just requires a deploy every time a category is added or removed.

New category URL slugs (confirmed 2026-08-13, no conflicts found against `state/pages.csv` or the live
site's crawled category tree):

- `/product-category/horse-boots/`
- `/product-category/donkey-boots/`
- `/product-category/mini-boots/`
- `/product-category/draft-boots/`

## Hub "By Horse Type" grid — required step

The hub already has a "By Horse Type" section (`views/woocommerce/archive/hub/types.php`), fed by a
hand-entered ACF repeater (`horse_types`: image/label/url) on the `hoof-boot` term — exactly the
placeholder `reference/10-pillar-1-hoof-boot-guide.md:309` describes as "ships with existing
subcategory links now; upgraded later." **Included in this spec as a required build step** (per
Mark, 2026-08-13): once the 4 new categories and the Acute Laminitis page exist, this repeater's rows
must be updated to point at them instead of the old subcategory links. Without this, the hub — the
site's #2 page — never surfaces the new structure to anyone who lands there from search instead of
nav.

## Redirects

- **`/shop-cavallo/` retires** (confirmed useless, 2026-08-13) → 301 to `/product-category/hoof-boot/`
  (the hub). It currently earns 250 clicks/12mo and has a cluster of orphaned attachment-page children
  (`trek-updated`, `bfb-updated`, etc. — thin WordPress image-attachment pages, not real content;
  clean these up as NOINDEX/prune alongside the redirect, not as a separate project).
- **`/shop/`** (the bare WooCommerce shop archive, 22 clicks/12mo, thin/auto-generated) — leave alone.
  Not part of the funnel, low risk, not worth touching this cycle.
- **No existing boot-model or accessory URLs move.** They gain a second category tag; nothing 301s.
- Homepage hero CTA and Featured-Products "Shop All" CTA repoint away from `/shop-cavallo/` — to the
  hub, matching the hero's existing destination.

## What still needs doing outside this repo

Per the roadmap's "Team's role" for Phase 3 — this document doesn't resolve these, it's the artifact
to work them against:

- **Carole locks the scheme.** This document is either the thing she signs off on, or the draft that
  gets adjusted until she does. Nothing here is real until that happens.
- **Confirm product-to-category mapping** for edge cases — e.g., does a Trek boot in a mini size
  belong in Horse, Mini, or both? The table above is the obvious-case mapping; sizing edge cases need
  a real pass against the product catalog.
- **Category descriptions** — buyer's-guide copy for each of the 4 new archive pages, in the style of
  the existing hub copy.
- **Boot-to-accessory pairings** — which pads/straps/studs get cross-sold on which category page.
  Feeds both this restructure and the Phase 4 product-page cross-sell overhaul.
- **Newsletter feature** — mentioned in the roadmap's Phase 3 team role, not scoped here; flag as a
  follow-up decision once the nav ships.

## Testing plan

- **Mobile funnel** — explicitly called out in the roadmap ("Mobile-optimized funnel tested"). Since
  the mobile drawer already caps at one level, the main thing to verify post-launch is that it now
  shows the *right* one level (the 6 new items) rather than the old 4, and that the drawer's accordion
  toggle still behaves correctly with the new item count.
- **Desktop hover flyout** — verify the CSS still lays out cleanly with 6 flat items instead of 4.
- **Redirect check** — confirm `/shop-cavallo/` 301s correctly and its orphaned attachment children
  don't throw 404s instead of resolving.

## Risks

- **Shipping before Carole's lock repeats the exact mistake this gate exists to prevent.** Treat this
  document as pre-lock: the categories and slugs may still move.
- **Cannibalization if Acute Laminitis and the laminitis-guide/FAQ work (`next-actions.md` item 2)
  drift out of sync.** They are the same destination; keep them coordinated, not two efforts.
- **The hub gate-widening (`cavallo_is_hoofboot_hub()`) is the one item that needs an engineer, not
  just a content edit.** If it slips, the 4 animal categories still work as plain product archives —
  they just look bare next to the hub until that lands.

## Non-goals

- No change to `/shop/`, the bare WooCommerce archive.
- No re-parenting or URL changes to any existing boot-model or accessory category.
- No new "custom link" capability for the homepage carousel block — Acute Laminitis gets a separate
  homepage callout instead of forcing it into the taxonomy-only carousel.
- No newsletter feature build — flagged for a later decision, not designed here.

## Success criteria

1. "Shop" nav shows exactly one hover level on desktop, matching what mobile already enforces:
   Horse, Donkey, Mini, Draft, Acute Laminitis, Accessories.
2. The 4 animal-type category pages exist, are populated with real products via a second category
   tag (no existing product URLs changed), and are linked from the hub's "By Horse Type" grid.
3. Acute Laminitis's nav slot points at `/hoof-boots-for-laminitis/` once `next-actions.md` item 2
   ships it — not a duplicate page.
4. `/shop-cavallo/` no longer exists as a live destination; it 301s to the hub.
5. Homepage's "Shop by Style" carousel shows the new 5 tiles (4 categories + Accessories); hero and
   Featured-Products CTAs no longer point at `/shop-cavallo/`.
6. Mobile and desktop nav tested and confirmed to show the same one-level structure.
