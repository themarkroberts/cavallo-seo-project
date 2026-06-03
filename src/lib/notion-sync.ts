import { Client } from "@notionhq/client";
import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { ClientConfig } from "./clients";
import type { ClientSnapshot, KeywordDetail, MonthPoint } from "./types";

type PageProperties = CreatePageParameters["properties"];

function getNotionClient(): Client | null {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return new Client({ auth: token });
}

type SyncResult = {
  keywords: boolean;
  visibility: boolean;
  sessions: boolean;
  revenue: boolean;
  competitors: boolean;
};

export async function syncSnapshotToNotion(
  config: ClientConfig,
  snapshot: ClientSnapshot
): Promise<SyncResult> {
  const notion = getNotionClient();
  const ds = config.notion.dataSources;

  if (!notion || !ds) {
    return { keywords: false, visibility: false, sessions: false, revenue: false, competitors: false };
  }

  const [keywords, visibility, sessions, revenue, competitors] = await Promise.allSettled([
    syncKeywords(notion, ds.keywordTracking, snapshot.targetKeywords),
    syncTimeSeries(notion, ds.organicVisibility, snapshot.visibility, "Organic Traffic"),
    syncTimeSeries(notion, ds.ga4Sessions, snapshot.sessions, "Sessions"),
    syncTimeSeries(notion, ds.ga4Revenue, snapshot.revenue, "Revenue"),
    syncCompetitors(notion, ds.competitorTraffic, snapshot.competitors),
  ]);

  return {
    keywords: keywords.status === "fulfilled" && keywords.value,
    visibility: visibility.status === "fulfilled" && visibility.value,
    sessions: sessions.status === "fulfilled" && sessions.value,
    revenue: revenue.status === "fulfilled" && revenue.value,
    competitors: competitors.status === "fulfilled" && competitors.value,
  };
}

const PILLAR_MAP: Record<string, string> = {
  "pillar-1": "Hoof Boot Guide",
  "pillar-2": "Hoof Health & Conditions",
  "pillar-3": "Barefoot Horse Care",
};

async function syncKeywords(
  notion: Client,
  dataSourceId: string,
  keywords: KeywordDetail[]
): Promise<boolean> {
  const existing = await queryAllPages(notion, dataSourceId);
  const existingByTitle = new Map(
    existing.map((p) => [getPageTitle(p), p.id])
  );

  for (const kw of keywords) {
    const pageId = existingByTitle.get(kw.keyword);
    const pillar = kw.pillarId ? PILLAR_MAP[kw.pillarId] ?? null : null;
    const status = kw.position === null
      ? "Not Ranking"
      : kw.position <= 10
        ? "Top 10"
        : kw.position <= 30
          ? "Striking Distance (11-30)"
          : "Low Visibility (31-100)";
    const priority = kw.volume >= 1000 ? "High" : kw.volume >= 300 ? "Medium" : "Low";

    const properties: PageProperties = {
      Volume: { number: kw.volume },
      KD: { number: kw.kd },
      Position: kw.position ? { number: kw.position } : { number: null },
      "Prev Position": kw.prev ? { number: kw.prev } : { number: null },
      Status: { select: { name: status } },
      Priority: { select: { name: priority } },
      "Ranking URL": kw.currentRankingUrl ? { url: kw.currentRankingUrl } : { url: null },
    };

    if (pillar) {
      properties["Pillar Page"] = { select: { name: pillar } };
    }

    if (pageId) {
      await notion.pages.update({ page_id: pageId, properties });
    } else {
      await notion.pages.create({
        parent: { data_source_id: dataSourceId },
        properties: {
          Keyword: { title: [{ text: { content: kw.keyword } }] },
          ...properties,
        },
      });
    }
  }

  return true;
}

async function syncTimeSeries(
  notion: Client,
  dataSourceId: string,
  data: MonthPoint[],
  valueProperty: string
): Promise<boolean> {
  const existing = await queryAllPages(notion, dataSourceId);
  const existingByTitle = new Map(
    existing.map((p) => [getPageTitle(p), p.id])
  );

  for (const point of data) {
    const [yearStr, monthNum] = point.month.split("-");
    const monthName = new Date(Number(yearStr), Number(monthNum) - 1).toLocaleString("en-US", { month: "long" });
    const title = `${monthName} ${yearStr}`;
    const pageId = existingByTitle.get(title);

    const properties: PageProperties = {
      [valueProperty]: { number: point.value },
      Year: { select: { name: yearStr } },
    };

    if (pageId) {
      await notion.pages.update({ page_id: pageId, properties });
    } else {
      await notion.pages.create({
        parent: { data_source_id: dataSourceId },
        properties: {
          Month: { title: [{ text: { content: title } }] },
          ...properties,
        },
      });
    }
  }

  return true;
}

async function syncCompetitors(
  notion: Client,
  dataSourceId: string,
  competitors: { label: string; traffic: number }[]
): Promise<boolean> {
  const existing = await queryAllPages(notion, dataSourceId);
  const existingByTitle = new Map(
    existing.map((p) => [getPageTitle(p), p.id])
  );

  for (const comp of competitors) {
    const pageId = existingByTitle.get(comp.label);

    const properties: PageProperties = {
      "Organic Traffic": { number: comp.traffic },
    };

    if (pageId) {
      await notion.pages.update({ page_id: pageId, properties });
    } else {
      await notion.pages.create({
        parent: { data_source_id: dataSourceId },
        properties: {
          Company: { title: [{ text: { content: comp.label } }] },
          ...properties,
        },
      });
    }
  }

  return true;
}

async function queryAllPages(notion: Client, dataSourceId: string) {
  const pages: Array<{ id: string; properties: Record<string, unknown> }> = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if ("properties" in page) {
        pages.push({ id: page.id, properties: page.properties as Record<string, unknown> });
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

function getPageTitle(page: { properties: Record<string, unknown> }): string {
  for (const prop of Object.values(page.properties)) {
    const p = prop as { type?: string; title?: Array<{ plain_text: string }> };
    if (p.type === "title" && p.title?.length) {
      return p.title.map((t) => t.plain_text).join("");
    }
  }
  return "";
}
