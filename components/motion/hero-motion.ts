import gsap from "gsap";

export type HeroMotionInspection = {
  loadTime: number;
  loadProgress: number;
  leftRotation: number;
  rightRotation: number;
  marqueeX: number;
  marqueeProgress: number;
};

export type HeroMotionRuntime = {
  timeline: gsap.core.Timeline;
  pause: () => void;
  play: () => void;
  seek: (time: number) => void;
  setLoopPhase: (progress: number) => void;
  setMarqueePhase: (progress: number) => void;
  inspect: () => HeroMotionInspection;
  destroy: () => void;
};

type HeroMotionOptions = {
  deterministic: boolean;
  reduced: boolean;
};

export const heroMotionSpec = {
  loadDuration: 1.3,
  artworkDuration: 10,
  marqueeDistance: 574.3,
  marqueeVelocity: 50,
  easing: [.44, 0, .56, 1] as const,
  delays: {
    heading: 0,
    trust: .1,
    description: .1,
    buttons: .2,
    skills: .3,
    artwork: 0,
  },
} as const;

const marqueeDuration = heroMotionSpec.marqueeDistance / heroMotionSpec.marqueeVelocity;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createHeroMotion({ deterministic, reduced }: HeroMotionOptions): HeroMotionRuntime {
  const paused = deterministic || reduced;
  let timeline!: gsap.core.Timeline;
  let leftLoop!: gsap.core.Tween;
  let rightLoop!: gsap.core.Tween;
  let marqueeLoop!: gsap.core.Tween;

  const context = gsap.context(() => {
    timeline = gsap.timeline({
      paused,
      defaults: { duration: 1, ease: "cubic-bezier(.44,0,.56,1)" },
    });
    timeline.fromTo("[data-hero='heading']", { y: 50, opacity: .001, scale: .9 }, { y: 0, opacity: 1, scale: 1 }, heroMotionSpec.delays.heading);
    timeline.fromTo("[data-hero='trust']", { y: -50, opacity: .001, scale: .9 }, { y: 0, opacity: 1, scale: 1 }, heroMotionSpec.delays.trust);
    timeline.fromTo("[data-hero='description']", { y: 50, opacity: .001, scale: .9 }, { y: 0, opacity: 1, scale: 1 }, heroMotionSpec.delays.description);
    timeline.fromTo("[data-hero='buttons']", { y: 50, opacity: .001, scale: .9 }, { y: 0, opacity: 1, scale: 1 }, heroMotionSpec.delays.buttons);
    timeline.fromTo("[data-hero='skills']", { y: 50, opacity: .001, scale: .9 }, { y: 0, opacity: 1, scale: 1 }, heroMotionSpec.delays.skills);
    timeline.fromTo("[data-hero-shape='left']", { "--hero-appear-rotate": "-20deg", "--hero-appear-scale": .8, opacity: .001 }, { "--hero-appear-rotate": "0deg", "--hero-appear-scale": 1, opacity: 1 }, heroMotionSpec.delays.artwork);
    timeline.fromTo("[data-hero-shape='left-glow']", { "--hero-appear-rotate": "-20deg", "--hero-appear-scale": .8, opacity: .0005 }, { "--hero-appear-rotate": "0deg", "--hero-appear-scale": 1, opacity: .25 }, heroMotionSpec.delays.artwork);
    timeline.fromTo("[data-hero-shape='right']", { "--hero-appear-rotate": "20deg", "--hero-appear-scale": .8, opacity: .001 }, { "--hero-appear-rotate": "0deg", "--hero-appear-scale": 1, opacity: 1 }, heroMotionSpec.delays.artwork);

    leftLoop = gsap.to("[data-hero-shape='left'], [data-hero-shape='left-glow']", {
      "--hero-loop-rotate": "360deg",
      duration: heroMotionSpec.artworkDuration,
      ease: "none",
      repeat: -1,
      paused,
    });
    rightLoop = gsap.to("[data-hero-shape='right']", {
      "--hero-loop-rotate": "-360deg",
      duration: heroMotionSpec.artworkDuration,
      ease: "none",
      repeat: -1,
      paused,
    });
    const marqueeTarget = document.querySelector("[data-hero-skills-track]");
    marqueeLoop = marqueeTarget
      ? gsap.fromTo(marqueeTarget, { x: 0 }, {
          x: -heroMotionSpec.marqueeDistance,
          duration: marqueeDuration,
          ease: "none",
          repeat: -1,
          paused,
        })
      : gsap.to({}, { duration: marqueeDuration, paused: true });
  });

  const setContinuousTime = (time: number) => {
    const safeTime = Math.max(0, time);
    leftLoop.pause().time(safeTime % heroMotionSpec.artworkDuration, false);
    rightLoop.pause().time(safeTime % heroMotionSpec.artworkDuration, false);
    marqueeLoop.pause().time(safeTime % marqueeDuration, false);
  };

  if (reduced) {
    timeline.pause().progress(1, false);
    setContinuousTime(0);
  }

  return {
    timeline,
    pause: () => {
      timeline.pause();
      leftLoop.pause();
      rightLoop.pause();
      marqueeLoop.pause();
    },
    play: () => {
      if (reduced) return;
      timeline.play();
      leftLoop.play();
      rightLoop.play();
      marqueeLoop.play();
    },
    seek: (time) => {
      timeline.pause().time(clamp(time, 0, heroMotionSpec.loadDuration), false);
      setContinuousTime(time);
    },
    setLoopPhase: (progress) => {
      const normalized = clamp(progress, 0, 1);
      leftLoop.pause().time(heroMotionSpec.artworkDuration * normalized, false);
      rightLoop.pause().time(heroMotionSpec.artworkDuration * normalized, false);
    },
    setMarqueePhase: (progress) => {
      marqueeLoop.pause().time(marqueeDuration * clamp(progress, 0, 1), false);
    },
    inspect: () => ({
      loadTime: timeline.time(),
      loadProgress: timeline.progress(),
      leftRotation: leftLoop.time() / heroMotionSpec.artworkDuration * 360,
      rightRotation: rightLoop.time() / heroMotionSpec.artworkDuration * -360,
      marqueeX: -heroMotionSpec.marqueeDistance * marqueeLoop.progress(),
      marqueeProgress: marqueeLoop.progress(),
    }),
    destroy: () => context.revert(),
  };
}
