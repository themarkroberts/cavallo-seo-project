export type ClientConfig = {
  slug: string;
  name: string;
  projectStart: string;
  ga4PropertyId: string;
  gscSiteUrl: string;
  ahrefs: { target: string; mode: string };
  competitor: { target: string; mode: string; label: string };
  notion: {
    tasksDataSourceId: string;
    clientPageId: string;
  };
  baseline: {
    dr: number;
    orgKeywords: number;
    refDomains: number;
    backlinks: number;
  };
};

export const clients: Record<string, ClientConfig> = {
  cavallo: {
    slug: "cavallo",
    name: "Cavallo Inc.",
    projectStart: "2026-06-01",
    ga4PropertyId: "319655127",
    gscSiteUrl: "sc-domain:cavallo-inc.com",
    ahrefs: { target: "cavallo-inc.com", mode: "subdomains" },
    competitor: { target: "scootboots.com", mode: "subdomains", label: "Scoot Boots" },
    notion: {
      tasksDataSourceId: "f786c417-f5cd-4c4f-bbfb-89a5a88edb7a",
      clientPageId: "326bed7c-ca7b-812e-b0a7-c7b7de8175f2",
    },
    baseline: { dr: 48, orgKeywords: 236, refDomains: 573, backlinks: 6199 },
  },
};

export function getClient(slug: string): ClientConfig | undefined {
  return clients[slug];
}
