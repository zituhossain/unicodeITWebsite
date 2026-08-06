"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motionIsDeterministic, useMotionCarousel } from "@/components/motion/control";

const CAROUSEL_ID = "pricing-quotes";
const TIMER_ID = "pricing-quote-timer";
const AUTOPLAY_DURATION = 5_000;
const QUOTE_TRANSITION = "opacity 400ms cubic-bezier(.44,0,.56,1), filter 400ms cubic-bezier(.44,0,.56,1)";

// Framer's duration-based spring is configured with duration: .4 and bounce: .2.
// This sampled response preserves the small overshoot while remaining seekable by
// the browser's animation clock.
const TAB_SPRING = "linear(0, .087 8.33%, .298 16.67%, .543 25%, .753 33.33%, .901 41.67%, .985 50%, 1.018 58.33%, 1.021 66.67%, 1.013 75%, 1.005 83.33%, 1.001 91.67%, 1)";

const slides = [
  {
    quote: "Seamless process from start to finish, they understood our vision quickly and delivered a high-quality product that exceeded expectations.",
    name: "Alex Morgan",
    role: "Product Lead",
  },
  {
    quote: "Their attention to detail elevated our brand instantly, making our product feel more premium, polished, and competitive in the market.",
    name: "Sarah Kim",
    role: "Marketing Head",
  },
  {
    quote: "Clear communication, fast execution, and thoughtful design decisions helped us improve conversions and create a much better overall user experience.",
    name: "Daniel Ross",
    role: "Founder",
  },
  {
    quote: "They go beyond design, bringing strategy and clarity into every decision, helping us build a product that performs consistently and connects with users.",
    name: "Emily Carter",
    role: "UX Manager",
  },
] as const;

const logos = [
  "RqFWIAmpQHWI3XwDywurrv6a0M.png",
  "m92VNot6TgOtXpNSRfrvz8qKaOs.png",
  "J3ePg8F3uGizhKL8A3taUNoKpK0.png",
  "Zgz1eMyqJ8PnPaddhNys508hYTk.png",
] as const;

export function LivePricingQuote() {
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<HTMLElement>(null);
  const timerAnimation = useRef<Animation | null>(null);
  const visible = useRef(false);
  const pageVisible = useRef(true);
  const reduced = useRef(false);
  const deterministic = useRef(false);
  const runningRef = useRef(false);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const [clockVersion, setClockVersion] = useState(0);

  const updateRunning = useCallback(() => {
    const nextRunning = visible.current && pageVisible.current && !reduced.current && !deterministic.current;
    runningRef.current = nextRunning;
    setRunning(nextRunning);
  }, []);

  const selectQuote = useCallback((index: number) => {
    const normalized = ((Math.trunc(index) % slides.length) + slides.length) % slides.length;
    setActive(normalized);
    // Selecting the current tab in Framer restarts that tab's five-second timer.
    setClockVersion((version) => version + 1);
  }, []);
  useMotionCarousel(CAROUSEL_ID, selectQuote);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    deterministic.current = motionIsDeterministic();
    pageVisible.current = document.visibilityState === "visible";
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = media.matches;
    setIsReduced(media.matches);

    const onVisibilityChange = () => {
      pageVisible.current = document.visibilityState === "visible";
      updateRunning();
    };
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reduced.current = event.matches;
      setIsReduced(event.matches);
      updateRunning();
      setClockVersion((version) => version + 1);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        updateRunning();
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0.01 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", onVisibilityChange);
    media.addEventListener("change", onReducedMotionChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      media.removeEventListener("change", onReducedMotionChange);
    };
  }, [updateRunning]);

  useEffect(() => {
    const element = timer.current;
    if (!element) return;

    timerAnimation.current?.cancel();
    timerAnimation.current = null;
    element.style.width = reduced.current ? "calc(100% + 1px)" : "1px";

    if (reduced.current) return;

    const animation = element.animate(
      [{ width: "1px" }, { width: "calc(100% + 1px)" }],
      {
        duration: AUTOPLAY_DURATION,
        easing: "linear",
        fill: "forwards",
      },
    );
    animation.id = TIMER_ID;
    timerAnimation.current = animation;
    animation.onfinish = () => {
      if (deterministic.current || reduced.current) return;
      setActive((index) => (index + 1) % slides.length);
    };

    if (!runningRef.current) animation.pause();

    return () => {
      animation.onfinish = null;
      animation.cancel();
      if (timerAnimation.current === animation) timerAnimation.current = null;
    };
  }, [active, clockVersion]);

  useEffect(() => {
    const animation = timerAnimation.current;
    if (!animation || reduced.current || deterministic.current) return;
    if (running) animation.play();
    else animation.pause();
  }, [running]);

  useEffect(() => {
    let frame = 0;
    const inspect = () => {
      const element = root.current;
      const animation = timerAnimation.current;
      if (!element) return;
      const elapsed = typeof animation?.currentTime === "number" ? animation.currentTime : 0;
      element.dataset.motionActive = String(active);
      element.dataset.motionRunning = String(running);
      element.dataset.motionElapsed = elapsed.toFixed(1);
      element.dataset.motionProgress = Math.min(1, Math.max(0, elapsed / AUTOPLAY_DURATION)).toFixed(4);
      element.dataset.motionDuration = String(AUTOPLAY_DURATION);
      if (running || deterministic.current) frame = window.requestAnimationFrame(inspect);
    };
    inspect();
    return () => window.cancelAnimationFrame(frame);
  }, [active, clockVersion, running]);

  return <div
    className="live-pricingQuoteExact"
    data-motion-carousel={CAROUSEL_ID}
    data-motion-source-transition="tween:.4:[.44,0,.56,1];spring:.4:bounce-.2"
    ref={root}
  >
    <div className="live-pricingQuoteStage">
      <img className="live-pricingQuoteSurface" src="/assets/live/hT7UOIQPukqpBI4ivaCU0ysWtXM.png" alt="" />
      <img className={`live-pricingQuoteRing live-pricingQuoteRingOuter`} src="/assets/live/detail-derivatives/tVKi9znZzAgYARCqBqyTiRbm6s-1024.png" alt="" />
      <img className={`live-pricingQuoteRing live-pricingQuoteRingInner`} src="/assets/live/detail-derivatives/98fwY6uljy91CPrSnYxoCPGbecA-1024.png" alt="" />
      <svg className="live-pricingQuoteMark" viewBox="0 0 44 44" aria-hidden="true">
        <path d="M20.423 9.625V22.4701C20.423 32.1578 12.2684 35.75 12.2684 35.75L11.6147 34.6609C11.6147 34.6609 16.5103 29.6546 15.6371 24.7535H5.30664V9.625H20.423Z" />
        <path d="M38.6871 9.625V22.4701C38.6871 32.1578 30.5325 35.75 30.5325 35.75L29.8788 34.6656C29.8788 34.6656 34.7744 29.6594 33.9012 24.7583H23.5755V9.625H38.6871Z" />
      </svg>
      <div className="live-pricingQuoteSlides">
        {slides.map((slide, index) => <article
          className={index === active ? "live-pricingQuoteSlideActive" : ""}
          aria-hidden={index !== active}
          key={slide.name}
          style={{
            filter: index === active ? "blur(0px)" : "blur(10px)",
            opacity: index === active ? 1 : 0,
            transition: QUOTE_TRANSITION,
            WebkitFilter: index === active ? "blur(0px)" : "blur(10px)",
          }}
        >
          <blockquote>{slide.quote}</blockquote>
          <p><strong>{slide.name}</strong><i /><span>{slide.role}</span></p>
        </article>)}
      </div>
    </div>
    <div className="live-pricingQuoteTabs">
      {logos.map((logo, index) => <button
        aria-label={`Show testimonial ${index + 1}`}
        aria-pressed={index === active}
        className={index === active ? "live-pricingQuoteTabActive" : ""}
        onClick={() => selectQuote(index)}
        type="button"
        key={logo}
      >
        <img
          src={`/assets/live/${logo}`}
          alt=""
          style={{
            opacity: index === active ? 1 : .4,
            transition: `opacity 400ms ${TAB_SPRING}`,
          }}
        />
        {index === active && <i
          className="live-pricingQuoteTimer"
          data-motion-loop={TIMER_ID}
          key={`${active}-${clockVersion}`}
          ref={timer}
          style={{
            animation: "none",
            left: "-1px",
            transform: "none",
            width: isReduced ? "calc(100% + 1px)" : "1px",
          }}
        />}
      </button>)}
    </div>
  </div>;
}
