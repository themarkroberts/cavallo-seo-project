import { google } from "googleapis";
import type { ClientConfig } from "./clients";
import type { MonthPoint } from "./types";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  const credentials = JSON.parse(
    raw.includes("{") ? raw : Buffer.from(raw, "base64").toString("utf-8")
  );

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
}

type GA4Result = {
  sessions: MonthPoint[];
  revenue: MonthPoint[];
};

export async function fetchGA4Data(config: ClientConfig): Promise<GA4Result | null> {
  const auth = getAuth();
  if (!auth) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_JSON not set — skipping GA4 fetch");
    return null;
  }

  const analyticsData = google.analyticsdata({ version: "v1beta", auth });

  const response = await analyticsData.properties.runReport({
    property: `properties/${config.ga4PropertyId}`,
    requestBody: {
      dateRanges: [{ startDate: "2024-01-01", endDate: "today" }],
      dimensions: [{ name: "yearMonth" }],
      metrics: [
        { name: "sessions" },
        { name: "totalRevenue" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: {
            matchType: "EXACT",
            value: "Organic Search",
          },
        },
      },
      orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
    },
  });

  const rows = response.data.rows ?? [];

  const sessions: MonthPoint[] = [];
  const revenue: MonthPoint[] = [];

  for (const row of rows) {
    const ym = row.dimensionValues?.[0]?.value ?? "";
    const month = `${ym.slice(0, 4)}-${ym.slice(4, 6)}`;
    const sessVal = parseInt(row.metricValues?.[0]?.value ?? "0", 10);
    const revVal = Math.round(parseFloat(row.metricValues?.[1]?.value ?? "0"));

    sessions.push({ month, value: sessVal });
    revenue.push({ month, value: revVal });
  }

  return { sessions, revenue };
}
