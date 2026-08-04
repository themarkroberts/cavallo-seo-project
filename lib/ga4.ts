import { google } from "googleapis";
import { config } from "../config.ts";
import type { MonthPoint } from "./types.ts";
import { getOAuth2Client } from "./google-auth.ts";

type GA4Result = {
  sessions: MonthPoint[];
  revenue: MonthPoint[];
};

export async function fetchGA4Data(): Promise<GA4Result> {
  const auth = getOAuth2Client();

  const analyticsData = google.analyticsdata({ version: "v1beta", auth });

  const response = await analyticsData.properties.runReport({
    property: `properties/${config.ga4PropertyId}`,
    requestBody: {
      dateRanges: [{ startDate: "2024-01-01", endDate: "today" }],
      dimensions: [{ name: "yearMonth" }],
      metrics: [{ name: "sessions" }, { name: "totalRevenue" }],
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

  if (rows.length === 0) {
    throw new Error(
      `GA4 property ${config.ga4PropertyId} returned no rows for organic search since 2024-01-01`
    );
  }

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
