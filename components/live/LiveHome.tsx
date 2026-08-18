import {
  comparisonRows,
  type ComparisonIcon,
  type ComparisonValue,
} from "@/lib/comparison-data";
import { livePricing, liveServices } from "@/lib/live-data";
import { LivePricingQuote } from "./LivePricingQuote";
import { LiveProjectShowcase } from "./LiveProjectShowcase";
import { LiveSelectedWorks } from "./LiveSelectedWorks";
import {
  ContactCardAction,
  FAQ,
  LiveButton,
  LiveTitle,
  Testimonials,
} from "./LiveShared";
import { PricingCalculator } from "./PricingCalculator";
import { TechnologyStack } from "./TechnologyStack";
import { ContactHeroSection } from "./LiveContactHero";

const PARTNER_LOGOS = [
  { name: "Dropcall", src: "/assets/brand/dropcall-logo.png" },
  { name: "FormGent", src: "/assets/brand/FormGent-logo.png" },
  { name: "HelpGent", src: "/assets/brand/helpgent-logo.png" },
  { name: "LeadFex", src: "/assets/brand/LeadFex_Logo.png" },
  { name: "Offcoustic", src: "/assets/brand/offcoustic-logo.png" },
  { name: "Pentillo", src: "/assets/brand/pentillo-logo.png" },
  { name: "Riptide", src: "/assets/brand/riptide-logo.png" },
  { name: "Storyteq", src: "/assets/brand/Storyteq_Logo.png" },
  { name: "Synthesia", src: "/assets/brand/synthesia-logo.png" },
  { name: "Waymark", src: "/assets/brand/Waymark-logo.png" },
] as const;

type PartnerLogo = (typeof PARTNER_LOGOS)[number];

function Hero() {
  return (
    <section className={`live-hero fix-hero`} data-section="hero">
      <div className="fix-heroBackdrop" aria-hidden="true">
        <div className="fix-heroArtLeft" data-hero-art="left">
          <img
            className="fix-heroLeftBase"
            src="/assets/live/hero-left-base-unicodeit-v2.png"
            alt=""
          />
          <img
            className="fix-heroLeftShape"
            data-hero-shape="left"
            src="/assets/live/hero-shape-unicodeit-v2.png"
            alt=""
          />
          <img
            className="fix-heroLeftGlow"
            data-hero-shape="left-glow"
            src="/assets/live/hero-glow-unicodeit-v2.png"
            alt=""
          />
          <div className="fix-heroLeftMaskWrap">
            <img src="/assets/live/2btCAfe8npZrlPtzLQ9kguEWtCE.png" alt="" />
            <img
              className="fix-heroLeftCorner"
              src="/assets/live/Z1hR7NPesqkWiUN7SMOLBgN2A.png"
              alt=""
            />
          </div>
        </div>
        <div className="fix-heroCenterCover" />
        <div className="fix-heroArtRight" data-hero-art="right">
          <img
            className="fix-heroRightBase"
            src="/assets/live/hero-right-base-unicodeit-v2.png"
            alt=""
          />
          <img
            className="fix-heroRightShape"
            data-hero-shape="right"
            src="/assets/live/hero-glow-unicodeit-v2.png"
            alt=""
          />
          <div className="fix-heroRightMaskWrap">
            <img src="/assets/live/FwC1Rq0iYZYsjzdEU5ivOzKSDII.png" alt="" />
            <img
              className="fix-heroRightCorner"
              src="/assets/live/v6jJG3Uix6d7ApDmaAD8J04wURg.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className={`live-heroContent fix-heroContent`}>
        <div className={`live-trustPill fix-trustPill`} data-hero="trust">
          <b>Helping startups & businesses</b>
        </div>
        <h1 className="fix-heroHeading" data-hero="heading">
          <span>Design, develop,</span>
          <span>Launch & Scale</span>
          <span className="sub_heading">Digital Products</span>
        </h1>
        <div className="fix-heroDescription" data-hero="description">
          <p className="fix-heroDescriptionDesktop">
            From UI/UX design and custom software development to AI integration
            & automation, we build scalable digital products that create
            measurable business impact.
          </p>
          <p className="fix-heroDescriptionMobile">
            From UI/UX design and custom software development to AI integration
            & automation, we build scalable digital products that create
            measurable business impact.
          </p>
        </div>
        <div className={`live-heroButtons fix-heroButtons`} data-hero="buttons">
          <LiveButton />
          <LiveButton href="#" dark>
            <img
              className="fix-heroWhatsappIcon"
              src="/assets/live/whatsapp.svg"
              alt=""
              aria-hidden="true"
            />
            <span>Chat on Whatsapp</span>
          </LiveButton>
        </div>
      </div>
      <div className={`live-heroSkills fix-heroSkills`} data-hero="skills">
        <div className="fix-heroClients" aria-hidden="true">
          <img
            className="fix-heroClientFaces"
            src="/assets/live/contact_client_img.png"
            alt=""
          />
          {/* <span className="fix-heroClientCount">100+</span> */}
        </div>
        <div className="fix-heroClientCopy">
          <div className="fix-heroStars" aria-hidden="true">
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </div>
          <p>Trusted by 100+ founders &amp; businesses worldwide</p>
        </div>
      </div>
    </section>
  );
}

function PartnersIntro() {
  const firstRow = PARTNER_LOGOS.slice(0, 5);
  const secondRow = PARTNER_LOGOS.slice(5);
  const cells = (items: readonly PartnerLogo[], copy = false) =>
    items.map(({ name, src }) => (
      <div
        className="fix-partnerLogoCell"
        aria-hidden={copy || undefined}
        key={`${name}-${copy ? "copy" : "original"}`}
      >
        <img src={src} alt={copy ? "" : `${name} logo`} />
      </div>
    ));

  return (
    <section className={`live-partners fix-partners`} id="partners">
      <div className="fix-partnerInner">
        <div className="fix-partnerTitle">
          <p className="fix-partnerKicker">
            <i />
            <span>Our Partners</span>
          </p>
          <span className="fix-partnerCopy">
            Trusted by 100+ businesses worldwide
          </span>
          {/* <i
            className={`fix-partnerArt fix-partnerArtLeft`}
            data-partner-art
            aria-hidden="true"
          />
          <i
            className={`fix-partnerArt fix-partnerArtRight`}
            data-partner-art
            aria-hidden="true"
          /> */}
        </div>
        <div className="fix-partnerGrid">
          <div className="fix-partnerGridTop">{cells(firstRow)}</div>
          <div className="fix-partnerGridBottom">{cells(secondRow)}</div>
        </div>
        <div className="fix-partnerRails" aria-label="Partner logos">
          <div className={`fix-partnerRail fix-partnerRailLeft`}>
            <div
              className="fix-partnerRailTrack"
              data-motion-loop="partners-left"
            >
              {cells(firstRow)}
              {cells(firstRow, true)}
            </div>
          </div>
          <div className={`fix-partnerRail fix-partnerRailRight`}>
            <div
              className="fix-partnerRailTrack"
              data-motion-loop="partners-right"
            >
              {cells(secondRow)}
              {cells(secondRow, true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesIntro() {
  const tags = [
    ["tag-1", "AI AUTOMATION", "fix-introTagWeb", "fix-introTagRight"],
    ["tag-2", "UI UX DESIGN", "fix-introTagFramer", "fix-introTagRight"],
    [
      "tag-3",
      "MOBILE APP DEVELOPMENT",
      "fix-introTagMobile",
      "fix-introTagLeft",
    ],
    [
      "tag-4",
      "SOFTWARE DEVELOPMENT",
      "fix-introTagProduct",
      "fix-introTagLeft",
    ],
  ] as const;

  return (
    <section
      className={`live-servicesIntro fix-servicesIntroExact`}
      id="services"
    >
      <div className="fix-introCircleClip" aria-hidden="true">
        <img
          className={`fix-introCircle fix-introCircleInner`}
          data-motion-loop="services-ring-inner"
          src="/assets/live/98fwY6uljy91CPrSnYxoCPGbecA.png"
          alt=""
        />
        <img
          className={`fix-introCircle fix-introCircleOuter`}
          data-motion-loop="services-ring-outer"
          src="/assets/live/tVKi9znZzAgYARCqBqyTiRbm6s.png"
          alt=""
        />
        <img
          className={`fix-introMask fix-introMaskTop`}
          src="/assets/live/JtB7mKNSeJ9ss5iXH3ZHjtzsDsI.png"
          alt=""
        />
        <img
          className={`fix-introMask fix-introMaskUpper`}
          src="/assets/live/XG6RQn38cjL6qzjLKCN0O0fuQ.png"
          alt=""
        />
        <img
          className={`fix-introMask fix-introMaskBottom`}
          src="/assets/live/zkwvK13KTJbk3ryrsdbwPTlgus.png"
          alt=""
        />
        <img
          className={`fix-introMask fix-introMaskLower`}
          src="/assets/live/JlSnUgU1ikeKTPLkHPv3ViTJ1I.png"
          alt=""
        />
      </div>
      <div className="fix-introContent">
        {tags.map(([id, label, colorClass, directionClass]) => (
          <div
            id={id}
            className={`fix-introTag ${colorClass} ${directionClass}`}
            data-intro-tag
            key={id}
            aria-hidden="true"
          >
            <span className="fix-introTagSurface">
              <i className="fix-introTagFill" />
              <i className="fix-introTagConnector">
                <i />
                <i />
              </i>
              <span>{label}</span>
            </span>
          </div>
        ))}
        <h2>
          We help founders and brands ship faster, scale smarter, and convert
          better without ever compromising on quality.
        </h2>
        <div className={`live-heroButtons fix-introButtons`}>
          <LiveButton />
          <LiveButton href="/works" dark>
            View Projects
          </LiveButton>
        </div>
      </div>
      <div className="fix-introWaveRow" aria-hidden="true">
        <img
          className="fix-introGlow"
          src="/assets/live/brand-cyan/J0CdaWzjawhE575G8LIv7rzAI.png"
          alt=""
        />
        <div className="fix-introWaveViewport">
          <div className="fix-introWaveTrack" data-motion-loop="services-ruler">
            <img
              className="fix-introWaveImage"
              src="/assets/live/sCElb0ycSJhVjPjM7nlsRGVqM.png"
              alt=""
            />
            <img
              className="fix-introWaveImage"
              src="/assets/live/sCElb0ycSJhVjPjM7nlsRGVqM.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  const tags = [
    ["Web Design", "live-brandTagPink", "live-brandTagRight"],
    ["Framer Expert", "live-brandTagWhite", "live-brandTagRight"],
    ["Mobile APP Design", "live-brandTagAqua", "live-brandTagLeft"],
    ["Product Design", "live-brandTagYellow", "live-brandTagLeft"],
  ] as const;
  return (
    <section className="live-brandStoryExact" data-brand-story>
      <div className="live-brandStorySticky" data-brand-sticky>
        <img
          className="live-brandStoryGlow"
          data-brand-glow
          src="/assets/live/brand-story-glow-unicodeit.png"
          alt=""
        />
        <div className="live-brandStoryCanvas">
          <img
            className="live-brandStoryFrameImage"
            src="/assets/live/brand-story-frame-unicodeit.png"
            alt=""
          />
          <div className="live-brandTags" data-brand-tags>
            {tags.map(([label, color, side], index) => (
              <span
                className={`live-brandTag ${color} ${side}`}
                data-brand-tag={index}
                key={label}
              >
                <i data-brand-tag-fill />
                <b data-brand-tag-label>{label}</b>
                <em data-brand-tag-connector>
                  <i />
                  <i />
                </em>
              </span>
            ))}
          </div>
          <div className="live-brandText" data-brand-text>
            <div className="live-brandTextTop">
              <span data-brand-word="building">Building</span>
              <span data-brand-word="brands">brands</span>
            </div>
            <div className="live-brandTextBottom">
              <span data-brand-word="phrase">is never easy.</span>
              <p data-brand-description>
                Scaling creative work demands strategy, clarity, and constant
                iteration across every touchpoint...
              </p>
            </div>
          </div>
          <div className="live-brandRulers" aria-hidden="true">
            <div className="live-brandRulerViewport">
              <div className="live-brandRulerTrack" data-brand-ruler="top">
                <img
                  src="/assets/live/PkSOyKv4nyRP4XyA42sPM0gVTZ0.png"
                  alt=""
                />
                <img
                  src="/assets/live/PkSOyKv4nyRP4XyA42sPM0gVTZ0.png"
                  alt=""
                />
              </div>
            </div>
            <div className="live-brandRulerViewport">
              <div className="live-brandRulerTrack" data-brand-ruler="bottom">
                <img
                  src="/assets/live/PkSOyKv4nyRP4XyA42sPM0gVTZ0.png"
                  alt=""
                />
                <img
                  src="/assets/live/PkSOyKv4nyRP4XyA42sPM0gVTZ0.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div
            className="live-brandAvailability"
            data-motion-loop="brand-availability"
          >
            <i />
            <span>Available for new projects</span>
            <b />
          </div>
        </div>
      </div>
      {Array.from({ length: 7 }, (_, index) => (
        <div
          className="live-brandSentinel"
          data-brand-sentinel={index + 1}
          key={index}
        />
      ))}
    </section>
  );
}

function Services() {
  const cards = liveServices;
  return (
    <section className="live-servicesExact" id="what-we-do">
      <div className="live-exactSectionInner">
        <LiveTitle kicker="What We Do" center>
          Our key services
        </LiveTitle>
        <p className="live-sectionLead">
          We deliver end-to-end digital solutions design, engineering, and AI,
          that help your business move faster and grow with confidence.
        </p>
        <div className="live-serviceMajorExact">
          {cards.map((card, index) => (
            <article
              data-reveal
              data-reveal-start={index >= 3 ? "top 88%" : undefined}
              key={card.title}
            >
              <div className="live-serviceCardTop">
                <ServiceIcon kind={card.icon} />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </div>
                <ContactCardAction
                  href="/contact"
                  className="live-serviceCardAction"
                >
                  {card.cta}
                </ContactCardAction>
              </div>
              <ul>
                {card.features.map((item) => (
                  <li key={item}>
                    ✓ <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({ kind }: { kind: string }) {
  const icons: Record<string, string> = {
    software: "/assets/services/chip.svg",
    mobile: "/assets/services/mobile-programming.svg",
    web: "/assets/services/web-programming.svg",
    ai: "/assets/services/Sparkle.svg",
    framer: "/assets/services/framer.svg",
    uiux: "/assets/services/figma.svg",
  };
  return (
    <span className="live-serviceIcon" aria-hidden="true">
      <img src={icons[kind] ?? icons.software} alt="" />
    </span>
  );
}
function ElevateButton() {
  return <LiveButton centered className="live-elevateCta" />;
}

function ElevateHand() {
  const path =
    "M 15.915 12.134 C 15.915 12.134 12.467 6.724 8.621 3.128 M 19.425 9.462 C 17.376 5.768 15.527 3.666 13.951 2.583 M 28.274 19.839 C 28.055 19.035 27.736 17.983 27.333 16.786 M 17.863 27.96 C 17.863 27.96 16.069 27.497 13.881 26.798 M 18.948 14.421 C 20.443 15.772 21.566 17.706 22.187 19.093 M 14.824 17.386 C 16.311 18.619 17.31 19.933 18.41 21.419 M 13.881 26.798 C 8.949 25.221 0.989 22.029 1.434 17.958 C 2.009 12.702 10.537 15.84 10.537 15.84 C 10.537 15.84 -3.92 4.847 1.034 0.702 C 3.068 -1.001 5.941 0.623 8.621 3.128 M 13.881 26.798 C 13.881 26.798 12.065 29.934 13.896 31.88 C 17.35 35.551 36.142 21.696 32.418 16.88 C 30.662 14.61 27.333 16.786 27.333 16.786 M 27.333 16.786 C 24.895 9.553 19.269 -2.826 13.951 2.583 M 13.951 2.583 C 11.245 0.724 9.344 1.874 8.621 3.128";
  return (
    <div
      className="live-elevateHand"
      data-motion-loop="benefits-hand"
      aria-hidden="true"
    >
      <img src="/assets/live/elevate-hand-unicodeit.png" alt="" />
      <svg viewBox="0 0 46 46" role="presentation">
        <g transform="translate(7.839 9.023)">
          <path d={path} />
        </g>
      </svg>
    </div>
  );
}

export function Benefits({ route = false }: { route?: boolean }) {
  const cards = [
    {
      title: "Strategic Thinking",
      lines: [
        "Every project starts with a clear strategy aligned with your business goals.",
      ],
    },
    {
      title: "User-First Experience",
      lines: [
        "We design intuitive digital products that people love to use and trust.",
      ],
    },
    {
      title: "Scalable Solutions",
      lines: [
        "Built with modern technologies to support long-term business growth.",
      ],
    },
    {
      title: "Reliable Partnership",
      lines: [
        "Transparent communication, timely delivery, and support you can rely on.",
      ],
    },
  ];
  const words = [
    "Build Better",
    "Build faster",
    "Build Smarter",
    "Build Stronger",
  ];
  const rollerWords = Array.from({ length: 3 }, () => words).flat();
  return (
    <section className="live-benefitsExact" id="benefits">
      <div className="live-exactSectionInner">
        <div className="live-benefitHeadingExact">
          <LiveTitle kicker="Benefits" center>
            Why We
          </LiveTitle>
          <div className="live-benefitRollerExact" data-benefits-roller>
            <div
              className="live-benefitWordViewport"
              data-benefits-word-viewport
            >
              <div
                className="live-benefitWordTrack"
                data-benefits-word-track
                data-motion-loop="benefits-words"
              >
                {rollerWords.map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </div>
            </div>
            {Array.from({ length: 4 }, (_, index) => (
              <i
                className={`live-benefitRollerCorner live-benefitRollerCorner${index + 1}`}
                aria-hidden="true"
                key={index}
              />
            ))}
          </div>
          <img
            className={`live-benefitTickerArt live-benefitTickerArtLeft`}
            src="/assets/live/pH0mzsn2HXkP91FHE5USKatyWM.png"
            alt=""
          />
          <img
            className={`live-benefitTickerArt live-benefitTickerArtRight`}
            src="/assets/live/Wy4CjWAaW8xVdcXD4CSIpfHnI8.png"
            alt=""
          />
        </div>
        <div className="live-benefitLayout">
          <div className="live-benefitCardsExact">
            {cards.map(({ title, lines }, index) => (
              <article data-route-reveal={route || undefined} key={title}>
                <b>
                  <BenefitIcon index={index} />
                </b>
                <div>
                  <h3>{title}</h3>
                  <p>
                    {lines.map((line, lineIndex) => (
                      <span key={line}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div
            className="live-elevateExact"
            data-route-reveal={route || undefined}
          >
            <div className="live-elevateRadarExact">
              <div className="live-elevateRadarCenter">
                <div className="live-elevateRadarImage">
                  <img
                    src="/assets/live/1pyo5whx4Ku48gn06LT8k68qyRc.png"
                    alt=""
                  />
                  <div
                    className="live-elevateRadarSignal"
                    data-motion-loop="benefits-radar"
                  >
                    <i />
                    <b />
                  </div>
                </div>
                <div
                  className="live-elevateAvailability"
                  data-motion-loop="benefits-availability"
                >
                  <div>
                    <i />
                    <span>Available for new projects</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="live-elevateCopy">
              <div>
                <h3>Ready to Launch Faster?</h3>
                <p>
                  Partner with a team that transforms ideas into scalable
                  digital products with confidence.
                </p>
              </div>
              <ElevateButton />
            </div>
            <ElevateHand />
          </div>
          <i className={`live-benefitFrameDot live-benefitFrameDot1`} />
          <i className={`live-benefitFrameDot live-benefitFrameDot2`} />
          <i className={`live-benefitFrameDot live-benefitFrameDot3`} />
          <i className={`live-benefitFrameDot live-benefitFrameDot4`} />
        </div>
      </div>
    </section>
  );
}

function BenefitIcon({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg className="live-benefitIcon" viewBox="0 0 46 46" aria-hidden="true">
        <path
          data-draw
          data-delay="1"
          pathLength="1"
          d="M40.25 37.375H5.75V8.625"
        />
        <path
          data-draw
          data-delay="1"
          pathLength="1"
          d="m35.938 12.938-12.938 12.937-5.75-5.75-11.5 11.5"
        />
        <path d="M35.938 20.125v-7.187H28.75" />
      </svg>
    );
  if (index === 1)
    return (
      <svg className="live-benefitIcon" viewBox="0 0 46 46" aria-hidden="true">
        {[
          [30.188, 7.188],
          [7.188, 7.188],
          [30.188, 30.188],
          [7.188, 30.188],
        ].map(([x, y]) => (
          <path
            data-draw
            data-delay="0"
            pathLength="1"
            d="M7.188 0H1.438A1.438 1.438 0 0 0 0 1.438v5.75a1.438 1.438 0 0 0 1.438 1.437h5.75a1.438 1.438 0 0 0 1.437-1.437v-5.75A1.438 1.438 0 0 0 7.188 0Z"
            transform={`translate(${x} ${y})`}
            key={`${x}-${y}`}
          />
        ))}
        <path data-draw data-delay="3" pathLength="1" d="M11.5 15.813v14.375" />
        <path data-draw data-delay="2" pathLength="1" d="M15.813 34.5h14.375" />
        <path data-draw data-delay="1" pathLength="1" d="M34.5 15.813v14.375" />
        <path data-draw data-delay="0" pathLength="1" d="M15.813 11.5h14.375" />
      </svg>
    );
  if (index === 2)
    return (
      <svg className="live-benefitIcon" viewBox="0 0 46 46" aria-hidden="true">
        <path
          data-draw
          data-delay="1"
          pathLength="1"
          d="M4.313 31.625v-4.109c0-10.329 8.292-18.855 18.62-18.891a18.688 18.688 0 0 1 18.755 18.688v4.312a1.438 1.438 0 0 1-1.438 1.438H5.75a1.438 1.438 0 0 1-1.438-1.438Z"
        />
        <path d="M23 8.625v5.75M35.938 24.438h5.53M4.562 24.438h5.5" />
        <path
          data-draw
          data-delay="1"
          pathLength="1"
          d="m18.688 33.063 11.5-15.813"
        />
      </svg>
    );
  return (
    <svg className="live-benefitIcon" viewBox="0 0 46 46" aria-hidden="true">
      <path
        data-draw
        data-delay="1"
        pathLength="1"
        d="m28.75 2.875-2.875 14.375 11.5 4.313L17.25 43.125l2.875-14.375-11.5-4.312Z"
      />
    </svg>
  );
}

const comparisonIconSrc: Record<ComparisonIcon, string> = {
  warning: "/assets/live/alert-02.svg",
  negative: "/assets/live/cross.svg",
  positive: "/assets/live/checkmark-circle.svg",
};

function ComparisonCell({
  value,
  provider,
  highlighted = false,
}: {
  value: ComparisonValue;
  provider: string;
  highlighted?: boolean;
}) {
  return (
    <span
      className={
        highlighted
          ? "live-compareCell live-compareCellBrand"
          : "live-compareCell"
      }
      data-provider={provider}
      role="cell"
    >
      <img
        className="live-compareStateIcon"
        src={comparisonIconSrc[value.icon]}
        alt=""
        aria-hidden="true"
      />
      <span>{value.text}</span>
    </span>
  );
}

function Comparison() {
  return (
    <section className="live-comparisonExact" id="comparison">
      <div className="live-exactSectionInner">
        <LiveTitle kicker="Comparison" center>
          Not Every Team Builds
          <br />
          Products That Grow
        </LiveTitle>
        <p className="live-sectionLead">
          The right partner doesn&apos;t just deliver a project, they understand
          your business, solve real problems, and build products to scale with
          your growth.
        </p>
        <div
          className="live-comparisonTable"
          role="table"
          aria-label="Service provider comparison"
        >
          <div className="live-comparisonTableHead" role="row">
            <span role="columnheader" aria-label="Comparison criteria" />
            <b role="columnheader">Freelancers</b>
            <b role="columnheader">Traditional Agencies</b>
            <b className="live-comparisonBrandHead" role="columnheader">
              <img src="/assets/logo/logo_white.png" alt="Unicode IT" />
            </b>
          </div>
          {comparisonRows.map((row) => (
            <div className="live-comparisonTableRow" key={row.label} role="row">
              <strong className="live-comparisonCriterion" role="rowheader">
                {row.label}
              </strong>
              <ComparisonCell value={row.freelancers} provider="Freelancers" />
              <ComparisonCell
                value={row.agencies}
                provider="Traditional Agencies"
              />
              <ComparisonCell
                value={row.unicodeIt}
                provider="Unicode IT"
                highlighted
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NumbersTools() {
  const stats = [
    ["100+", "Projects Delivered", "bars"],
    ["12+", "Years of experience", "dots"],
    ["98%", "Client Satisfaction", "target"],
    ["85%", "Repeat Clients", "bars"],
  ] as const;
  return (
    <>
      <section className="live-numbersExact" data-section="stats">
        <div className="live-exactSectionInner">
          <LiveTitle kicker="By the Numbers" center>
            Experience That <br /> Delivers Results
          </LiveTitle>
          <p className="live-sectionLead">
            Our team combines years of product design and development experience
            to build scalable digital solutions that help businesses grow
            smarter, and create lasting impact.
          </p>
          <div className="live-statGrid">
            {stats.map(([number, label, icon]) => (
              <article key={number}>
                <StatGraphic kind={icon} />
                <div>
                  <strong>{number}</strong>
                  <span>{label}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <TechnologyStack />
    </>
  );
}

function StatGraphic({ kind }: { kind: "bars" | "dots" | "target" }) {
  if (kind === "bars")
    return (
      <span
        className={`live-statIcon live-statBars`}
        data-stat-graphic="bars"
        aria-hidden="true"
      >
        <i data-stat-bar="41" />
        <i data-stat-bar="82" />
        <i data-stat-bar="88" />
      </span>
    );

  if (kind === "dots")
    return (
      <span
        className={`live-statIcon live-statDots`}
        data-stat-graphic="dots"
        aria-hidden="true"
      >
        {Array.from({ length: 25 }, (_, index) => (
          <i data-stat-dot={index} key={index} />
        ))}
      </span>
    );

  return (
    <span
      className={`live-statIcon live-statTarget`}
      data-stat-graphic="target"
      aria-hidden="true"
    >
      <svg viewBox="0 0 130 100" role="presentation">
        <path
          className="live-statTargetGuide"
          d="M 0 23.926 C 0 10.712 10.712 0 23.926 0 C 37.141 0 47.853 10.712 47.853 23.926 C 47.853 37.141 37.141 47.853 23.926 47.853 C 10.712 47.853 0 37.141 0 23.926 Z"
          transform="translate(41.074 42.425)"
        />
        <path
          className="live-statTargetDot"
          d="M 0 5.583 C 0 2.5 2.5 0 5.583 0 C 8.666 0 11.166 2.5 11.166 5.583 C 11.166 8.666 8.666 11.166 5.583 11.166 C 2.5 11.166 0 8.666 0 5.583 Z"
          transform="translate(59.417 60.769)"
        />
        <path
          className="live-statTargetTrace"
          data-stat-target-path
          pathLength="353.44830322265625"
          d="M 5.943 13.902 C 1.519 20.2 -0.543 27.856 0.122 35.524 C 0.787 43.192 4.135 50.379 9.578 55.822 C 15.02 61.264 22.208 64.612 29.876 65.277 C 37.544 65.941 45.2 63.879 51.498 59.455 C 57.796 55.031 62.331 48.526 64.305 41.087 C 66.279 33.648 65.566 25.751 62.291 18.786 C 59.016 11.821 53.389 6.234 46.401 3.009 C 39.413 -0.216 31.511 -0.872 24.086 1.155 L 24.982 4.438 C 31.634 2.621 38.714 3.21 44.975 6.099 C 51.236 8.988 56.277 13.994 59.211 20.234 C 62.146 26.474 62.784 33.549 61.015 40.214 C 59.247 46.879 55.184 52.707 49.541 56.67 C 43.899 60.635 37.04 62.481 30.17 61.886 C 23.3 61.291 16.86 58.291 11.984 53.416 C 7.108 48.539 4.108 42.1 3.513 35.23 C 2.917 28.361 4.764 21.501 8.728 15.858 Z"
          transform="translate(32.301 33.652)"
        />
      </svg>
    </span>
  );
}

export function PricingSection({ route = false }: { route?: boolean }) {
  return (
    <section
      className={`live-pricingExact ${route ? "live-pricingRouteSection" : ""}`}
      data-section="pricing"
    >
      {route && (
        <img
          className="live-pricingRouteBackdrop"
          src="/assets/live/brand-cyan/ArOKS9oueStdoViN3FDHYzMN7JI.png"
          alt=""
        />
      )}
      <div className="live-pricingInner">
        <LiveTitle kicker="Pricing" center>
          Plans Built
          <br />
          for Growth
        </LiveTitle>
        <p className="live-sectionLead">
          {route
            ? "No hidden fees. No vague quotes. Adjust the controls below to see a real-time estimate â€” then book a free call to lock in your scope."
            : "Flexible pricing designed to fit your business needs"}
        </p>
        {route ? (
          <PricingCalculator />
        ) : (
          <div className="live-priceGridExact">
            {route && (
              <>
                <img
                  className={`live-pricingSideArt live-pricingSideArtLeft`}
                  src="/assets/live/brand-cyan/p66Ex21bxknbF6DJpl6fBENUyU.png"
                  alt=""
                />
                <img
                  className={`live-pricingSideArt live-pricingSideArtRight`}
                  src="/assets/live/brand-cyan/p66Ex21bxknbF6DJpl6fBENUyU.png"
                  alt=""
                />
                <img
                  className={`live-pricingCornerArt live-pricingCornerArtLeft`}
                  src="/assets/live/apbbjvFRSWG4NsdXTpKVBCU5spc.png"
                  alt=""
                />
                <img
                  className={`live-pricingCornerArt live-pricingCornerArtRight`}
                  src="/assets/live/uNs6FM14xJ3vD3YiwlFl5e5ya5E.png"
                  alt=""
                />
                {[
                  "live-pricingGridDotTL",
                  "live-pricingGridDotTR",
                  "live-pricingGridDotBR",
                  "live-pricingGridDotBL",
                ].map((cornerClass, index) => (
                  <i
                    className={`live-pricingGridDot ${cornerClass}`}
                    key={index}
                  />
                ))}
              </>
            )}
            {livePricing.map((plan) => (
              <article data-route-reveal={route || undefined} key={plan.name}>
                <div className="live-priceTop">
                  <h3>{plan.name}</h3>
                  <p className="live-priceDescription">{plan.subtitle}</p>
                  <strong>{plan.price}</strong>
                  <LiveButton centered />
                </div>
                <ul>
                  {plan.features.map((item) => (
                    <li key={item}>
                      <b>✓</b>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
        {route ? <LivePricingQuote /> : null}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    [
      "Discovery & Strategy",
      "Understand your business, users, and goals to build the right solution.",
    ],
    [
      "Planning & Roadmap",
      "We define the project scope, timeline, milestones, and technical roadmap.",
    ],
    [
      "Design & Validation",
      "We design intuitive user experiences, prototype ideas, and validate them before development.",
    ],
    [
      "Development & Testing",
      "We build scalable, high-quality solutions with continuous testing and quality assurance.",
    ],
    [
      "Launch & Growth",
      "We deploy, optimize, and continuously improve your product for long-term success.",
    ],
  ];
  return (
    <section className="live-processExact" data-section="process">
      <div className="live-processSticky">
        <div className="live-processHeader">
          <LiveTitle kicker="Process">How We Work</LiveTitle>
        </div>
        <div className="live-processRail">
          <div className="live-processRailTrack" data-process-track>
            {steps.map(([title, copy], index) => (
              <article key={title} data-process-card>
                <small>Step 0{index + 1}</small>
                <div>
                  <img
                    className="live-processIcon"
                    src={`/assets/live/process-icon-cyan-${index + 1}.svg`}
                    alt=""
                  />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiveHome() {
  return (
    <main>
      <Hero />
      <LiveProjectShowcase />
      <PartnersIntro />
      <ServicesIntro />
      <LiveSelectedWorks />
      {/*<BrandStory/> */}
      <Services />
      <Benefits />
      <Comparison />
      <NumbersTools />
      {/* <PricingSection /> */}
      <Process />
      <Testimonials />
      <FAQ />
      <ContactHeroSection id="cta" placement="home" />
    </main>
  );
}
