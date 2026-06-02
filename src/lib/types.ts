export type MonthPoint = { month: string; value: number };

export type ClientSnapshot = {
  lastUpdated: string;
  visibility: MonthPoint[];
  sessions: MonthPoint[];
  revenue: MonthPoint[];
  targetKeywords: { keyword: string; position: number | null; prev: number | null }[];
  competitor: { label: string; ourTraffic: number; theirTraffic: number };
  tasks: { name: string; status: string; due: string | null }[];
  roadmap: { phase: string; status: string }[];
  documents: { label: string; url: string }[];
  nextSteps: string[];
};
