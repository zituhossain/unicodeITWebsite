import type { Metadata } from "next";
import { ContactPageLive } from "@/components/live/LivePages";
export const metadata: Metadata = { title: "Contact" };
export default function Page() { return <ContactPageLive />; }
