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
  /** Ahrefs organic traffic ESTIMATE. Not measured clicks — GSC is blocked. */
  visibility: MonthPoint[];
  sessions: MonthPoint[];
  revenue: MonthPoint[];
  competitors: { label: string; traffic: number }[];
};

export type Task = { name: string; status: string; due: string | null };

export type TaskSnapshot = { fetchedAt: string; tasks: Task[] };

export type LearnDoc = { slug: string; title: string; body: string };

export type ProjectState = {
  whereWeAre: string;
  decisions: string;
  nextActions: string;
  learn: LearnDoc[];
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
