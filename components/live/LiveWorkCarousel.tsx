"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { liveWorks } from "@/lib/live-data";

export function LiveWorkCarousel() {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = rail.current?.querySelector<HTMLElement>("a");
    if (!card || !rail.current) return;
    const gap = Number.parseFloat(getComputedStyle(rail.current).columnGap || "16");
    gsap.to(rail.current, { x: -index * (card.offsetWidth + gap), duration: .62, ease: "power3.out", overwrite: true });
  }, [index]);

  const previous = () => setIndex((value) => (value - 1 + liveWorks.length) % liveWorks.length);
  const next = () => setIndex((value) => (value + 1) % liveWorks.length);

  return <div className="fix-workCarousel">
    <div ref={rail} className={`live-workRail fix-workRail`}>
      {[...liveWorks, ...liveWorks].map((work, itemIndex) => <Link href={`/works/${work.slug}`} key={`${work.slug}-${itemIndex}`} className="live-workCard"><img src={work.listing} alt={`${work.title} project`} /><div><span>{work.category}</span><h3>{work.title}</h3><small>{work.region}</small></div></Link>)}
    </div>
    <fieldset className="fix-workControls" aria-label="Project carousel controls"><button type="button" aria-label="Previous" onClick={previous}>←</button><button type="button" aria-label="Next" onClick={next}>→</button></fieldset>
  </div>;
}
