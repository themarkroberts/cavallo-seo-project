# Cavallo nav restructure — Phase 3 shop funnel + full-site mega menu (design)

**Date:** 2026-08-13
**Status:** awaiting Carole's lock on the 5-category scheme (Part 1) — Part 2 is Mark's own call,
not gated on Carole
**Phase:** 3 of 6 (August 2026), **due this month** per `reference/01-roadmap.md` — Part 1 is the
Phase 3 deliverable; Part 2 is a scope expansion Mark asked for in the same session, not on the
roadmap under its own line item

---

# Part 1 — Shop funnel (the Phase 3 deliverable)

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
reachable. The one-hover-level request isn't a new constraint — it's already true on mobile.

| | Before | After |
|---|---|---|
| Top level | Shop | Shop |
| Level 1 (under Shop) | Hoof Boots · Saddle Pads · Other Products · **Best Boot Warranty** | Horse · Donkey · Mini · Draft · Acute Laminitis · Accessories |
| Level 2 | Trek · Simple · Sport · Mini · BFB · LEB · ELB · Bling (under Hoof Boots) | *(none — collapsed)* |

`Best Boot Warranty` is currently a content link mixed into the category tier with no clean category
home — move it to the footer, or a link inside category pages, while this nav gets touched anyway.

**Accessories keeps its own nav slot** rather than folding entirely into the 5 categories: it earns
real independent search traffic (`hoof-boot-pads` alone: 434 clicks/12mo, more than several boot
models) from people who already know they want a pad, not an animal. It is *also* cross-sold
contextually within each of the 5 category pages — both, not either/or.

**Saddle Pads and Pro-Flex Splint Boots are both removed entirely, not folded in** (Mark: Saddle Pads
2026-08-13, Splint Boots 2026-08-14): Cavallo is discontinuing both product lines. The Shop
mega-menu's secondary strip (see Part 2) is Other Products · Canine · Clothing — no Saddle Pads, no
Pro-Flex Splint Boots. The live `/product-category/saddle-pads/` tree (12,403 combined GA4 views/12mo
— real traffic, not nothing) and `/product-category/pro-flex-splint-boots/` (1,056 GA4 views/12mo)
each need their own disposition-map treatment once their discontinuation actually executes
(PRUNE/301, handling support for prior buyers) — that's a catalog decision on its own timeline, out
of scope for this nav spec. Saddle Pad FAQ and Saddle Pad Technology (previously homed under Get Boot
Smart) are dropped for the same reason — no new home needed for content about a line that's going
away.

## `/shop-cavallo/` — corrected 2026-08-13

**Earlier draft of this spec got this wrong and said `/shop-cavallo/` retires. It doesn't.** The
"Shop" nav item's click target (not just its hover dropdown) is `/shop-cavallo/` — confirmed from the
live nav markup (cached crawl, `site-audit/html/8.html`). It is the site's actual shop landing page,
not a legacy artifact — its "basically useless" framing (Mark) refers to its *current thin content*,
not its role. **It gets rebuilt as the umbrella shop landing page**: the same 5-6 tiles as the Shop
mega-menu and the homepage carousel (Horse/Donkey/Mini/Draft/Acute Laminitis/Accessories), so clicking
"Shop" itself — not just hovering — lands somewhere coherent. No redirect, no retirement.

`/shop/` (the bare WooCommerce default archive, 1,360 GA4 views/12mo, mostly pagination noise) is the
actually-useless one (confirmed, Mark 2026-08-13) — leave it alone, not part of the funnel, not worth
touching this cycle.

## Homepage changes

Homepage is a plain WP Page (`page.php`, `the_content()` only — no `front-page.php`), built from
ACF/Gutenberg blocks. Current shop-relevant blocks, top to bottom:

1. **Hero** — CTA "Shop Hoof Boots" → `/product-category/hoof-boot/`
2. **Featured Products** — CTA "Shop All" → `/shop-cavallo/` (stays; `/shop-cavallo/` is being rebuilt,
   not replaced — see above)
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
sets up the Phase 4 goal of properly differentiating the floating-toe design).

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
by default. **Recommended: a term-meta boolean flag**, settable per category from wp-admin, so future
categories can opt into the hub layout without another code deploy. A hardcoded slug allowlist is the
faster fallback if the term-meta version doesn't fit the sprint.

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

## What still needs doing outside this repo

- **Carole locks the scheme.** This document is either the thing she signs off on, or the draft that
  gets adjusted until she does. Nothing here is real until that happens.
- **Confirm product-to-category mapping** for edge cases — e.g., does a Trek boot in a mini size
  belong in Horse, Mini, or both?
- **Category descriptions** — buyer's-guide copy for each of the 4 new archive pages.
- **Boot-to-accessory pairings** — which pads/straps/studs get cross-sold on which category page.
- **Saddle pad line-discontinuation disposition** — separate catalog decision, own timeline.
- **Newsletter feature** — mentioned in the roadmap's Phase 3 team role, not scoped here.

## Testing plan

- **Mobile funnel** — verify the drawer shows the *right* one level (the 6 new items), not the old 4.
- **Desktop hover flyout** — verify the CSS lays out cleanly with 6 flat items instead of 4.
- **`/shop-cavallo/` rebuild** — confirm the "Shop" click target (not just hover) renders the new
  6-tile landing experience.

## Risks

- **Shipping before Carole's lock repeats the exact mistake this gate exists to prevent.**
- **Cannibalization if Acute Laminitis and the laminitis-guide/FAQ work (`next-actions.md` item 2)
  drift out of sync.** Same destination — keep coordinated, not two efforts.
- **The hub gate-widening (`cavallo_is_hoofboot_hub()`) needs an engineer, not just a content edit.**

## Success criteria

1. "Shop" nav shows exactly one hover level on desktop: Horse, Donkey, Mini, Draft, Acute Laminitis,
   Accessories — matching what mobile already enforces.
2. The 4 animal-type category pages exist, are populated with real products via a second category
   tag (no existing product URLs changed), and are linked from the hub's "By Horse Type" grid.
3. Acute Laminitis's nav slot points at `/hoof-boots-for-laminitis/` once `next-actions.md` item 2
   ships it — not a duplicate page.
4. `/shop-cavallo/` is rebuilt as a real 6-tile shop landing page — no longer thin/orphaned.
5. Homepage's "Shop by Style" carousel shows the new 5 tiles (4 categories + Accessories).
6. Mobile and desktop nav tested and confirmed to show the same one-level structure.
7. No saddle-pad content or links appear anywhere in the new structure.

---

# Part 2 — Full-site nav reimagining (mega menu)

Scope added by Mark in the same session, on top of the Phase 3 deliverable: "so much of the
navigation dedicated towards education and very little towards the actual shop" — and whether the
new pillar pages (2 of 3 not yet live on production) should get real nav presence. Not gated on
Carole; this is Mark's own call to make.

## The data

12 months of GA4 pageviews (2025-08-11 to 2026-08-10), rolled up by matching every link actually in
today's nav tree (extracted from the cached crawl, `site-audit/html/8.html`) to its pageview count:

| Nav branch | Links | Pageviews (12mo) | Share |
|---|---|---|---|
| Shop | 26 | 201,323 | 80.4% |
| How to Measure | 1 | 25,240 | 10.1% |
| Get Boot Smart! | 8 | 11,612 | 4.6% |
| Contact Us! | 1 | 8,018 | 3.2% |
| Behind the Brand | 7 | 2,562 | 1.0% |
| What's New? | 6 | 812 | 0.3% |
| Reviews | 2 | 699 | 0.3% |

**4 of the site's 7 top-level nav items — Get Boot Smart, Reviews, Behind the Brand, What's New — are
57% of the top-level slots and 21 of the ~51 nav links, and carry only 6.2% of nav-linked traffic
combined.** Reviews and What's New are each nearly dead standalone (under 1,000 views/year across all
children). Meanwhile How to Measure, a single un-nested link, outperforms three of those entire
branches combined. (Honest caveat: this measures total visits to each destination by any channel, not
proof people click the nav item specifically — GA4 isn't instrumented on nav clicks. But a page almost
nobody visits by any channel doesn't obviously earn a dedicated top-level slot either way.)

**Neither Pillar 2 (`/horse-hoof-care/`) nor Pillar 3 (`/barefoot-horse-care/`) is reachable from nav
today.** Pillar 2 gets a trickle of stray traffic (18 views); Pillar 3 isn't tracked at all — both
consistent with `state/where-we-are.md`'s note that both 404 on production. "Make the pillars a focus"
means giving them a nav home that doesn't exist yet, designed for the state once they publish (Mark's
call, 2026-08-13) — not fixing a bad placement.

## Mega menu: recommended

Today's dropdown is plain CSS `:hover` flyouts with no JS and no multi-column layout — a mega menu is
real (contained) engineering, not a settings toggle. Recommended, scoped:

- **Shop** — image-tile mega-menu: a primary row of Horse/Donkey/Mini/Draft/Acute Laminitis/
  Accessories, a smaller secondary strip for Other Products/Canine/Clothing (no Saddle Pads, no
  Pro-Flex Splint Boots — both discontinued). Mirrors `/shop-cavallo/`'s rebuilt content (see Part 1)
  and the homepage carousel — one visual pattern, three surfaces.
- **Learn** — replaces Get Boot Smart's flat list with organized columns (below).
- **About** — replaces three dying branches with one organized mega-menu (below).
- **How to Measure** and **Contact Us** stay exactly as single standalone links — a genuine top
  performer and a high-utility page don't need a container.

## Top-level structure: 5 items (Option A, confirmed 2026-08-13)

**Shop · How to Measure · Learn · About · Contact Us**

Two other structures were considered and rejected in favor of this one:
- *Keep Reviews standalone* — rejected on reflection (see below): the E-E-A-T argument for a
  standalone Reviews slot doesn't hold up under scrutiny once you separate content-level E-E-A-T
  (bylines, schema, citations — lives on pillar/spoke pages regardless of nav) from customer-testimonial
  social proof (a conversion signal, not an AI-citation lever, and already rendered ambiently
  sitewide via the theme's global "Voices from the Field" block). Given Reviews' standalone traffic is
  0.3% of nav-linked views, a dedicated slot isn't earning its place.
- *Push weak branches to the footer instead of a merged About* — rejected: About's own content
  includes real E-E-A-T-relevant material (team, research, the WKU study) this project's own build
  standard leans on; folding it into one organized mega-menu keeps it discoverable without pretending
  it's a high-traffic destination.

## Learn mega-menu — designed for the post-publish state (Pillar 2 and 3 live)

**Click target:** `/things-to-know/` repurposed as the Learn landing page — it's the existing
education hub (1,649 GA4 views), reusing an existing URL beats minting a new one. Its `pages.csv` row
currently ties it specifically to Pillar 2 (laminitis/founder); that tag needs a review flag once it
becomes a cross-pillar landing page rather than laminitis-specific content.

- **Hoof Health & Conditions** (Pillar 2 hub, `/horse-hoof-care/`)
  - Laminitis & Hoof Issue Guide (`/your-cavallo-laminitis-healing-plan/`) — Pillar 2 canonical
  - Navicular (`/is-navicular-disease-always-the-beginning-of-the-end/`) — Pillar 2 canonical,
    **3,537 GA4 views/12mo and currently unreachable from any nav item today.** Second-biggest single
    piece of Pillar 2 content after the laminitis guide; belongs here explicitly, not just "linked
    from the hub eventually."
  - Using Cavallos for Hoof Rehab (`/using-cavallo-boots-for-hoof-rehab/`) — Pillar 2 KEEP-SPOKE
  - Other condition spokes (contracted heels, white line, abscess, thrush, DSLD) link from the Pillar
    2 hub itself as they publish, rather than each getting an individual mega-menu row — the hub's own
    spoke-links block is the right density for those, not the nav.
- **Barefoot Horse Care** (Pillar 3 hub, `/barefoot-horse-care/`) — **added here, not a remap; no
  current nav link exists for this branch today.**
  - Why Barefoot? (`/why-bare-foot/`) — re-homed here, corrected 2026-08-13. Its `pages.csv` tag says
    Pillar 2, but the actual page content (read directly, `site-audit/content/6727.txt`) is
    unambiguously Pillar 3: a "Barefoot Horse – Trims" section, a citation of Gene Ovnicek's wild-horse
    self-trimming research (the exact model Pillar 3 is anchored on), and a closing CTA — "keep your
    horse barefoot... using horse boots when you ride" — that is verbatim the Pillar 3
    barefoot-plus-boots-for-protection bridge described in `reference/02-content-strategy.md`. The
    `pages.csv` "Pillar 2 (hoof health/anatomy)" tag almost certainly triggered on generic anatomy
    vocabulary ("hoof mechanism," "blood circulation") without weighing what the page is actually
    about — the same failure mode AGENTS.md already documents for "boots" over-tagging Pillar 1.
    **Flagged for `next-actions.md` item 1's review as a confirmed misclassification**, not a guess.
  - `/category/the-barefoot-horse/` (old archive) — `pages.csv` still says "KEEP-CANONICAL, convert
    thin archive in place," but `reference/04-build-standard.md`'s later (2026-06-27) plan change
    supersedes that: build Pillar 3 as a net-new standalone page, then **301 this old archive into
    it**. The `pages.csv` row is stale against that later decision — flag, don't silently edit.
- **Buying & Sizing Guides**
  - Hoof Boots FAQ (`/faq/`, includes the Saddle Pad FAQ anchor's former slot — dropped, see Part 1)
  - How to Measure — a second entry point here in addition to its own top-level slot; no harm in two
    paths to the site's single biggest utility page
  - Ask an Expert (`/ask-an-expert/`) — a utility form, not really "content"; `pages.csv` itself tags
    it off-topic. Placed here as a quick-link, but flag its untracked duplicate: `/things-to-know/
    ask-an-expert/` gets more traffic (1,917 vs 882 GA4 views) and isn't in `pages.csv` at all — same
    disease as the how-to-measure duplicate pair below.

**Open item, not resolved here:** `/how-to-measure/` (in nav, 25,231 views) has an untracked twin,
`/things-to-know/how-to-measure/` (not in nav, 26,877 views — bigger). Point How to Measure's nav
target at whichever wins `next-actions.md` item 1's review; don't hardcode today's smaller one.

## About mega-menu

- **Our Story** — About (`/about/`), Meet the Team, Cavallo Gives, Associate Sellers Program,
  Affiliate Program, Donations and Sponsorships
  - Research Behind Cavallo Boots (`/why-are-cavallo-hoof-boots-the-best/`) — anchors the Western
    Kentucky University hoof-boot study, which `reference/04-build-standard.md` names as the specific
    evidence source for the site's whole DVM-review/E-E-A-T strategy. Its `pages.csv` tag says Pillar
    3 (barefoot), which is defensible — the WKU study compares boots to metal shoes, which is core to
    the barefoot argument — but the content reads at least as much like the same "why Cavallo
    technology" evidence as Hoof Boot Technology below. Not a clean single-pillar fit; placed in About
    for its brand-credibility role, with a cross-link recommended from Learn's Buying & Sizing column
    too, rather than forcing one home.
  - Hoof Boot Technology (`/our-hoof-boot-technology/`) — Pillar 1/commercial per `pages.csv`; the
    pillar-1 doc already flags it for re-homing its cannibalizing anchors to the Shop hub. Pairs with
    Research Behind Cavallo Boots above as the same kind of "why Cavallo" evidence page, just
    currently split across two different orphaned branches — **worth consolidating into one page**
    once this nav ships, rather than maintaining two.
- **Reviews** (not "Social Proof" — plain language, matching the site's own existing label) — Real
  Stories, Horse Industry Experts, Celebrities, Submit Your Review
- **News & Updates** — Newsletters, Cavallo in the Media, Video Library, Notable Blogs, the What's New
  hub itself
  - Educational Articles (`/category/horsecare-educational-resources/`) **drops from nav entirely** —
    already tagged NOINDEX in `pages.csv` as a thin auto-archive. Clean kill, nothing to remap.

## Remaining flags for `next-actions.md` item 1 (not resolved here, just surfaced)

1. **Two "why Cavallo" evidence pages, split across two orphaned branches** — Hoof Boot Technology
   (Get Boot Smart) and Research Behind Cavallo Boots (Behind the Brand). Same audience, same job.
   Worth merging into one page.
2. **`/why-bare-foot/` is confirmed mistagged** Pillar 2 → should be Pillar 3 (content-verified, see
   above).
3. **`/equine-nutrition/`** is `pages.csv`'s Pillar 2 KEEP-CANONICAL for the diet spoke, but
   `reference/02-content-strategy.md`'s later (June 26 audit) call is "Diet closed — OUT of scope
   (Carole: not a nutrition authority)." Later decision should win; `pages.csv` row looks stale.
   Unrelated to nav directly — flagging because this sweep surfaced it, not resolving it here.
4. **Ask an Expert has an untracked duplicate** that outperforms the tracked one (see above) — same
   pattern as the How to Measure pair.
5. **The Donkey category has three live URL variants in GA4** —
   `/product-category/leb-long-ear-hoof-boots-for-donkeys/`,
   `/product-category/hoof-boot/leb-long-ear-hoof-boots-for-donkeys/`, and a singular-"boot" typo
   variant. Worth a cleanup pass when building the Donkey category page in Part 1, since it's already
   being touched.
6. **`/category/the-barefoot-horse/`'s `pages.csv` row is stale** against the later plan-change to
   301 it into the new Pillar 3 hub rather than convert it in place.
7. **`/whats-new/` and `/cavallo-gives/` carry loose pillar tags** (Pillar 2 and Pillar 1
   respectively) that don't obviously match their actual content — lower-confidence flags than #2,
   worth a look during the same review pass rather than a dedicated one.

## Non-goals (Part 2)

- Not rebuilding every individual spoke/FAQ/download page's placement — the nav's job is to reach the
  top of each cluster; the pillar hubs' own internal spoke-links blocks handle the rest.
- Not resolving the diet/`equine-nutrition/` staleness (#3 above) — flagged, not fixed, here.
- Not building the mega-menu itself in this document — this is the design; implementation is a
  follow-on plan once Mark reviews this.

## Success criteria (Part 2)

1. Top-level nav is 5 items: Shop, How to Measure, Learn, About, Contact Us.
2. Shop and Learn render as real mega-menus (multi-column/tiled), not flat `:hover` lists.
3. Learn includes both live pillar hubs (2 and 3) plus Navicular and Why Barefoot in their corrected
   homes.
4. About consolidates Reviews, Behind the Brand, and What's New into one mega-menu with three clearly
   labeled sections, using plain labels (e.g., "Reviews," not "Social Proof").
5. `/category/horsecare-educational-resources/` no longer appears anywhere in nav.
6. The 7 flags above are logged against `next-actions.md` item 1 for the human review pass, not
   silently fixed by editing `pages.csv` directly.
