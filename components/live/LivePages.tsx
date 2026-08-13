import Link from "next/link";
import { calLink, liveTeam, liveWorks } from "@/lib/live-data";
import { ContactHeroSection, ContactHeroTransition } from "./LiveContactHero";
import { Benefits, PricingSection } from "./LiveHome";
import {
  ContactCardAction,
  FAQ,
  Kicker,
  LiveButton,
  LiveTitle,
  ScaleCTA,
  Testimonials,
} from "./LiveShared";
import { LiveFeaturedWorks } from "./LiveFeaturedWorks";
import { LiveAllWorks } from "./LiveAllWorks";
import { AboutMotion } from "./AboutMotion";


export function WorksPageLive() {
  const workCards = [
    {
      ...liveWorks[0],
      image: "/assets/projects/tempo-home.png",
      category: "Saas",
      region: "India",
    },
    {
      ...liveWorks[1],
      image: "/assets/projects/unigram-home.png",
      category: "Startup",
      region: "GLOBAL",
    },
    {
      ...liveWorks[2],
      image: "/assets/live/HbC1fjEUQVC5H6CG4Jg5aY0Q.png",
      category: "AI PLATFORM",
      region: "USA",
    },
  ];
  return (
    <main>
      <section className="live-worksHero" data-section="works-hero">
        <img
          className="live-worksHeroGlow"
          src="/assets/live/brand-cyan/21Nxe9BjOK1MSyJrrYQgCDts.png"
          alt=""
        />
        <img
          className="live-worksHeroRuler"
          src="/assets/live/7xWbAyTQN909Y3iX0Cq9QfWxA.png"
          alt=""
        />
        <div className="live-worksHeroInner">
          <Kicker>Featured Works</Kicker>
          <h1>Latest Works</h1>
          <LiveFeaturedWorks />
        </div>
      </section>
      <div className="fix-introWaveRow live-worksTransition" aria-hidden="true">
        <div className="fix-introWaveViewport">
          <div
            className="fix-introWaveTrack"
            data-motion-loop="works-hero-ruler"
          >
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
      <LiveAllWorks workCards={workCards} />
      <Testimonials />
      <FAQ />
      <ScaleCTA />
    </main>
  );
}

export function PricingPageLive() {
  return (
    <main className="live-pricingPage">
      <div className="live-innerTop">
        <PricingSection route />
      </div>
      <Benefits route />
      <Testimonials />
      <FAQ />
      <ScaleCTA />
    </main>
  );
}

export function AboutPageLive() {
  const story = [
    "We started Aexo with a simple belief that great design can transform how brands connect, grow, and stand out in a crowded digital world.",
    "Today, building digital products often involves fragmented workflows from design and development to collaboration and feedback—making the process slow, inconsistent, and difficult to scale.",
    "Our team experienced these challenges firsthand while working across multiple projects and industries. Managing tools, aligning teams, and maintaining quality across every stage became time-consuming and often frustrating.",
    "That’s why we built Aexo a design partner focused on creating high-performing digital experiences. A future where thoughtful design, smart systems, and fast execution help brands move forward with confidence.",
  ];

  const thinkerCopy = [
    "We don’t design for noise or vanity metrics. We design for clarity, impact, and experiences that people actually remember. Every project is built to feel intentional, not just visually appealing.",
    "We believe great design should simplify, not complicate. It should guide users effortlessly, communicate clearly, and make every interaction feel natural and purposeful.",
    "Too often, digital products are rushed, inconsistent, and disconnected. We’ve seen it firsthand endless revisions, unclear direction, and systems that don’t scale. That’s where we choose to work differently.",
    "We focus on building systems, not just screens. Thoughtful design decisions, structured workflows, and scalable solutions that grow with your product over time.",
  ];

  return (
    <main className="live-aboutPage" data-about-page>
      <AboutMotion />
      <section className="live-aboutHero" data-section="about-hero">
        <img
          className="live-aboutHeroTexture"
          src="/assets/live/brand-cyan/21Nxe9BjOK1MSyJrrYQgCDts.png"
          alt=""
        />
        <img
          className="live-aboutHeroGrid"
          src="/assets/live/UkL67OWi34bxCle9SIy5O0k.png"
          alt=""
        />
        <img
          className={`live-aboutHeroRing live-aboutHeroRingOuter`}
          data-about-ring="outer"
          src="/assets/live/tVKi9znZzAgYARCqBqyTiRbm6s.png"
          alt=""
        />
        <img
          className={`live-aboutHeroRing live-aboutHeroRingInner`}
          data-about-ring="inner"
          src="/assets/live/98fwY6uljy91CPrSnYxoCPGbecA.png"
          alt=""
        />
        <div className="live-aboutHeroCopy" data-about-hero-copy>
          <Kicker>About Us</Kicker>
          <h1>
            We Help Brands Grow
            <br />
            <span>With Better Design</span>
          </h1>
          <p>
            Combining strategy, design, and technology to help brands grow,
            <br />
            stand out, and perform consistently.
          </p>
          <div className="live-aboutHeroButton">
            <LiveButton />
          </div>
        </div>
        <img
          className="live-aboutTeamImage"
          src="/assets/live/LjQl1b57p9r3QXIa0Tc9QhvrNvg.png"
          alt="Aexo team collaborating"
        />
        <img
          className="live-aboutHeroLowerGlow"
          src="/assets/live/brand-cyan/0pGuw8Zol1JkB8FhgdSyeOVr3M.png"
          alt=""
        />
        <img
          className="live-aboutHeroRuler"
          src="/assets/live/7xWbAyTQN909Y3iX0Cq9QfWxA.png"
          alt=""
        />
        <div className="live-foundingCards">
          <article className="live-foundingIntro" data-about-founding="left">
            <img
              className="live-foundingSurface"
              src="/assets/live/rmcWL8GkgexGAHZBAvLWh0NFl0.png"
              alt=""
            />
            <img
              className="live-foundingGlow"
              src="/assets/live/brand-cyan/0X1CXp4xj8kowNCpRbYuUIVkaDQ.png"
              alt=""
            />
            <div className="live-foundingContent">
              <Kicker>Founding Story</Kicker>
              <h2>
                There Had
                <br />
                to Be Better
              </h2>
              <p>
                We started Aexo to simplify design, helping brands build better
                digital experiences with clarity, speed, and purpose.
              </p>
              <div className="live-foundingActions">
                <LiveButton href="https://x.com/sandykoshti" centered>
                  Talk to founder
                </LiveButton>
                <LiveButton href="/contact" dark>
                  Contact Us
                </LiveButton>
              </div>
            </div>
          </article>
          <article className="live-founderCopy" data-about-founding="right">
            <img
              className="live-founderSurface"
              src="/assets/live/72zcO37jki94dL2YM2h4linrFsU.png"
              alt=""
            />
            <div className="live-founderParagraphs">
              {story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="live-storyLogo">
              <img src="/assets/live/Gv6TSze4bq22VZUTnO9id1DcyE.png" alt="" />
              <img
                src="/assets/live/nBqqRERrJTMPHxxBjWkG1sV7Bzw.png"
                alt="Aexo"
              />
            </div>
          </article>
        </div>
      </section>
      <section className="live-thinkersSection" data-section="about-us">
        <article className="live-thinkers" data-about-thinkers>
          <img
            className="live-thinkersSurface"
            src="/assets/live/gqQ3ffbzGqkzpuGyqYCz2zTVOYg.png"
            alt=""
          />
          <ThinkerPencil className="live-thinkerPen" />
          <ThinkerBolt className="live-thinkerBolt" />
          <div
            className={`live-thinkerPhoto live-thinkerPhotoLeft`}
            data-about-thinker-photo="left"
          >
            <img
              src="/assets/live/nII0o2cWuRfQlkk7QhjEB6e0WrI.png"
              alt="Aexo founder sketching"
            />
            <img src="/assets/live/cHTZgik4Vy1CilWOawNxAXSJXw.png" alt="" />
          </div>
          <div
            className={`live-thinkerPhoto live-thinkerPhotoRight`}
            data-about-thinker-photo="right"
          >
            <img
              src="/assets/live/2HBGAvA1eqd8eyuMbOj1WmF9Ieg.png"
              alt="Aexo founder"
            />
            <img src="/assets/live/cHTZgik4Vy1CilWOawNxAXSJXw.png" alt="" />
          </div>
          <div className="live-thinkerCopy">
            <h3>We Are Thinkers.</h3>
            {thinkerCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <footer>
            <span>
              <FounderSignature kind="alex" />
              <b>Alex Sameni</b>
              <small>Cofounder</small>
            </span>
            <span>
              <FounderSignature kind="paul" />
              <b>Paul Johnson</b>
              <small>Cofounder</small>
            </span>
          </footer>
        </article>
      </section>
      <section className="live-team" data-section="team">
        <div className="live-aboutSectionTitle">
          <Kicker>Our Team</Kicker>
          <h2>Meet the team</h2>
        </div>
        <img
          className="live-teamEdgeLeft"
          src="/assets/live/hOcxLOBuq3DkW8A7q8Fx5TUUx4.png"
          alt=""
        />
        <img
          className="live-teamEdgeRight"
          src="/assets/live/BJm2GW3Zo7nTkMbVzP4GWj2Cs8.png"
          alt=""
        />
        <div className="live-teamGrid">
          {liveTeam.map((member, index) => (
            <article key={member.name} data-team-card>
              <img
                className="live-teamCardSurface"
                src="/assets/live/brand-cyan/4Lsc1onyNrhirkTEeDjiaifcy8k.png"
                alt=""
              />
              <img
                className="live-teamPortrait"
                data-about-team-portrait
                src={member.portrait}
                alt={member.name}
              />
              <img
                className="live-teamCardAbstract"
                src="/assets/live/brand-cyan/msMyC8COjFVKGxc0WC6uCnA5HvM.png"
                alt=""
              />
              <span className="live-teamNumber">0{index + 1}</span>
              <div className="live-teamCardInfo">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className="live-teamCardHover">
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <nav aria-label={`${member.name} social links`}>
                  <a
                    href={member.links.instagram}
                    aria-label={`${member.name} on Instagram`}
                  >
                    <TeamSocialIcon kind="instagram" />
                  </a>
                  <a href={member.links.x} aria-label={`${member.name} on X`}>
                    <TeamSocialIcon kind="x" />
                  </a>
                  <a
                    href={member.links.linkedin}
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <TeamSocialIcon kind="linkedin" />
                  </a>
                </nav>
              </div>
              <TeamCorners />
            </article>
          ))}
        </div>
        <img
          className="live-teamRuler"
          src="/assets/live/lkhewGNVqRf0UlvtVg98YPI6PA.png"
          alt=""
        />
      </section>
      <section className="live-culture" data-section="culture">
        <div className="live-aboutSectionTitle">
          <Kicker>Our Culture</Kicker>
          <h2>
            Culture That
            <br />
            Powers Innovation
          </h2>
        </div>
        <p>
          We foster a culture of collaboration, continuous learning, and
          building
          <br />
          meaningful digital experiences together.
        </p>
        <div className="live-cultureFrame" data-about-culture>
          <div className="live-cultureTop">
            <img
              data-about-culture-image
              src="/assets/live/tWEAuMI8nKc0wm0pRbAPKhFkvi4.png"
              alt="Aexo team collaborating"
            />
            <img
              data-about-culture-image
              src="/assets/live/NZLTg6gctUDOFNiCAEEsCI3zc.png"
              alt="Aexo team workshop"
            />
          </div>
          <div className="live-cultureBottom">
            <img
              data-about-culture-image
              src="/assets/live/mkfHUgFo94AwKDmyecI3oi8qL4.png"
              alt="Aexo team member"
            />
            <img
              data-about-culture-image
              src="/assets/live/iWAnKgUMx096YZYHEqFtKKneCU.png"
              alt="Aexo collaboration"
            />
            <img
              data-about-culture-image
              src="/assets/live/1ck7wq9MT9Jwwcjx5nKkTSc2F6k.png"
              alt="Aexo studio culture"
            />
          </div>
        </div>
        <div
          className="live-cultureRuler"
          data-about-culture-ruler
          data-motion-loop="about-culture-ruler"
        >
          <img src="/assets/live/sCElb0ycSJhVjPjM7nlsRGVqM.png" alt="" />
          <img src="/assets/live/sCElb0ycSJhVjPjM7nlsRGVqM.png" alt="" />
        </div>
        <img
          className="live-cultureGlow"
          data-about-culture-glow
          src="/assets/live/brand-cyan/J0CdaWzjawhE575G8LIv7rzAI.png"
          alt=""
        />
      </section>
      <ScaleCTA />
    </main>
  );
}

function TeamCorners() {
  return (
    <span className="live-teamCorners" aria-hidden="true">
      <img
        src="/assets/live/brand-cyan/zag0M0ZRgmKY1g5oJINOd7cU9M.png"
        alt=""
      />
      <img
        src="/assets/live/brand-cyan/mWpB1JPTzT646RdWNnGkg3s8RtY.png"
        alt=""
      />
      <img
        src="/assets/live/brand-cyan/Dzm0rpPvMdVPACdbFrIPWScMIfo.png"
        alt=""
      />
      <img src="/assets/live/brand-cyan/OAWptzoRWd2jPgU6OTKWx0YH0.png" alt="" />
    </span>
  );
}

function TeamSocialIcon({ kind }: { kind: "instagram" | "x" | "linkedin" }) {
  if (kind === "instagram")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4.5" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
      </svg>
    );
  if (kind === "x")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 3.75H9l10.5 16.5H15L4.5 3.75Z" />
        <path d="m10.7 13.45-6.2 6.8M19.5 3.75l-6.2 6.8" />
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

function ThinkerPencil({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 130 100" aria-hidden="true">
      <path
        d="M27.78 69.344 29.625 48.621 76.294 5.421c4.299 0 8.846 1.583 12.967 4.134 3.593 2.225 6.862 5.187 9.36 8.479l-28.414 58.095-21.213 6.969-21.214 6.969Z"
        fill="rgb(var(--brand-rgb) / 0.5)"
        stroke="var(--brand)"
        strokeWidth="3.76"
      />
      <path
        d="m28.702 69.344 1.845-20.723 46.669-43.2c4.299 0 8.846 1.583 12.967 4.134 3.593 2.225 6.862 5.187 9.36 8.479M30.547 48.621c5.855-.45 12.486 1.198 18.699 4.26m-20.544 16.463-.922 20.723 21.214-6.969 21.213-6.969 32.927-48.831c-.688-3.158-2.296-6.341-4.513-9.264M49.246 52.881c5.179 2.553 10.069 6.088 13.978 10.212 3.723 3.926 6.556 8.385 7.905 13.036m-42.427-6.785s6.122 1.091 11.253 4.569 9.038 9.185 9.038 9.185m14.231-20.005 36.319-45.059M49.246 52.881 90.183 9.555"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function ThinkerBolt({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 130 100" aria-hidden="true">
      <path
        d="m39.435 64.89 11.452-30.891h40.196l-7.901 16.99h19.656l-42.066 47.01L75.74 64.89Z"
        fill="rgb(var(--brand-rgb) / 0.5)"
        stroke="var(--brand)"
        strokeWidth="3.35"
      />
      <path
        d="m39.435 64.89 11.452-30.891h40.196l-7.901 16.99h19.656l-42.066 47.01L75.74 64.89Z"
        fill="none"
        stroke="#fff"
        strokeWidth="2.14"
      />
    </svg>
  );
}

function FounderSignature({ kind }: { kind: "alex" | "paul" }) {
  return kind === "alex" ? (
    <svg
      className="live-founderSignature"
      viewBox="0 0 241 40"
      aria-hidden="true"
    >
      <path
        transform="translate(20)"
        d="M3 31c11-6 16-28 21-26 4 2-4 25 1 25 5 0 8-16 12-15 4 2-2 17 2 17 5 0 9-13 13-13 4 1-2 13 3 13 7 0 16-10 27-12"
      />
    </svg>
  ) : (
    <svg
      className="live-founderSignature"
      viewBox="0 0 241 40"
      aria-hidden="true"
    >
      <path
        transform="translate(20)"
        d="M4 31C11 16 14 3 21 5c6 3-4 26 2 27 6 0 9-18 14-17 5 2-2 17 3 17 5 0 9-14 14-13 5 1-1 13 4 13 7 0 12-9 22-11"
      />
    </svg>
  );
}

export function ContactPageLive() {
  const cards = [
    [
      "Email Us",
      "Reach out anytime and we’ll respond within one business day",
      "hello@aexo.studio",
      "mailto:hello@aexo.studio",
    ],
    [
      "Call Us",
      "Speak directly with our team for quick support or inquiries",
      "+1 (234) 567-890",
      "tel:+1234567890",
    ],
  ] as const;
  const logos = [
    "awYGr9hKmGORNITxrdFwP2P4tN4.png",
    "SwxVnCDnWY5CqqJzzml0eW8EoGQ.png",
    "0LMg4hj6OEknvI9sYQ0FzlzvyE.png",
    "2aODmHv0zXAaBrr5MGpuKx4.png",
    "gGeRS06WZLqWd2v2lztoyTOsrU.png",
    "QBbatH8ukCBGbXANUXDS7N3R6o.png",
    "FHRwztEjMcGa4aBWTX8D3ZIHSk.png",
    "REWCNK1YONu9wbO5584o5srR7y4.png",
    "AHXuMDWldzeohd9VWZ5zqXmrrc.png",
  ];
  return (
    <main>
      <ContactHeroSection />
      <ContactHeroTransition />
      <section className="live-contactCards" data-section="contact-cards">
        <div className="live-contactCardsRail">
          {cards.map(([title, copy, label, href], index) => (
            <article key={title} data-route-reveal>
              <img
                className="live-contactCardSurface"
                src="/assets/live/fef9iiIL7mjFJgl72caJ8dxLWM.png"
                alt=""
              />
              <ContactCardIcon index={index} />
              <div className="live-contactCardCopy">
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <ContactCardAction href={href}>
                {label}
              </ContactCardAction>
            </article>
          ))}
        </div>
        <div className="live-contactTrust">
          <p>Trusted by tech teams worldwide</p>
          <img
            className="live-contactTrustLeft"
            src="/assets/live/pH0mzsn2HXkP91FHE5USKatyWM.png"
            alt=""
          />
          <img
            className="live-contactTrustRight"
            src="/assets/live/Wy4CjWAaW8xVdcXD4CSIpfHnI8.png"
            alt=""
          />
          <div className="live-contactLogoViewport">
            <div
              className="live-contactLogoTrack"
              data-motion-loop="contact-logos"
            >
              {[...logos, ...logos].map((logo, index) => (
                <span key={`${logo}-${index}`}>
                  <img src={`/assets/live/${logo}`} alt="" />
                </span>
              ))}
            </div>
            <img
              className="live-contactLogoFadeLeft"
              src="/assets/live/WWJt5Jcw9cOllf8DqcwKpTfLkjw.png"
              alt=""
            />
            <img
              className="live-contactLogoFadeRight"
              src="/assets/live/89noeY0irov7wdrgYvecfSlLDI.png"
              alt=""
            />
          </div>
        </div>
      </section>
      <Testimonials />
      <FAQ />
      <ScaleCTA />
    </main>
  );
}

function ContactCardIcon({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg
        className="live-contactCardIcon"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 23.75H8.75M25 22.5V3.75H30M36.25 27.5V18.125C36.25 15.9701 35.394 13.9035 33.8702 12.3798C32.3465 10.856 30.2799 10 28.125 10H11.875C14.0299 10 16.0965 10.856 17.6202 12.3798C19.144 13.9035 20 15.9701 20 18.125V28.75H35C35.3315 28.75 35.6495 28.6183 35.8839 28.3839C36.1183 28.1495 36.25 27.8315 36.25 27.5ZM20 35V28.75H5C4.66848 28.75 4.35054 28.6183 4.11612 28.3839C3.8817 28.1495 3.75 27.8315 3.75 27.5V18.125C3.75 15.9701 4.60602 13.9035 6.12976 12.3798C7.65349 10.856 9.72012 10 11.875 10"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (index === 1)
    return (
      <svg
        className="live-contactCardIcon"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M25.6859 22.7095C25.8591 22.5943 26.0582 22.5241 26.2652 22.5053C26.4723 22.4864 26.6808 22.5196 26.8719 22.6016L34.2406 25.9032C34.489 26.0094 34.6962 26.1931 34.8314 26.4268C34.9666 26.6606 35.0225 26.9319 34.9906 27.2001C34.7479 29.0142 33.8545 30.6785 32.4767 31.8833C31.0988 33.0881 29.3303 33.7515 27.5 33.7501C21.8642 33.7501 16.4591 31.5113 12.474 27.5261C8.48884 23.541 6.25 18.1359 6.25 12.5001C6.2486 10.6698 6.912 8.90126 8.11682 7.52342C9.32163 6.14558 10.9859 5.25222 12.8 5.00946C13.0682 4.9776 13.3395 5.03345 13.5732 5.16865C13.807 5.30385 13.9907 5.51113 14.0969 5.75946L17.3984 13.1345C17.4796 13.3239 17.5126 13.5304 17.4946 13.7357C17.4766 13.941 17.4081 14.1386 17.2953 14.311L13.9563 18.2813C13.8378 18.4601 13.7678 18.6665 13.753 18.8804C13.7382 19.0943 13.7792 19.3083 13.8719 19.5016C15.1641 22.147 17.8984 24.8485 20.5516 26.1282C20.7459 26.2205 20.961 26.2606 21.1755 26.2444C21.3901 26.2282 21.5967 26.1564 21.775 26.036L25.6859 22.7095Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg
      className="live-contactCardIcon"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 21.25C22.7614 21.25 25 19.0114 25 16.25C25 13.4886 22.7614 11.25 20 11.25C17.2386 11.25 15 13.4886 15 16.25C15 19.0114 17.2386 21.25 20 21.25ZM32.5 16.25C32.5 27.5 20 36.25 20 36.25C20 36.25 7.5 27.5 7.5 16.25C7.5 12.9348 8.81696 9.75537 11.1612 7.41117C13.5054 5.06696 16.6848 3.75 20 3.75C23.3152 3.75 26.4946 5.06696 28.8388 7.41117C31.183 9.75537 32.5 12.9348 32.5 16.25Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PolicySection = { title: string; html: string; headingBreak?: boolean };

const privacySections: PolicySection[] = [
  {
    title: "Information We Collect Through Aexo",
    html: `<p><br>When you use Aexo, we collect certain information that helps us provide reliable chatbot automation and improve your support workflows. This may include:<br>• Account details such as name, email address, company name, and user role • Conversation data including chat transcripts, interaction metadata, and chatbot  • Usage information related to platform activity, features used, and performance metrics • Communication details when you contact support or submit feedback</p>`,
  },
  {
    title: "How Aexo Uses Your Data",
    headingBreak: true,
    html: `<p><br></p><p>Aexo uses collected information to operate and improve the platform while maintaining privacy-focused practices. We use data to:<br><br><br></p><ol><li><p>Deliver AI-powered chatbot automation and response generation</p></li><li><p>Improve system performance, accuracy, and reliability</p></li><li><p>Provide onboarding assistance, customer support, and service updates</p></li><li><p>Monitor platform health, detect misuse, and maintain security</p></li><li><p>Develop new features that improve automation workflows</p></li></ol><p><br></p>`,
  },
  {
    title: "AI Processing & Conversation Data Responsibility",
    html: `<p><br>Aexo processes chatbot conversations using secure AI systems designed to support automated customer communication.</p><p><br>• Limited to the features and services you actively use</p><p>• Restricted to authorized systems and infrastructure</p><p>• Governed by strict internal access and data protection policies</p><p><br>Conversation data and customer interactions remain the property of the business using Aexo. We do not claim ownership of customer conversations or generated responses.</p><p><br></p>`,
  },
  {
    title: "Data Retention & User Control",
    html: `<p><br></p><p>We retain customer and platform data only for as long as necessary to provide services and meet legal or operational requirements.<br><br>Users may request deletion or export of their data according to applicable privacy regulations. Once data is removed from the system, it is permanently deleted from active infrastructure.</p><p><br></p>`,
  },
  {
    title: "Security & Infrastructure Protection",
    html: `<p><br>Aexo applies modern security practices to ensure data protection and platform<br>integrity, including:</p><p><br>• End-to-end encryption for data in transit and storage </p><p>• Secure cloud infrastructure and strict access controls </p><p>• Continuous system monitoring and vulnerability management</p><p><br>While no digital system can guarantee absolute security, we actively maintain safeguards to protect your information.</p><p><br></p>`,
  },
  {
    title: "Cookies & Platform Analytics",
    html: `<p><br>Aexo uses cookies and analytics technologies to enhance platform performance and improve user experience.</p><p><br>• Analyze product usage and feature adoption</p><p>• Maintain session security and authentication</p><p>• Identify performance improvements across the platform</p><p><br>You can control cookie preferences through your browser settings</p><p><br></p>`,
  },
  {
    title: "Contact Us",
    html: `<p><br></p><p>If you have questions about privacy, data handling, or security at Aexo, contact us at:<br>hello@aexo.com We’re committed to transparency and responsible AI research practices.</p>`,
  },
];
const termsSections: PolicySection[] = [
  {
    title: "Use of the Aexo Platform",
    html: `<p><br>By using Aexo, you agree to use the platform responsibly and in accordance with applicable laws and regulations.</p><p><br>• Use the platform for unlawful, fraudulent, or harmful activities </p><p>• Attempt to access unauthorized areas of the system </p><p>• Disrupt platform operations or interfere with other users </p><p>• Upload malicious code or harmful conten</p>`,
  },
  {
    title: "Account Registration & Responsibilities",
    html: `<p><br>To access certain features of Aexo, users may need to create an account. When registering, you agree to provide accurate and complete information.<br><br>• Maintaining the confidentiality of your account credentials </p><p>• All activities conducted through your account </p><p>• Notifying us immediately of any unauthorized access<br><br></p>`,
  },
  {
    title: "AI Automation & Generated Responses",
    html: `<p><br>Aexo uses artificial intelligence to automate conversations and generate responses. While the platform is designed to provide accurate and helpful responses, AI-generated outputs may not always be perfect.<br><br>Users are responsible for reviewing chatbot configurations and ensuring responses align with their business requirements.<br><br>Aexo does not guarantee that automated responses will always be accurate, complete, or suitable for every situation.</p><p><br></p>`,
  },
  {
    title: "Platform Availability",
    html: `<p><br></p><p>We strive to ensure reliable platform performance and availability. However, Aexo does not guarantee uninterrupted access to services.</p><p><br></p>`,
  },
  {
    title: "Limitation of Liability",
    html: `<p><br>Aexo provides services on an “as available” basis. While we aim to maintain a reliable platform, we are not liable for damages arising from:</p><p><br>• Platform downtime or service interruptions</p><p>• Errors in automated chatbot responses</p><p>• Loss of data caused by external systems or user actions</p><p><br>Users agree that their use of the platform is at their own risk.</p><p><br></p>`,
  },
  {
    title: "Changes to Terms",
    html: `<p><br>Aexo may update these Terms &amp; Conditions periodically to reflect changes in services, legal requirements, or platform functionality.<br><br>When updates occur, the revised terms will be published on this page with an updated revision date.<br><br>Continued use of the platform after updates indicates acceptance of the revised terms.</p><p><br></p>`,
  },
  {
    title: "Contact Us",
    html: `<p><br></p><p>If you have any questions about these Terms, please contact us:<br>Email: contact@aexo.com</p>`,
  },
];

export function PolicyPageLive({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  const sections = privacy ? privacySections : termsSections;
  return (
    <main>
      <div
        className={`live-policyMain ${privacy ? "live-policyPrivacy" : "live-policyTerms"}`}
        data-section="policy-main"
      >
        <section className="live-policyHero">
          <PolicyUpdated />
          <h1>Our {privacy ? "Privacy Policy" : "Terms & conditions"}</h1>
        </section>
        <article className="live-policyBody">
          <p>
            {privacy
              ? "Aexo is committed to protecting your privacy and maintaining transparency about how we collect, use, and safeguard your data. This Privacy Policy explains how information is collected and processed when you use the Aexo platform and services."
              : "These Terms & Conditions govern your use of the Aexo platform and services. By accessing or using Aexo, you agree to comply with these terms. If you do not agree with any part of these terms, you should discontinue using the platform."}
          </p>
          {sections.map(({ title, html, headingBreak }, index) => (
            <section key={title}>
              <span>0{index + 1}</span>
              <div>
                <h2>
                  {headingBreak && <br />}
                  {title}
                </h2>
                <div
                  className="live-policyRich"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </section>
          ))}
        </article>
      </div>
      <ScaleCTA />
    </main>
  );
}

function PolicyUpdated() {
  return (
    <div className="live-policyUpdate">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.8 7.2A8 8 0 1 1 4 12" />
        <path d="M4 4v4h4M12 7v5l3 2" />
      </svg>
      <span>Last Updated on</span>
      <time dateTime="2026-05-07">May 7, 2026</time>
    </div>
  );
}

export function NotFoundLive() {
  return (
    <main id="not-found" className="live-notFound">
      <span>404</span>
      <h1>Oops page not found</h1>
      <p>
        <span>
          We regret to inform you that the Pavyon you&apos;re searching for
          seems to be
        </span>
        <span>
          beyond our grasp. We apologize for any inconvenience this may cause.
        </span>
      </p>
      <LiveButton href="/" centered>
        Back to Home Page
      </LiveButton>
      <ScaleCTA />
    </main>
  );
}
