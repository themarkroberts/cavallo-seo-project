# Working in this repo

No framework. Node 22 runs TypeScript directly — no bundler, no transpiler, no build step.
Relative imports must include the `.ts` extension.

**Read `docs/HANDOFF-2026-08-04.md` first.** It records verified credentials, open questions, and
specific mistakes not to repeat. Then `state/where-we-are.md` and `state/next-actions.md`.

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
- **Never re-run `scripts/flag-gsc-review.ts --apply`** without `--force`. It aborts deliberately;
  re-flagging cleared rows destroys real decisions.
- **SEO branch only. Never touch `dev` or `main` of the Cavallo site.** Mark's standing instruction,
  2026-08-05: this project works on SEO only. Edit the WordPress site *exclusively* through the pinned
  worktree at `.worktrees/seo` (`config.ts` `workRepo.worktree`, or the gitignored `wp-seo` symlink).
  **Never run git commands or edit files in `app/public/wp-content`** — that checkout floats between
  branches and moved from `dev` to `main` mid-session once already. To read another branch, use
  `git -C <worktree> show <branch>:<path>`; never check one out.
- **Push the site repo with `origin`, never `Cavallo`.** `Cavallo` is SSH and its auth is broken, so
  its remote-tracking refs are frozen at 2026-07-09 — any ahead/behind count measured against it is
  fiction. `git fetch origin` and compare against `origin/<branch>` before trusting git's counts.
- **Pushing `seo` deploys to cavallo.seo.markroberts.io immediately.** `deploy-seo.yml` fires on push
  with no staging step. Commit freely; **never push without explicit approval.**
- **Know which source owns which truth.** Three records of this project exist and have contradicted
  each other. **Execution** (what is built) = the `seo` branch of `themarkroberts/cavallo`, read via
  the gitignored `wp-seo` symlink or `config.ts` `workRepo`; if a document disagrees with the branch,
  the branch wins. **Analysis** = `state/`. **Strategy** = `reference/`; Notion is an archive now, not
  a source. **Tasks** = the Notion Project Tasks database, read-only. Full reasoning in
  `state/decisions.md`, 2026-08-04.
- Zero new dependencies without asking.
