"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { liveNavigation } from "@/lib/live-data";

export function LiveLogo() {
  return <Link href="/" className="live-logo" aria-label="Aexo home"><img className="live-logoImage" src="/assets/logo/logo_white.png" alt="Aexo" /></Link>;
}

export function PixelArrow({ label }: { label?: ReactNode } = {}) { return <span className={`live-pixelArrow fix-pixelArrow`}>{label && <span className="fix-pixelArrowLabel">{label}</span>}</span>; }

export function RollingPrimaryLink({
  href,
  children,
  variant = "wide",
  tone = "red",
  centered = false,
  className = "",
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  variant?: "compact" | "wide" | "small";
  tone?: "white" | "red";
  centered?: boolean;
  className?: string;
  target?: "_blank";
  rel?: string;
}) {
  const arrow = tone === "red"
    ? "/assets/live/brand-cyan/BQFGBP7rOiJsOjI0KKyLLQcyBLk.png"
    : "/assets/live/kM9jSUZLyWdbxIqG89MSUiTPTg.png";
  return <Link
    href={href}
    target={target}
    rel={rel}
    className={`rolling-primary ${variant === "compact" ? "rolling-compact" : variant === "small" ? "rolling-small" : "rolling-wide"} ${tone === "red" ? "rolling-red" : ""} ${centered ? "rolling-centered" : ""} ${className}`}
    data-rolling-button="primary"
    data-rolling-kind={tone === "red" ? "red" : "white"}
    data-rolling-variant={
      tone === "red"
        ? centered
          ? "2"
          : "1"
        : centered || variant === "wide"
          ? "2"
          : "1"
    }
  >
    <span className="rolling-well" aria-hidden="true">
      <span className="rolling-fill">
        <span className="rolling-arrow-rail">
          <img className="rolling-arrow rolling-arrow-outgoing" src={arrow} alt="" />
        </span>
        <span className="rolling-label rolling-label-incoming">{children}</span>
      </span>
    </span>
    <span className="rolling-label rolling-label-outgoing">{children}</span>
  </Link>;
}

export function LiveHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return <>
    <header className={`live-header fix-header`} data-site-header>
      <div className="fix-headerInner">
        <LiveLogo />
        <nav className="live-desktopNav" aria-label="Primary navigation">{liveNavigation.map((item) => {
          const active = pathname === item.href || (item.href.includes("#") && pathname === "/");
          return <Link className={active ? "live-active" : ""} data-active={active || undefined} href={item.href} key={item.href}>{item.label}</Link>;
        })}</nav>
        <RollingPrimaryLink href="/contact" variant="compact" tone="white" className={`live-contactButton fix-headerContact`}>Contact</RollingPrimaryLink>
        <button className={`live-menuButton fix-menuButton ${open ? "fix-menuButtonOpen" : ""}`} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /><i /></button>
      </div>
    </header>
    <aside className={`live-mobileMenu fix-mobileMenu ${open ? "live-mobileMenuOpen" : ""}`} aria-hidden={!open}>
      <nav>{liveNavigation.map((item) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}><span>{item.href === "/works" ? "Projects" : item.label}</span></Link>)}</nav>
      <Link className="fix-mobileContact" data-brand-button href="/contact" onClick={() => setOpen(false)}><PixelArrow /><span>Contact</span></Link>
    </aside>
  </>;
}
