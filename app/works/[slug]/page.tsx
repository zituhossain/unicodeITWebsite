import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetailLive } from "@/components/live/LiveWorkDetail";
import { getProjectBySlug, projects } from "@/data/projects";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = getProjectBySlug(slug);
  return work ? { title: work.title, description: work.summary } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getProjectBySlug(slug);
  if (!work) notFound();
  return <WorkDetailLive work={work} />;
}
