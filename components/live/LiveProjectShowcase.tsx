"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { motionIsDeterministic, useMotionCarousel } from "@/components/motion/control";

const projects = [
  { slug: "tempo", name: "Tempo", image: "/assets/projects/tempo-home.png", icon: "/assets/projects/tempo-icon.ico", inset: 19 },
  { slug: "unigram", name: "Unigram", image: "/assets/projects/unigram-home.png", icon: "/assets/projects/unigram-icon.png", inset: 18 },
  { slug: "teamlink", name: "Teamlink", image: "/assets/live/30Nd65liCOODrWIKwQTTFtIWag.png", icon: "/assets/live/uvYFA3tUk0recctfNBRH2PNmk.png", inset: 16 },
] as const;

const cycleDuration = 5_000;
const transitionDuration = 400;

type ShowcaseRuntime = {
  select: (index: number, immediate?: boolean) => void;
};

function normalizeIndex(index: number) {
  return ((Math.trunc(index) % projects.length) + projects.length) % projects.length;
}

function cubicBezierProgress(progress: number) {
  const x = Math.min(1, Math.max(0, progress));
  let parameter = x;

  const curve = (value: number, point1: number, point2: number) => {
    const inverse = 1 - value;
    return 3 * inverse * inverse * value * point1 + 3 * inverse * value * value * point2 + value ** 3;
  };
  const derivative = (value: number, point1: number, point2: number) => {
    const inverse = 1 - value;
    return 3 * inverse * inverse * point1 + 6 * inverse * value * (point2 - point1) + 3 * value * value * (1 - point2);
  };

  for (let iteration = 0; iteration < 6; iteration += 1) {
    const slope = derivative(parameter, 0.44, 0.56);
    if (Math.abs(slope) < 0.000001) break;
    parameter -= (curve(parameter, 0.44, 0.56) - x) / slope;
    parameter = Math.min(1, Math.max(0, parameter));
  }

  return curve(parameter, 0, 1);
}

export function LiveProjectShowcase() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const projectLinkRef = useRef<HTMLAnchorElement>(null);
  const hoverCursorRef = useRef<HTMLDivElement>(null);
  const activeProjectRef = useRef<(typeof projects)[number]>(projects[0]);
  const runtimeRef = useRef<ShowcaseRuntime | null>(null);
  const pendingSelectionRef = useRef<number | null>(null);

  const selectDeterministicProject = useCallback((requestedIndex: number) => {
    const index = normalizeIndex(requestedIndex);
    if (runtimeRef.current) runtimeRef.current.select(index, true);
    else pendingSelectionRef.current = index;
  }, []);
  useMotionCarousel("home-projects", selectDeterministicProject);

  const selectManualProject = useCallback((requestedIndex: number) => {
    const index = normalizeIndex(requestedIndex);
    if (runtimeRef.current) runtimeRef.current.select(index);
    else pendingSelectionRef.current = index;
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const progress = progressRef.current;
    if (!root || !progress) return;

    const slides = Array.from(root.querySelectorAll<HTMLImageElement>("[data-showcase-slide]"));
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-showcase-tab]"));
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deterministic = motionIsDeterministic();

    let activeIndex = 0;
    let outgoingIndex = 0;
    let incomingIndex = 0;
    let cycleElapsed = 0;
    let transitionElapsed = transitionDuration;
    let transitioning = false;
    let transitionAmount = 1;
    let reducedMotion = reducedMotionQuery.matches;
    let isIntersecting = typeof IntersectionObserver === "undefined";
    let previousTimestamp: number | null = null;
    let animationFrame = 0;

    progress.style.animation = "none";
    progress.style.width = "55px";
    progress.style.transformOrigin = "left center";

    slides.forEach((slide) => {
      slide.style.transition = "none";
      slide.style.willChange = "opacity, filter";
    });

    const updateTabs = (selectedIndex: number) => {
      tabs.forEach((tab, index) => {
        const selected = index === selectedIndex;
        tab.classList.toggle("fix-projectTabActive", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.dataset.active = String(selected);
      });
    };

    const paintSlides = (amount: number) => {
      const eased = transitioning ? cubicBezierProgress(amount) : 1;
      slides.forEach((slide, index) => {
        const isOutgoing = index === outgoingIndex;
        const isIncoming = index === incomingIndex;
        const opacity = !transitioning
          ? (index === activeIndex ? 1 : 0)
          : isOutgoing
            ? 1 - eased
            : isIncoming
              ? eased
              : 0;
        const blur = !transitioning
          ? (index === activeIndex ? 0 : 10)
          : isOutgoing
            ? eased * 10
            : isIncoming
              ? (1 - eased) * 10
              : 10;

        slide.style.opacity = opacity.toFixed(6);
        slide.style.filter = `blur(${blur.toFixed(3)}px)`;
        slide.style.zIndex = isIncoming || index === activeIndex ? "2" : "1";
        slide.classList.toggle("fix-projectImageActive", !transitioning && index === activeIndex);
        slide.dataset.active = String(!transitioning ? index === activeIndex : isIncoming && eased >= 0.5);
        slide.setAttribute("aria-hidden", String(opacity <= 0.001));
      });
    };

    const paint = () => {
      const timerProgress = deterministic || reducedMotion
        ? 0
        : Math.min(1, Math.max(0, cycleElapsed / cycleDuration));
      transitionAmount = transitioning
        ? Math.min(1, Math.max(0, transitionElapsed / transitionDuration))
        : 1;

      progress.style.transform = `scaleX(${timerProgress.toFixed(6)})`;
      paintSlides(transitionAmount);
      updateTabs(transitioning ? incomingIndex : activeIndex);

      const canPlay = !deterministic && !reducedMotion && isIntersecting && document.visibilityState !== "hidden";
      root.dataset.carouselIndex = String(transitioning ? incomingIndex : activeIndex);
      root.dataset.carouselProgress = timerProgress.toFixed(6);
      root.dataset.carouselTransition = cubicBezierProgress(transitionAmount).toFixed(6);
      root.dataset.carouselPlaying = String(canPlay);
      root.dataset.carouselState = deterministic
        ? "deterministic"
        : reducedMotion
          ? "reduced"
          : transitioning
            ? "transitioning"
            : canPlay
              ? "playing"
              : "paused";

      const displayedIndex = transitioning && transitionAmount >= 0.5 ? incomingIndex : activeIndex;
      activeProjectRef.current = projects[displayedIndex];
      if (projectLinkRef.current) {
        projectLinkRef.current.href = `/works/${projects[displayedIndex].slug}`;
        projectLinkRef.current.setAttribute("aria-label", `View ${projects[displayedIndex].name} project`);
      }
    };

    const completeTransition = () => {
      activeIndex = incomingIndex;
      outgoingIndex = activeIndex;
      transitionElapsed = transitionDuration;
      transitioning = false;
      transitionAmount = 1;
    };

    const select = (requestedIndex: number, immediate = false) => {
      const index = normalizeIndex(requestedIndex);
      cycleElapsed = 0;
      previousTimestamp = null;

      if (immediate || deterministic || reducedMotion || index === activeIndex && !transitioning) {
        activeIndex = index;
        outgoingIndex = index;
        incomingIndex = index;
        transitioning = false;
        transitionElapsed = transitionDuration;
        paint();
        return;
      }

      const displayedIndex = transitioning && transitionAmount >= 0.5 ? incomingIndex : activeIndex;
      activeIndex = displayedIndex;
      outgoingIndex = displayedIndex;
      incomingIndex = index;
      transitionElapsed = 0;
      transitioning = outgoingIndex !== incomingIndex;
      paint();
    };
    runtimeRef.current = { select };

    const beginAutomaticTransition = (overflow: number) => {
      outgoingIndex = activeIndex;
      incomingIndex = (activeIndex + 1) % projects.length;
      transitionElapsed = Math.min(transitionDuration, Math.max(0, overflow));
      transitioning = true;
    };

    const tick = (timestamp: number) => {
      const canAdvance = !deterministic && !reducedMotion && isIntersecting && document.visibilityState !== "hidden";
      if (!canAdvance) {
        previousTimestamp = null;
        paint();
        animationFrame = requestAnimationFrame(tick);
        return;
      }

      if (previousTimestamp === null) previousTimestamp = timestamp;
      const delta = Math.max(0, timestamp - previousTimestamp);
      previousTimestamp = timestamp;
      cycleElapsed += delta;

      if (transitioning) {
        transitionElapsed += delta;
        if (transitionElapsed >= transitionDuration) completeTransition();
      }

      while (cycleElapsed >= cycleDuration) {
        const overflow = cycleElapsed - cycleDuration;
        cycleElapsed = overflow;
        if (transitioning) completeTransition();
        beginAutomaticTransition(overflow);
        if (transitionElapsed >= transitionDuration) completeTransition();
      }

      paint();
      animationFrame = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      previousTimestamp = null;
      paint();
    };
    const onResize = () => {
      previousTimestamp = null;
      paint();
    };
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      previousTimestamp = null;
      cycleElapsed = 0;
      if (transitioning) completeTransition();
      paint();
    };
    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isIntersecting = entry?.isIntersecting ?? false;
          previousTimestamp = null;
          paint();
        }, { rootMargin: "0px 0px -35% 0px", threshold: 0.01 });

    const initialIndex = pendingSelectionRef.current ?? 0;
    pendingSelectionRef.current = null;
    activeIndex = normalizeIndex(initialIndex);
    outgoingIndex = activeIndex;
    incomingIndex = activeIndex;
    paint();

    observer?.observe(root);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      runtimeRef.current = null;
      slides.forEach((slide) => {
        slide.style.removeProperty("transition");
        slide.style.removeProperty("will-change");
      });
      progress.style.removeProperty("animation");
      progress.style.removeProperty("transform");
      progress.style.removeProperty("transform-origin");
      progress.style.removeProperty("width");
    };
  }, []);

  const showProjectCursor = useCallback((event: ReactPointerEvent<HTMLAnchorElement>) => {
    const cursor = hoverCursorRef.current;
    if (!cursor || event.pointerType === "touch" || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    gsap.set(cursor, { x: event.clientX, y: event.clientY });
    gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: .4, ease: "back.out(1.2)", overwrite: true });
  }, []);

  const openActiveProject = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(`/works/${activeProjectRef.current.slug}`);
  }, [router]);

  const hideProjectCursor = useCallback(() => {
    const cursor = hoverCursorRef.current;
    if (!cursor) return;
    gsap.to(cursor, { autoAlpha: 0, scale: .9, duration: .4, ease: "back.out(1.2)", overwrite: true });
  }, []);

  return <section
    ref={rootRef}
    className={`live-productStage fix-productStage`}
    data-motion-carousel="home-projects"
    data-carousel-index="0"
    data-carousel-progress="0"
    data-carousel-transition="1"
    data-carousel-state="initial"
    data-carousel-playing="false"
    aria-label="Selected project preview"
  >
    <img className="fix-projectGlow" src="/assets/live/project-partners-glow-cyan.png" alt="" />
    <div className={`live-browserFrame fix-browserFrame`}>
      <img className="fix-browserShell" src="/assets/live/269s6g8NfMPp0Qq9CNdgoaPUM.png" alt="" />
      <div className="fix-projectImages">{projects.map((project, index) => <img
        className={index === 0 ? "fix-projectImageActive" : ""}
        data-showcase-slide
        data-showcase-index={index}
        data-project-media
        data-project-slug={project.slug}
        src={project.image}
        alt={`${project.name} project`}
        key={project.name}
      />)}</div>
      <div className={`live-browserTop fix-browserTop`} role="tablist" aria-label="Project previews">{projects.map((project, index) => <button
        className={index === 0 ? "fix-projectTabActive" : ""}
        data-showcase-tab
        data-showcase-index={index}
        type="button"
        role="tab"
        aria-selected={index === 0}
        tabIndex={index === 0 ? 0 : -1}
        onClick={() => selectManualProject(index)}
        key={project.name}
      ><img src={project.icon} alt="" /><span>{project.name}</span></button>)}</div>
      <span className="fix-projectProgress" data-motion-loop="project-progress" aria-hidden="true"><i ref={progressRef} /></span>
      <Link
        ref={projectLinkRef}
        className="fix-projectInteraction"
        href={`/works/${projects[0].slug}`}
        aria-label="View Tempo project"
        onPointerEnter={showProjectCursor}
        onPointerMove={showProjectCursor}
        onPointerLeave={hideProjectCursor}
        onClick={openActiveProject}
      />
    </div>
    <div ref={hoverCursorRef} className="fix-selectedCursor fix-projectHoverCursor" aria-hidden="true">
      <i><b /></i><span>View Project</span>
    </div>
    <div className="fix-mobileProjectViewport" aria-hidden="true">
      <div className="fix-mobileProjectTrack">{[...projects, ...projects].map((project, index) => <div className="fix-mobileProjectCard" key={`${project.name}-${index}`}><img className="fix-mobileProjectShell" src="/assets/live/269s6g8NfMPp0Qq9CNdgoaPUM.png" alt="" /><img className="fix-mobileProjectImage" data-project-media data-project-slug={project.slug} style={{ top: project.inset }} src={project.image} alt="" /></div>)}</div>
    </div>
  </section>;
}
