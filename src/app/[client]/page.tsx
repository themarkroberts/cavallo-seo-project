import { notFound } from "next/navigation";
import { getClient } from "@/lib/clients";
import { getSnapshot } from "@/lib/snapshot";
import { Header } from "@/components/Header";
import { AtAGlance } from "@/components/AtAGlance";
import { PerformanceChain } from "@/components/PerformanceChain";
import { CompetitorCompare } from "@/components/CompetitorCompare";
import { KeywordTable } from "@/components/KeywordTable";
import { Roadmap } from "@/components/Roadmap";
import { ThisMonthTasks } from "@/components/ThisMonthTasks";
import { Documents } from "@/components/Documents";
import { NextSteps } from "@/components/NextSteps";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ client: string }>;
}): Promise<Metadata> {
  const { client: clientSlug } = await params;
  const config = getClient(clientSlug);
  return {
    title: config ? `${config.name} — SEO Dashboard` : "SEO Dashboard",
    robots: { index: false, follow: false },
  };
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientSlug } = await params;
  const clientConfig = getClient(clientSlug);
  if (!clientConfig) notFound();

  const snapshot = await getSnapshot(clientSlug);
  if (!snapshot) notFound();

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header clientName={clientConfig.name} lastUpdated={snapshot.lastUpdated} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AtAGlance snapshot={snapshot} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <PerformanceChain snapshot={snapshot} projectStart={clientConfig.projectStart} />
          </div>
          <div className="space-y-6">
            <CompetitorCompare snapshot={snapshot} />
            <KeywordTable snapshot={snapshot} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Roadmap snapshot={snapshot} />
          <ThisMonthTasks snapshot={snapshot} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <NextSteps snapshot={snapshot} />
          <Documents snapshot={snapshot} />
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400">
        <p>
          Last updated{" "}
          {new Date(snapshot.lastUpdated).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </footer>
    </div>
  );
}
