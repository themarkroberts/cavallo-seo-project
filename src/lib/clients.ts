export type ClientConfig = {
  slug: string;
  name: string;
  projectStart: string;
  ga4PropertyId: string;
  gscSiteUrl: string;
  ahrefs: { target: string; mode: string };
  competitors: { target: string; mode: string; label: string }[];
  notion: {
    dataSources?: {
      tasks: string;
      keywordTracking: string;
      organicVisibility: string;
      ga4Sessions: string;
      ga4Revenue: string;
      competitorTraffic: string;
    };
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
    competitors: [
      { target: "scootboots.com", mode: "subdomains", label: "Scoot Boots" },
      { target: "renegadehoofboots.com", mode: "subdomains", label: "Renegade Hoof Boots" },
      { target: "easycareinc.com", mode: "subdomains", label: "EasyCare" },
      { target: "softrideboots.com", mode: "subdomains", label: "Softride Boots" },
    ],
    notion: {
      dataSources: {
        tasks: "ff3ec7b0-97d8-42a0-b323-5eb8badc3a1e",
        keywordTracking: "ea4a93e0-42de-83ee-b480-07db102b5c76",
        organicVisibility: "d33a93e0-42de-8390-b51b-87a4f969e86c",
        ga4Sessions: "aeba93e0-42de-833d-8d16-0756b2693337",
        ga4Revenue: "67fa93e0-42de-8252-9faf-07cd1f6a78ed",
        competitorTraffic: "b7da93e0-42de-838e-bcc3-0769aa1d4492",
      },
    },
    baseline: { dr: 48, orgKeywords: 236, refDomains: 573, backlinks: 6199 },
  },
};

export function getClient(slug: string): ClientConfig | undefined {
  return clients[slug];
}
