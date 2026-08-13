"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  pricingCategories,
  pricingCurrency,
  pricingPromotion,
  type PricingCategory,
  type PricingIcon,
} from "@/data/pricing-data";
import { LiveButton } from "./LiveShared";

const pricingIconSrc: Record<PricingIcon, string> = {
  pen: "/assets/pricing/Pen.svg",
  code: "/assets/pricing/Code.svg",
  screen: "/assets/pricing/Desktop.svg",
};

const currencyFormatter = new Intl.NumberFormat(pricingCurrency.locale, {
  style: "currency",
  currency: pricingCurrency.currency,
  maximumFractionDigits: pricingCurrency.maximumFractionDigits,
});

function CardIcon({ icon }: { icon: PricingIcon }) {
  return <img src={pricingIconSrc[icon]} alt="" aria-hidden="true" />;
}

function controlValueText(category: PricingCategory, levelIndex: number) {
  const level = category.control.levels[levelIndex];
  if (category.control.kind === "pages") {
    return level.label + " page" + (level.label === "1" ? "" : "s");
  }
  return level.label;
}


function CustomScopeSection() {
  return (
    <section
      className="pricing-custom-scope-frame"
      aria-labelledby="pricing-custom-scope-title"
    >
      {[
        "live-pricingGridDotTL",
        "live-pricingGridDotTR",
        "live-pricingGridDotBR",
        "live-pricingGridDotBL",
      ].map((cornerClass) => (
        <i
          className={`live-pricingGridDot ${cornerClass}`}
          aria-hidden="true"
          key={cornerClass}
        />
      ))}
      <div className="pricing-custom-scope">
        <div className="pricing-custom-scope-copy">
          <span className="pricing-custom-scope-icon" aria-hidden="true">
            <img src="/assets/pricing/scope.svg" alt="" />
          </span>
          <div>
            <h3 id="pricing-custom-scope-title">Have a custom scope?</h3>
            <p>
              For enterprise projects, complex workflows, multi-platform
              products, or unique business requirements, book a discovery call
              and receive a customized project roadmap and estimate.
            </p>
            <small>
              No commitment. No agency jargon. Just a straight conversation.
            </small>
          </div>
        </div>
        <div className="pricing-custom-scope-actions">
          <LiveButton href="/contact" className="pricing-book-call-button">
            Book A Call
          </LiveButton>
          <a className="pricing-whatsapp-link" href="#">
            <img src="/assets/pricing/whatsapp.svg" alt="" />
            <span>Chat on Whatsapp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function PricingCalculator() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const category = pricingCategories[categoryIndex];
  const level = category.control.levels[levelIndex];
  const progress =
    category.control.levels.length === 1
      ? 0
      : (levelIndex / (category.control.levels.length - 1)) * 100;

  function selectCategory(nextIndex: number) {
    setCategoryIndex(nextIndex);
    setLevelIndex(0);
  }

  function handleTabKeyDown(event: KeyboardEvent, index: number) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % pricingCategories.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + pricingCategories.length) % pricingCategories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = pricingCategories.length - 1;
    }
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectCategory(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="pricing-calculator">
      <div className="pricing-promotion" aria-label={pricingPromotion.message}>
        <span>{pricingPromotion.message}</span>
        <strong>{pricingPromotion.availability}</strong>
      </div>

      <div className="pricing-tabs" role="tablist" aria-label="Project category">
        {pricingCategories.map((item, index) => {
          const selected = index === categoryIndex;
          return (
            <button
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={"pricing-tab-" + item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="pricing-category-panel"
              tabIndex={selected ? 0 : -1}
              className={selected ? "pricing-tab-active" : ""}
              onClick={() => selectCategory(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              key={item.id}
            >
              {item.label}
            </button>
            );
          })}
      </div>

      <div
        className="pricing-control"
        style={{ "--pricing-progress": progress + "%" } as CSSProperties}
      >
        <label htmlFor="pricing-range">{category.control.label}</label>
        <input
          id="pricing-range"
          type="range"
          min={0}
          max={category.control.levels.length - 1}
          step={1}
          value={levelIndex}
          aria-valuetext={controlValueText(category, levelIndex)}
          onChange={(event) => setLevelIndex(Number(event.currentTarget.value))}
        />
        <output htmlFor="pricing-range" aria-live="polite">
          {level.label}
        </output>
      </div>

      <div className="live-benefitLayout pricing-card-frame">
        <div
          id="pricing-category-panel"
          role="tabpanel"
          aria-labelledby={"pricing-tab-" + category.id}
          className="pricing-card-grid"
        >
          {category.cards.map((card) => {
            const quote = level.quotes[card.id];
            return (
              <article
              className={
                "pricing-card" + (card.featured ? " pricing-card-featured" : "")
              }
              key={card.id}
            >
              {card.badge ? (
                <span className="pricing-card-badge"><img src="/assets/pricing/Lightning.svg" alt="" aria-hidden="true" /><span>{card.badge}</span></span>
              ) : null}
              <div className="live-priceTop pricing-card-top">
                <div className="pricing-card-heading">
                  <span className="pricing-card-icon">
                    <CardIcon icon={card.icon} />
                  </span>
                  <h3>{card.label}</h3>
                </div>
                <strong>{currencyFormatter.format(quote.price)}</strong>
                <div className="pricing-regular">
                  <span>
                    Regular {currencyFormatter.format(quote.regularPrice)}
                  </span>
                  <b>{quote.discount}% OFF</b>
                </div>
                <LiveButton
                  href={card.ctaHref}
                  className="pricing-book-call-button"
                >
                  {card.ctaLabel}
                </LiveButton>
              </div>
              <ul>
                {level.features[card.id].map((feature) => (
                  <li key={feature}>
                    <b aria-hidden="true">✓</b>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
            );
          })}
        </div>
        {[1, 2, 3, 4].map((index) => (
          <i
            className={`live-benefitFrameDot live-benefitFrameDot${index}`}
            aria-hidden="true"
            key={index}
          />
        ))}
      </div>
      <CustomScopeSection />
      <p className="pricing-selection-status" aria-live="polite">
        Showing {category.label}, {controlValueText(category, levelIndex)}
      </p>
    </div>
  );
}

