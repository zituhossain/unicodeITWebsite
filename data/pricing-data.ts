export type PricingCardId = "design" | "development" | "combined";
export type PricingIcon = "pen" | "code" | "screen";

export type PricingQuote = {
  price: number;
  regularPrice: number;
  discount: number;
};

export type PricingLevel = {
  id: string;
  label: string;
  features: Record<PricingCardId, readonly string[]>;
  quotes: Record<PricingCardId, PricingQuote>;
};

export type PricingCardDefinition = {
  id: PricingCardId;
  label: string;
  badge?: string;
  icon: PricingIcon;
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

export type PricingCategory = {
  id: "website" | "saas" | "mobile" | "automation" | "webflow";
  label: string;
  control: {
    kind: "pages" | "complexity";
    label: string;
    levels: readonly PricingLevel[];
  };
  cards: readonly PricingCardDefinition[];
};

type QuoteSeed = {
  basePrice: number;
  priceStep: number;
  discount: number;
};

type LevelSeed = { id: string; label: string; multiplier: number };

const CARD_IDS: readonly PricingCardId[] = [
  "design",
  "development",
  "combined",
];

function roundToNearest25(value: number) {
  return Math.round(value / 25) * 25;
}

function makeLevels(
  levels: readonly LevelSeed[],
  pricing: Record<PricingCardId, QuoteSeed>,
  features: (level: LevelSeed) => Record<PricingCardId, readonly string[]>,
): readonly PricingLevel[] {
  return levels.map((level) => ({
    id: level.id,
    label: level.label,
    features: features(level),
    quotes: Object.fromEntries(
      CARD_IDS.map((cardId) => {
        const seed = pricing[cardId];
        const price = roundToNearest25(
          seed.basePrice + seed.priceStep * level.multiplier,
        );
        const regularPrice = roundToNearest25(
          price / (1 - seed.discount / 100),
        );
        return [cardId, { price, regularPrice, discount: seed.discount }];
      }),
    ) as Record<PricingCardId, PricingQuote>,
  }));
}

const pageLevels = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1) + "-pages",
  label: String(index + 1),
  multiplier: index,
}));

const mobilePageLevels = Array.from({ length: 30 }, (_, index) => ({
  id: String(index + 1) + "-pages",
  label: String(index + 1),
  multiplier: index,
}));

const productLevels: readonly LevelSeed[] = [
  { id: "basic-mvp", label: "Basic MVP", multiplier: 0 },
  { id: "standard", label: "Standard", multiplier: 1 },
  { id: "advanced", label: "Advanced", multiplier: 2 },
];

const automationLevels: readonly LevelSeed[] = [
  { id: "basic-mvp", label: "Basic MVP", multiplier: 0 },
  { id: "standard", label: "Standard", multiplier: 1 },
  { id: "advanced", label: "Advanced", multiplier: 2 },
];

function cards(
  definitions: Omit<PricingCardDefinition, "ctaLabel" | "ctaHref">[],
): readonly PricingCardDefinition[] {
  return definitions.map((definition) => ({
    ...definition,
    ctaLabel: "Book A Call",
    ctaHref: "/contact",
  }));
}

const FEATURE_LIBRARY: Record<
  PricingCategory["id"],
  Record<PricingCardId, readonly string[]>
> = {
  website: {
    design: [
      "Brand-aligned visual system",
      "Mobile-first responsive design",
      "Conversion-focused structure",
      "Figma source file delivery",
      "UX research insights",
      "Unlimited revisions",
      "Revision rounds included",
    ],
    development: [
      "Responsive across devices",
      "Modern development setup",
      "Fast turnaround delivery",
      "Conversion-focused layout",
      "Performance optimization",
      "Strategy onboarding call",
      "Revision rounds included",
    ],
    combined: [
      "Complete design and development",
      "Responsive across devices",
      "Priority turnaround time",
      "Dedicated communication channel",
      "Design system handoff",
      "Performance optimization support",
      "Launch support included",
    ],
  },
  saas: {
    design: [
      "Product discovery workshop",
      "User flows and information architecture",
      "Responsive product interface",
      "Interactive Figma prototype",
      "Reusable design system",
      "Developer-ready handoff",
      "Revision rounds included",
    ],
    development: [
      "Technical planning",
      "Responsive frontend development",
      "Backend and API integration",
      "Authentication setup",
      "Quality assurance",
      "Deployment configuration",
      "Post-launch handoff",
    ],
    combined: [
      "Product strategy and planning",
      "UX, UI and interactive prototype",
      "Frontend and backend development",
      "Scalable design system",
      "Weekly progress reviews",
      "Quality assurance and deployment",
      "Launch support included",
    ],
  },
  mobile: {
    design: [
      "iOS and Android patterns",
      "User flow planning",
      "High-fidelity page design",
      "Interactive Figma prototype",
      "Mobile design system",
      "Developer-ready assets",
      "Revision rounds included",
    ],
    development: [
      "Cross-platform development",
      "Responsive page implementation",
      "API integration",
      "Device testing",
      "App performance tuning",
      "Build and release support",
      "Technical documentation",
    ],
    combined: [
      "Product discovery and scope",
      "UX, UI and prototype",
      "Cross-platform development",
      "Reusable component system",
      "Device and accessibility testing",
      "Store submission support",
      "Post-launch handoff",
    ],
  },
  automation: {
    design: [
      "Automation discovery workshop",
      "Process and decision mapping",
      "Conversation or workflow UX",
      "Error and fallback states",
      "Interactive prototype",
      "Human-in-the-loop planning",
      "Technical handoff",
    ],
    development: [
      "Automation architecture",
      "Model and API integration",
      "Multi-step workflow build",
      "Data validation and safeguards",
      "Monitoring-ready setup",
      "Deployment configuration",
      "Technical documentation",
    ],
    combined: [
      "Opportunity and feasibility workshop",
      "Workflow UX and prototyping",
      "AI and system integration",
      "Guardrails and fallback design",
      "Testing and evaluation",
      "Deployment and monitoring setup",
      "Team handoff session",
    ],
  },
  webflow: {
    design: [
      "Brand-aligned visual direction",
      "Responsive page design",
      "CMS-aware structure",
      "Reusable section system",
      "Figma source file delivery",
      "Interaction direction",
      "Developer-ready handoff",
    ],
    development: [
      "Webflow or Framer development",
      "Responsive across devices",
      "CMS collection setup",
      "Purposeful interactions",
      "SEO-ready structure",
      "Editor training",
      "Launch support included",
    ],
    combined: [
      "Strategy and content structure",
      "Custom responsive design",
      "Webflow or Framer development",
      "CMS and component system",
      "Motion and interactions",
      "SEO and performance setup",
      "Launch support included",
    ],
  },
};

const FEATURE_SCOPE: Record<
  PricingCategory["id"],
  Record<PricingCardId, (label: string) => string>
> = {
  website: {
    design: (label) => label + "-page website design scope",
    development: (label) => label + "-page responsive development scope",
    combined: (label) => label + "-page complete website scope",
  },
  saas: {
    design: (label) => label + " product design scope",
    development: (label) => label + " application development scope",
    combined: (label) => label + " end-to-end product scope",
  },
  mobile: {
    design: (label) => label + "-page mobile app design scope",
    development: (label) => label + "-page cross-platform build scope",
    combined: (label) => label + "-page complete mobile app scope",
  },
  automation: {
    design: (label) => label + " automation design scope",
    development: (label) => label + " automation build scope",
    combined: (label) => label + " end-to-end automation scope",
  },
  webflow: {
    design: (label) => label + "-page no-code design scope",
    development: (label) => label + "-page Webflow or Framer scope",
    combined: (label) => label + "-page complete no-code scope",
  },
};

function makeLevelFeatures(
  level: LevelSeed,
  category: PricingCategory["id"],
): Record<PricingCardId, readonly string[]> {
  const scopedFeatures = (cardId: PricingCardId) => [
    FEATURE_SCOPE[category][cardId](level.label),
    ...FEATURE_LIBRARY[category][cardId],
  ];
  return {
    design: scopedFeatures("design"),
    development: scopedFeatures("development"),
    combined: scopedFeatures("combined"),
  };
}
/**
 * PLACEHOLDER PRICING
 * The supplied screenshots expose only a $250 sale / $499 regular example.
 * Every curve below is a deterministic working estimate that must be confirmed.
 */
export const PRICING_VALUES_REQUIRE_CONFIRMATION = true;

export const pricingCategories: readonly PricingCategory[] = [
  {
    id: "website",
    label: "Website",
    control: {
      kind: "pages",
      label: "Pages",
      levels: makeLevels(
        pageLevels,
        {
          design: { basePrice: 250, priceStep: 150, discount: 40 },
          development: { basePrice: 250, priceStep: 175, discount: 40 },
          combined: { basePrice: 250, priceStep: 275, discount: 50 },
        },
        (level) => makeLevelFeatures(level, "website"),
      ),
    },
    cards: cards([
      {
        id: "design",
        label: "Design only",
        icon: "pen",
      },
      {
        id: "development",
        label: "Development only",
        icon: "code",
      },
      {
        id: "combined",
        label: "Design + Development",
        badge: "Most Popular",
        icon: "screen",
        featured: true,
      },
    ]),
  },
  {
    id: "saas",
    label: "SaaS / Web App",
    control: {
      kind: "complexity",
      label: "Complexity",
      levels: makeLevels(
        productLevels,
        {
          design: { basePrice: 1200, priceStep: 800, discount: 35 },
          development: { basePrice: 1800, priceStep: 1200, discount: 30 },
          combined: { basePrice: 2700, priceStep: 1800, discount: 45 },
        },
        (level) => makeLevelFeatures(level, "saas"),
      ),
    },
    cards: cards([
      {
        id: "design",
        label: "Product design",
        icon: "pen",
      },
      {
        id: "development",
        label: "Development only",
        icon: "code",
      },
      {
        id: "combined",
        label: "Design + Development",
        badge: "Best Value",
        icon: "screen",
        featured: true,
      },
    ]),
  },
  {
    id: "mobile",
    label: "Mobile App",
    control: {
      kind: "pages",
      label: "Pages",
      levels: makeLevels(
        mobilePageLevels,
        {
          design: { basePrice: 400, priceStep: 175, discount: 35 },
          development: { basePrice: 650, priceStep: 275, discount: 30 },
          combined: { basePrice: 900, priceStep: 400, discount: 45 },
        },
        (level) => makeLevelFeatures(level, "mobile"),
      ),
    },
    cards: cards([
      {
        id: "design",
        label: "App design",
        icon: "pen",
      },
      {
        id: "development",
        label: "Development only",
        icon: "code",
      },
      {
        id: "combined",
        label: "Design + Development",
        badge: "Most Popular",
        icon: "screen",
        featured: true,
      },
    ]),
  },
  {
    id: "automation",
    label: "AI Automation",
    control: {
      kind: "complexity",
      label: "Complexity",
      levels: makeLevels(
        automationLevels,
        {
          design: { basePrice: 750, priceStep: 550, discount: 30 },
          development: { basePrice: 1400, priceStep: 1100, discount: 30 },
          combined: { basePrice: 1900, priceStep: 1500, discount: 40 },
        },
        (level) => makeLevelFeatures(level, "automation"),
      ),
    },
    cards: cards([
      {
        id: "design",
        label: "Workflow design",
        icon: "pen",
      },
      {
        id: "development",
        label: "Automation build",
        icon: "code",
      },
      {
        id: "combined",
        label: "Design + Development",
        badge: "Best Value",
        icon: "screen",
        featured: true,
      },
    ]),
  },
  {
    id: "webflow",
    label: "Webflow / Framer",
    control: {
      kind: "pages",
      label: "Pages",
      levels: makeLevels(
        pageLevels,
        {
          design: { basePrice: 250, priceStep: 125, discount: 35 },
          development: { basePrice: 300, priceStep: 150, discount: 35 },
          combined: { basePrice: 500, priceStep: 250, discount: 45 },
        },
        (level) => makeLevelFeatures(level, "webflow"),
      ),
    },
    cards: cards([
      {
        id: "design",
        label: "Design only",
        icon: "pen",
      },
      {
        id: "development",
        label: "Development only",
        icon: "code",
      },
      {
        id: "combined",
        label: "Design + Development",
        badge: "Most Popular",
        icon: "screen",
        featured: true,
      },
    ]),
  },
] as const;

export const pricingPromotion = {
  message: "Save up to 50% - Limited to 10 projects only",
  availability: "6 slots left",
} as const;

export const pricingCurrency = {
  locale: "en-US",
  currency: "USD",
  maximumFractionDigits: 0,
} as const;
