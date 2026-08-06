import Image from "next/image";
import Link from "next/link";
import { pricingPlans, processSteps, works } from "@/lib/data";
import { ArrowIcon } from "./Header";
import { FaqList, ProjectCarousel, TestimonialRail } from "./Interactive";
import { Button, Eyebrow, Marquee, SectionTitle } from "./Primitives";

function Hero() {
  return (
    <section className="live-hero">
      <div className={`live-heroArt live-heroArtLeft`} data-hero-art="left">
        <i />
      </div>
      <div className={`live-heroArt live-heroArtRight`} data-hero-art="right">
        <i />
      </div>
      <div className="live-heroInner">
        <div className="live-heroTrust" data-hero>
          <span>★★★★★</span>
          <b>Trusted by fast growing brands worldwide</b>
        </div>
        <h1>
          <span data-hero>THINK. DESIGN.</span>
          <span data-hero>DEVELOP. LAUNCH.</span>
        </h1>
        <p data-hero>
          We craft high-performing digital experiences that help brands grow
          faster, convert better, and stand out globally.
        </p>
        <div className="live-heroActions" data-hero>
          <Button href="/contact" light>
            BOOK A CALL
          </Button>
          <Button href="/works">VIEW PROJECTS</Button>
        </div>
      </div>
      <div className="live-heroServices">
        <b>WHAT WE&apos;RE BEST AT</b>
        <span>
          UI/UX　•　Development　•　Strategy　•　Motion Web Design　•　Branding
        </span>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="live-showcase">
      <div className="live-showcaseTrack">
        {works.map((work, index) => (
          <Link
            href={`/works/${work.slug}`}
            className="live-showcaseItem"
            key={work.slug}
            style={{ "--accent": work.accent } as React.CSSProperties}
          >
            <span>0{index + 1}</span>
            <Image
              src={work.image}
              alt={`${work.title} project`}
              fill
              sizes="44vw"
            />
            <strong>{work.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="live-partners" data-reveal>
      <Eyebrow>TRUSTED BY AMBITIOUS TEAMS</Eyebrow>
      <div>
        {["MAVEN", "KINETIQ", "APOLLO", "NORTH/CO", "VECTRA", "LUMEN"].map(
          (name) => (
            <span key={name}>{name}</span>
          ),
        )}
      </div>
    </section>
  );
}

function ServicesIntro() {
  return (
    <section className="live-servicesIntro">
      <div className="live-redOrb" data-pointer>
        <span>IDEAS</span>
      </div>
      <div className="live-servicesCopy" data-reveal>
        <Eyebrow light>WHAT WE BELIEVE</Eyebrow>
        <h2>
          GOOD DESIGN GETS
          <br />
          ATTENTION. <em>GREAT DESIGN</em>
          <br />
          GETS RESULTS.
        </h2>
        <p>
          We build visual systems with enough character to stand apart and
          enough clarity to move a business forward.
        </p>
      </div>
      <div className="live-serviceSticker" data-pointer>
        STRATEGY
        <br />+ DESIGN
      </div>
    </section>
  );
}

function SelectedWorks() {
  return (
    <section className="live-selectedWorks">
      <div className="live-sectionTop">
        <SectionTitle eyebrow="SELECTED WORKS">
          MADE TO MAKE
          <br />
          <em>AN IMPACT.</em>
        </SectionTitle>
        <Button href="/works">VIEW ALL WORKS</Button>
      </div>
      <ProjectCarousel />
    </section>
  );
}

function BrandNarrative() {
  return (
    <section className="live-narrative">
      <Marquee>BRANDS WITH BITE</Marquee>
      <div className="live-narrativeInner">
        <span className="live-narrativeLabel">
          NO GENERIC
          <br />
          DESIGN HERE.
        </span>
        <h2 data-reveal>
          WE SHAPE DISTINCTIVE IDENTITIES AND DIGITAL EXPERIENCES FOR TEAMS THAT
          REFUSE TO BLEND IN.
        </h2>
        <div className="live-narrativeMark" data-pointer>
          AX
        </div>
      </div>
      <Marquee reverse>BUILT TO PERFORM</Marquee>
    </section>
  );
}

function WhatWeDo() {
  const services = [
    [
      "01",
      "Brand Strategy",
      "Positioning, research, naming and a clear creative direction.",
    ],
    [
      "02",
      "Visual Identity",
      "Flexible brand systems with a memorable point of view.",
    ],
    [
      "03",
      "Web Design",
      "Responsive experiences designed to communicate and convert.",
    ],
    [
      "04",
      "Development",
      "Fast, accessible builds with motion in all the right places.",
    ],
  ];
  return (
    <section className="live-whatWeDo" id="services">
      <SectionTitle eyebrow="CAPABILITIES" light>
        WHAT WE <em>DO.</em>
      </SectionTitle>
      <div className="live-serviceRows">
        {services.map(([number, title, body]) => (
          <article key={number} data-reveal data-once="false">
            <small>{number}</small>
            <h3>{title}</h3>
            <p>{body}</p>
            <ArrowIcon />
          </article>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="live-benefits">
      <SectionTitle eyebrow="WHY AEXO" compact>
        SMALL TEAM.
        <br />
        <em>BIG ENERGY.</em>
      </SectionTitle>
      <div className="live-benefitGrid">
        <article data-reveal>
          <b>01</b>
          <h3>SENIOR TALENT ONLY</h3>
          <p>
            You work directly with the people doing the thinking and making.
          </p>
        </article>
        <article data-reveal>
          <b>02</b>
          <h3>BUILT AROUND YOU</h3>
          <p>
            Every process and deliverable is shaped around the actual challenge.
          </p>
        </article>
        <article data-reveal>
          <b>03</b>
          <h3>FAST, NOT RUSHED</h3>
          <p>
            Focused teams, fewer meetings, decisive feedback, better momentum.
          </p>
        </article>
        <article data-reveal>
          <b>04</b>
          <h3>DESIGN THAT WORKS</h3>
          <p>Distinctive creative grounded in practical business outcomes.</p>
        </article>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    ["Direct access to senior creatives", true, false],
    ["Original work, never templates", true, false],
    ["Flexible, focused process", true, false],
    ["Strategy through development", true, false],
    ["No layers of account management", true, false],
  ] as const;
  return (
    <section className="live-comparison">
      <SectionTitle eyebrow="THE DIFFERENCE" light>
        NOT YOUR TYPICAL
        <br />
        <em>AGENCY.</em>
      </SectionTitle>
      <div className="live-compareTable" data-reveal>
        <div className="live-compareHead">
          <span />
          <strong>AEXO</strong>
          <strong>OTHERS</strong>
        </div>
        {rows.map(([label, us, them]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{us ? "✓" : "×"}</b>
            <b>{them ? "✓" : "×"}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="live-stats">
      {[
        ["8+", "YEARS CREATING"],
        ["70+", "PROJECTS SHIPPED"],
        ["14", "DESIGN AWARDS"],
        ["11", "COUNTRIES REACHED"],
      ].map(([value, label]) => (
        <div key={label} data-reveal>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function Tools() {
  return (
    <section className="live-tools">
      <div className="live-toolWheel">
        <span className="live-toolOrbit">AEXO · DESIGN · DEVELOPMENT · </span>
        <b>A</b>
      </div>
      <div data-reveal>
        <Eyebrow>TOOLS OF THE TRADE</Eyebrow>
        <h2>
          THE RIGHT TOOLS.
          <br />
          <em>ZERO LIMITS.</em>
        </h2>
        <p>
          We move from idea to production using a modern, flexible stack built
          for speed and expressive digital work.
        </p>
        <div className="live-toolTags">
          {["FIGMA", "FRAMER", "NEXT.JS", "GSAP", "WEBFLOW", "THREE.JS"].map(
            (tool) => (
              <span key={tool}>{tool}</span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="live-homePricing">
      <div className="live-sectionTop">
        <SectionTitle eyebrow="SIMPLE PRICING" light>
          CHOOSE YOUR
          <br />
          <em>STARTING POINT.</em>
        </SectionTitle>
        <p>Clear scopes. Senior attention. No mystery markups.</p>
      </div>
      <div className="live-pricingGrid">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={plan.featured ? "live-featuredPlan" : ""}
            data-reveal
          >
            {plan.featured && (
              <span className="live-popular">MOST POPULAR</span>
            )}
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>↗ {f}</li>
              ))}
            </ul>
            <Button href="/contact" light={!plan.featured}>
              GET STARTED
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="live-process">
      <div className="live-processSticky">
        <SectionTitle eyebrow="HOW IT WORKS" compact>
          FROM FIRST THOUGHT
          <br />
          TO <em>FULL IMPACT.</em>
        </SectionTitle>
        <p>
          A focused four-step process keeps the work clear, collaborative, and
          moving.
        </p>
      </div>
      <div className="live-processSteps">
        {processSteps.map((step) => (
          <article key={step.number} data-reveal>
            <b>{step.number}</b>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="live-testimonials">
      <div className="live-sectionTop">
        <SectionTitle eyebrow="CLIENT NOTES" light>
          THEY SAID IT.
          <br />
          <em>NOT US.</em>
        </SectionTitle>
        <span>DRAG THE LOVE →</span>
      </div>
      <TestimonialRail />
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="live-faqSection">
      <SectionTitle eyebrow="FAQ" compact>
        QUESTIONS,
        <br />
        <em>ANSWERED.</em>
      </SectionTitle>
      <FaqList />
    </section>
  );
}

export function ReadyCTA() {
  return (
    <section className="live-readyCta">
      <div className="live-ctaBurst">✦</div>
      <Eyebrow light>HAVE A PROJECT IN MIND?</Eyebrow>
      <h2 data-reveal>
        LET&apos;S MAKE
        <br />
        <em>SOMETHING LOUD.</em>
      </h2>
      <Button href="/contact" light>
        START A PROJECT
      </Button>
      <div className="live-ctaStar">✳</div>
    </section>
  );
}

export function HomePage() {
  return (
    <main>
      <Hero />
      <Showcase />
      <Partners />
      <ServicesIntro />
      <SelectedWorks />
      <BrandNarrative />
      <WhatWeDo />
      <Benefits />
      <Comparison />
      <Stats />
      <Tools />
      <Pricing />
      <Process />
      <TestimonialsSection />
      <FAQSection />
      <ReadyCTA />
    </main>
  );
}
