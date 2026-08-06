"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/data";

export function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-[9px] text-[25px] max-[809.98px]:text-[23px] font-bold tracking-[-1.2px] relative z-[2]" 
      aria-label="Aexo home"
    >
      <span className="grid place-items-center w-[34px] h-[34px] max-[809.98px]:w-[31px] max-[809.98px]:h-[31px] rounded-full bg-red rotate-[-8deg]" />
      <span>Aexo</span>
    </Link>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => { 
    document.body.style.overflow = open ? "hidden" : ""; 
    return () => { document.body.style.overflow = ""; }; 
  }, [open]);

  return (
    <>
      <header className="absolute z-40 top-0 left-0 w-full h-[110px] max-[1199.98px]:h-[92px] max-[809.98px]:h-[86px] px-pad flex items-center justify-between text-white">
        <Logo />
        <nav className="flex items-center gap-[39px] font-semibold max-[1199.98px]:hidden" aria-label="Primary navigation">
          {navigation.slice(0, 4).map((item) => (
            <Link 
              key={item.href} 
              className={`relative transition-opacity duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-7px] after:w-full after:h-[2px] after:bg-red after:scale-x-0 after:origin-left after:transition-transform after:duration-350 hover:after:scale-x-100 ${pathname === item.href ? "after:scale-x-100" : ""}`} 
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link 
          className="inline-flex items-center justify-between gap-[22px] border border-[rgba(255,255,255,0.7)] rounded-[100px] pt-[5px] pr-[5px] pb-[5px] pl-[22px] font-medium text-[13px] leading-none font-mono tracking-[-0.25px] transition-[color,background-color,transform] duration-350 max-[1199.98px]:hidden hover:bg-white hover:text-[#111] hover:-translate-y-[2px] [&>svg]:w-[39px] [&>svg]:h-[39px] [&>svg]:p-[9px] [&>svg]:rounded-full [&>svg]:bg-red [&>svg]:text-white [&>svg]:transition-transform [&>svg]:duration-350 hover:[&>svg]:rotate-[-35deg]" 
          href="/contact"
        >
          <ArrowIcon />
          <span>Contact</span>
        </Link>
        <button 
          className="hidden max-[1199.98px]:flex w-[47px] h-[47px] border border-[rgba(255,255,255,0.45)] rounded-full bg-transparent items-center justify-center flex-col gap-[5px]" 
          type="button" 
          onClick={() => setOpen(!open)} 
          aria-expanded={open} 
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="w-[17px] h-[1px] bg-white" />
          <span className="w-[17px] h-[1px] bg-white" />
        </button>
      </header>
      <div 
        className={`fixed z-[100] inset-[10px] bg-red text-white rounded-[14px] p-[20px] pointer-events-none ${open ? "translate-y-0 scale-100 opacity-100 pointer-events-auto" : "translate-y-[-110%] scale-[0.96] opacity-0"}`} 
        aria-hidden={!open}
        style={{ transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s" }}
      >
        <div className="flex justify-between items-center">
          <Logo />
          <button 
            type="button" 
            className="w-[46px] h-[46px] border border-[rgba(255,255,255,0.5)] bg-none rounded-full text-[30px] font-light flex items-center justify-center" 
            onClick={() => setOpen(false)} 
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="mt-[10vh] border-t border-[rgba(255,255,255,0.35)]">
          {navigation.map((item, index) => (
            <Link 
              href={item.href} 
              key={item.href} 
              onClick={() => setOpen(false)}
              className="h-[78px] border-b border-[rgba(255,255,255,0.35)] grid grid-cols-[45px_1fr_30px] items-center"
            >
              <small className="font-mono">0{index + 1}</small>
              <span className="font-normal text-[48px] leading-none font-display uppercase">{item.label}</span>
              <ArrowIcon />
            </Link>
          ))}
        </nav>
        <p className="absolute bottom-[20px] font-medium text-[11px] font-mono">BRANDING · WEB DESIGN · DEVELOPMENT</p>
      </div>
    </>
  );
}
