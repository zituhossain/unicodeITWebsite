import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { pricingPlans, works } from "@/lib/data";
import type { Work } from "@/lib/types";
import { ContactForm } from "./ContactForm";
import { FAQSection, ReadyCTA, TestimonialsSection } from "./HomePage";
import { Button, Eyebrow, SectionTitle } from "./Primitives";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return <section className="live-pageHero">
    <Eyebrow light>{eyebrow}</Eyebrow><h1 data-hero>{title}</h1>
    {children && <div className="live-pageHeroCopy" data-hero>{children}</div>}
    <div className="live-heroGlyph">✦</div>
  </section>;
}

export function WorksGrid({ exclude }: { exclude?: string }) {
  return <div className="live-worksGrid">{works.filter((work) => work.slug !== exclude).map((work, index) =>
    <Link href={`/works/${work.slug}`} key={work.slug} className="live-gridWork" data-reveal>
      <div><Image src={work.image} alt={`${work.title} project`} fill sizes="(max-width: 809px) 90vw, 45vw" /></div>
      <aside><span>0{index + 1}</span><h2>{work.title}</h2><p>{work.category} · {work.year}</p></aside>
    </Link>)}</div>;
}

export function WorksPage() {
  return <main><PageHero eyebrow="OUR WORK" title={<>SELECTED<br /><em>PROJECTS.</em></>}><p>Distinctive identities and digital experiences made for brands with something real to say.</p></PageHero><section className="live-allWorks"><SectionTitle eyebrow="ALL WORKS">A FEW THINGS<br />WE&apos;RE <em>PROUD OF.</em></SectionTitle><WorksGrid /></section><TestimonialsSection /><FAQSection /><ReadyCTA /></main>;
}

export function PricingPage() {
  return <main><PageHero eyebrow="PRICING" title={<>CLEAR SCOPE.<br /><em>NO SURPRISES.</em></>}><p>Choose the starting point that fits. Every engagement is led by senior creatives and tailored to the real challenge.</p></PageHero><section className="live-innerPricing"><div className="live-pricingGrid">{pricingPlans.map((plan) => <article key={plan.name} className={plan.featured ? "live-featuredPlan" : ""} data-reveal><h3>{plan.name}</h3><strong>{plan.price}</strong><p>{plan.description}</p><ul>{plan.features.map((f) => <li key={f}>↗ {f}</li>)}</ul><Button href="/contact" light={!plan.featured}>GET STARTED</Button></article>)}</div></section><section className="live-innerBenefits"><SectionTitle eyebrow="EVERY PLAN INCLUDES">THE IMPORTANT<br /><em>STUFF.</em></SectionTitle><div>{["Senior creative direction", "Responsive design", "Clear weekly progress", "Production-ready files", "Post-launch support", "No hidden fees"].map((x) => <span key={x}>✓ {x}</span>)}</div></section><TestimonialsSection /><FAQSection /><ReadyCTA /></main>;
}

export function AboutPage() {
  const people = [["/assets/team-anna.png", "ANNA MILES", "CREATIVE DIRECTOR"], ["/assets/team-marc.png", "MARC ELLIS", "DESIGN DIRECTOR"], ["/assets/team-jon.png", "JON PARK", "LEAD DEVELOPER"]];
  return <main><PageHero eyebrow="ABOUT AEXO" title={<>SMALL STUDIO.<br /><em>SERIOUS IMPACT.</em></>}><p>We are an independent creative studio helping ambitious teams become clear, distinct, and impossible to overlook.</p></PageHero><section className="live-aboutStory"><div className="live-aboutImage"><Image src="/assets/culture-one.png" fill alt="Aexo studio culture" sizes="50vw" /></div><div data-reveal><Eyebrow>OUR STORY</Eyebrow><h2>BUILT FOR BETTER<br />CREATIVE WORK.</h2><p>Aexo was created as a focused alternative to the traditional agency: fewer layers, sharper thinking, and direct collaboration with the people actually making the work.</p><p>We stay intentionally small so every project gets senior attention, honest feedback, and the momentum it deserves.</p></div></section><section className="live-team"><SectionTitle eyebrow="THE TEAM" light>PEOPLE BEHIND<br /><em>THE PIXELS.</em></SectionTitle><div className="live-teamGrid">{people.map(([image, name, role]) => <article key={name} data-reveal><div><Image src={image} fill alt={name} sizes="30vw" /></div><h3>{name}</h3><p>{role}</p></article>)}</div></section><section className="live-culture"><SectionTitle eyebrow="HOW WE WORK">CLEAR. CURIOUS.<br /><em>ALL IN.</em></SectionTitle><div className="live-cultureImages"><Image src="/assets/culture-two.png" fill alt="Studio collaboration" sizes="80vw" /></div></section><ReadyCTA /></main>;
}

export function ContactPage() {
  return <main><PageHero eyebrow="CONTACT" title={<>LET&apos;S BUILD<br /><em>SOMETHING GOOD.</em></>}><p>Tell us what you are working on. We usually reply within two working days.</p></PageHero><section className="live-contactSection"><div><SectionTitle eyebrow="START A PROJECT" compact>READY WHEN<br /><em>YOU ARE.</em></SectionTitle><p>hello@aexo.design<br />+1 415 555 0148</p></div><ContactForm /></section><TestimonialsSection /><FAQSection /><ReadyCTA /></main>;
}

export function WorkDetailPage({ work }: { work: Work }) {
  return <main><section className="live-workHero"><Eyebrow light>CASE STUDY · {work.year}</Eyebrow><h1 data-hero>{work.title}</h1><div className="live-workIntro"><p data-hero>{work.summary}</p><div>{work.services.map((service) => <span key={service}>{service}</span>)}</div></div></section><div className="live-workCover"><Image src={work.image} fill priority alt={`${work.title} design showcase`} sizes="100vw" /></div><section className="live-workChallenge"><div><Eyebrow>THE CHALLENGE</Eyebrow><h2>A CLEARER STORY.<br />A STRONGER <em>SIGNAL.</em></h2></div><p>The brand needed a system with enough flexibility to grow and enough character to be recognized instantly. We stripped away the noise, found the sharpest idea, and built every expression around it.</p></section><section className="live-workGallery"><Image src="/assets/project-blue.png" fill alt="Project interface detail" sizes="90vw" /></section><section className="live-otherWorks"><SectionTitle eyebrow="OTHER WORKS" light>KEEP<br /><em>EXPLORING.</em></SectionTitle><WorksGrid exclude={work.slug} /></section><ReadyCTA /></main>;
}

export function PolicyPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  const headings = privacy ? ["Information we collect", "How we use information", "Cookies and analytics", "Sharing and retention", "Your rights", "Contact"] : ["Scope of services", "Proposals and payment", "Client responsibilities", "Intellectual property", "Cancellation", "Liability", "General terms"];
  return <main><PageHero eyebrow="POLICY" title={privacy ? <>PRIVACY<br /><em>POLICY.</em></> : <>TERMS &amp;<br /><em>CONDITIONS.</em></>}><p>Last updated July 2026</p></PageHero><article className="live-policy"><p>This document explains how Aexo Studio handles information and the terms that apply when using this website or working with us.</p>{headings.map((heading, index) => <section key={heading}><span>0{index + 1}</span><div><h2>{heading}</h2><p>We collect and use only the information reasonably necessary to provide our services, communicate with you, maintain this website, and meet legal obligations. We do not sell personal information. Specific project terms are confirmed in writing before work begins.</p><p>If you have questions about this section, contact us at hello@aexo.design.</p></div></section>)}</article></main>;
}
