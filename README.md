# Cavallo SEO project

Project state for the Cavallo Inc. SEO engagement, as version-controlled files plus a
dashboard generated from them.

## Using it

**Easiest:** double-click `Cavallo Dashboard.command` in Finder (or keep it in your Dock).
It fetches fresh numbers, rebuilds, and opens the dashboard. Takes about 30 seconds.

Or from a terminal:

```bash
npm start         # refresh + rebuild + open, all in one
npm run build     # rebuild only, no fetching (instant)
npm run check     # typecheck + tests
```

### Credentials

Google credentials come from the sibling `../mrc-marketing/.env`, which both scripts load
before `.env.local`. Nothing Google-related needs duplicating here — `lib/env.ts` maps the
name differences. Note that MRC's `GOOGLE_ADS_REFRESH_TOKEN` is the working one; its
`GOOGLE_REFRESH_TOKEN` is blank.

Put anything MRC does not provide in `.env.local` (see `.env.local.example`). Values there
override the shared file.

`npm run build` works without any credentials; it just reports that metrics were never fetched.

## Where things live

| Path | What |
|---|---|
| `state/where-we-are.md` | Current step, what's blocked |
| `state/decisions.md` | Every decision, why, and when |
| `state/next-actions.md` | The ordered queue |
| `state/pages.csv` | All 1,154 pages and the single role each one has |
| `state/metrics.json` | Ahrefs and GA4 figures, snapshotted per refresh |
| `state/tasks.json` | Snapshot of the Notion task database |
| `learn/` | Why the strategy is what it is |
| `site-audit/` | The original one-off audit pipeline (Python) |
| `data/cavallo-history.ts` | Retained, unimported: the only offline copy of 36 keywords, pending the Notion extraction |

`dashboard.html` is generated and gitignored. `state/*.json` and `state/*.csv` are committed
deliberately — their diffs are the record of progress over time.

## How state changes

Tasks are managed in Notion and read from there. Everything else changes by editing the files in
`state/`, normally by asking Claude, so each change lands in git with its reasoning attached.

Nothing in this repo writes to Notion.

## Caveats that matter

Traffic figures come in two flavours and must never be merged:

- **Measured** — Search Console clicks and impressions, in `state/gsc.json`. Real counts:
  52,078 clicks across 4,629 pages in the last 12 months.
- **Estimated** — Ahrefs figures, in `state/metrics.json`. Educated guesses. The estimate the
  strategy was originally built on claimed only ~72 pages had organic traffic, undercounting
  reality by roughly 14x.

Search Console is **not** blocked for this domain and never was. Anything claiming otherwise is
stale.

`site-audit/build_disposition_map.py` is retired as a generator. `state/pages.csv` now holds
human review decisions and re-running the classifier would overwrite them.
