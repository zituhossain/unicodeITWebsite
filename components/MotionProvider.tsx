"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type AexoMotionController,
  type RouteMotionState,
  readRequestedMotionState,
  selectMotionCarousel,
} from "./motion/control";
import { createHeroMotion, type HeroMotionRuntime } from "./motion/hero-motion";
import { createBrandStoryMotion, type BrandStoryMotionRuntime } from "./motion/brand-story-motion";
import { createBenefitsMotion, type BenefitsMotionRuntime } from "./motion/benefits-motion";
import { createHeaderRuntime, type HeaderRuntime } from "./motion/header-runtime";
import { createCtaPhysics, type CtaPhysicsRuntime } from "./motion/cta-physics";
import { createStatsMotion, type StatsMotionRuntime } from "./motion/stats-motion";
import { magneticMotion, resolveRouteMotionSpec } from "./motion/specs";

function pauseDocumentAnimations() {
  document.getAnimations?.().forEach((animation) => {
    try { animation.pause(); } catch { /* A detached Framer-derived layer can finish between collection and pause. */ }
  });
}

function playDocumentAnimations() {
  document.getAnimations?.().forEach((animation) => {
    try { animation.play(); } catch { /* Ignore animations whose targets were removed during navigation. */ }
  });
}

async function waitForMotionAssets(capture: string | null) {
  await document.fonts?.ready;
  const scope = capture === "hero"
    ? document.querySelector<HTMLElement>("[data-section='hero']")
    : capture === "brand"
      ? document.querySelector<HTMLElement>("[data-brand-story]")
      : capture === "benefits"
        ? document.querySelector<HTMLElement>("#benefits")
      : null;
  const images = Array.from((scope ?? document).querySelectorAll<HTMLImageElement>("img"));
  await Promise.all(images.map(async (image) => {
    try {
      if (!image.complete) await new Promise<void>((resolve) => {
        const finish = () => resolve();
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
        window.setTimeout(finish, 3000);
      });
      await image.decode?.();
    } catch { /* A failed decorative image must not block deterministic inspection. */ }
  }));
}

export function MotionProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const loadTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const heroMotionRef = useRef<HeroMotionRuntime | null>(null);
  const brandMotionRef = useRef<BrandStoryMotionRuntime | null>(null);
  const benefitsMotionRef = useRef<BenefitsMotionRuntime | null>(null);
  const headerRuntimeRef = useRef<HeaderRuntime | null>(null);
  const ctaPhysicsRef = useRef<CtaPhysicsRuntime | null>(null);
  const statsMotionRef = useRef<StatsMotionRuntime | null>(null);
  const applyStateRef = useRef<(state: RouteMotionState) => void>(() => undefined);
  const routeStateRef = useRef<RouteMotionState>("revealed");
  const pathnameRef = useRef(pathname);
  const reducedRef = useRef(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(window.location.search);
    const deterministic = process.env.NODE_ENV !== "production" && params.get("motion") === "paused";
    const capture = process.env.NODE_ENV !== "production" ? params.get("capture") : null;
    const heroHover = process.env.NODE_ENV !== "production" ? params.get("hover") : null;
    reducedRef.current = reduced;
    pausedRef.current = reduced || deterministic;

    if (deterministic) {
      document.documentElement.dataset.motion = "paused";
      document.documentElement.dataset.motionReady = "false";
    }
    if (capture === "hero" || capture === "brand" || capture === "benefits") document.documentElement.dataset.capture = capture;
    if (capture === "hero" && (heroHover === "primary" || heroHover === "secondary")) {
      document.documentElement.dataset.heroHover = heroHover;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: reduced ? 0 : 1,
      smoothWheel: !reduced,
    });
    lenisRef.current = lenis;
    const headerRuntime = createHeaderRuntime({
      lenis,
      reduced,
      deterministic,
      onScrollUpdate: () => ScrollTrigger.update(),
    });
    headerRuntimeRef.current = headerRuntime;

    const logoLoop = reduced || deterministic ? null : gsap.to("[data-logo-disc]", {
      rotate: 360,
      duration: 5,
      ease: "none",
      repeat: -1,
    });

    let installedController: AexoMotionController | null = null;
    if (process.env.NODE_ENV !== "production") {
      installedController = {
        pause: () => {
          pausedRef.current = true;
          gsap.globalTimeline.pause();
          pauseDocumentAnimations();
          heroMotionRef.current?.pause();
          brandMotionRef.current?.pause();
          benefitsMotionRef.current?.pause();
          statsMotionRef.current?.pause();
          ctaPhysicsRef.current?.pause();
        },
        play: () => {
          pausedRef.current = false;
          gsap.globalTimeline.play();
          playDocumentAnimations();
          heroMotionRef.current?.play();
          brandMotionRef.current?.play();
          benefitsMotionRef.current?.play();
          statsMotionRef.current?.play();
          ctaPhysicsRef.current?.play();
        },
        seek: (time) => {
          if (heroMotionRef.current) heroMotionRef.current.seek(time);
          else loadTimelineRef.current?.pause().time(Math.max(0, time), false);
          statsMotionRef.current?.seek(time);
          pauseDocumentAnimations();
          pausedRef.current = true;
        },
        refresh: () => ScrollTrigger.refresh(),
        setScroll: (scrollY) => {
          const target = Math.max(0, scrollY);
          lenis.scrollTo(target, { immediate: true, force: true });
          window.scrollTo(0, target);
          ScrollTrigger.update();
          headerRuntime.sync(target, true);
        },
        setStickyProgress: (id, progress) => {
          const normalized = Math.min(1, Math.max(0, progress));
          const selectors: Record<string, string> = {
            brand: "[data-brand-story]",
            process: "[data-section='process']",
          };
          const section = document.querySelector<HTMLElement>(selectors[id] ?? id);
          if (!section) return;
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const sticky = id === "brand" ? section.querySelector<HTMLElement>("[data-brand-sticky]") : null;
          const sectionStyle = getComputedStyle(section);
          const paddingTop = parseFloat(sectionStyle.paddingTop) || 0;
          const paddingBottom = parseFloat(sectionStyle.paddingBottom) || 0;
          const start = sticky ? sectionTop + paddingTop - 50 : sectionTop;
          const distance = sticky
            ? Math.max(0, section.offsetHeight - paddingTop - paddingBottom - sticky.offsetHeight)
            : Math.max(0, section.offsetHeight - window.innerHeight);
          const target = start + distance * normalized;
          lenis.scrollTo(target, { immediate: true, force: true });
          window.scrollTo(0, target);
          ScrollTrigger.update();
          headerRuntime.sync(target, true);
          if (id === "brand") brandMotionRef.current?.setProgress(normalized);
        },
        setState: (state) => {
          routeStateRef.current = state;
          applyStateRef.current(state);
          window.dispatchEvent(new CustomEvent("aexo:motion-state", { detail: { state } }));
        },
        setSharedState: (state) => {
          document.documentElement.dataset.sharedMotion = state;
          routeStateRef.current = state;
          applyStateRef.current(state);
          if (state === "loop") ctaPhysicsRef.current?.setPhase(.5);
        },
        setCarousel: (id, index) => selectMotionCarousel(id, Math.max(0, Math.floor(index))),
        setLoopPhase: (id, progress) => {
          const normalized = Math.min(1, Math.max(0, progress));
          if (id === "hero-art") {
            heroMotionRef.current?.setLoopPhase(normalized);
          }
          if (id === "hero-marquee") {
            heroMotionRef.current?.setMarqueePhase(normalized);
          }
          if (id === "brand-rulers") {
            brandMotionRef.current?.setRulerPhase(normalized);
          }
          if (id === "benefits-words") {
            benefitsMotionRef.current?.setPhase(normalized);
          }
          if (id === "cta-tags") {
            ctaPhysicsRef.current?.setPhase(normalized);
          }
          document.querySelectorAll<HTMLElement>(`[data-motion-loop="${CSS.escape(id)}"]`).forEach((element) => {
            element.getAnimations?.({ subtree: true }).forEach((animation) => {
              try {
                const duration = Number(animation.effect?.getTiming().duration);
                if (Number.isFinite(duration) && duration > 0) animation.currentTime = duration * normalized;
                animation.pause();
              } catch { /* The loop may be replaced while a route is hydrating. */ }
            });
          });
          pausedRef.current = true;
        },
        snapshot: () => ({
          pathname: pathnameRef.current,
          paused: pausedRef.current,
          reduced: reducedRef.current,
          scrollY: window.scrollY,
          state: routeStateRef.current,
          scrollTriggerCount: ScrollTrigger.getAll().length,
          hero: heroMotionRef.current?.inspect() ?? null,
          brand: brandMotionRef.current?.inspect() ?? null,
          benefits: benefitsMotionRef.current?.inspect() ?? null,
          stats: statsMotionRef.current?.inspect() ?? null,
        }),
      };
      window.__AEXO_MOTION__ = installedController;
    }

    if (reduced || deterministic) requestAnimationFrame(pauseDocumentAnimations);

    return () => {
      headerRuntime.destroy();
      if (headerRuntimeRef.current === headerRuntime) headerRuntimeRef.current = null;
      logoLoop?.kill();
      lenis.destroy();
      lenisRef.current = null;
      delete document.documentElement.dataset.motion;
      delete document.documentElement.dataset.routeMotion;
      delete document.documentElement.dataset.sharedMotion;
      delete document.documentElement.dataset.motionReady;
      delete document.documentElement.dataset.capture;
      delete document.documentElement.dataset.heroHover;
      if (window.__AEXO_MOTION__ === installedController) delete window.__AEXO_MOTION__;
    };
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;
    headerRuntimeRef.current?.routeChanged();
    const spec = resolveRouteMotionSpec(pathname);
    const reduced = reducedRef.current;
    const deterministic = process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("motion") === "paused";
    const requestedState = readRequestedMotionState();
    routeStateRef.current = requestedState;
    document.documentElement.dataset.motionRoute = spec.route;
    if (deterministic) document.documentElement.dataset.motionReady = "false";

    const cleanups: Array<() => void> = [];
    let loadTimeline: gsap.core.Timeline | null = null;
    let heroMotion: HeroMotionRuntime | null = null;
    let brandMotion: BrandStoryMotionRuntime | null = null;
    let benefitsMotion: BenefitsMotionRuntime | null = null;
    let ctaPhysics: CtaPhysicsRuntime | null = null;
    let statsMotion: StatsMotionRuntime | null = null;

    const ctaRoot = document.querySelector<HTMLElement>("[data-shared-cta]");
    if (ctaRoot) {
      ctaPhysics = createCtaPhysics({ root: ctaRoot, reduced, deterministic });
      ctaPhysicsRef.current = ctaPhysics;
    }

    if (spec.load === "home") {
      heroMotion = createHeroMotion({ deterministic, reduced });
      heroMotionRef.current = heroMotion;
      loadTimeline = heroMotion.timeline;
      brandMotion = createBrandStoryMotion({ deterministic, reduced });
      brandMotionRef.current = brandMotion;
      benefitsMotion = createBenefitsMotion({ deterministic, reduced });
      benefitsMotionRef.current = benefitsMotion;
      const statsRoot = document.querySelector<HTMLElement>("[data-section='stats']");
      if (statsRoot) {
        statsMotion = createStatsMotion({ root: statsRoot, deterministic, reduced });
        statsMotionRef.current = statsMotion;
      }
    }

    if (!reduced && !deterministic) {
      type ViewportRuntime = { pause: () => void; play: () => void };
      const gateRuntime = (
        trigger: HTMLElement | string | null,
        runtime: ViewportRuntime | null,
        start = "top 88%",
        end = "bottom 12%",
        resetOnLeaveBack?: () => void,
      ) => {
        if (!trigger || !runtime) return;
        runtime.pause();
        const gate = ScrollTrigger.create({
          trigger,
          start,
          end,
          onEnter: () => runtime.play(),
          onEnterBack: () => runtime.play(),
          onLeave: () => runtime.pause(),
          onLeaveBack: () => {
            runtime.pause();
            resetOnLeaveBack?.();
          },
        });
        cleanups.push(() => gate.kill());
      };

      gateRuntime(document.querySelector<HTMLElement>("[data-brand-story]"), brandMotion, "top 72%", "bottom top");
      gateRuntime(document.querySelector<HTMLElement>("#benefits"), benefitsMotion, "top 65%", "bottom 12%");
      gateRuntime(ctaRoot, ctaPhysics, "top 72%", "bottom 10%");
      gateRuntime(
        document.querySelector<HTMLElement>("[data-section='stats']"),
        statsMotion,
        "top 65%",
        "bottom 15%",
        () => statsMotion?.setRevealed(false),
      );

      // CSS-owned loops (marquees, rulers, pulses and rotations) remain on
      // their first frame until their owning section enters the viewport.
      const viewportSections = Array.from(document.querySelectorAll<HTMLElement>(
        "main > section, main > [data-section], main > [data-brand-story], main > .live-caseMain > section, footer[data-section]",
      ));
      const setViewportState = (section: HTMLElement, running: boolean) => {
        section.dataset.motionViewport = running ? "running" : "paused";
      };
      const isInitiallyVisible = (section: HTMLElement) => {
        const rect = section.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight * .65;
      };
      viewportSections.forEach((section) => setViewportState(section, isInitiallyVisible(section)));
      const viewportObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => setViewportState(entry.target as HTMLElement, entry.isIntersecting));
      }, { rootMargin: "0px 0px -35% 0px", threshold: .01 });
      viewportSections.forEach((section) => viewportObserver.observe(section));
      cleanups.push(() => {
        viewportObserver.disconnect();
        viewportSections.forEach((section) => delete section.dataset.motionViewport);
      });
    }

    const context = gsap.context(() => {
      const pageRoot = document.querySelector<HTMLElement>("main");
      if (pageRoot) {
        const pageEntrance = gsap.fromTo(pageRoot, { opacity: 0 }, {
          opacity: 1,
          duration: .2,
          ease: "cubic-bezier(.27,0,.51,1)",
          paused: deterministic || reduced,
        });
        if (deterministic) pageEntrance.progress(requestedState === "initial" ? 0 : 1, false);
        else if (reduced) pageEntrance.progress(1, false);
      }

      for (const reveal of spec.reveals) {
        const elements = gsap.utils.toArray<HTMLElement>(reveal.selector);
        if (!elements.length) continue;
        if (reveal.selector === "[data-reveal]") {
          elements.forEach((element) => {
            const direction = element.dataset.reveal === "left" ? -36 : element.dataset.reveal === "right" ? 36 : reveal.fromX ?? 0;
            gsap.fromTo(element, { x: direction, y: direction ? 0 : reveal.fromY ?? 0, opacity: 0 }, {
              x: 0,
              y: 0,
              opacity: 1,
              duration: reveal.duration,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: reveal.start,
                toggleActions: element.dataset.once === "false" || reveal.reverse ? "play reverse play reverse" : "play none none none",
              },
            });
          });
        } else {
          gsap.fromTo(elements, { x: reveal.fromX ?? 0, y: reveal.fromY ?? 0, opacity: 0 }, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: reveal.duration,
            stagger: reveal.stagger ?? 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elements[0],
              start: reveal.start,
              toggleActions: reveal.reverse ? "play none none reverse" : "play none none none",
            },
          });
        }
      }

      const testimonialTrack = document.querySelector<HTMLElement>("[data-testimonial-track]");
      if (testimonialTrack) gsap.fromTo(testimonialTrack, { y: 32, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-section='testimonials']", start: "top 62%", toggleActions: "play none none reverse" },
      });

      const partnerArt = gsap.utils.toArray<HTMLElement>("[data-partner-art]");
      if (partnerArt.length) gsap.fromTo(partnerArt, { scale: .7, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "cubic-bezier(.44,0,.56,1)",
        clearProps: "transform",
        scrollTrigger: { trigger: "#partners", start: "top 65%", toggleActions: "play none none none" },
      });

      const partnersSection = document.querySelector<HTMLElement>("#partners");
      if (partnersSection) {
        const tracks = partnersSection.querySelectorAll<HTMLElement>("[data-motion-loop]");
        tracks.forEach((track) => { track.style.animationPlayState = "paused"; });
        ScrollTrigger.create({
          trigger: partnersSection,
          start: "top 65%",
          onEnter: () => tracks.forEach((track) => { track.style.animationPlayState = "running"; }),
          onLeaveBack: () => tracks.forEach((track) => { track.style.animationPlayState = "paused"; }),
        });
        cleanups.push(() => tracks.forEach((track) => { track.style.removeProperty("animation-play-state"); }));
      }

      const introTags = gsap.utils.toArray<HTMLElement>("[data-intro-tag]");
      if (introTags.length && document.querySelector("#services")) {
        const timeline = gsap.timeline({
          defaults: { duration: .4, ease: "cubic-bezier(.44,0,.56,1)" },
          scrollTrigger: { trigger: "#services", start: "top 50%", toggleActions: "play reverse play reverse" },
        });
        introTags.forEach((tag) => {
          const fill = tag.querySelector<HTMLElement>("i:first-child");
          const connector = tag.querySelector<HTMLElement>("i:nth-child(2)");
          const label = tag.querySelector<HTMLElement>("span > span");
          if (!fill || !connector || !label) return;
          timeline.fromTo(fill, { width: 1, opacity: 0 }, { width: "100%", opacity: 1 }, 0);
          timeline.fromTo([connector, label], { opacity: 0 }, { opacity: 1 }, 0);
        });
      }

      const pointerCards = gsap.utils.toArray<HTMLElement>("[data-pointer]");
      if (pointerCards.length) {
        // The purchased Framer project applies its `withMagnet` override to
        // these layers: mass 1, stiffness 400, damping 40 and 10% of the
        // pointer's distance from the element centre.
        const magnets = pointerCards.map((element) => ({
          element, hovered: false, x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0,
        }));
        let frame = 0;
        let previous = performance.now();
        const tick = (now: number) => {
          const dt = Math.min((now - previous) / 1000, 1 / 30);
          previous = now;
          let active = false;
          magnets.forEach((magnet) => {
            const ax = (magneticMotion.stiffness * (magnet.targetX - magnet.x) - magneticMotion.damping * magnet.vx) / magneticMotion.mass;
            const ay = (magneticMotion.stiffness * (magnet.targetY - magnet.y) - magneticMotion.damping * magnet.vy) / magneticMotion.mass;
            magnet.vx += ax * dt;
            magnet.vy += ay * dt;
            magnet.x += magnet.vx * dt;
            magnet.y += magnet.vy * dt;
            if (Math.abs(magnet.targetX - magnet.x) > .01 || Math.abs(magnet.targetY - magnet.y) > .01 || Math.abs(magnet.vx) > .01 || Math.abs(magnet.vy) > .01) active = true;
            gsap.set(magnet.element, { x: magnet.x, y: magnet.y });
          });
          frame = active ? requestAnimationFrame(tick) : 0;
        };
        const wake = () => {
          if (!frame) {
            previous = performance.now();
            frame = requestAnimationFrame(tick);
          }
        };
        const move = (event: PointerEvent) => magnets.forEach((magnet) => {
          if (!magnet.hovered) return;
          const rect = magnet.element.getBoundingClientRect();
          magnet.targetX = (event.clientX - (rect.left + rect.width / 2)) * magneticMotion.distance;
          magnet.targetY = (event.clientY - (rect.top + rect.height / 2)) * magneticMotion.distance;
          wake();
        });
        const listeners = magnets.map((magnet) => {
          const enter = () => { magnet.hovered = true; };
          const leave = () => {
            magnet.hovered = false;
            magnet.targetX = 0;
            magnet.targetY = 0;
            wake();
          };
          magnet.element.addEventListener("pointerenter", enter);
          magnet.element.addEventListener("pointerleave", leave);
          return { magnet, enter, leave };
        });
        window.addEventListener("pointermove", move);
        cleanups.push(() => {
          window.removeEventListener("pointermove", move);
          listeners.forEach(({ magnet, enter, leave }) => {
            magnet.element.removeEventListener("pointerenter", enter);
            magnet.element.removeEventListener("pointerleave", leave);
          });
          if (frame) cancelAnimationFrame(frame);
        });
      }

      const processSection = document.querySelector<HTMLElement>(
        "[data-section='process']",
      );
      const processSticky =
        processSection?.querySelector<HTMLElement>(".live-processSticky");
      const processViewport =
        processSection?.querySelector<HTMLElement>(".live-processRail");
      const processTrack =
        processSection?.querySelector<HTMLElement>("[data-process-track]");
      let processDistance = 0;
      let processScrollFrame = 0;
      let processMeasureFrame = 0;

      const paintProcessTrack = () => {
        processScrollFrame = 0;
        if (!processSection || !processSticky || !processTrack) return;

        const scrollRange = Math.max(
          processSection.offsetHeight - processSticky.clientHeight,
          0,
        );
        const rawProgress =
          scrollRange > 0
            ? -processSection.getBoundingClientRect().top / scrollRange
            : 0;
        const progress = Math.min(1, Math.max(0, rawProgress));
        const translateX = -processDistance * progress;

        processTrack.style.transform = `translate3d(${translateX.toFixed(3)}px, 0, 0)`;
      };

      const scheduleProcessPaint = () => {
        if (processScrollFrame) return;
        processScrollFrame = requestAnimationFrame(paintProcessTrack);
      };

      const measureProcessTrack = () => {
        processMeasureFrame = 0;
        if (!processSection || !processViewport || !processTrack) return;

        processDistance = Math.max(
          0,
          processTrack.scrollWidth - processViewport.clientWidth,
        );
        processSection.style.setProperty(
          "--process-scroll-distance",
          `${processDistance}px`,
        );
        scheduleProcessPaint();
      };

      const scheduleProcessMeasure = () => {
        cancelAnimationFrame(processMeasureFrame);
        processMeasureFrame = requestAnimationFrame(measureProcessTrack);
      };

      const processResizeObserver =
        typeof ResizeObserver === "undefined" ||
        !processViewport ||
        !processTrack
          ? null
          : new ResizeObserver(scheduleProcessMeasure);
      if (processViewport && processTrack) {
        processResizeObserver?.observe(processViewport);
        processResizeObserver?.observe(processTrack);
      }

      const processMutationObserver =
        typeof MutationObserver === "undefined" || !processTrack
          ? null
          : new MutationObserver(scheduleProcessMeasure);
      processMutationObserver?.observe(processTrack as HTMLElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      const processImages = processTrack
        ? Array.from(processTrack.querySelectorAll("img"))
        : [];
      processImages.forEach((image) => {
        if (!image.complete) image.addEventListener("load", scheduleProcessMeasure);
      });

      const processReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const updateProcessMotionPreference = () => {
        if (processTrack) {
          processTrack.style.willChange = processReducedMotion.matches
            ? "auto"
            : "transform";
        }
        scheduleProcessMeasure();
      };

      measureProcessTrack();
      document.fonts?.ready.then(scheduleProcessMeasure);
      window.addEventListener("load", scheduleProcessMeasure);
      window.addEventListener("resize", scheduleProcessMeasure);
      window.addEventListener("scroll", scheduleProcessPaint, { passive: true });
      processReducedMotion.addEventListener(
        "change",
        updateProcessMotionPreference,
      );
      updateProcessMotionPreference();

      cleanups.push(() => {
        window.removeEventListener("load", scheduleProcessMeasure);
        window.removeEventListener("resize", scheduleProcessMeasure);
        window.removeEventListener("scroll", scheduleProcessPaint);
        processReducedMotion.removeEventListener(
          "change",
          updateProcessMotionPreference,
        );
        processImages.forEach((image) => {
          image.removeEventListener("load", scheduleProcessMeasure);
        });
        processResizeObserver?.disconnect();
        processMutationObserver?.disconnect();
        cancelAnimationFrame(processScrollFrame);
        cancelAnimationFrame(processMeasureFrame);
      });

      // The purchased CTA has no page-level entrance or tag stagger. Its
      // badges are owned by two physics fields, so an invented ScrollTrigger
      // here changes both the captured initial state and the real trajectory.
    });

    loadTimelineRef.current = loadTimeline;
    applyStateRef.current = (state) => {
      routeStateRef.current = state;
      document.documentElement.dataset.routeMotion = state;
      if (heroMotion) heroMotion.seek(state === "initial" ? 0 : 1.3);
      else if (state === "initial") loadTimeline?.pause(0);
      else loadTimeline?.pause().progress(1, false);
      if (brandMotion) {
        if (state === "initial") {
          brandMotion.setState(0, false);
          brandMotion.setTagsRevealed(false, false);
        } else if (state === "sticky-start") {
          brandMotion.setProgress(0);
        } else if (state === "sticky-mid") {
          brandMotion.setProgress(.5);
        } else if (state === "sticky-end") {
          brandMotion.setProgress(1);
        } else {
          brandMotion.setTagsRevealed(true, false);
        }
      }
      if (benefitsMotion && state === "initial") benefitsMotion.setPhase(0);
      if (statsMotion) statsMotion.setRevealed(state !== "initial");
      if (deterministic && state === "initial") ctaPhysics?.setPhase(0);
      else if (deterministic && (state === "loop" || state === "loop-phase")) ctaPhysics?.setPhase(.5);
      if (state === "initial") document.documentElement.dataset.sharedMotion = "initial";
      else if (state === "hover") document.documentElement.dataset.sharedMotion = "hover";
      else if (state === "loop") document.documentElement.dataset.sharedMotion = "loop";
      else document.documentElement.dataset.sharedMotion = "revealed";

      if (deterministic && state !== "initial") {
        gsap.set("[data-reveal], [data-route-reveal], [data-partner-art], [data-testimonial-track]", {
          x: 0,
          y: 0,
          opacity: 1,
          clearProps: "transform",
        });
      }
    };

    if (reduced) {
      if (heroMotion) {
        heroMotion.timeline.pause().progress(1, false);
        heroMotion.setLoopPhase(0);
      } else (loadTimeline as gsap.core.Timeline | null)?.pause().progress(1, false);
      gsap.set("[data-reveal], [data-route-reveal]", { clearProps: "all" });
      requestAnimationFrame(pauseDocumentAnimations);
    } else if (deterministic) {
      applyStateRef.current(requestedState);
      const capture = new URLSearchParams(window.location.search).get("capture");
      void waitForMotionAssets(capture).then(() => {
        pauseDocumentAnimations();
        const params = new URLSearchParams(window.location.search);
        const requestedTime = Number(params.get("time"));
        if (Number.isFinite(requestedTime) && requestedTime >= 0) {
          window.__AEXO_MOTION__?.seek(requestedTime);
        }
        if (requestedState === "loop-phase") {
          const loopId = params.get("loop") ?? (capture === "brand" ? "brand-rulers" : "hero-art");
          const phase = Math.min(1, Math.max(0, Number(params.get("phase") ?? .013)));
          window.__AEXO_MOTION__?.setLoopPhase(loopId, phase);
        }
        const artPhase = Number(params.get("artPhase"));
        if (Number.isFinite(artPhase)) {
          window.__AEXO_MOTION__?.setLoopPhase("hero-art", Math.min(1, Math.max(0, artPhase)));
        }
        const marqueePhase = Number(params.get("marqueePhase"));
        if (Number.isFinite(marqueePhase)) {
          window.__AEXO_MOTION__?.setLoopPhase("hero-marquee", Math.min(1, Math.max(0, marqueePhase)));
        }
        if (requestedState === "carousel-slide") {
          window.__AEXO_MOTION__?.setCarousel(params.get("carousel") ?? "selected-works", Number(params.get("slide") ?? 0));
        }
        if (requestedState === "sticky-start" || requestedState === "sticky-mid" || requestedState === "sticky-end") {
          const fallback = requestedState === "sticky-start" ? 0 : requestedState === "sticky-end" ? 1 : .5;
          window.__AEXO_MOTION__?.setStickyProgress(params.get("sticky") ?? "brand", Number(params.get("progress") ?? fallback));
        }
        document.documentElement.dataset.motionReady = "true";
        window.dispatchEvent(new CustomEvent("aexo:motion-state", { detail: { state: requestedState } }));
        window.dispatchEvent(new CustomEvent("aexo:motion-ready", { detail: { state: requestedState, pathname } }));
      });
    } else {
      if (heroMotion) heroMotion.play();
      else (loadTimeline as gsap.core.Timeline | null)?.play(0);
    }

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refreshFrame);
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
      heroMotion?.destroy();
      if (heroMotionRef.current === heroMotion) heroMotionRef.current = null;
      brandMotion?.destroy();
      if (brandMotionRef.current === brandMotion) brandMotionRef.current = null;
      benefitsMotion?.destroy();
      if (benefitsMotionRef.current === benefitsMotion) benefitsMotionRef.current = null;
      statsMotion?.destroy();
      if (statsMotionRef.current === statsMotion) statsMotionRef.current = null;
      ctaPhysics?.destroy();
      if (ctaPhysicsRef.current === ctaPhysics) ctaPhysicsRef.current = null;
      loadTimelineRef.current = null;
      applyStateRef.current = () => undefined;
      delete document.documentElement.dataset.routeMotion;
      delete document.documentElement.dataset.motionRoute;
    };
  }, [pathname]);

  return null;
}


