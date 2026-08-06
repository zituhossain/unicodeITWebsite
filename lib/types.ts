export type WorkSlug = "ametrix" | "notlex" | "botwise" | "cognefy";

export interface Work {
  slug: WorkSlug;
  title: string;
  category: string;
  year: string;
  image: string;
  accent: string;
  summary: string;
  services: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
  features: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FaqItem { question: string; answer: string }
export interface ProcessStep { number: string; title: string; body: string }
export interface NavItem { label: string; href: string }
