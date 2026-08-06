import { contactSocialProofCard } from "@/lib/live-data";
import { LiveContactForm } from "./LiveContactForm";
import { ContactCardAction, Kicker } from "./LiveShared";

const contactBenefits = [
  "Response within 12 hours",
  "NDA available on request",
  "Dedicated product team",
  "Unlimited support & long-term partnership",
] as const;

export function ContactHeroSection({
  id,
  placement = "route",
}: {
  id?: string;
  placement?: "route" | "home";
}) {
  return (
    <section
      id={id}
      className={`live-contactHero${placement === "home" ? " live-contactHeroHome" : ""}`}
      data-section="contact-hero"
      data-home-section={placement === "home" ? "cta" : undefined}
    >
      <div className="contact-hero-motion" aria-hidden="true" />
      <img
        className="live-contactAbstract"
        data-contact-art
        src="/assets/live/brand-cyan/y48cq5SH9O3kuRoMxQPnzmqYg0.png"
        alt=""
      />
      <img
        className="live-contactRuler"
        src="/assets/live/7xWbAyTQN909Y3iX0Cq9QfWxA.png"
        alt=""
      />
      <img
        className="live-contactBackdrop"
        src="/assets/live/brand-cyan/hxv1k6QKnlVRWyZvet7V0Jn7iW0.png"
        alt=""
      />
      <div className="live-contactIntro" data-contact-intro>
        <Kicker>Let&apos;s Connect</Kicker>
        <h1>
          Start Your <br />
          Next Project
        </h1>
        <ul className="live-contactBenefits">
          {contactBenefits.map((benefit) => (
            <li key={benefit}>
              <img src="/assets/live/checkmark-circle-02.svg" alt="" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <ContactSocialProofCard />
      </div>
      <LiveContactForm />
      <div className="live-contactDirectBar">
        <p>Prefer to reach out directly?</p>
        <ContactCardAction className="live-contactDirectCall">
          Book a Free Call
        </ContactCardAction>
        <a
          className="live-contactWhatsApp"
          href="#"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <img src="/assets/live/whatsapp.svg" alt="" />
        </a>
      </div>
    </section>
  );
}

function ContactSocialProofCard() {
  return (
    <aside
      className="live-callCard"
      data-contact-call
      aria-label="Aexo client proof"
    >
      <div className="live-callAvatarRow">
        <img
          className="live-callAvatarImage"
          src={contactSocialProofCard.avatarImage.src}
          alt={contactSocialProofCard.avatarImage.alt}
        />
        <span>{contactSocialProofCard.trustText}</span>
      </div>
      <p>{contactSocialProofCard.text}</p>
    </aside>
  );
}
export function ContactHeroTransition({ home = false }: { home?: boolean }) {
  return (
    <div
      className={`live-contactTransition${home ? " live-contactTransitionHome" : ""}`}
      data-motion-loop="contact-transition-ruler"
      aria-hidden="true"
    />
  );
}
