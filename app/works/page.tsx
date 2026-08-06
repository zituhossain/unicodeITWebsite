import type { Metadata } from "next";
import { WorksPageLive } from "@/components/live/LivePages";
export const metadata: Metadata = { title: "Works" };
export default function Page() { return <WorksPageLive />; }
