import type { Metadata } from "next";
import { PolicyPageLive } from "@/components/live/LivePages";
export const metadata: Metadata = { title: "Terms & Conditions" };
export default function Page() { return <PolicyPageLive kind="terms" />; }
