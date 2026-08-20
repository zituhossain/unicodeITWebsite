"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RouteMotionState } from "@/components/motion/control";

type AboutState = "initial" | "revealed" | "hover" | "culture-revealed";

const sourceEase = "cubic-bezier(.44,0,.56,1)";
const hoverSpring = "linear(0,0.0794,0.2486,0.4375,0.6093,0.7484,0.8518,0.9231,0.9688,0.9954,1.0091,1.0144,1.015,1.0131,1.0104,1.0076,1.0051,1.0032,1.0018,1.0009,1.0003)";

function isAboutState(value: string | null): value is AboutState {
  return value === "initial" || value === "revealed" || value === "hover" || value === "culture-revealed";
}

function routeStateToAboutState(state: RouteMotionState): AboutState {
  if (state === "initial") return "initial";
  if (state === "hover") return "hover";
  if (state === "loop" || state === "loop-phase") return "culture-revealed";
  return "revealed";
}

export function AboutMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.querySelector<HTMLElement>("[data-about-page]");
    if (!root) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = reducedQuery.matches;
    const search = new URLSearchParams(window.location.search);
    const deterministic = process.env.NODE_ENV !== "production" && search.get("motion") === "paused";
    const requestedState = search.get("aboutState");
    const initialState: AboutState = isAboutState(requestedState) ? requestedState : "revealed";
    const heroCopy = root.querySelectorAll<HTMLElement>("[data-about-hero-copy] > *");
    const founding = root.querySelectorAll<HTMLElement>("[data-about-founding]");
    const thinkers = root.querySelectorAll<HTMLElement>("[data-about-thinker-photo]");
    const portraits = root.querySelectorAll<HTMLElement>("[data-about-team-portrait]");
    const cultureImages = root.querySelectorAll<HTMLElement>("[data-about-culture-image]");
    const cultureGlow = root.querySelectorAll<HTMLElement>("[data-about-culture-glow]");
    const rings = root.querySelectorAll<HTMLElement>("[data-about-ring]");
    const ruler = root.querySelector<HTMLElement>("[data-about-culture-ruler]");
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-team-card]"));

    const setRulerPhase = (phase: number) => {
      if (!ruler) return;
      ruler.style.animation = "none";
      ruler.style.transform = `translate3d(${(-8640 * phase).toFixed(3)}px, 0, 0)`;
      ruler.dataset.motionPhase = phase.toFixed(6);
    };

    const setRingPhase = (phase: number) => {
      const normalized = Math.min(1, Math.max(0, phase));
      rings.forEach((ring) => {
        const direction = ring.dataset.aboutRing === "inner" ? 1 : -1;
        gsap.set(ring, { rotate: direction * 360 * normalized, transformOrigin: "50% 50%" });
        ring.dataset.motionPhase = normalized.toFixed(6);
      });
    };

    const clearMotionProps = () => {
      gsap.set([...heroCopy, ...founding, ...thinkers, ...portraits, ...cultureImages, ...cultureGlow], {
        clearProps: "transform,opacity,filter",
      });
    };

    if (reduced) {
      root.dataset.aboutState = "culture-revealed";
      root.dataset.aboutMotion = "reduced";
      clearMotionProps();
      gsap.set(portraits, { opacity: 1, scale: 1 });
      gsap.set(cultureImages, { opacity: 1, y: 0, scale: 1 });
      gsap.set(cultureGlow, { opacity: .5, y: 0, scale: 1 });
      setRingPhase(0);
      setRulerPhase(0);
      return () => {
        clearMotionProps();
        ruler?.style.removeProperty("animation");
        ruler?.style.removeProperty("transform");
        delete root.dataset.aboutState;
        delete root.dataset.aboutMotion;
      };
    }

    if (deterministic) {
      const applyState = (nextState: AboutState) => {
        const revealed = nextState !== "initial";
        const cultureRevealed = nextState !== "initial";
        root.dataset.aboutState = nextState;
        root.dataset.aboutMotion = "deterministic";
        root.dataset.aboutHover = nextState === "hover" ? "0" : "none";

        gsap.set(heroCopy, {
          opacity: revealed ? 1 : 0,
          y: revealed ? 0 : 34,
          scale: revealed ? 1 : .96,
        });
        gsap.set(founding, { opacity: revealed ? 1 : 0, x: revealed ? 0 : 36, y: revealed ? 0 : 24 });
        if (founding[0]) gsap.set(founding[0], { x: revealed ? 0 : -36 });
        gsap.set(thinkers, { opacity: revealed ? 1 : 0, x: 0, y: 0 });
        gsap.set(portraits, { opacity: revealed ? 1 : 0, scale: revealed ? 1 : 1.035 });
        gsap.set(cultureImages, { opacity: cultureRevealed ? 1 : 0, y: cultureRevealed ? 0 : 18, scale: cultureRevealed ? 1 : 1.025 });
        gsap.set(cultureGlow, { opacity: cultureRevealed ? .5 : 0, y: cultureRevealed ? -90 : 90, scale: cultureRevealed ? 1 : 1.08 });
        setRingPhase(nextState === "culture-revealed" ? .5 : 0);
        setRulerPhase(nextState === "culture-revealed" ? .5 : 0);
      };

      applyState(initialState);
      const listener = (event: Event) => {
        const requested = (event as CustomEvent<{ state: RouteMotionState }>).detail?.state;
        if (requested) applyState(routeStateToAboutState(requested));
      };
      window.addEventListener("aexo:motion-state", listener);
      return () => {
        window.removeEventListener("aexo:motion-state", listener);
        clearMotionProps();
        rings.forEach((ring) => {
          gsap.set(ring, { clearProps: "transform" });
          delete ring.dataset.motionPhase;
        });
        ruler?.style.removeProperty("animation");
        ruler?.style.removeProperty("transform");
        if (ruler) delete ruler.dataset.motionPhase;
        delete root.dataset.aboutState;
        delete root.dataset.aboutMotion;
        delete root.dataset.aboutHover;
      };
    }

    root.dataset.aboutState = "revealed";
    root.dataset.aboutMotion = "running";
    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const hero = gsap.timeline({ defaults: { duration: 1, ease: sourceEase } });
      const [heroKicker, heroHeading, heroDescription, heroButton] = Array.from(heroCopy);
      if (heroKicker) hero.fromTo(heroKicker, { y: -28, opacity: .001 }, { y: 0, opacity: 1 }, 0);
      if (heroHeading) hero.fromTo(heroHeading, { y: 44, opacity: .001, scale: .94 }, { y: 0, opacity: 1, scale: 1 }, .1);
      if (heroDescription) hero.fromTo(heroDescription, { y: 34, opacity: .001 }, { y: 0, opacity: 1 }, .2);
      if (heroButton) hero.fromTo(heroButton, { y: 34, opacity: .001, scale: .96 }, { y: 0, opacity: 1, scale: 1 }, .3);

      const innerRing = gsap.to("[data-about-ring='inner']", { rotate: 360, duration: 100, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      const outerRing = gsap.to("[data-about-ring='outer']", { rotate: -360, duration: 100, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      const heroSection = root.querySelector<HTMLElement>("[data-section='about-hero']");
      const ringObserver = heroSection && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
              innerRing.play();
              outerRing.play();
            } else {
              innerRing.pause();
              outerRing.pause();
            }
            root.dataset.aboutRings = entry?.isIntersecting ? "running" : "paused";
          }, { threshold: 0.01 })
        : null;
      if (ringObserver && heroSection) ringObserver.observe(heroSection);
      cleanups.push(() => ringObserver?.disconnect());

      gsap.fromTo("[data-about-founding='left']", { x: -36, y: 24, opacity: 0 }, {
        x: 0, y: 0, opacity: 1, duration: 1, ease: sourceEase,
        scrollTrigger: { trigger: "[data-about-founding='left']", start: "top 65%", toggleActions: "play reverse play reverse" },
      });
      gsap.fromTo("[data-about-founding='right']", { x: 36, y: 24, opacity: 0 }, {
        x: 0, y: 0, opacity: 1, duration: 1, delay: .1, ease: sourceEase,
        scrollTrigger: { trigger: "[data-about-founding='right']", start: "top 65%", toggleActions: "play reverse play reverse" },
      });

      gsap.fromTo("[data-about-thinker-photo='left']", { x: -48, y: 36, rotate: -8, opacity: 0 }, {
        x: 0, y: 0, rotate: -11, opacity: 1, duration: 1, ease: sourceEase,
        scrollTrigger: { trigger: "[data-section='about-us']", start: "top 62%", toggleActions: "play reverse play reverse" },
      });
      gsap.fromTo("[data-about-thinker-photo='right']", { x: 48, y: 36, rotate: 8, opacity: 0 }, {
        x: 0, y: -164, rotate: 10, opacity: 1, duration: 1, delay: .1, ease: sourceEase,
        scrollTrigger: { trigger: "[data-section='about-us']", start: "top 62%", toggleActions: "play reverse play reverse" },
      });

      if (portraits.length) gsap.fromTo(portraits, { opacity: 0, scale: 1.035 }, {
        opacity: 1, scale: 1, duration: 1, stagger: .08, ease: sourceEase,
        scrollTrigger: { trigger: "[data-section='team']", start: "top 56%", toggleActions: "play reverse play reverse" },
      });

      if (cultureImages.length) gsap.fromTo(cultureImages, { y: 18, scale: 1.025 }, {
        y: 0, scale: 1, duration: 1, stagger: .08, ease: sourceEase,
        scrollTrigger: { trigger: "[data-about-culture]", start: "top 68%", toggleActions: "play none none reverse" },
      });

      gsap.fromTo(cultureGlow, { opacity: 0, y: 90, scale: 1.08 }, {
        opacity: .5, y: -90, scale: 1, ease: "none",
        scrollTrigger: { trigger: "[data-section='culture']", start: "top bottom", end: "bottom top", scrub: true },
      });

      if (ruler) {
        ruler.style.animationPlayState = "paused";
        ScrollTrigger.create({
          trigger: "[data-section='culture']",
          start: "top bottom",
          end: "bottom top",
          onEnter: () => { ruler.style.animationPlayState = "running"; },
          onEnterBack: () => { ruler.style.animationPlayState = "running"; },
          onLeave: () => { ruler.style.animationPlayState = "paused"; },
          onLeaveBack: () => { ruler.style.animationPlayState = "paused"; },
        });
        cleanups.push(() => ruler.style.removeProperty("animation-play-state"));
      }
    }, root);

    const cardAnimations = new Map<HTMLElement, Animation[]>();
    const animateCard = (card: HTMLElement, hovered: boolean) => {
      cardAnimations.get(card)?.forEach((animation) => animation.cancel());
      const info = card.querySelector<HTMLElement>("[class*='teamCardInfo']");
      const overlay = card.querySelector<HTMLElement>("[class*='teamCardHover']");
      if (!info || !overlay) return;
      const animations = [
        info.animate([{ opacity: hovered ? 1 : 0 }, { opacity: hovered ? 0 : 1 }], { duration: 400, easing: hoverSpring, fill: "forwards" }),
        overlay.animate(
          [{ opacity: hovered ? 0 : 1, filter: hovered ? "blur(18px)" : "blur(0px)" }, { opacity: hovered ? 1 : 0, filter: hovered ? "blur(0px)" : "blur(18px)" }],
          { duration: 400, easing: hoverSpring, fill: "forwards" },
        ),
      ];
      cardAnimations.set(card, animations);
      root.dataset.aboutHover = hovered ? card.dataset.teamCard ?? String(cards.indexOf(card)) : "none";
      card.dataset.motionHover = String(hovered);
    };
    cards.forEach((card, index) => {
      card.dataset.teamCard = String(index);
      const enter = () => animateCard(card, true);
      const leave = () => animateCard(card, false);
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
        cardAnimations.get(card)?.forEach((animation) => animation.cancel());
        delete card.dataset.teamCard;
        delete card.dataset.motionHover;
      });
    });

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refreshFrame);
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
      clearMotionProps();
      delete root.dataset.aboutState;
      delete root.dataset.aboutMotion;
      delete root.dataset.aboutHover;
      delete root.dataset.aboutRings;
    };
  }, []);

  return null;
}
