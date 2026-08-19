"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef } from "react";
import { motionIsDeterministic, useMotionCarousel } from "@/components/motion/control";
import { liveWorks } from "@/lib/live-data";
import { FeaturedProjectFrame } from "./FeaturedProjectFrame";
import { ProjectHoverCursor, useProjectHoverCursor } from "./LiveSelectedWorks";

type FeaturedWorkSlide = {
  slug: string;
  title: string;
  image: string;
  thumbnail: string;
};

type FeaturedWorksRuntime = {
  select: (index: number) => void;
};

const slides: FeaturedWorkSlide[] = [
  { slug: liveWorks[0].slug, title: `${liveWorks[0].title} project`, image: liveWorks[0].listing, thumbnail: liveWorks[0].listing },
  { slug: "unigram", title: "Unigram project", image: "/assets/projects/unigram-home.png", thumbnail: "/assets/projects/unigram-home.png" },
  { slug: "teamlink", title: "Teamlink project", image: "/assets/live/a0Wtj8qawEzvxhakjHMoT0DWcQ.png", thumbnail: "/assets/live/oMPehT5WogBPz0L0HAvBmbujI8.png" },
];

const cycleDurationMs = 5_000;
const transitionDurationMs = 400;
const thumbnailGap = 10;
const middleCopyOffset = slides.length;

/** Framer's duration .4 / bounce .2 spring, expressed as its damped response. */
function springProgress(milliseconds: number) {
  const seconds = Math.min(transitionDurationMs, Math.max(0, milliseconds)) / 1_000;
  const stiffness = 505.60858084385114;
  const damping = 35.97718675716959;
  const naturalFrequency = Math.sqrt(stiffness);
  const dampingRatio = damping / (2 * naturalFrequency);
  const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio ** 2);
  const envelope = Math.exp(-dampingRatio * naturalFrequency * seconds);
  return 1 - envelope * (
    Math.cos(dampedFrequency * seconds)
    + (dampingRatio * naturalFrequency / dampedFrequency) * Math.sin(dampedFrequency * seconds)
  );
}

function normalizeIndex(index: number) {
  return ((Math.trunc(index) % slides.length) + slides.length) % slides.length;
}

export function LiveFeaturedWorks() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const runtimeRef = useRef<FeaturedWorksRuntime | null>(null);
  const pendingSelectionRef = useRef<number | null>(null);
  const { hoverCursorRef, projectCursorHandlers } = useProjectHoverCursor();

  const selectSlide = useCallback((requestedIndex: number) => {
    const index = normalizeIndex(requestedIndex);
    if (runtimeRef.current) runtimeRef.current.select(index);
    else pendingSelectionRef.current = index;
  }, []);
  useMotionCarousel("works-featured", selectSlide);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!root || !track || !progress) return;

    const slideElements = Array.from(root.querySelectorAll<HTMLElement>("[data-featured-work-slide]"));
    const thumbnailElements = Array.from(root.querySelectorAll<HTMLImageElement>("[data-featured-work-thumb]"));
    const thumbnailViewport = root.querySelector<HTMLElement>("[data-featured-work-thumbs]");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deterministic = motionIsDeterministic();

    let activeIndex = 0;
    let incomingIndex = 0;
    let physicalIndex = middleCopyOffset;
    let incomingPhysicalIndex = middleCopyOffset;
    let cycleElapsed = 0;
    let transitionElapsed = transitionDurationMs;
    let transitionActive = false;
    let reducedMotion = reducedMotionQuery.matches;
    let isIntersecting = true;
    let frame = 0;
    let previousTimestamp: number | null = null;
    let thumbnailWidth = 71;
    let thumbnailStep = thumbnailWidth + thumbnailGap;
    let viewportWidth = 390;

    const measureRail = () => {
      const measuredThumbnailWidth = thumbnailElements[0]?.getBoundingClientRect().width;
      const measuredViewportWidth = thumbnailViewport?.getBoundingClientRect().width;
      thumbnailWidth = measuredThumbnailWidth && measuredThumbnailWidth > 0 ? measuredThumbnailWidth : 71;
      viewportWidth = measuredViewportWidth && measuredViewportWidth > 0 ? measuredViewportWidth : 390;
      thumbnailStep = thumbnailWidth + thumbnailGap;
    };

    const railX = (index: number) => viewportWidth / 2 - thumbnailWidth / 2 - index * thumbnailStep;

    const updateInspectionState = (displayIndex: number, timerProgress: number, transition: number) => {
      root.dataset.featuredWorkState = deterministic
        ? "deterministic"
        : reducedMotion
          ? "reduced"
          : transitionActive
            ? "transitioning"
            : isIntersecting
              ? "playing"
              : "paused";
      root.dataset.featuredWorkIndex = String(displayIndex);
      root.dataset.featuredWorkProgress = timerProgress.toFixed(6);
      root.dataset.featuredWorkTransition = transition.toFixed(6);
      root.dataset.featuredWorkPhysicalIndex = String(transitionActive ? incomingPhysicalIndex : physicalIndex);
    };

    const paintSlides = (from: number, to: number, amount: number) => {
      const clamped = Math.min(1, Math.max(0, amount));
      slideElements.forEach((element, index) => {
        const isOutgoing = index === from;
        const isIncoming = index === to;
        const opacity = from === to
          ? (isIncoming ? 1 : 0)
          : isOutgoing
            ? 1 - clamped
            : isIncoming
              ? clamped
              : 0;
        const blur = from === to
          ? (isIncoming ? 0 : 10)
          : isOutgoing
            ? 10 * clamped
            : isIncoming
              ? 10 * (1 - clamped)
              : 10;
        element.style.opacity = String(opacity);
        element.style.filter = `blur(${blur.toFixed(3)}px)`;
        element.style.pointerEvents = isIncoming && clamped >= 0.5 ? "auto" : isOutgoing && clamped < 0.5 ? "auto" : "none";
        element.style.zIndex = isIncoming ? "4" : isOutgoing ? "3" : "1";
        element.dataset.active = isIncoming && clamped >= 0.5 ? "true" : "false";
        element.setAttribute("aria-hidden", opacity <= 0.001 ? "true" : "false");
      });
    };

    const paintThumbnails = (fromPhysical: number, toPhysical: number, amount: number) => {
      const clamped = Math.min(1, Math.max(0, amount));
      thumbnailElements.forEach((element, index) => {
        const isOutgoing = index === fromPhysical;
        const isIncoming = index === toPhysical;
        const opacity = fromPhysical === toPhysical
          ? (isIncoming ? 1 : 0.3)
          : isOutgoing
            ? 1 - 0.7 * clamped
            : isIncoming
              ? 0.3 + 0.7 * clamped
              : 0.3;
        element.style.opacity = String(opacity);
        element.dataset.active = isIncoming && clamped >= 0.5 ? "true" : "false";
      });
    };

    const paintImmediate = (index: number, selectedPhysicalIndex: number, timerProgress: number) => {
      activeIndex = index;
      incomingIndex = index;
      physicalIndex = selectedPhysicalIndex;
      incomingPhysicalIndex = selectedPhysicalIndex;
      transitionElapsed = transitionDurationMs;
      transitionActive = false;
      paintSlides(index, index, 1);
      paintThumbnails(selectedPhysicalIndex, selectedPhysicalIndex, 1);
      track.style.transform = `translate3d(${railX(selectedPhysicalIndex).toFixed(3)}px, 0, 0)`;
      progress.style.transformOrigin = "left center";
      progress.style.transform = `scaleX(${timerProgress})`;
      updateInspectionState(index, timerProgress, 1);
    };

    const beginTransition = (elapsed = 0) => {
      incomingIndex = (activeIndex + 1) % slides.length;
      incomingPhysicalIndex = physicalIndex + 1;
      transitionElapsed = Math.min(transitionDurationMs, Math.max(0, elapsed));
      transitionActive = true;
    };

    const paintCurrentFrame = () => {
      const timerProgress = deterministic || reducedMotion ? 1 : cycleElapsed / cycleDurationMs;
      progress.style.transformOrigin = "left center";
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, timerProgress)).toFixed(6)})`;

      if (!transitionActive) {
        paintSlides(activeIndex, activeIndex, 1);
        paintThumbnails(physicalIndex, physicalIndex, 1);
        track.style.transform = `translate3d(${railX(physicalIndex).toFixed(3)}px, 0, 0)`;
        updateInspectionState(activeIndex, timerProgress, 1);
        return;
      }

      const response = springProgress(transitionElapsed);
      const clampedResponse = Math.min(1, Math.max(0, response));
      paintSlides(activeIndex, incomingIndex, clampedResponse);
      paintThumbnails(physicalIndex, incomingPhysicalIndex, clampedResponse);
      const x = railX(physicalIndex) + (railX(incomingPhysicalIndex) - railX(physicalIndex)) * response;
      track.style.transform = `translate3d(${x.toFixed(3)}px, 0, 0)`;
      updateInspectionState(incomingIndex, timerProgress, clampedResponse);

      if (transitionElapsed >= transitionDurationMs) {
        activeIndex = incomingIndex;
        physicalIndex = incomingPhysicalIndex;
        transitionActive = false;
        if (physicalIndex >= middleCopyOffset + slides.length) {
          physicalIndex = middleCopyOffset;
        }
        paintImmediate(activeIndex, physicalIndex, timerProgress);
      }
    };

    const select = (requestedIndex: number) => {
      const index = normalizeIndex(requestedIndex);
      cycleElapsed = 0;
      paintImmediate(index, middleCopyOffset + index, deterministic || reducedMotion ? 1 : 0);
      previousTimestamp = null;
    };
    runtimeRef.current = { select };

    const tick = (timestamp: number) => {
      const canAdvance = !deterministic && !reducedMotion && isIntersecting && document.visibilityState !== "hidden";
      if (!canAdvance) {
        previousTimestamp = null;
        paintCurrentFrame();
        frame = window.requestAnimationFrame(tick);
        return;
      }

      if (previousTimestamp === null) previousTimestamp = timestamp;
      const delta = Math.max(0, timestamp - previousTimestamp);
      previousTimestamp = timestamp;
      cycleElapsed += delta;
      let crossedCycleBoundary = false;

      while (cycleElapsed >= cycleDurationMs) {
        crossedCycleBoundary = true;
        const overflow = cycleElapsed - cycleDurationMs;
        cycleElapsed = overflow;
        if (transitionActive) {
          activeIndex = incomingIndex;
          physicalIndex = incomingPhysicalIndex >= middleCopyOffset + slides.length
            ? middleCopyOffset
            : incomingPhysicalIndex;
        }
        beginTransition(overflow);
      }

      if (transitionActive && !crossedCycleBoundary) transitionElapsed += delta;
      paintCurrentFrame();
      frame = window.requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      previousTimestamp = null;
    };
    const onResize = () => {
      measureRail();
      previousTimestamp = null;
      paintCurrentFrame();
    };
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      previousTimestamp = null;
      if (reducedMotion) paintImmediate(activeIndex, physicalIndex, 1);
      else {
        cycleElapsed = 0;
        paintImmediate(activeIndex, physicalIndex, 0);
      }
    };

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isIntersecting = entry?.isIntersecting ?? true;
          previousTimestamp = null;
          paintCurrentFrame();
        }, { rootMargin: "0px 0px -35% 0px", threshold: 0.01 });

    measureRail();
    const initialIndex = pendingSelectionRef.current ?? 0;
    pendingSelectionRef.current = null;
    paintImmediate(initialIndex, middleCopyOffset + initialIndex, deterministic || reducedMotion ? 1 : 0);
    observer?.observe(root);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      runtimeRef.current = null;
    };
  }, []);

  return <div
    ref={rootRef}
    className="live-featuredWorksController"
    data-motion-carousel="works-featured"
    data-featured-work-state="initial"
    data-featured-work-index="0"
    data-featured-work-progress="0"
    data-featured-work-transition="1"
  >
    <FeaturedProjectFrame
      variant="works"
      className="live-featuredWork"
      viewportClassName="live-featuredWorkSlides"
    >
        {slides.map((slide, index) => <Link
          className="live-featuredWorkSlide"
          data-featured-work-slide
          data-featured-work-index={index}
          href={`/works/${slide.slug}`}
          aria-label={`View ${slide.title}`}
          key={slide.slug}
          {...projectCursorHandlers}
        >
          <img data-project-media data-project-slug={slide.slug} src={slide.image} alt={slide.title} />
        </Link>)}
    </FeaturedProjectFrame>
    <div className="live-worksThumbs" data-featured-work-thumbs aria-hidden="true">
      <div ref={trackRef} className="live-worksThumbTrack">
        {[...slides, ...slides, ...slides].map((slide, index) => <img
          data-project-media
          data-project-slug={slide.slug}
          src={slide.thumbnail}
          alt=""
          data-featured-work-thumb
          data-featured-work-index={index % slides.length}
          data-featured-work-physical-index={index}
          key={`${slide.slug}-${index}`}
        />)}
      </div>
      <img className="live-worksThumbActive" src="/assets/live/OoUkUu9DM15RTUezBMiSiq5PkS0.png" alt="" />
    </div>
    <span className="live-worksProgress" data-featured-work-timer aria-hidden="true">
      <i ref={progressRef} />
    </span>
    <ProjectHoverCursor cursorRef={hoverCursorRef} />
  </div>;
}
