# Working in this repo

No framework. Node 22 runs TypeScript directly — no bundler, no transpiler, no build step.
Relative imports must include the `.ts` extension.

Read `docs/superpowers/specs/2026-08-04-project-dashboard-design.md` before changing structure.

## Rules

- **Nothing writes to Notion.** Read-only, task database only.
- **Fail loudly.** Never swallow an error and return empty or stale data in its place. The
  previous version of this project had 23 silent-failure paths and displayed two-month-old
  numbers as current.
- **Never conflate measured and estimated traffic.** `state/gsc.json` is MEASURED Search Console
  clicks. Ahrefs figures are ESTIMATES and were wrong by ~14x. Label both, always, separately.
  Search Console is NOT blocked for this domain — anything claiming otherwise is stale.
- **Never regenerate `state/pages.csv`** with `site-audit/build_disposition_map.py`. It holds
  human review decisions the classifier does not know about.
- **Run `npm run check` before committing.** Node strips types without validating them, so a
  type error will run happily and fail only at runtime. A real Notion-SDK type bug shipped this
  way once already and was caught only by an explicit `tsc --noEmit`.
- **Credentials are shared, not duplicated.** Google comes from `../mrc-marketing/.env` via
  aliases in `lib/env.ts`. Do not copy secrets into this repo.
- Zero new dependencies without asking.
