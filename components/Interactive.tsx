"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { faqs, testimonials, works } from "@/lib/data";
import { ArrowIcon } from "./Header";

export function ProjectCarousel() {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  
  const move = (next: number) => {
    const normalized = (next + works.length) % works.length;
    setIndex(normalized);
    if (rail.current) {
      const item = rail.current.firstElementChild as HTMLElement | null;
      if (item) gsap.to(rail.current, { x: -(item.offsetWidth + 20) * normalized, duration: .72, ease: "power3.out" });
    }
  };

  return (
    <div>
      <div className="overflow-hidden pl-pad">
        <div className="flex gap-[20px] w-max will-change-transform" ref={rail}>
          {works.map((work) => (
            <Link 
              className="w-[calc((100vw-var(--pad)*2-20px)/2)] max-[1199.98px]:w-[65vw] max-[809.98px]:w-[calc(100vw-40px)] block group" 
              href={`/works/${work.slug}`} 
              key={work.slug}
            >
              <div className="relative h-[580px] max-[1199.98px]:h-[500px] max-[809.98px]:h-[430px] rounded-[7px] overflow-hidden bg-[#ccc] [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.025]">
                <Image src={work.image} alt="" fill sizes="(max-width: 809px) 90vw, 48vw" />
              </div>
              <div className="flex justify-between py-[20px] px-[1px]">
                <div>
                  <h3 className="font-normal text-[42px] max-[809.98px]:text-[36px] leading-[0.9] font-display uppercase m-0 mb-[9px]">
                    {work.title}
                  </h3>
                  <p className="font-medium text-[11px] font-mono m-0 text-[#777] uppercase">
                    {work.category}
                  </p>
                </div>
                <span className="font-medium text-[11px] font-mono m-0 text-[#777] uppercase">
                  {work.year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="pt-[30px] px-pad pb-0 flex justify-end items-center gap-[20px] max-[809.98px]:p-[20px]">
        <button 
          type="button" 
          onClick={() => move(index - 1)} 
          aria-label="Previous project"
          className="w-[49px] h-[49px] rounded-full border border-[#999] bg-transparent grid place-items-center transition-all duration-300 hover:bg-red hover:border-red hover:text-white [&>svg]:rotate-180"
        >
          <ArrowIcon />
        </button>
        <span className="font-medium text-[11px] font-mono">
          {String(index + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
        </span>
        <button 
          type="button" 
          onClick={() => move(index + 1)} 
          aria-label="Next project"
          className="w-[49px] h-[49px] rounded-full border border-[#999] bg-transparent grid place-items-center transition-all duration-300 hover:bg-red hover:border-red hover:text-white"
        >
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

export function FaqList() {
  const [open, setOpen] = useState(0);
  
  return (
    <div className="border-t border-[#aaa]">
      {faqs.map((item, index) => (
        <div className="border-b border-[#aaa]" key={item.question}>
          <button 
            type="button" 
            onClick={() => setOpen(open === index ? -1 : index)} 
            aria-expanded={open === index}
            className="w-full border-0 bg-transparent py-[25px] px-0 flex justify-between items-center text-left font-semibold text-[18px] max-[809.98px]:text-[16px]"
          >
            <span>{item.question}</span>
            <i className={`w-[32px] h-[32px] rounded-full text-white grid place-items-center not-italic font-normal transition-colors duration-300 ${open === index ? "bg-red" : "bg-[#111]"}`}>
              {open === index ? "−" : "+"}
            </i>
          </button>
          <div className={`grid transition-[grid-template-rows] duration-[450ms] ${open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <p className="m-0 text-[#666] max-w-[570px] pb-[28px] pr-[50px] pt-0 pl-0">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestimonialRail() {
  return (
    <div className="overflow-hidden">
      <div className="flex w-max gap-[15px] pl-pad animate-[testimonials_42s_linear_infinite] hover:[animation-play-state:paused]">
        {[...testimonials, ...testimonials].map((item, index) => (
          <blockquote 
            key={index}
            className="w-[480px] min-h-[380px] m-0 bg-[#111] rounded-[6px] p-[30px] flex flex-col max-[809.98px]:w-[340px] max-[809.98px]:min-h-[370px]"
          >
            <span className="font-normal text-[70px] leading-[0.7] font-display text-red">“</span>
            <p className="text-[23px] leading-[1.25] tracking-[-0.6px] mt-[35px] mx-0 mb-auto max-[809.98px]:text-[20px]">
              {item.quote}
            </p>
            <footer className="flex flex-col border-t border-[#3b3b3b] pt-[20px]">
              <strong>{item.name}</strong>
              <small className="font-medium text-[10px] font-mono text-[#777] mt-[6px]">
                {item.role}
              </small>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
