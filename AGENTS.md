# Working in this repo

No framework. Node 22 runs TypeScript directly — no bundler, no transpiler, no build step.
Relative imports must include the `.ts` extension.

Read `docs/superpowers/specs/2026-08-04-project-dashboard-design.md` before changing structure.

## Rules

- **Nothing writes to Notion.** Read-only, task database only.
- **Fail loudly.** Never swallow an error and return empty or stale data in its place. The
  previous version of this project had 23 silent-failure paths and displayed two-month-old
  numbers as current.
- **Label traffic figures as Ahrefs estimates.** Search Console is blocked for this domain.
- **Never regenerate `state/pages.csv`** with `site-audit/build_disposition_map.py`. It holds
  human review decisions the classifier does not know about.
- Zero new dependencies without asking.
