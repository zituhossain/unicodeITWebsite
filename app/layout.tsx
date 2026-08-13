import type { Metadata } from "next";
import { MotionProvider } from "@/components/MotionProvider";
import { LiveHeader } from "@/components/live/LiveHeader";
import { LiveFooter } from "@/components/live/LiveShared";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aexo.design"),
  title: { default: "UnicodeIT", template: "%s — UnicodeIT" },
  description:
    "Independent creative studio building bold brands and digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LiveHeader />
        <MotionProvider />
        {children}
        <LiveFooter />
      </body>
    </html>
  );
}
