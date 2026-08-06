import type { Metadata } from "next";
import { AboutPageLive } from "@/components/live/LivePages";
export const metadata: Metadata = { title: "About" };
export default function Page() { return <AboutPageLive />; }
