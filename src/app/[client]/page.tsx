import { notFound } from "next/navigation";
import { getClient } from "@/lib/clients";
import { getSnapshot } from "@/lib/snapshot";
import ProjectShell from "@/components/ProjectShell";
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
    title: config ? `${config.name} — SEO Project Portal` : "SEO Project Portal",
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

  return <ProjectShell snapshot={snapshot} clientName={clientConfig.name} />;
}
