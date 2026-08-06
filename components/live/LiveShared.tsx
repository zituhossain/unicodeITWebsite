import Link from "next/link";
import type { ReactNode } from "react";
import { calLink, liveFaqs, liveTestimonials } from "@/lib/live-data";
import { RollingPrimaryLink } from "./LiveHeader";
import { LiveFaq } from "./LiveInteractive";

export function LiveButton({
  href = calLink,
  children = "Book A Free Call",
  dark = false,
  centered = false,
  className = "",
}: {
  href?: string;
  children?: ReactNode;
  dark?: boolean;
  centered?: boolean;
  className?: string;
}) {
  const external = href.startsWith("http");
  const buttonClassName = `live-liveButton fix-liveButton ${dark ? `live-darkButton fix-darkButton` : ""} ${className}`;
  if (!dark)
    return (
      <RollingPrimaryLink
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        variant="wide"
        tone="red"
        centered={centered}
        className={buttonClassName}
      >
        {children}
      </RollingPrimaryLink>
    );
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`${buttonClassName} rolling-secondary`}
      data-rolling-button="secondary"
    >
      {children}
    </Link>
  );
}

export function ContactCardAction({
  href = calLink,
  children,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <RollingPrimaryLink
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      variant="wide"
      tone="white"
      className={`live-contactCardAction ${className}`}
    >
      {children}
    </RollingPrimaryLink>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="live-kicker">
      <i />
      {children}
    </p>
  );
}

export function LiveTitle({
  kicker,
  children,
  center = false,
}: {
  kicker?: string;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`live-liveTitle ${center ? "live-center" : ""}`}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2>{children}</h2>
    </div>
  );
}

function TestimonialHeart() {
  return (
    <i className="live-testimonialHeart" aria-hidden="true">
      <svg viewBox="0 0 130 100" role="presentation">
        <g transform="translate(26.019 4.66)">
          <path
            className="live-testimonialHeartFill"
            d="M 43.942 82.023 C 70.855 55.601 89.742 11 61.593 1.183 C 46.417 -4.11 36.171 9.322 32.136 22.304 C 25.235 15.006 15.201 9.828 7.568 15.367 C -8.443 26.986 -0.284 61.924 43.942 82.023 Z"
            fill="rgb(var(--brand-rgb) / 0.5)"
            transform="translate(2.113 2.12)"
          />
          <path
            className="live-testimonialHeartRed"
            d="M 64.402 1.302 C 55.997 -1.629 48.86 0.667 43.408 5.412 C 38.903 9.333 35.542 14.91 33.344 20.587 C 30.235 17.794 26.659 15.444 22.939 14.141 C 18.153 12.466 12.964 12.487 8.437 15.772 C -0.685 22.391 -2.451 35.277 3.338 48.485 C 9.162 61.771 22.71 75.86 45.178 86.071 L 46.502 86.672 L 47.538 85.654 C 61.195 72.248 72.873 54.189 77.563 38.089 C 79.906 30.045 80.567 22.275 78.64 15.759 C 76.675 9.118 72.071 3.976 64.402 1.302 Z"
            fill="transparent"
            stroke="var(--brand)"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            strokeWidth="4.24"
          />
        </g>
        <g transform="translate(28.131 6.78)">
          <path
            className="live-testimonialHeartWhite"
            d="M 43.942 82.023 C 70.855 55.601 89.742 11 61.593 1.183 C 33.443 -8.634 22.255 45.973 36.21 42.633 C 50.164 39.293 23.58 3.747 7.568 15.367 C -8.443 26.986 -0.284 61.924 43.942 82.023 Z"
            fill="transparent"
            stroke="#ffffff"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            strokeWidth="2.7"
          />
        </g>
      </svg>
    </i>
  );
}

export function Testimonials() {
  const avatars = [
    "2rswq23jjlnRTi7DPaCIWj0y04w.png",
    "K9DnSOhLja4KTERyyVDfs.png",
    "iRe6ld4p3tQcyRitKmtYR9COjY.png",
    "KpF5hoN7j0ToaZD1DAf5ciUt5rY.png",
    "fLRwv5ljYnJviagoeeY4E3gW1U.png",
    "3jHJfNLig4FRz6NnPFIp60un0Jo.png",
  ];
  return (
    <section className="live-testimonialsExact" data-section="testimonials">
      <div className={`live-liveTitle live-center`}>
        <Kicker>Testimonials</Kicker>
        <h2>
          Real Feedback.
          <br />
          Real Results
        </h2>
      </div>
      <p className="live-sectionLead">
        Discover our comprehensive range of services tailored to enhance your
        digital presence.
      </p>
      <div className="live-testimonialViewportExact">
        <div
          className="live-testimonialTrackExact"
          data-testimonial-track
          data-motion-loop="testimonials"
        >
          {[...liveTestimonials, ...liveTestimonials].map((item, index) => (
            <article key={index}>
              <b className="live-quoteMark">”</b>
              <blockquote>{item.quote}</blockquote>
              <footer>
                <img
                  src={`/assets/live/${avatars[index % avatars.length]}`}
                  alt=""
                />
                <span>
                  <b>{item.name}</b>
                  <small>{item.role}</small>
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const ordered = [
    liveFaqs[0],
    liveFaqs[1],
    liveFaqs[2],
    liveFaqs[3],
    liveFaqs[4],
    liveFaqs[5],
    liveFaqs[1],
    liveFaqs[6],
  ];
  return (
    <section className="live-faqExact" data-section="faq">
      <LiveTitle kicker="FAQ’s" center>
        Frequently Asked
        <br />
        Questions
      </LiveTitle>
      <div className="live-faqGridExact">
        {ordered.map(([question, answer], index) => (
          <LiveFaq
            question={question}
            answer={answer}
            key={`${question}-${index}`}
            index={index}
          />
        ))}
      </div>
      <div className="live-faqContactExact">
        <b>
          <i>?</i>
          <span>Still Have a Question</span>
        </b>
        <Link data-brand-button href="/contact">
          Contact Us
        </Link>
      </div>
    </section>
  );
}

export function ScaleCTA() {
  return (
    <section
      className={`live-scaleCtaExact shared-scale-cta`}
      data-section="cta"
      data-shared-cta
    >
      <img
        className={`live-scaleCtaGlow shared-glow`}
        data-cta-layer="glow"
        src="/assets/live/hmnwPSglwCIGdQjCqhEbqtQumI8.png"
        alt=""
      />
      <img
        className={`live-scaleCtaTexture shared-texture`}
        data-cta-layer="texture"
        src="/assets/live/brand-cyan/vPufXlAxj0qjF98pQCjoHGRq40.png"
        alt=""
      />
      <div className="shared-kicker" data-cta-copy="kicker">
        <Kicker>Ready to get started?</Kicker>
      </div>
      <h2 data-cta-copy="heading">
        Ready to
        <br />
        Scale Now
      </h2>
      <LiveButton>Book A Call</LiveButton>
    </section>
  );
}

export function LiveFooter() {
  const homeLinks = [
    ["Partners", "/#partners"],
    ["Works", "/#works"],
    ["Services", "/#what-we-do"],
    ["Benefits", "/#benefits"],
    ["Comparison", "/#comparison"],
    ["Testimonials", "/#testimonials"],
  ] as const;
  return (
    <footer
      className={`live-footerExact shared-footer`}
      data-section="footer"
      data-shared-footer
    >
      <img
        className={`live-footerBackdropExact shared-footer-backdrop`}
        src="/assets/live/brand-cyan/qfxmllsEQ8LT5FmJKm1sadVYsGg.png"
        alt=""
      />
      <div className={`live-footerMainExact shared-footer-main`}>
        <div className={`live-footerBrand shared-footer-brand`}>
          <Link href="/" className={`live-footerLogoExact shared-footer-logo`}>
            <img src="/assets/logo/logo_white.png" alt="UnicodeIT" />
          </Link>
          <a
            className={`live-footerEmailExact shared-footer-email`}
            data-footer-email
            href="mailto:contact@unicodeit.com"
          >
            <span className="shared-footer-email-well">
              <span className="shared-footer-email-well-inner">
                <span className="shared-footer-email-hover-label">
                  contact@unicodeit.com
                </span>
                <span className="shared-footer-email-icon">
                  <img
                    src="/assets/live/kM9jSUZLyWdbxIqG89MSUiTPTg.png"
                    alt=""
                  />
                </span>
              </span>
            </span>
            <span className="shared-footer-email-rest-label">
              contact@unicodeit.com
            </span>
          </a>
        </div>
        <div className="shared-footer-home">
          <b>Home</b>
          {homeLinks.map(([label, href]) => (
            <Link href={href} key={label}>
              {label}
            </Link>
          ))}
        </div>
        <div className="shared-footer-pages">
          <b>Pages</b>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/about">About Us</Link>
        </div>
        <div className={`live-footerSocials shared-footer-socials`}>
          <b>Socials</b>
          <a
            href="https://www.facebook.com/Unicodeitltd/"
            target="_blank"
            rel="noreferrer"
          >
            <i>
              <FooterSocialIcon kind="facebook" />
            </i>
            <span>Facebook</span>
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            <i>
              <FooterSocialIcon kind="instagram" />
            </i>
            <span>Instagram</span>
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            <i>
              <FooterSocialIcon kind="x" />
            </i>
            <span>X / Twitter</span>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
            <i>
              <FooterSocialIcon kind="linkedin" />
            </i>
            <span>Linkedin</span>
          </a>
        </div>
      </div>
      <div className={`live-footerBottomExact shared-footer-bottom`}>
        <span>© 2026 UnicodeIT, All rights reserved.</span>
        <span data-motion-loop="footer-availability">
          <i />
          Available for new projects
        </span>
        <div>
          <Link href="/policy/our-privacy-policy">Privacy Policy</Link>
          <Link href="/policy/our-terms-conditions">Terms of Service</Link>
        </div>
      </div>
      <div
        className={`live-footerWave shared-footer-wave`}
        data-footer-wave
        data-motion-loop="footer-ruler"
        aria-hidden="true"
      >
        <img src="/assets/live/sCElb0ycSJhVjPjM7nlsRGVqM.png" alt="" />
        <img src="/assets/live/sCElb0ycSJhVjPjM7nlsRGVqM.png" alt="" />
      </div>
    </footer>
  );
}

function FooterSocialIcon({
  kind,
}: {
  kind: "facebook" | "instagram" | "x" | "linkedin";
}) {
  if (kind === "facebook")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M13.75 20.25v-7h2.5l.375-3h-2.875V8.375c0-.875.25-1.5 1.5-1.5h1.625V4.25c-.375-.05-1.2-.125-2.175-.125-2.15 0-3.625 1.3-3.625 3.7v2.425H8.625v3h2.45v7h2.675Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  if (kind === "instagram")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4.5" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="16.875" cy="7.125" r="1.125" fill="currentColor" />
      </svg>
    );
  if (kind === "x")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 3.75H9l10.5 16.5H15L4.5 3.75Z" />
        <path d="m10.676 13.456-6.176 6.794M19.5 3.75l-6.176 6.794" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx=".75" />
      <path d="M8.25 10.5v6M11.25 10.5v6m0-3.375a2.625 2.625 0 0 1 5.25 0V16.5" />
      <circle cx="8.25" cy="7.875" r="1.125" fill="currentColor" />
    </svg>
  );
}
