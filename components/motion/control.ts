"use client";

import { useEffect } from "react";
import type { HeroMotionInspection } from "./hero-motion";
import type { BrandStoryInspection } from "./brand-story-motion";
import type { BenefitsMotionInspection } from "./benefits-motion";
import type { StatsMotionInspection } from "./stats-motion";

export type RouteMotionState =
  | "initial"
  | "revealed"
  | "hover"
  | "expanded"
  | "loop"
  | "sticky-start"
  | "sticky-mid"
  | "sticky-end"
  | "loop-phase"
  | "carousel-slide";

export type MotionSnapshot = {
  pathname: string;
  paused: boolean;
  reduced: boolean;
  scrollY: number;
  state: RouteMotionState;
  scrollTriggerCount: number;
  hero: HeroMotionInspection | null;
  brand: BrandStoryInspection | null;
  benefits: BenefitsMotionInspection | null;
  stats: StatsMotionInspection | null;
};

export type AexoMotionController = {
  pause: () => void;
  play: () => void;
  seek: (time: number) => void;
  refresh: () => void;
  setScroll: (scrollY: number) => void;
  setStickyProgress: (id: string, progress: number) => void;
  setState: (state: RouteMotionState) => void;
  setSharedState: (state: "initial" | "revealed" | "hover" | "loop") => void;
  setCarousel: (id: string, index: number) => void;
  setLoopPhase: (id: string, progress: number) => void;
  snapshot: () => MotionSnapshot;
};

declare global {
  interface Window {
    __AEXO_MOTION__?: AexoMotionController;
  }
}

const carouselEvent = "aexo:motion-carousel";

export function motionIsDeterministic() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return false;
  return new URLSearchParams(window.location.search).get("motion") === "paused";
}

export function readRequestedMotionState(): RouteMotionState {
  if (typeof window === "undefined") return "revealed";
  const params = new URLSearchParams(window.location.search);
  const value = params.get("state") ?? params.get("shared");
  return value === "initial" || value === "hover" || value === "expanded" || value === "loop" || value === "sticky-start" || value === "sticky-mid" || value === "sticky-end" || value === "loop-phase" || value === "carousel-slide" ? value : "revealed";
}

export function useMotionCarousel(id: string, onSelect: (index: number) => void) {
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; index: number }>).detail;
      if (detail?.id === id) onSelect(detail.index);
    };
    window.addEventListener(carouselEvent, listener);
    return () => window.removeEventListener(carouselEvent, listener);
  }, [id, onSelect]);
}

export function selectMotionCarousel(id: string, index: number) {
  window.dispatchEvent(new CustomEvent(carouselEvent, { detail: { id, index } }));
}
