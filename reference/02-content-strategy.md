> **Imported 2026-08-04** from the Notion export `cavallo-seo-export.zip` — `03-content-strategy-pillar-pages.md`.
> Notion is now an archive; this file is authoritative. Figures inside may be Ahrefs
> **ESTIMATES** — check each label before trusting a number.

# 🎯 Content Strategy — Pillar Pages

Our content is organized around three pillar pages. Each pillar targets a cluster of related keywords. As pillar pages publish and mature, we expect to see these keywords climb in search rankings.

Full playbooks for each pillar (wireframes, audits, outbound-link maps) live in `pillars/`:
- `pillars/pillar-1-hoof-boot-guide.md`
- `pillars/pillar-2-hoof-health-conditions.md`
- `pillars/pillar-3-barefoot-horse-care.md`

---

## Pillar 1 — The Hoof Boot Guide

**Intent:** Commercial-informational hub

The commercial spine of the content strategy. This comprehensive guide targets the highest-intent search terms — people actively looking for hoof boots. It covers what they are, types and use cases, sizing, and comparisons. Every product page links back here, and this page routes to the shop.

## Pillar 2 — Hoof Health & Conditions

**Intent:** Authority + AI-answer pillar

The highest-volume pillar and the trust engine. This page establishes Cavallo as an authority on hoof health — not just a boot seller. It targets the massive laminitis search cluster (10,000+ monthly searches) and bridges to the patented acute-laminitis boot that competitors can't match.

## Pillar 3 — Barefoot Horse Care

**Intent:** Credibility + AI-answer pillar

The credibility pillar, anchored on the wild-horse self-trimming model. Scoot Boots' single biggest content winner is "how do wild horses maintain their hooves" — this is a direct content gap for Cavallo to take. Bridges to the boot range as protection for barefoot horses on rough terrain.

---

## Why This Structure

Scoot Boots (comparable DR to Cavallo) pulls more US organic traffic than Cavallo, and does it through an educational blog, not product pages — which validates the pillar/spoke approach. Cavallo's edge is twofold: the broadest product range in the category (the donkey boot, the draft/BFB, and the patented acute-laminitis floating-toe boot) and decades of hands-on expertise in hoof health. The pillar pages position Cavallo as the authoritative voice in hoof care — not just a boot seller — and route that authority to the products no competitor can match.

---

## Cross-Cutting Pre-Pillar Actions (Sitewide — not pillar-specific)

These items from the content reconciliation don't belong to a single pillar but must happen before/alongside the pillar work. Per-pillar actions and cannibalization live on each Pillar Playbook page.

### Sitewide NOINDEX batch (run in parallel — independent of pillar work)

- [ ] Newsletters (~22 dated issues: /newsletter/your-cavallo-news-*, year-in-review, etc.) — NOINDEX, keep live for users. Exception: /newsletter/your-cavallo-news-march-2023/ (1,793w, has organic equity) — confirm index vs noindex.
- [ ] All taxonomy / category archives (/category/blog/*, /category/*, /hoof-boot-testimonials/, /saddle-pad-testimonials/, etc.) — NOINDEX via Yoast.
- [ ] All /tag/* and /product-tag/* archives — NOINDEX.
- [ ] Author archives (/author/yvonne/, /author/rachel/, etc.) — NOINDEX.
- [ ] Paginated /page/N/ and /feed/ URLs — confirm non-indexable.

### Coverage gap — no-pillar / off-topic (disposition, mostly PRUNE)

- [ ] Off-topic stories → PRUNE/301 to nearest relevant page or homepage: /fun-halloween-horsey-facts/, /journey-with-wildebeests…/, /twenty-horsey-things-to-do-before-you-die/, /humanizing-your-horse/, /working-with-your-horses-unique-personality/, /athlete-or-couch-potato/, /are-you-treating-your-horse-with-bubble-wrap/
- [ ] Core / utility KEEP (confirm "None"/sitewide, no hoof pillar): /, /about/, /contact-us/, /privacy-policy/, /faq/ (hub), /cavallo-gives/, /ask-an-expert/, /cavallo-in-the-media/, warranty & returns pages
- [ ] Saddle-pad & canine product lines — off-pillar commercial; KEEP, cross-link from Pillar 1 only, no hoof-pillar assignment.

### Data validation / map hygiene

- [ ] Re-pull GSC (Pages report) once the connector is fixed, to validate the unmapped tail and the "confirm" newsletters — the reconciliation ran on Ahrefs only (GSC was unavailable).
- [ ] Backfill Content Disposition Map rows for all coverage-gap URLs across the three pillars; set Needs Review = true until confirmed.

---

## ⚠️ The level beyond the wireframes (cross-pillar — applies to all three)

> Lives here on the parent page because it applies to all three pillar playbooks, not just one. Each pillar's wireframe sits at the bottom of its own playbook.

1. **Canonical spoke briefs are the missing layer, and they're load-bearing.** The wireframes spec the *pillar* pages. The two-tier model only works if each canonical actually carries its KEEP-SPOKE links. Right now those onward links live in the "canonical carries:" lines — not yet a spec anyone can build from. Each canonical (laminitis, navicular, white line, abscess, thrush, transition, wild horse, trimming) needs its own brief: target terms, sections, which donors merge in, and **its required outbound links to its spokes**. Without that line in the brief, the spokes get orphaned the moment the canonical ships. Biggest gap.
2. **Merge-before-redirect sequencing gates go-live.** Several canonicals can't be linked from the pillar until their donors are merged and 301'd — and Pillar 2 carries live #1/#3 rankings on pages slated for redirect. Build order: spokes optimized → donors merged → *then* pillar links them.
3. **Open calls resolved.** Founder closed — a section within the laminitis canonical (Carole confirmed). Diet closed — OUT of scope (Carole: not a nutrition authority; the three diet articles stay live but unlinked from the hub). DSLD closed — IN scope (Mark ratified): a net-new spoke targeting dsld in horses (3,900, KD 1).
4. **On-page SEO depth not yet included.** The wireframes are structure + block content + internal links. Per-section word targets, H2/H3 keyword mapping, meta title/description, and FAQ schema are the next fidelity level — most valuable on Pillar 2's anatomy section.
5. **Pillar 1 "By Horse Type" Phase 3 dependency.** Ships with existing subcategory links; upgraded once Carole locks the 5-category shop-nav scheme.

---

## 🤖 AI-Citation & E-E-A-T Build Standard (applies to every pillar + spoke)

A June-26-2026 audit found that 10 of 12 priority target terms trigger Google AI Overviews, and those AI Overviews already cite competitor hoof-boot brands (Scoot Boots, Mad Barn, Hoof Boss) — Cavallo is absent from that citation set. The gap is FORMAT + E-E-A-T, not content volume. Every pillar and spoke build MUST follow this checklist:

- **Answer-first 40-60 word definition block** directly under the H1 (plain, declarative, entity-dense; no brand framing in sentence one).
- **FAQPage JSON-LD** on every Q&A-structured page; plus MedicalWebPage/Article schema with author, reviewedBy, datePublished, dateModified.
- **A "Medically reviewed by [Name], DVM" byline + credentials.** Highest-E-E-A-T lever — the single biggest reason Merck/vet-schools out-cite brand blogs on these YMYL animal-health topics. **Not a blocker (Mark, June 2026):** assume a reviewer will be secured and build every page review-ready (clinical structure, vet-source citations, a reserved byline slot); but do NOT publish a "medically reviewed by" claim until a named vet has actually signed off — a claimed-but-absent review is a false E-E-A-T signal. Until a reviewer is locked, publish the page without the claim. (Reviewer sourcing → ask Carole; anchor on Dr. Jennifer Gill / the WKU study.)
- **Symptom / stage / treatment content as TABLES or tight bullet lists**, not prose (AI Overviews preferentially lift tables).
- **Inline citations to authoritative vet sources** (Merck Veterinary Manual, AAEP, vet-school extension pages, peer-reviewed studies) — replace podcast/Wikipedia-grade links.
- **A labeled hoof-anatomy diagram with entity-rich alt text** (navicular bone, coffin bone, DDFT, impar ligament, frog, lamellae, etc.).
- **A visible "Last reviewed / updated" date kept current** (dateModified schema).
- **Commercial CTA kept BELOW the fold** — first 1-2 screens stay answer-only, or AI engines skip the page as ad-like.

---

## 📊 June 26 2026 Audit — cross-pillar corrections

- **Brand Radar baseline: none configured in Ahrefs.** Recommend creating a Brand Radar report (brand = Cavallo; competitors = Scoot Boots, Mad Barn, Hoof Boss; prompts on the six hoof conditions; sources = AI Overviews + ChatGPT + Perplexity) to measure AI-citation lift before/after the builds.
- **Missed hub-family opportunity (Pillar 2):** the strategy targeted horse hoof anatomy (2,400) + horse hoof care (600) but missed the high-volume hub above them — hooves (9,300/KD10), horse hoof (5,500/KD13), horse hooves (3,300/KD8), horse feet (1,400/KD5). Pillar 2 should target these as secondary head terms (roughly triples its volume ceiling). Caveat: "hooves" has diffuse intent and a .edu/Wikipedia-heavy top 5 (though a DR-24 nonprofit ranks #5, so entry is proven) — treat the very-high-DR ones as page-1 + AI-Overview-citation plays, not guaranteed top-5.
- **Winnability tiers for a DR-49 brand** (match ambition to the live SERP):
  - *Genuinely winnable (top-5 + AI-Overview citation realistic):* how do wild horses maintain their hooves (Scoot ranks #4), horse hoof trimming, DSLD, horse hoof abscess, white line disease, navicular (lower page 1) — plus horse boots, already #5/#8.
  - *Aspirational (target page-1 presence + AI-Overview citation, NOT top-5):* laminitis in horses, thrush in horses, horse hoof — all walled off in the top 5 by DR-76-97 vet manuals, vet-school extensions, Wikipedia, and NIH.
- **Keyword corrections applied to the playbooks:** horse hoof care 1,000→600; Pillar 3 re-anchored off "barefoot horse" (only 60/mo); laminitis cluster KD drifted up (laminitis KD11→14, laminitis in horses KD8→13); several "already ranking" claims corrected (see each playbook).
