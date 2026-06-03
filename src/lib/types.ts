export type MonthPoint = { month: string; value: number };

export type PhaseTask = {
  name: string;
  status: string;
  due: string | null;
  description?: string;
};

export type PhaseDetail = {
  id: string;
  title: string;
  month: string;
  status: "Complete" | "In progress" | "Not started";
  description: string;
  outcome: string;
  teamRole: string;
  tasks: PhaseTask[];
};

export type PillarPage = {
  id: string;
  title: string;
  url: string | null;
  status: "Published" | "In progress" | "Planned";
  description: string;
  intent: string;
  keywordIds: string[];
};

export type KeywordDetail = {
  id: string;
  keyword: string;
  volume: number;
  kd: number;
  position: number | null;
  prev: number | null;
  pillarId: string | null;
  currentRankingUrl: string | null;
  history: { month: string; position: number | null }[];
};

export type ClientSnapshot = {
  lastUpdated: string;
  visibility: MonthPoint[];
  sessions: MonthPoint[];
  revenue: MonthPoint[];
  targetKeywords: KeywordDetail[];
  competitors: { label: string; traffic: number }[];
  phases: PhaseDetail[];
  pillarPages: PillarPage[];
  documents: { label: string; url: string; category: string }[];
  nextSteps: string[];
  projectContext: {
    summary: string;
    goals: string[];
    approach: string;
    timeline: string;
    baseline: {
      dr: number;
      orgKeywords: number;
      orgTraffic: number;
      refDomains: number;
      backlinks: number;
      monthlyRevenue: number;
      monthlySessions: number;
    };
  };
};
