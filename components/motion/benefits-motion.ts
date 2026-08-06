export const benefitsMotionSpec = {
  words: ["Build Better", "Build faster", "Build Smarter", "Build Stronger"],
  interval: 2,
  itemHeight: 88,
  gap: 10,
  step: 98,
  frameWidths: [405, 410, 470, 500],
  spring: { mass: 1, stiffness: 200, damping: 40 },
  frameSpring: {
    duration: .4,
    bounce: .2,
    mass: 1,
    stiffness: 505.60858084385114,
    damping: 35.97718675716959,
  },
  radarPulseDuration: .5,
  availabilityDelay: 1,
  availabilityDuration: 1,
  availabilityDistance: 195,
  handDuration: 4,
  handTarget: { x: -12, y: -21 },
} as const;

export type BenefitsMotionInspection = {
  activeSlide: number;
  frameSlide: number;
  physicalSlide: number;
  trackY: number;
  frameWidth: number;
  playing: boolean;
  wordPlaying: boolean;
};

export type BenefitsMotionRuntime = {
  pause: () => void;
  play: () => void;
  setPhase: (progress: number) => void;
  inspect: () => BenefitsMotionInspection;
  destroy: () => void;
};

type BenefitsMotionOptions = {
  deterministic: boolean;
  reduced: boolean;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function createBenefitsMotion({ deterministic, reduced }: BenefitsMotionOptions): BenefitsMotionRuntime | null {
  const frame = document.querySelector<HTMLElement>("[data-benefits-roller]");
  const track = document.querySelector<HTMLElement>("[data-benefits-word-track]");
  if (!frame || !track) return null;
  const section = frame.closest<HTMLElement>("#benefits");

  const { mass, stiffness, damping } = benefitsMotionSpec.spring;
  const frameSpring = benefitsMotionSpec.frameSpring;
  let activeSlide = 0;
  let frameSlide = 0;
  let physicalSlide = 4;
  let currentY = -physicalSlide * benefitsMotionSpec.step;
  let targetY = currentY;
  let currentWidth: number = benefitsMotionSpec.frameWidths[0];
  let targetWidth: number = currentWidth;
  let transitionStartY = currentY;
  let transitionStartWidth = currentWidth;
  let wordTransitionStartedAt: number | null = null;
  let frameTransitionStartedAt: number | null = null;
  let animationFrame = 0;
  let frameInterval = 0;
  let wordInterval = 0;
  let playing = false;
  let wordVisible = false;

  const viewportLoopTargets = [
    frame.parentElement?.querySelector("p i"),
    section?.querySelector('[data-motion-loop="benefits-radar"]'),
    section?.querySelector('[data-motion-loop="benefits-availability"]'),
    section?.querySelector('[data-motion-loop="benefits-hand"]'),
  ].filter((target): target is Element => target instanceof Element);
  const loopVisibility = new Map<Element, boolean>();
  const loopStarted = new Set<Element>();

  const decorativeAnimations = () => Array.from(section?.getAnimations?.({ subtree: true }) ?? []);
  const targetAnimations = (target: Element) => Array.from(target.getAnimations?.({ subtree: true }) ?? []);

  const pauseDecorativeAnimations = () => {
    decorativeAnimations().forEach((animation) => {
      try { animation.pause(); } catch { /* The decorative layer may be replaced during hydration. */ }
    });
  };

  const playDecorativeAnimations = () => {
    decorativeAnimations().forEach((animation) => {
      try { animation.play(); } catch { /* The decorative layer may be replaced during hydration. */ }
    });
    viewportLoopTargets.forEach((target) => {
      if (loopVisibility.get(target)) return;
      targetAnimations(target).forEach((animation) => {
        try { animation.pause(); } catch { /* The loop can be replaced during hydration. */ }
      });
    });
  };

  const setDecorativePhase = (progress: number) => {
    decorativeAnimations().forEach((animation) => {
      try {
        const timing = animation.effect?.getTiming();
        const duration = Number(timing?.duration);
        const delay = Number(timing?.delay) || 0;
        // Web Animations currentTime includes the authored delay. Sampling only
        // `duration * progress` kept the purchased hand line inside its 1s
        // delay and made deterministic screenshots appear to have no accents.
        if (Number.isFinite(duration) && duration > 0) animation.currentTime = Math.max(0, delay) + duration * progress;
        animation.pause();
      } catch { /* A finished animation can disappear while its state is sampled. */ }
    });
  };

  const render = () => {
    track.style.transform = `translate3d(0, ${currentY}px, 0)`;
    frame.style.width = `${currentWidth}px`;
  };

  const resetLoopCopy = () => {
    if (physicalSlide !== 8) return;
    physicalSlide = 4;
    currentY += benefitsMotionSpec.step * 4;
    targetY += benefitsMotionSpec.step * 4;
    render();
  };

  const tick = (time: number) => {
    if (!playing) return;
    if (wordTransitionStartedAt !== null) {
      const elapsed = Math.max(0, (time - wordTransitionStartedAt) / 1000);

      // Framer solves spring motion analytically. A stepped numerical integrator
      // introduces extra damping and visibly changes the overshoot, especially on
      // the rolling frame's duration/bounce spring.
      const yDisplacement = transitionStartY - targetY;
      const discriminant = damping * damping - 4 * mass * stiffness;
      if (discriminant > 0) {
        const root = Math.sqrt(discriminant);
        const slowRoot = (-damping + root) / (2 * mass);
        const fastRoot = (-damping - root) / (2 * mass);
        const slowAmount = (-fastRoot * yDisplacement) / (slowRoot - fastRoot);
        const fastAmount = yDisplacement - slowAmount;
        currentY = targetY
          + slowAmount * Math.exp(slowRoot * elapsed)
          + fastAmount * Math.exp(fastRoot * elapsed);
      } else {
        const naturalFrequency = Math.sqrt(stiffness / mass);
        currentY = targetY + yDisplacement * (1 + naturalFrequency * elapsed) * Math.exp(-naturalFrequency * elapsed);
      }

      const yVelocity = discriminant > 0
        ? (() => {
            const root = Math.sqrt(discriminant);
            const slowRoot = (-damping + root) / (2 * mass);
            const fastRoot = (-damping - root) / (2 * mass);
            const slowAmount = (-fastRoot * yDisplacement) / (slowRoot - fastRoot);
            const fastAmount = yDisplacement - slowAmount;
            return slowAmount * slowRoot * Math.exp(slowRoot * elapsed)
              + fastAmount * fastRoot * Math.exp(fastRoot * elapsed);
          })()
        : 0;
      const ySettled = Math.abs(targetY - currentY) < .01 && Math.abs(yVelocity) < .01;
      if (ySettled) {
        currentY = targetY;
        wordTransitionStartedAt = null;
        resetLoopCopy();
      }
    }

    if (frameTransitionStartedAt !== null) {
      const elapsed = Math.max(0, (time - frameTransitionStartedAt) / 1000);
      if (elapsed >= frameSpring.duration) {
        currentWidth = targetWidth;
        frameTransitionStartedAt = null;
      } else {
        const naturalFrequency = Math.sqrt(frameSpring.stiffness / frameSpring.mass);
        const dampingRatio = frameSpring.damping / (2 * Math.sqrt(frameSpring.stiffness * frameSpring.mass));
        const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);
        const decay = Math.exp(-dampingRatio * naturalFrequency * elapsed);
        const response = decay * (
          Math.cos(dampedFrequency * elapsed)
          + (dampingRatio * naturalFrequency / dampedFrequency) * Math.sin(dampedFrequency * elapsed)
        );
        currentWidth = targetWidth + (transitionStartWidth - targetWidth) * response;
      }
    }
    render();
    animationFrame = requestAnimationFrame(tick);
  };

  const advanceWord = () => {
    if (physicalSlide >= 8) resetLoopCopy();
    physicalSlide += 1;
    activeSlide = (activeSlide + 1) % benefitsMotionSpec.words.length;
    targetY = -physicalSlide * benefitsMotionSpec.step;
    transitionStartY = currentY;
    wordTransitionStartedAt = performance.now();
  };

  const advanceFrame = () => {
    frameSlide = (frameSlide + 1) % benefitsMotionSpec.words.length;
    targetWidth = benefitsMotionSpec.frameWidths[frameSlide];
    transitionStartWidth = currentWidth;
    frameTransitionStartedAt = performance.now();
  };

  const startWordLoop = () => {
    if (!playing || !wordVisible || wordInterval) return;
    wordInterval = window.setInterval(advanceWord, benefitsMotionSpec.interval * 1000);
  };

  const stopWordLoop = () => {
    if (wordInterval) window.clearInterval(wordInterval);
    wordInterval = 0;
  };

  const observer = new IntersectionObserver(([entry]) => {
    wordVisible = entry?.isIntersecting ?? false;
    if (wordVisible) startWordLoop();
    else stopWordLoop();
  });
  // The purchased slideshow uses playOffscreen:false, so its own viewport—not
  // the much taller Benefits section—controls whether the word timer advances.
  observer.observe(frame);

  const loopObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      loopVisibility.set(entry.target, entry.isIntersecting);
      targetAnimations(entry.target).forEach((animation) => {
        try {
          if (playing && !reduced && entry.isIntersecting) {
            loopStarted.add(entry.target);
            animation.play();
          } else {
            if (!loopStarted.has(entry.target)) animation.currentTime = 0;
            animation.pause();
          }
        } catch { /* A loop can disappear while its route is being replaced. */ }
      });
    });
  });
  viewportLoopTargets.forEach((target) => {
    loopVisibility.set(target, false);
    targetAnimations(target).forEach((animation) => {
      try {
        animation.currentTime = 0;
        animation.pause();
      } catch { /* A pseudo-element animation may not be ready until the next frame. */ }
    });
    loopObserver.observe(target);
  });

  const pause = () => {
    playing = false;
    if (frameInterval) window.clearInterval(frameInterval);
    frameInterval = 0;
    stopWordLoop();
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    pauseDecorativeAnimations();
  };

  const play = () => {
    if (reduced || playing) return;
    playing = true;
    frameInterval = window.setInterval(advanceFrame, benefitsMotionSpec.interval * 1000);
    startWordLoop();
    animationFrame = requestAnimationFrame(tick);
    playDecorativeAnimations();
  };

  const setPhase = (progress: number) => {
    const normalized = clamp(progress);
    activeSlide = normalized >= 1 ? 0 : Math.floor(normalized * benefitsMotionSpec.words.length);
    frameSlide = activeSlide;
    physicalSlide = 4 + activeSlide;
    currentY = targetY = -physicalSlide * benefitsMotionSpec.step;
    currentWidth = targetWidth = benefitsMotionSpec.frameWidths[frameSlide];
    transitionStartY = currentY;
    transitionStartWidth = currentWidth;
    wordTransitionStartedAt = null;
    frameTransitionStartedAt = null;
    render();
    setDecorativePhase(normalized);
  };

  render();
  if (!deterministic && !reduced) play();
  else requestAnimationFrame(pauseDecorativeAnimations);

  return {
    pause,
    play,
    setPhase,
    inspect: () => ({ activeSlide, frameSlide, physicalSlide, trackY: currentY, frameWidth: currentWidth, playing, wordPlaying: wordInterval !== 0 }),
    destroy: () => {
      pause();
      observer.disconnect();
      loopObserver.disconnect();
      track.style.removeProperty("transform");
      frame.style.removeProperty("width");
    },
  };
}
