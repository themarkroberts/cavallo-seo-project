import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientSlug = request.nextUrl.searchParams.get("client") ?? "cavallo";

  // TODO: Fetch from GA4, Ahrefs, Notion, GSC and write snapshot to KV
  // For now, return a placeholder response
  return NextResponse.json({
    ok: true,
    client: clientSlug,
    message: "Cron refresh placeholder — data sources not yet wired",
  });
}
