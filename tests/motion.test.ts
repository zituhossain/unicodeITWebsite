import { describe, expect, it } from "vitest";
import { magneticMotion, resolveRouteMotionSpec } from "../components/motion/specs";
import { heroMotionSpec } from "../components/motion/hero-motion";
import { brandStoryMotionSpec } from "../components/motion/brand-story-motion";
import { benefitsMotionSpec } from "../components/motion/benefits-motion";
import { CTA_PHYSICS_CONFIG } from "../components/motion/cta-physics";

describe("desktop route motion registry", () => {
  it.each([
    ["/", "home"],
    ["/works", "works"],
    ["/works/ametrix", "work-detail"],
    ["/pricing", "pricing"],
    ["/about", "about"],
    ["/contact", "contact"],
    ["/404", "404"],
    ["/policy/our-privacy-policy", "policy"],
  ] as const)("maps %s to %s", (pathname, route) => {
    expect(resolveRouteMotionSpec(pathname).route).toBe(route);
  });

  it("keeps work galleries static as confirmed by the live source", () => {
    expect(resolveRouteMotionSpec("/works/notlex").reveals).toEqual([]);
  });

  it("uses the purchased Framer magnetic override values", () => {
    expect(magneticMotion).toEqual({ mass: 1, stiffness: 400, damping: 40, distance: .1 });
  });

  it("keeps the Hero timing and tuned loop measurements exact", () => {
    expect(heroMotionSpec).toMatchObject({
      loadDuration: 1.3,
      artworkDuration: 10,
      marqueeDistance: 574.3,
      marqueeVelocity: 50,
      easing: [.44, 0, .56, 1],
      delays: { heading: 0, trust: .1, description: .1, buttons: .2, skills: .3, artwork: 0 },
    });
    expect(heroMotionSpec.marqueeDistance / heroMotionSpec.marqueeVelocity).toBeCloseTo(11.486, 6);
  });

  it("keeps the purchased Brand Story scroll and ticker measurements exact", () => {
    expect(brandStoryMotionSpec).toEqual({
      transitionDuration: .6,
      easing: [.44, 0, .56, 1],
      stickyTop: 50,
      triggerViewportProgress: .5,
      rulerDistance: 1440,
      rulerVelocity: 160,
      rulerDuration: 9,
      stateCount: 5,
    });
    expect(brandStoryMotionSpec.rulerDistance / brandStoryMotionSpec.rulerVelocity).toBe(brandStoryMotionSpec.rulerDuration);
  });

  it("keeps the purchased Benefits slideshow and decorative loop values exact", () => {
    expect(benefitsMotionSpec).toMatchObject({
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
    });
  });

  it("uses the effective Framer CTA physics runtime values", () => {
    expect(CTA_PHYSICS_CONFIG).toMatchObject({
      density: .001,
      friction: .1,
      frictionAir: .01,
      gravityX: 0,
      gravityY: .75,
      mouseStiffness: .631,
      mouseAngularStiffness: .19,
      walls: { top: true, right: true, bottom: true, left: true },
    });
  });
});
