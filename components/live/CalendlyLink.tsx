"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { CALENDLY_URL } from "@/lib/calendly";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type CalendlyLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href"
> & {
  children: ReactNode;
  href?: string;
};

const SCRIPT_ID = "calendly-widget-script";
const STYLESHEET_ID = "calendly-widget-stylesheet";

function ensureCalendlyAssets() {
  if (!document.getElementById(STYLESHEET_ID)) {
    const link = document.createElement("link");
    link.id = STYLESHEET_ID;
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  }

  const existingScript = document.getElementById(
    SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise<void>((resolve) => {
      if (window.Calendly) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
    });
  }

  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    document.body.appendChild(script);
  });
}

export function CalendlyLink({
  children,
  href = CALENDLY_URL,
  onClick,
  target,
  rel,
  ...anchorProps
}: CalendlyLinkProps) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();

    try {
      await ensureCalendlyAssets();
      window.Calendly?.initPopupWidget({ url: href });
    } catch {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <a
      {...anchorProps}
      href={href}
      target={target ?? "_blank"}
      rel={rel ?? "noopener noreferrer"}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

