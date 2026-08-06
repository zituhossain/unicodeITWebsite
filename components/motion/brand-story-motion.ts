import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const brandStoryMotionSpec = {
  transitionDuration: .6,
  easing: [.44, 0, .56, 1] as const,
  stickyTop: 50,
  triggerViewportProgress: .5,
  rulerDistance: 1440,
  rulerVelocity: 160,
  rulerDuration: 9,
  stateCount: 5,
} as const;

export type BrandStoryInspection = {
  activeState: number;
  stickyProgress: number;
  tagsRevealed: boolean;
  topRulerX: number;
  bottomRulerX: number;
  rulerProgress: number;
};

export type BrandStoryMotionRuntime = {
  pause: () => void;
  play: () => void;
  setState: (state: number, animate?: boolean) => void;
  setProgress: (progress: number) => void;
  setTagsRevealed: (revealed: boolean, animate?: boolean) => void;
  setRulerPhase: (progress: number) => void;
  inspect: () => BrandStoryInspection;
  destroy: () => void;
};

type BrandStoryMotionOptions = {
  deterministic: boolean;
  reduced: boolean;
};

type WordState = {
  left: number;
  top: string | number;
  yPercent: number;
  scale: number;
};

type StoryState = {
  building: WordState;
  brands: WordState;
  phrase: WordState;
  description: { left: number; top: number | "auto"; bottom: number | "auto"; opacity: number };
};

const storyStates: readonly StoryState[] = [
  {
    building: { left: 217, top: "50%", yPercent: -50, scale: 1 },
    brands: { left: 629, top: "50%", yPercent: -50, scale: 1 },
    phrase: { left: 261, top: "50%", yPercent: -50, scale: 1 },
    description: { left: 954, top: "auto", bottom: 0, opacity: 0 },
  },
  {
    building: { left: 217, top: "50%", yPercent: -50, scale: .6 },
    brands: { left: 584, top: "50%", yPercent: -50, scale: 1 },
    phrase: { left: 261, top: "50%", yPercent: -50, scale: 1 },
    description: { left: 954, top: "auto", bottom: 0, opacity: 0 },
  },
  {
    building: { left: 217, top: "50%", yPercent: -50, scale: .6 },
    brands: { left: 486, top: "50%", yPercent: -50, scale: .6 },
    phrase: { left: 261, top: "50%", yPercent: -50, scale: 1 },
    description: { left: 954, top: "auto", bottom: 0, opacity: 0 },
  },
  {
    building: { left: 217, top: 13, yPercent: 0, scale: .6 },
    brands: { left: 486, top: 13, yPercent: 0, scale: .6 },
    phrase: { left: 261, top: "50%", yPercent: -50, scale: .6 },
    description: { left: 954, top: "auto", bottom: 0, opacity: 0 },
  },
  {
    building: { left: 140, top: 13, yPercent: 0, scale: .6 },
    brands: { left: 408, top: 13, yPercent: 0, scale: .6 },
    phrase: { left: 87, top: -21, yPercent: 0, scale: .6 },
    description: { left: 656, top: 18, bottom: "auto", opacity: 1 },
  },
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function createBrandStoryMotion({ reduced }: BrandStoryMotionOptions): BrandStoryMotionRuntime | null {
  const section = document.querySelector<HTMLElement>("[data-brand-story]");
  if (!section) return null;

  gsap.registerPlugin(ScrollTrigger);
  const sticky = section.querySelector<HTMLElement>("[data-brand-sticky]");
  const building = section.querySelector<HTMLElement>("[data-brand-word='building']");
  const brands = section.querySelector<HTMLElement>("[data-brand-word='brands']");
  const phrase = section.querySelector<HTMLElement>("[data-brand-word='phrase']");
  const description = section.querySelector<HTMLElement>("[data-brand-description]");
  const tagsContainer = section.querySelector<HTMLElement>("[data-brand-tags]");
  const tags = Array.from(section.querySelectorAll<HTMLElement>("[data-brand-tag]"));
  const tagFills = Array.from(section.querySelectorAll<HTMLElement>("[data-brand-tag-fill]"));
  const tagLabels = Array.from(section.querySelectorAll<HTMLElement>("[data-brand-tag-label]"));
  const tagConnectors = Array.from(section.querySelectorAll<HTMLElement>("[data-brand-tag-connector]"));
  const sentinels = Array.from(section.querySelectorAll<HTMLElement>("[data-brand-sentinel]")).slice(0, 4);
  const topRuler = section.querySelector<HTMLElement>("[data-brand-ruler='top']");
  const bottomRuler = section.querySelector<HTMLElement>("[data-brand-ruler='bottom']");
  if (!sticky || !building || !brands || !phrase || !description || !topRuler || !bottomRuler) return null;

  const ease = "cubic-bezier(.44,0,.56,1)";
  let activeState = 0;
  let stickyProgress = 0;
  let tagsRevealed = false;
  let topLoop!: gsap.core.Tween;
  let bottomLoop!: gsap.core.Tween;
  let tagsTween: gsap.core.Timeline | null = null;

  const applyWord = (element: HTMLElement, state: WordState, animate: boolean) => {
    const vars = {
      left: state.left,
      top: state.top,
      yPercent: state.yPercent,
      scale: state.scale,
      duration: brandStoryMotionSpec.transitionDuration,
      ease,
      overwrite: true,
    };
    if (animate && !reduced) gsap.to(element, vars);
    else gsap.set(element, vars);
  };

  const applyState = (requestedState: number, animate = true) => {
    const index = Math.round(clamp(requestedState, 0, storyStates.length - 1));
    const state = storyStates[index];
    activeState = index;
    applyWord(building, state.building, animate);
    applyWord(brands, state.brands, animate);
    applyWord(phrase, state.phrase, animate);
    gsap.set(description, { top: state.description.top, bottom: state.description.bottom });
    const descriptionVars = {
      left: state.description.left,
      opacity: state.description.opacity,
      duration: brandStoryMotionSpec.transitionDuration,
      ease,
      overwrite: true,
    };
    if (animate && !reduced) gsap.to(description, descriptionVars);
    else gsap.set(description, descriptionVars);
  };

  const revealTags = (revealed: boolean, animate = true) => {
    tagsRevealed = revealed;
    tagsTween?.kill();
    tagsTween = null;
    if (!tags.length) return;
    gsap.set(tags, { opacity: 1 });
    if (animate && !reduced) {
      tagsTween = gsap.timeline({ defaults: { duration: brandStoryMotionSpec.transitionDuration, ease } });
      tagsTween.to(tagFills, { width: revealed ? "100%" : 1, opacity: revealed ? 1 : 0, overwrite: true }, 0);
      tagsTween.to(tagLabels, { opacity: revealed ? 1 : 0, overwrite: true }, 0);
      tagsTween.to(tagConnectors, { opacity: revealed ? 1 : 0, overwrite: true }, 0);
    } else {
      gsap.set(tagFills, { width: revealed ? "100%" : 1, opacity: revealed ? 1 : 0 });
      gsap.set(tagLabels, { opacity: revealed ? 1 : 0 });
      gsap.set(tagConnectors, { opacity: revealed ? 1 : 0 });
    }
  };

  const context = gsap.context(() => {
    applyState(0, false);
    revealTags(false, false);

    ScrollTrigger.create({
      trigger: tagsContainer ?? section,
      start: "top 50%",
      onEnter: () => revealTags(true),
      onEnterBack: () => revealTags(true),
      once: true,
    });

    sentinels.forEach((sentinel, index) => {
      ScrollTrigger.create({
        trigger: sentinel,
        start: "top 50%",
        onEnter: () => applyState(index + 1),
        onEnterBack: () => applyState(index + 1),
        onLeaveBack: () => applyState(index),
      });
    });

    topLoop = gsap.fromTo(topRuler, { x: 0 }, {
      x: -brandStoryMotionSpec.rulerDistance,
      duration: brandStoryMotionSpec.rulerDuration,
      ease: "none",
      repeat: -1,
      paused: true,
    });
    bottomLoop = gsap.fromTo(bottomRuler, { x: -brandStoryMotionSpec.rulerDistance }, {
      x: 0,
      duration: brandStoryMotionSpec.rulerDuration,
      ease: "none",
      repeat: -1,
      paused: true,
    });
  }, section);

  if (reduced) {
    applyState(4, false);
    revealTags(true, false);
  }

  const setRulerPhase = (progress: number) => {
    const normalized = clamp(progress);
    topLoop.pause().time(brandStoryMotionSpec.rulerDuration * normalized, false);
    bottomLoop.pause().time(brandStoryMotionSpec.rulerDuration * normalized, false);
  };

  const setProgress = (progress: number) => {
    stickyProgress = clamp(progress);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionStyle = getComputedStyle(section);
    const paddingTop = parseFloat(sectionStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(sectionStyle.paddingBottom) || 0;
    const scrollStart = sectionTop + paddingTop - brandStoryMotionSpec.stickyTop;
    const scrollEnd = sectionTop + section.offsetHeight - paddingBottom - sticky.offsetHeight - brandStoryMotionSpec.stickyTop;
    const targetScroll = scrollStart + Math.max(0, scrollEnd - scrollStart) * stickyProgress;
    const triggerLine = targetScroll + window.innerHeight * brandStoryMotionSpec.triggerViewportProgress;
    const state = sentinels.reduce((count, sentinel) => {
      const sentinelTop = sentinel.getBoundingClientRect().top + window.scrollY;
      return count + (sentinelTop <= triggerLine + .5 ? 1 : 0);
    }, 0);
    applyState(Math.min(4, state), false);
    revealTags(stickyProgress >= 0, false);
  };

  return {
    pause: () => {
      topLoop.pause();
      bottomLoop.pause();
      tagsTween?.pause();
    },
    play: () => {
      if (reduced) return;
      topLoop.play();
      bottomLoop.play();
      tagsTween?.play();
    },
    setState: applyState,
    setProgress,
    setTagsRevealed: revealTags,
    setRulerPhase,
    inspect: () => ({
      activeState,
      stickyProgress,
      tagsRevealed,
      topRulerX: -brandStoryMotionSpec.rulerDistance * topLoop.progress(),
      bottomRulerX: -brandStoryMotionSpec.rulerDistance * (1 - bottomLoop.progress()),
      rulerProgress: topLoop.progress(),
    }),
    destroy: () => context.revert(),
  };
}
