import { notFound } from "next/navigation";
import { getClient } from "@/lib/clients";
import { getSnapshot } from "@/lib/snapshot";
import { AtAGlance } from "@/components/AtAGlance";
import { PerformanceChain } from "@/components/PerformanceChain";
import { CompetitorCompare } from "@/components/CompetitorCompare";
import { KeywordTable } from "@/components/KeywordTable";
import { Roadmap } from "@/components/Roadmap";
import { ThisMonthTasks } from "@/components/ThisMonthTasks";
import { Documents } from "@/components/Documents";
import { NextSteps } from "@/components/NextSteps";

export const revalidate = 3600;

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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">{clientConfig.name}</h1>
          <p className="text-sm text-zinc-500 mt-1">SEO Project Dashboard</p>
        </header>

        <AtAGlance snapshot={snapshot} />
        <PerformanceChain snapshot={snapshot} projectStart={clientConfig.projectStart} />
        <KeywordTable snapshot={snapshot} />
        <CompetitorCompare snapshot={snapshot} />
        <Roadmap snapshot={snapshot} />
        <ThisMonthTasks snapshot={snapshot} />
        <Documents snapshot={snapshot} />
        <NextSteps snapshot={snapshot} />

        <footer className="mt-12 border-t border-zinc-200 pt-6 pb-10 text-center text-xs text-zinc-400">
          Last updated {new Date(snapshot.lastUpdated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </footer>
      </div>
    </div>
  );
}
