"use client";

import { useState } from "react";
import {
  technologies,
  technologyCategories,
  type TechnologyCategory,
} from "@/data/technology-stack";
import { ContactHeroTransition } from "./LiveContactHero";
import { LiveTitle } from "./LiveShared";

export function TechnologyStack() {
  const [activeCategory, setActiveCategory] =
    useState<TechnologyCategory>("All");

  const visibleTechnologies =
    activeCategory === "All"
      ? technologies
      : technologies.filter(
          (technology) => technology.category === activeCategory,
        );

  return (
    <section className="live-techStack" data-section="tools">
      <div className="live-techStackInner">
        <LiveTitle kicker="Our Tech Stack" center>
          Technology Stack
          <br />
          We Use
        </LiveTitle>

        <div
          className="live-techStackTabs"
          role="tablist"
          aria-label="Filter technologies by category"
        >
          {technologyCategories.map((category) => (
            <button
              className="live-techStackTab"
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="live-techStackGrid" aria-live="polite">
          {visibleTechnologies.map((technology, index) => (
            <article
              className="live-techStackCard"
              key={`${technology.name}-${index}`}
            >
              <img src={technology.icon} alt="" aria-hidden="true" />
              <span>{technology.name}</span>
            </article>
          ))}
          <i
            className="live-benefitFrameDot live-benefitFrameDot1"
            aria-hidden="true"
          />
          <i
            className="live-benefitFrameDot live-benefitFrameDot2"
            aria-hidden="true"
          />
          <i
            className="live-benefitFrameDot live-benefitFrameDot3"
            aria-hidden="true"
          />
          <i
            className="live-benefitFrameDot live-benefitFrameDot4"
            aria-hidden="true"
          />
        </div>
      </div>
      <ContactHeroTransition home />
    </section>
  );
}
