import type { Metadata } from "next";
import { PricingPageLive } from "@/components/live/LivePages";
export const metadata: Metadata = { title: "Pricing" };
export default function Page() {
  return <PricingPageLive />;
}
