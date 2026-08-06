import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "./Header";

export function Button({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link 
      className={`inline-flex items-center justify-between gap-[22px] border rounded-[100px] pt-[5px] pr-[5px] pb-[5px] pl-[22px] font-medium text-[13px] leading-none font-mono tracking-[-0.25px] transition-[color,background-color,transform] duration-350 hover:-translate-y-[2px] [&>svg]:w-[39px] [&>svg]:h-[39px] [&>svg]:p-[9px] [&>svg]:rounded-full [&>svg]:bg-red [&>svg]:text-white [&>svg]:transition-transform [&>svg]:duration-350 hover:[&>svg]:rotate-[-35deg] ${
        light 
          ? "border-[rgba(255,255,255,0.75)] text-white hover:bg-white hover:text-[#111]" 
          : "border-[#111] color-[#111] hover:bg-ink hover:text-white"
      }`} 
      href={href}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div 
      className={`flex items-center gap-[10px] font-medium text-[12px] leading-none font-mono tracking-[-0.3px] uppercase [&>i]:w-[7px] [&>i]:h-[7px] [&>i]:rounded-full [&>i]:bg-brand [&>i]:shadow-[0_0_0_3px_var(--brand-alpha-15)] ${
        light ? "text-[#a8a8a8]" : "text-[#4e4e4e]"
      }`}
    >
      <i />
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, children, light = false, compact = false }: { eyebrow?: string; children: ReactNode; light?: boolean; compact?: boolean }) {
  return (
    <div 
      className={`[&>h2]:font-normal [&>h2]:text-[clamp(65px,6.25vw,90px)] [&>h2]:leading-[0.88] [&>h2]:font-display [&>h2]:tracking-[-1.8px] [&>h2]:uppercase [&>h2]:mt-[27px] [&>h2]:mb-0 [&>h2]:mx-0 ${
        light ? "text-white" : ""
      } ${
        compact ? "[&>h2]:text-[clamp(60px,5.7vw,82px)]" : ""
      }`} 
      data-reveal
    >
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2>{children}</h2>
    </div>
  );
}

export function Marquee({ children, reverse = false }: { children: ReactNode; reverse?: boolean }) {
  const items = Array.from({ length: 8 });
  return (
    <div 
      className="h-[125px] border-t border-b border-[#292929] flex items-center overflow-hidden max-[809.98px]:h-[87px]" 
      aria-hidden="true"
    >
      <div className={`flex w-max animate-[marquee_32s_linear_infinite] ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {items.map((_, i) => (
          <span 
            key={i} 
            className="font-normal text-[66px] max-[809.98px]:text-[46px] leading-none font-display whitespace-nowrap text-[#333] flex items-center"
          >
            {children}
            <b className="text-red mx-[25px] text-[35px]">✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
