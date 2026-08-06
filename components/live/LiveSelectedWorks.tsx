"use client";

import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import gsap from "gsap";
import { liveWorks } from "@/lib/live-data";
import { LiveProjectCard } from "./LiveProjectCard";
import { LiveButton } from "./LiveShared";

const selectedWorks = [
  {
    ...liveWorks[0],
    image: "/assets/projects/tempo-home.png",
  },
  {
    ...liveWorks[1],
    image: "/assets/projects/unigram-home.png",
  },
  {
    ...liveWorks[2],
    image: "/assets/live/HbC1fjEUQVC5H6CG4Jg5aY0Q.png",
  },
] as const;

const displayedWorks = [...selectedWorks, ...selectedWorks];

export function useProjectHoverCursor() {
  const hoverCursorRef = useRef<HTMLDivElement>(null);

  const showProjectCursor = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      const cursor = hoverCursorRef.current;
      if (
        !cursor ||
        event.pointerType === "touch" ||
        !window.matchMedia("(hover:hover) and (pointer:fine)").matches
      )
        return;
      gsap.set(cursor, { x: event.clientX + 22, y: event.clientY - 8 });
      gsap.to(cursor, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
        overwrite: true,
      });
    },
    [],
  );

  const hideProjectCursor = useCallback(() => {
    const cursor = hoverCursorRef.current;
    if (!cursor) return;
    gsap.to(cursor, {
      autoAlpha: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "back.out(1.2)",
      overwrite: true,
    });
  }, []);

  return {
    hoverCursorRef,
    projectCursorHandlers: {
      onPointerEnter: showProjectCursor,
      onPointerMove: showProjectCursor,
      onPointerLeave: hideProjectCursor,
      onPointerCancel: hideProjectCursor,
    },
  };
}

export function ProjectHoverCursor({
  cursorRef,
}: {
  cursorRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={cursorRef} className="fix-selectedCursor" aria-hidden="true">
      <i>
        <b />
      </i>
      <span>View Project</span>
    </div>
  );
}

function Lightning() {
  return (
    <span className="fix-selectedBolt" aria-hidden="true">
      <svg viewBox="0 0 46 46" role="presentation">
        <g transform="translate(6.825 3.493)">
          <path
            d="M 0.026 18.172 L 6.664 0.265 C 6.723 0.106 6.875 0 7.045 0 L 23.544 0 C 23.841 0 24.038 0.309 23.913 0.578 L 19.662 9.718 C 19.537 9.988 19.734 10.296 20.031 10.296 L 30.396 10.296 C 30.747 10.296 30.933 10.712 30.699 10.974 L 7.575 36.816 C 7.264 37.162 6.71 36.801 6.901 36.377 L 14.624 19.294 C 14.746 19.025 14.549 18.72 14.254 18.72 L 0.407 18.72 C 0.124 18.72 -0.073 18.438 0.026 18.172 Z"
            fill="rgb(var(--brand-rgb) / 0.5)"
          />
          <path
            className="fix-selectedBoltRed"
            d="M 24.561 0 C 25.602 0 26.29 1.08 25.852 2.023 L 22.005 10.296 L 31.413 10.296 C 32.643 10.296 33.294 11.752 32.474 12.668 L 9.349 38.509 L 9.35 38.51 C 8.264 39.723 6.322 38.458 6.992 36.975 L 14.326 20.753 L 1.424 20.753 C 0.433 20.753 -0.255 19.764 0.09 18.835 L 6.729 0.928 L 6.771 0.826 C 7.002 0.326 7.505 0 8.063 0 Z"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2.03"
          />
        </g>
        <g transform="translate(7.842 4.51)">
          <path
            className="fix-selectedBoltWhite"
            d="M 0.026 18.172 L 6.664 0.265 C 6.723 0.106 6.875 0 7.045 0 L 23.544 0 C 23.841 0 24.038 0.309 23.913 0.578 L 19.662 9.718 C 19.537 9.988 19.734 10.296 20.031 10.296 L 30.396 10.296 C 30.747 10.296 30.933 10.712 30.699 10.974 L 7.575 36.816 C 7.264 37.162 6.71 36.801 6.901 36.377 L 14.624 19.294 C 14.746 19.025 14.549 18.72 14.254 18.72 L 0.407 18.72 C 0.124 18.72 -0.073 18.438 0.026 18.172 Z"
            fill="none"
            stroke="#fff"
            strokeWidth="1.3"
          />
        </g>
      </svg>
    </span>
  );
}

export function LiveSelectedWorks() {
  const { hoverCursorRef, projectCursorHandlers } = useProjectHoverCursor();

  return (
    <section className="fix-selectedWorksExact" id="works">
      <div className="fix-selectedInner">
        <div className="fix-selectedHeader">
          <div className="fix-selectedTitle">
            <div className="fix-selectedKickerRow">
              <p className="fix-selectedKicker">
                <i aria-hidden="true" />
                <span>Selected works</span>
              </p>
            </div>
            <div className="fix-selectedHeadingWrap">
              <h2>Case {"        "} Studies</h2>
              <Lightning />
            </div>
            <p className="fix-selectedDescription">
              Designing and building digital experiences that are{" "}
              <br />
              thoughtful, scalable, and built to perform.
            </p>
          </div>
        </div>

        <div className="fix-selectedGrid live-allWorksGrid">
          {displayedWorks.map((work, itemIndex) => (
            <LiveProjectCard
              key={`${work.slug}-${itemIndex}`}
              slug={work.slug}
              title={work.title}
              image={work.image}
              tags={work.tags}
              hoverHandlers={projectCursorHandlers}
            />
          ))}
        </div>

        <div className="fix-selectedActions">
          <LiveButton href="/works" dark>
            View Projects
          </LiveButton>
        </div>
      </div>
      <ProjectHoverCursor cursorRef={hoverCursorRef} />
    </section>
  );
}
