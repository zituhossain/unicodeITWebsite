import type { Metadata } from "next";
import { PolicyPageLive } from "@/components/live/LivePages";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function Page() { return <PolicyPageLive kind="privacy" />; }
