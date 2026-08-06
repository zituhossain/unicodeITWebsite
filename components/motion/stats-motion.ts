import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const statsMotionSpec = {
  ease: "cubic-bezier(.44,0,.56,1)",
  barDelay: .5,
  barDuration: 2,
  dotStarts: [.5, 1, 1.5, 2, 2.5],
  dotCounts: [1, 5, 8, 10, 13],
  dotDuration: .8,
  targetLength: 353.44830322265625,
  targetDuration: 2,
} as const;

export type StatsMotionInspection = {
  time: number;
  progress: number;
  activeDots: number;
  targetProgress: number;
  playing: boolean;
};

export type StatsMotionRuntime = {
  pause: () => void;
  play: () => void;
  seek: (time: number) => void;
  setRevealed: (revealed: boolean) => void;
  inspect: () => StatsMotionInspection;
  destroy: () => void;
};

type StatsMotionOptions = {
  root: HTMLElement;
  deterministic: boolean;
  reduced: boolean;
};

export function createStatsMotion({ root, deterministic, reduced }: StatsMotionOptions): StatsMotionRuntime {
  gsap.registerPlugin(ScrollTrigger);
  const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-stat-bar]"));
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-stat-dot]"));
  const target = root.querySelector<SVGPathElement>("[data-stat-target-path]");
  const master = gsap.timeline({ paused: true });
  const targetTimeline = gsap.timeline({ paused: true });

  bars.forEach((bar) => {
    const height = Number(bar.dataset.statBar) || 1;
    master.fromTo(bar, { scaleY: 1 / height }, {
      scaleY: 1,
      duration: statsMotionSpec.barDuration,
      ease: statsMotionSpec.ease,
    }, statsMotionSpec.barDelay);
  });

  let previousCount = 0;
  statsMotionSpec.dotCounts.forEach((count, stateIndex) => {
    const group = dots.slice(previousCount, count);
    if (group.length) master.to(group, {
      backgroundColor: "rgb(169, 255, 243)",
      duration: statsMotionSpec.dotDuration,
      ease: statsMotionSpec.ease,
    }, statsMotionSpec.dotStarts[stateIndex]);
    previousCount = count;
  });

  if (target) targetTimeline.fromTo(target, {
    strokeDashoffset: statsMotionSpec.targetLength,
  }, {
    strokeDashoffset: 0,
    duration: statsMotionSpec.targetDuration,
    ease: statsMotionSpec.ease,
  });

  let targetTriggered = false;
  let playing = false;
  const targetTrigger = ScrollTrigger.create({
    trigger: root,
    start: "top 50%",
    onEnter: () => {
      targetTriggered = true;
      if (!deterministic && !reduced) targetTimeline.play(0);
    },
    onEnterBack: () => {
      targetTriggered = true;
      if (!deterministic && !reduced) targetTimeline.play();
    },
    onLeaveBack: () => {
      targetTriggered = false;
      targetTimeline.pause(0);
    },
  });

  const setCompleted = () => {
    master.pause().progress(1, false);
    targetTimeline.pause().progress(1, false);
    targetTriggered = true;
  };

  if (reduced) setCompleted();

  return {
    pause: () => {
      playing = false;
      master.pause();
      targetTimeline.pause();
    },
    play: () => {
      if (reduced) return;
      playing = true;
      master.play();
      if (targetTriggered) targetTimeline.play();
    },
    seek: (time) => {
      const next = Math.max(0, time);
      playing = false;
      master.pause().time(Math.min(next, master.duration()), false);
      targetTimeline.pause().time(Math.min(next, targetTimeline.duration()), false);
    },
    setRevealed: (revealed) => {
      playing = false;
      if (revealed) setCompleted();
      else {
        master.pause(0);
        targetTimeline.pause(0);
        targetTriggered = false;
      }
    },
    inspect: () => ({
      time: master.time(),
      progress: master.progress(),
      activeDots: dots.filter((dot) => {
        const color = getComputedStyle(dot).backgroundColor;
        return color === "rgb(169, 255, 243)";
      }).length,
      targetProgress: targetTimeline.progress(),
      playing,
    }),
    destroy: () => {
      targetTrigger.kill();
      master.kill();
      targetTimeline.kill();
    },
  };
}
