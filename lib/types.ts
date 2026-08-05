export type Role =
  | "KEEP-CANONICAL"
  | "OPTIMIZE"
  | "KEEP-SPOKE"
  | "MERGE+301"
  | "REWRITE"
  | "NOINDEX"
  | "PRUNE";

export type PageRow = {
  url: string;
  pillar: string;
  role: Role;
  /** A live URL, or a "(NEW) ..." placeholder meaning the destination is unbuilt. */
  destinationUrl: string;
  evidence: string;
  source: "Seed" | "Auto";
  needsReview: boolean;
};

export type MonthPoint = { month: string; value: number };

export type Metrics = {
  fetchedAt: string;
  /** Ahrefs organic traffic ESTIMATE. Measured clicks live in `state/gsc.json`. */
  visibility: MonthPoint[];
  sessions: MonthPoint[];
  revenue: MonthPoint[];
  competitors: { label: string; traffic: number }[];
};

export type Task = { name: string; status: string; due: string | null };

export type TaskSnapshot = { fetchedAt: string; tasks: Task[] };

export type LearnDoc = { slug: string; title: string; body: string };

/** Where a deliverable stands. `built` means finished but not on production — the state
 *  this project kept losing track of, because "done" and "live" are not the same thing. */
export type DeliverableStatus = "done" | "built" | "in-progress" | "blocked" | "not-started";

/** One promised deliverable from the client-facing roadmap. */
export type Deliverable = {
  /** Stable dotted id, e.g. "1.2". Referenced from notes and decisions. */
  id: string;
  title: string;
  /** What Cavallo was told they would get, in the roadmap's own terms. */
  promised: string;
  /** Who owes it: Mark, Carole, or the Cavallo team. */
  owner: string;
  status: DeliverableStatus;
  /** Dated, verified justification for the status — or a plain statement that none exists. */
  evidence: string;
  /** Required when status is "blocked"; forbidden otherwise. Enforced by lib/phases.ts. */
  blockedBy?: string;
  /** Known defects that must be fixed before this ships. Empty when there are none. */
  defects: string[];
};

/** One month of the six-month engagement. */
export type Phase = {
  number: number;
  month: string;
  title: string;
  /** True for the phases actually being worked right now. */
  active: boolean;
  /** The outcome promised to the client for this phase. */
  outcome: string;
  note: string;
  /** What the Cavallo team owes back during this phase. */
  teamRole: string[];
  deliverables: Deliverable[];
};

/** state/phases.json — the client-facing commitment record. */
export type PhasesFile = {
  /** Where these commitments came from, so provenance never gets lost again. */
  source: string;
  updated: string;
  phases: Phase[];
};

export type ProjectState = {
  /** The six-month engagement, deliverable by deliverable. */
  phases: PhasesFile;
  whereWeAre: string;
  decisions: string;
  nextActions: string;
  learn: LearnDoc[];
  /** Strategy reference imported from Notion and the work repo. Empty if `reference/` is absent. */
  reference: LearnDoc[];
  pages: PageRow[];
  metrics: Metrics | null;
  tasks: TaskSnapshot | null;
  /** Measured Search Console traffic. Null until `npm run refresh` has run. */
  gsc: GscSnapshot | null;
};

/** One page's measured Search Console performance. */
export type GscStats = { clicks: number; impressions: number };

/** A raw Search Console page row, before URL normalisation. */
export type GscPage = { url: string } & GscStats;

/** state/gsc.json — measured traffic, refreshed. Separate from pages.csv, which holds decisions. */
export type GscSnapshot = {
  fetchedAt: string;
  startDate: string;
  endDate: string;
  /** Measured clicks per month, site-wide. */
  monthly: MonthPoint[];
  pages: GscPage[];
};
