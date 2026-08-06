import type Lenis from "lenis";
import gsap from "gsap";

const PHONE_MAX = 809.98;
const DIRECTION_THRESHOLD = .5;
const HEADER_OFFSET = -82;
const DURATION = .4;
const BOUNCE = .2;
const COMPACT_EASE = "cubic-bezier(.44,0,.56,1)";
const COMPACT_SHADOW = "inset 0 -10px 10px rgba(79,79,79,.1), inset 0 -4px 10px rgba(79,79,79,.25), 0 0 0 2px #000, 0 8px 18px rgba(0,0,0,.3), 0 33px 33px rgba(0,0,0,.25), 0 75px 45px rgba(0,0,0,.17)";

type LenisScrollEvent = {
  direction: number;
  velocity: number;
  scroll: number;
};

export type HeaderRuntime = {
  destroy(): void;
  routeChanged(): void;
  sync(scroll?: number, immediate?: boolean): void;
};

/**
 * Motion's duration-based spring resolves bounce to a damping ratio of
 * `1 - bounce`. Sampling that damped oscillator as a GSAP ease keeps the
 * header's intermediate frames deterministic without adding another runtime.
 */
function createDurationSpringEase(duration: number, bounce: number) {
  const dampingRatio = Math.min(.999, Math.max(.05, 1 - bounce));
  const remaining = .001;
  const angularFrequency = -Math.log(remaining * Math.sqrt(1 - dampingRatio ** 2)) / (dampingRatio * duration);
  const dampedFrequency = angularFrequency * Math.sqrt(1 - dampingRatio ** 2);
  const coefficient = dampingRatio / Math.sqrt(1 - dampingRatio ** 2);
  const response = (seconds: number) => 1 - Math.exp(-dampingRatio * angularFrequency * seconds)
    * (Math.cos(dampedFrequency * seconds) + coefficient * Math.sin(dampedFrequency * seconds));
  const finalResponse = response(duration);
  return (progress: number) => progress <= 0 ? 0 : progress >= 1 ? 1 : response(progress * duration) / finalResponse;
}

const framerHeaderSpring = createDurationSpringEase(DURATION, BOUNCE);

function createCompactLogo(container: HTMLElement) {
  const existing = container.querySelector<HTMLAnchorElement>("[data-header-compact-logo]");
  if (existing) return { element: existing, created: false };

  const link = document.createElement("a");
  link.href = "/";
  link.ariaLabel = "Aexo home";
  link.dataset.headerCompactLogo = "";
  Object.assign(link.style, {
    position: "absolute",
    zIndex: "1",
    left: "10px",
    top: "50%",
    width: "100px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    transform: "translateY(-50%)",
    filter: "blur(5px)",
    opacity: "0",
  });

  const image = document.createElement("img");
  image.alt = "Aexo";
  image.src = "/assets/logo/logo_white.png";
  Object.assign(image.style, {
    display: "block",
    width: "100px",
    height: "auto",
    objectFit: "contain",
  });

  link.append(image);
  container.append(link);
  return { element: link, created: true };
}

export function createHeaderRuntime({
  lenis,
  reduced,
  deterministic,
  onScrollUpdate,
}: {
  lenis: Lenis;
  reduced: boolean;
  deterministic: boolean;
  onScrollUpdate: () => void;
}): HeaderRuntime {
  let destroyed = false;
  let visible: boolean | null = null;
  let compact: boolean | null = null;
  let routeFrame = 0;
  let header: HTMLElement | null = null;
  let inner: HTMLElement | null = null;
  let regularLogo: HTMLElement | null = null;
  let compactLogo: HTMLElement | null = null;
  let compactLogoCreated = false;
  let previousHeaderTransition = "";

  const bindHeader = () => {
    const nextHeader = document.querySelector<HTMLElement>("[data-site-header]");
    if (!nextHeader || nextHeader === header) return;

    if (header) header.style.transition = previousHeaderTransition;
    header = nextHeader;
    previousHeaderTransition = header.style.transition;
    // GSAP exclusively owns the wrapper transform/opacity; the stylesheet's
    // concurrent transition otherwise creates a second, conflicting easing.
    header.style.transition = "none";
    inner = header.firstElementChild instanceof HTMLElement ? header.firstElementChild : null;
    regularLogo = inner?.querySelector<HTMLElement>(":scope > a:first-child") ?? null;
    if (inner) {
      const result = createCompactLogo(inner);
      compactLogo = result.element;
      compactLogoCreated = result.created;
    }
    visible = null;
    compact = null;
  };

  const setVisible = (next: boolean, immediate: boolean) => {
    bindHeader();
    if (!header || visible === next) return;
    visible = next;
    header.dataset.headerVisibility = next ? "visible" : "hidden";
    gsap.to(header, {
      y: next ? 0 : HEADER_OFFSET,
      opacity: next ? 1 : 0,
      duration: immediate || reduced || deterministic ? 0 : DURATION,
      ease: framerHeaderSpring,
      overwrite: "auto",
    });
  };

  const setCompact = (next: boolean, immediate: boolean) => {
    bindHeader();
    if (!header || !inner || compact === next) return;
    compact = next;
    header.dataset.headerVariant = next ? "compact" : "route";
    const duration = immediate || reduced || deterministic ? 0 : DURATION;
    const common = { duration, ease: COMPACT_EASE, overwrite: "auto" as const };

    gsap.to(header, {
      backgroundColor: next ? "rgba(10,10,10,0)" : "#0a0a0a",
      paddingTop: next ? 20 : 10,
      paddingRight: 40,
      paddingBottom: next ? 10 : 10,
      paddingLeft: 40,
      ...common,
    });
    gsap.to(inner, {
      maxWidth: next ? 656 : 1200,
      backgroundColor: next ? "#0f0f0f" : "rgba(15,15,15,0)",
      borderColor: next ? "#303030" : "rgba(48,48,48,0)",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 16,
      boxShadow: next ? COMPACT_SHADOW : "inset 0 -10px 10px rgba(79,79,79,0), inset 0 -4px 10px rgba(79,79,79,0), 0 0 0 2px rgba(0,0,0,0), 0 8px 18px rgba(0,0,0,0), 0 33px 33px rgba(0,0,0,0), 0 75px 45px rgba(0,0,0,0)",
      ...common,
    });
    if (regularLogo) gsap.to(regularLogo, {
      left: next ? -86 : 10,
      opacity: next ? 0 : 1,
      filter: next ? "blur(5px)" : "blur(0px)",
      ...common,
    });
    if (compactLogo) gsap.to(compactLogo, {
      opacity: next ? 1 : 0,
      filter: next ? "blur(0px)" : "blur(5px)",
      ...common,
    });
  };

  const sync = (scroll = lenis.scroll, immediate = false) => {
    if (destroyed) return;
    bindHeader();
    if (window.innerWidth <= PHONE_MAX) {
      setVisible(true, true);
      setCompact(false, true);
      return;
    }
    if (scroll <= DIRECTION_THRESHOLD) setVisible(true, immediate);
    setCompact(scroll > DIRECTION_THRESHOLD, immediate);
  };

  const onScroll = ({ direction, velocity, scroll }: LenisScrollEvent) => {
    onScrollUpdate();
    if (window.innerWidth <= PHONE_MAX) return sync(scroll, true);
    if (scroll <= DIRECTION_THRESHOLD) {
      setVisible(true, false);
    } else if (Math.abs(velocity) >= DIRECTION_THRESHOLD) {
      if (direction > 0) setVisible(false, false);
      else if (direction < 0) setVisible(true, false);
    }
    setCompact(scroll > DIRECTION_THRESHOLD, false);
  };

  const onResize = () => sync(lenis.scroll, true);
  lenis.on("scroll", onScroll);
  window.addEventListener("resize", onResize, { passive: true });

  const syncOverlay = () => {
    const htmlLocked = getComputedStyle(document.documentElement).overflow === "hidden";
    const bodyLocked = getComputedStyle(document.body).overflow === "hidden";
    if (htmlLocked || bodyLocked) lenis.stop();
    else lenis.start();
  };
  const overlayObserver = new MutationObserver(syncOverlay);
  overlayObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
  overlayObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "style"], childList: true, subtree: false });

  sync(window.scrollY, true);

  return {
    sync,
    routeChanged: () => {
      cancelAnimationFrame(routeFrame);
      routeFrame = requestAnimationFrame(() => {
        routeFrame = requestAnimationFrame(() => sync(window.scrollY, true));
      });
    },
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(routeFrame);
      lenis.off("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      overlayObserver.disconnect();
      if (header) {
        gsap.killTweensOf(header);
        header.style.transition = previousHeaderTransition;
        delete header.dataset.headerVisibility;
        delete header.dataset.headerVariant;
      }
      if (inner) gsap.killTweensOf(inner);
      if (regularLogo) gsap.killTweensOf(regularLogo);
      if (compactLogo) gsap.killTweensOf(compactLogo);
      if (compactLogoCreated) compactLogo?.remove();
    },
  };
}

