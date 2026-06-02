# CLAUDE.md — Cavallo Client Portal

## Project
A branded, private, client-facing SEO dashboard for one client (Cavallo Inc.), built multi-tenant so more clients can be added by config alone. Deployed on Vercel at a dedicated subdomain (e.g. dash.markroberts.io). It shows project progress, task status, and SEO performance — framed so progress is legible even while the underlying numbers are still declining (see **Measurement framing** — the reason this project exists).

Audience: the client's CEO. Single-scroll, full-detail view. All copy is first person ("I"); never include hours, pricing, or team/contractor names.

## Stack
- Next.js (latest, App Router) + TypeScript
- Tailwind CSS
- Recharts for charts
- Vercel hosting + Vercel Cron for scheduled refresh
- Vercel KV (Upstash Redis) for the snapshot cache
- All external data fetched server-side only (Route Handlers / server components)

## Architecture rules (do not violate)
1. Every API key/token is a server-side env var only. Never import one into a client component or include it in any payload sent to the browser.
2. Never call external APIs (GA4, GSC, Ahrefs, Notion) during a page render. A Vercel Cron job fetches on a schedule and writes a per-client snapshot to KV; pages read only that snapshot.
3. The browser only ever receives data already filtered to the current client. No other client's data enters a client-visible payload.
4. Multi-tenant by config: a `clients` map keyed by slug drives everything. New client = one config entry + credentials.
5. Client-facing copy: first person, no hours/pricing/contractor names.

## Routes & access
- Page route `/[client]` (e.g. `/cavallo`).
- Private URL: middleware requires `?k=<PORTAL_ACCESS_TOKEN>`, sets it as an httpOnly cookie on first visit, and 404s without it. This is obscurity + a shared secret; leave a clean seam for real per-client auth later.
- Cron route `/api/cron/refresh` guarded by a `CRON_SECRET` bearer check.

## Data model
```ts
type MonthPoint = { month: string; value: number };
type ClientSnapshot = {
  lastUpdated: string;
  visibility: MonthPoint[];   // Ahrefs org_traffic, monthly
  sessions: MonthPoint[];     // GA4 organic sessions, monthly
  revenue: MonthPoint[];      // GA4 organic revenue, monthly
  targetKeywords: { keyword: string; position: number | null; prev: number | null }[];
  competitor: { label: string; ourTraffic: number; theirTraffic: number };
  tasks: { name: string; status: string; due: string | null }[];
  roadmap: { phase: string; status: string }[];
  documents: { label: string; url: string }[];
  nextSteps: string[];
};
```
Cron builds it; pages read it from KV under `snapshot:<client>`.

## Measurement framing (the differentiator — implement carefully)
The client starts from a multi-year decline, so raw month-over-month will look flat or down early even when the work is succeeding. The framing prevents that misread.
- Order metrics on the page as a lead→lag chain: **visibility/rankings → organic sessions → revenue.** Rankings move first; sessions track revenue at ~0.7; revenue lags. State the chain on the page in one line.
- Every time-series shows three series: **actual**, **prior-year same month (YoY)**, and an **expected path** = a linear trend fit to the pre-project period (months up to and including May 2026, in the appendix). After June 2026 the gap between actual and expected IS the project's effect — shade and label it.
- Revenue is de-emphasised: smaller, lower on the page, YoY framing only, labelled "lagging indicator."
- Draw the fixed baseline reference line (1 June 2026 snapshot) on relevant charts.
- Include a short context note: the site begins from a declining base; arresting the decline is the early goal. Never show a bare month-over-month delta as a headline.

## Sections / components
1. `AtAGlance` header — current phase, % complete, next milestone, last-updated.
2. `PerformanceChain` — the three charts in lead→lag order with the framing above.
3. `CompetitorCompare` — Cavallo vs Scoot Boots organic visibility.
4. `Roadmap` — the six project phases with status.
5. `ThisMonthTasks` — current month's tasks + status (Cavallo-filtered).
6. `Documents` — links to client-safe deliverables.
7. `NextSteps` — what's coming.

## Data wiring
**GA4** — property 319655127, Data API runReport (proven working):
```
POST https://analyticsdata.googleapis.com/v1beta/properties/319655127:runReport
{
  "dateRanges":[{"startDate":"2024-01-01","endDate":"today"}],
  "dimensions":[{"name":"yearMonth"}],
  "metrics":[{"name":"sessions"},{"name":"totalRevenue"},{"name":"ecommercePurchases"}],
  "dimensionFilter":{"filter":{"fieldName":"sessionDefaultChannelGroup","stringFilter":{"matchType":"EXACT","value":"Organic Search"}}},
  "orderBys":[{"dimension":{"dimensionName":"yearMonth"}}]
}
```
Auth: Google service account with Viewer on the GA4 property.

**GSC** — Search Console API, scoped to the new pillar URLs once live (earliest-signal layer):
```
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{ENCODED_SITE}/searchAnalytics/query
{ "startDate":"...","endDate":"...","dimensions":["date","page"],"type":"web","rowLimit":1000 }
```
Same service account, added to the GSC property.

**Ahrefs** — API v3, Bearer token. Visibility:
```
GET https://api.ahrefs.com/v3/site-explorer/metrics-history?target=cavallo-inc.com&mode=subdomains&history_grouping=monthly&date_from=2024-01-01&select=date,org_traffic,org_cost
```
Target-keyword positions: site-explorer/organic-keywords filtered to the project list. Competitor: site-explorer/organic-competitors or batch-analysis for scootboots.com. Cache weekly — this is the only metered source.

**Notion** — `@notionhq/client`. Query the Tasks data source `f786c417-f5cd-4c4f-bbfb-89a5a88edb7a` filtered to the Client relation containing the Cavallo page `326bed7c-ca7b-812e-b0a7-c7b7de8175f2`. Read properties: Task (title), Status (select), Month (select), Due Date (date), Estimated Time (number).

## Multi-tenant config
```ts
export const clients = {
  cavallo: {
    slug: "cavallo",
    name: "Cavallo Inc.",
    projectStart: "2026-06-01",
    ga4PropertyId: "319655127",
    gscSiteUrl: "sc-domain:cavallo-inc.com", // CONFIRM: domain vs URL-prefix property
    ahrefs: { target: "cavallo-inc.com", mode: "subdomains" },
    competitor: { target: "scootboots.com", mode: "subdomains", label: "Scoot Boots" },
    notion: {
      tasksDataSourceId: "f786c417-f5cd-4c4f-bbfb-89a5a88edb7a",
      clientPageId: "326bed7c-ca7b-812e-b0a7-c7b7de8175f2",
    },
    baseline: { dr: 48, orgKeywords: 236, refDomains: 573, backlinks: 6199 },
  },
} as const;
```
Store each client's pre-project monthly series in `/data/<client>-history.ts` for the expected-path trend fit and for chart dev before live wiring.

## Caching / cron
- `/api/cron/refresh?client=cavallo` fetches all sources, builds the `ClientSnapshot`, writes it to KV.
- Schedule (vercel.json): GA4 + Notion nightly; Ahrefs weekly. Two cron entries, or one nightly cron that skips Ahrefs unless its cached block is >6 days old.
- Pages read the KV snapshot; set ISR `revalidate` hourly so a manual cron run surfaces quickly. Show the lastUpdated timestamp.

## Env vars
```
GA4_PROPERTY_ID=319655127
GOOGLE_SERVICE_ACCOUNT_JSON=        # full service-account JSON (or base64)
GSC_SITE_URL=sc-domain:cavallo-inc.com
AHREFS_API_TOKEN=
NOTION_TOKEN=
CRON_SECRET=
PORTAL_ACCESS_TOKEN=
# Vercel KV vars are injected automatically when you attach a KV store
```

## Build order (check in after each phase)
1. Scaffold Next.js + TS + Tailwind. Add the `clients` config, env loading, the `/[client]` route + access-token middleware. Deploy to Vercel early on a placeholder subdomain.
2. Attach Vercel KV. Define `ClientSnapshot`. Build the Notion section first (cheapest, near-live, immediate visible result).
3. GA4 sessions + revenue with baseline / YoY / expected-path framing. Seed charts from the appendix history before wiring live.
4. Ahrefs visibility + target-keyword positions (cached weekly) and the Scoot competitor compare.
5. GSC pillar-page impressions layer (earliest-signal tiles).
6. Documents + Next steps + AtAGlance header.
7. Cron wiring, layout polish, branding, last-updated, final deploy + DNS.

## Acceptance criteria
- No secret or SDK reachable from the browser; verify the client bundle.
- No external API called on page render; all reads come from KV.
- `/cavallo` returns 404 without the access token.
- Every time-series shows actual + YoY + expected-path, with the post-June gap labelled.
- Revenue is present but visually secondary and YoY-only.
- Adding a second client requires only a new `clients` entry + its credentials.

## Prerequisites (Mark provides — the only real blockers)
- A Google Cloud service account with Viewer on GA4 property 319655127, added as a user on the GSC property. Confirm whether GSC is a domain property (`sc-domain:cavallo-inc.com`) or URL-prefix, and set `GSC_SITE_URL` to match.
- An Ahrefs API v3 token (API plan).
- A Notion internal integration token, with the Tasks database, project hub, and Foundation page shared to it.
- A Vercel project, an attached Vercel KV store, and the subdomain DNS (CNAME to Vercel).
- All env vars above set in Vercel.

## Appendix — seed data (move to /data/cavallo-history.ts)
GA4 organic channel, monthly — `yearMonth, sessions, revenue_usd, purchases`:
```
202401,8104,27330,175
202402,7368,24238,144
202403,8040,45449,274
202404,7559,28894,189
202405,7225,35749,212
202406,7659,39925,225
202407,7537,40102,249
202408,6986,38252,254
202409,6603,41709,252
202410,6205,31786,198
202411,5464,39843,197
202412,4610,23949,152
202501,4828,16906,121
202502,3878,14845,97
202503,4930,33373,195
202504,4617,16695,116
202505,4725,25682,153
202506,5403,30173,181
202507,5661,30179,191
202508,5854,37770,218
202509,5393,29767,186
202510,5074,23132,141
202511,3830,28200,148
202512,3300,18644,114
202601,3365,15169,90
202602,2735,15496,93
202603,5474,35389,183
202604,6989,38968,202
202605,4130,21585,117
```
Ahrefs visibility, monthly — `yearMonth, org_traffic, org_value_usd`:
```
202401,4627,3344
202402,4889,3487
202403,5008,3444
202404,5518,3761
202405,5627,3639
202406,6236,3675
202407,6088,3481
202408,5936,3596
202409,5993,3517
202410,6229,3787
202411,5239,3266
202412,5450,2862
202501,4570,2736
202502,4200,2655
202503,4596,2550
202504,5062,3109
202505,5036,3000
202506,5711,3740
202507,6442,4108
202508,6316,4051
202509,6206,3928
202510,5551,3633
202511,4972,3358
202512,4997,3339
202601,4523,2841
202602,4389,2841
202603,4601,3168
202604,4087,2596
202605,3414,2062
```
Baseline (1 June 2026, fixed): DR 48; organic keywords (top 100) 236; referring domains 573; backlinks 6,199. Organic sessions ↔ organic revenue correlation over this period ≈ 0.7.
