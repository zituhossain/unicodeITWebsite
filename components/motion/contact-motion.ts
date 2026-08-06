import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RouteMotionState } from "./control";

const sourceEase = "cubic-bezier(.44,0,.56,1)";
const logoDistance = 1152;
const logoDuration = 38;

export type ContactMotionRuntime = {
  setState: (state: RouteMotionState) => void;
  setLogoPhase: (phase: number) => void;
  inspect: () => {
    state: string;
    logoPhase: number;
    logoPlaying: boolean;
  };
  destroy: () => void;
};

type ContactMotionOptions = {
  form: HTMLFormElement;
  reduced: boolean;
  deterministic: boolean;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function createContactMotion({ form, reduced, deterministic }: ContactMotionOptions): ContactMotionRuntime {
  gsap.registerPlugin(ScrollTrigger);
  const hero = form.closest<HTMLElement>("[data-section='contact-hero']");
  const page = hero?.closest<HTMLElement>("main");
  if (!hero || !page) {
    return { setState: () => undefined, setLogoPhase: () => undefined, inspect: () => ({ state: "missing", logoPhase: 0, logoPlaying: false }), destroy: () => undefined };
  }

  const introKicker = hero.querySelector<HTMLElement>("[data-contact-intro] > p:first-child");
  const heading = hero.querySelector<HTMLElement>("[data-contact-intro] h1");
  const description = hero.querySelector<HTMLElement>("[data-contact-intro] > p:not(:first-child)");
  const call = hero.querySelector<HTMLElement>("[data-contact-call]");
  const art = hero.querySelector<HTMLElement>("[data-contact-art]");
  const cardsSection = page.querySelector<HTMLElement>("[data-section='contact-cards']");
  const cards = Array.from(cardsSection?.querySelectorAll<HTMLElement>("[data-route-reveal]") ?? []);
  const logo = cardsSection?.querySelector<HTMLElement>("[data-motion-loop='contact-logos']") ?? null;
  const loadTargets = [introKicker, heading, description, call, form, art].filter((target): target is HTMLElement => Boolean(target));

  let state: RouteMotionState = deterministic
    ? ((new URLSearchParams(window.location.search).get("state") as RouteMotionState | null) ?? "revealed")
    : "revealed";
  let logoPhase = 0;
  let logoPlaying = false;
  let destroyed = false;
  let setupFrame = 0;
  let loadTimeline: gsap.core.Timeline | null = null;
  let cardsTween: gsap.core.Tween | null = null;
  let cardTrigger: ScrollTrigger | null = null;
  let logoObserver: IntersectionObserver | null = null;

  const setLogoPhase = (requested: number) => {
    logoPhase = clamp(requested);
    if (!logo) return;
    logo.style.animation = "none";
    logo.style.transform = `translate3d(${(-logoDistance * logoPhase).toFixed(3)}px, 0, 0)`;
    logo.dataset.motionPhase = logoPhase.toFixed(6);
    logo.dataset.motionPlaying = "false";
    logoPlaying = false;
  };

  const restoreLogoLoop = () => {
    if (!logo || deterministic || reduced) return;
    logo.style.removeProperty("transform");
    // Removing the inline override restores the CSS-module keyframe name;
    // only the measured source duration is supplied inline.
    logo.style.removeProperty("animation");
    logo.style.animationDuration = `${logoDuration}s`;
    logo.style.animationPlayState = logoPlaying ? "running" : "paused";
    delete logo.dataset.motionPhase;
    logo.dataset.motionPlaying = String(logoPlaying);
  };

  const setState = (next: RouteMotionState) => {
    state = next;
    const revealed = next !== "initial";
    hero.dataset.contactMotion = deterministic ? "deterministic" : reduced ? "reduced" : "running";
    hero.dataset.contactState = next;
    loadTimeline?.pause(revealed ? loadTimeline.duration() : 0, false);
    gsap.set(cards, { y: revealed ? 0 : 32, opacity: revealed ? 1 : 0 });
    if (next === "loop" || next === "loop-phase") setLogoPhase(.5);
    else if (deterministic || reduced) setLogoPhase(0);
  };

  const onMotionState = (event: Event) => {
    const requested = (event as CustomEvent<{ state?: RouteMotionState }>).detail?.state;
    if (requested) setState(requested);
  };
  window.addEventListener("aexo:motion-state", onMotionState);

  setupFrame = requestAnimationFrame(() => {
    if (destroyed) return;

    // MotionProvider supplies the common route bootstrap. Contact owns these
    // nodes, so remove only its provisional tweens/triggers before installing
    // the purchased component's exact route sequence.
    gsap.killTweensOf(loadTargets);
    gsap.killTweensOf(cards);
    ScrollTrigger.getAll().forEach((trigger) => {
      const triggerElement = trigger.trigger;
      if (triggerElement instanceof Element && cardsSection?.contains(triggerElement)) trigger.kill();
    });

    // Framer starts this sequence before React hydration. The local controller
    // starts after hydration, so use the measured .8s playback window to land
    // on the same absolute 1.3s reference frame while preserving its stagger.
    loadTimeline = gsap.timeline({ paused: deterministic || reduced, defaults: { duration: .8, ease: sourceEase } });
    if (introKicker) loadTimeline.fromTo(introKicker, { y: -28, opacity: .001 }, { y: 0, opacity: 1 }, 0);
    if (art) loadTimeline.fromTo(art, { x: 58, opacity: .001 }, { x: 0, opacity: 1 }, 0);
    if (heading) loadTimeline.fromTo(heading, { y: 42, opacity: .001, scale: .94 }, { y: 0, opacity: 1, scale: 1 }, .1);
    loadTimeline.fromTo(form, { x: 38, opacity: .001, scale: .98 }, { x: 0, opacity: 1, scale: 1 }, .1);
    if (description) loadTimeline.fromTo(description, { y: 34, opacity: .001 }, { y: 0, opacity: 1 }, .2);
    if (call) loadTimeline.fromTo(call, { y: 34, opacity: .001 }, { y: 0, opacity: 1 }, .3);

    if (cards.length && cardsSection) {
      cardsTween = gsap.fromTo(cards, { y: 32, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: .1,
        ease: sourceEase,
        // ScrollTrigger is the sole playback owner. Allowing this tween to
        // auto-play makes the cards reveal on route load before their measured
        // 62% viewport threshold and leaves stale progress on revisits.
        paused: true,
      });
      if (!deterministic && !reduced) {
        cardTrigger = ScrollTrigger.create({
          trigger: cards[0],
          start: "top 62%",
          onEnter: () => cardsTween?.play(),
          onEnterBack: () => cardsTween?.play(),
          onLeaveBack: () => cardsTween?.reverse(),
        });
      }
    }

    if (reduced) {
      loadTimeline.progress(1, false);
      cardsTween?.progress(1, false);
      setLogoPhase(0);
    } else if (deterministic) {
      setState(state);
    } else {
      loadTimeline.play(0);
      if (logo && cardsSection && typeof IntersectionObserver !== "undefined") {
        logoObserver = new IntersectionObserver(([entry]) => {
          logoPlaying = Boolean(entry?.isIntersecting) && document.visibilityState !== "hidden";
          restoreLogoLoop();
        }, { rootMargin: "0px 0px -30% 0px", threshold: .01 });
        logoObserver.observe(cardsSection);
      } else {
        logoPlaying = true;
        restoreLogoLoop();
      }
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  const onVisibility = () => {
    if (!logo || deterministic || reduced) return;
    if (document.visibilityState === "hidden") logoPlaying = false;
    else if (cardsSection) {
      const rect = cardsSection.getBoundingClientRect();
      logoPlaying = rect.bottom > 0 && rect.top < window.innerHeight;
    }
    restoreLogoLoop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setState,
    setLogoPhase,
    inspect: () => ({ state, logoPhase, logoPlaying }),
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(setupFrame);
      window.removeEventListener("aexo:motion-state", onMotionState);
      document.removeEventListener("visibilitychange", onVisibility);
      logoObserver?.disconnect();
      cardTrigger?.kill();
      cardsTween?.kill();
      loadTimeline?.kill();
      gsap.set([...loadTargets, ...cards], { clearProps: "transform,opacity,filter" });
      if (logo) {
        logo.style.removeProperty("animation");
        logo.style.removeProperty("animation-duration");
        logo.style.removeProperty("animation-play-state");
        logo.style.removeProperty("transform");
        delete logo.dataset.motionPhase;
        delete logo.dataset.motionPlaying;
      }
      delete hero.dataset.contactMotion;
      delete hero.dataset.contactState;
    },
  };
}
