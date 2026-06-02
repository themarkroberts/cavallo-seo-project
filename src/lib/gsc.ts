import { google } from "googleapis";
import type { ClientConfig } from "./clients";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  const credentials = JSON.parse(
    raw.includes("{") ? raw : Buffer.from(raw, "base64").toString("utf-8")
  );

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

type GSCPageMetrics = {
  page: string;
  clicks: number;
  impressions: number;
  position: number;
};

export async function fetchGSCPillarPages(
  config: ClientConfig
): Promise<GSCPageMetrics[] | null> {
  const auth = getAuth();
  if (!auth) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_JSON not set — skipping GSC fetch");
    return null;
  }

  const webmasters = google.webmasters({ version: "v3", auth });

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const response = await webmasters.searchanalytics.query({
    siteUrl: config.gscSiteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 100,
    },
  });

  const rows = response.data.rows ?? [];

  return rows.map((row) => ({
    page: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    position: Math.round((row.position ?? 0) * 10) / 10,
  }));
}
