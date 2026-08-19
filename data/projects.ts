export type ProjectShowcaseBlock = {
  title?: string;
  body?: string;
  images: readonly string[];
  layout?: "full" | "grid";
};

export type Project = {
  slug: string;
  title: string;
  industry: readonly string[];
  serviceCategory: readonly string[];
  servicesProvided: readonly string[];
  scopeOfWork: readonly string[];
  liveUrl: string;
  summary: string;
  heroImage: string;
  problems: string;
  solutions: readonly string[];
  showcase: readonly ProjectShowcaseBlock[];
  tags: readonly string[];
  category: string;
  region: string;
  year: string;
  listing: string;
  relatedImage: string;
  cover: string;
  gallery: readonly string[];
};

export const EMLOCK_PROJECT_IMAGE =
  "/assets/projects/emlock/_mobileapp_project_main_img.png";

export const projects = [
  {
    slug: "ametrix",
    title: "Ametrix",
    industry: ["Fintech & Financial", "Services"],
    serviceCategory: ["SaaS Development"],
    servicesProvided: ["Product Discovery", "User Research", "UI UX Design", "Development"],
    scopeOfWork: ["React Development", "Node.js Development", "Admin Portal"],
    liveUrl: "https://ametrix.com/",
    summary: "Ametrix is a productivity-focused SaaS platform designed to simplify inbox management through AI-powered automation. We were tasked with shaping the product experience, refining the brand identity, and building a high-converting marketing website. Our approach focused on clarity, speed, and a modern visual system that reflects efficiency and intelligence.",
    heroImage: "/assets/project-ametrix.png",
    problems: "The product needed to make complex financial workflows feel clear and approachable while maintaining consistency across a growing set of screens and user journeys.",
    solutions: ["Implemented referral tracking", "Introduced leadership and collection boards", "Supported department-wide and individual job posts", "Revamped navigation for ease of use", "Created personalized dashboards for relevant information and actions"],
    showcase: [
      { title: "The final experience", body: "The final experience combines strong visuals with usability, helping users manage workflows effortlessly while reinforcing Ametrix as a modern, AI-first platform.", images: ["/assets/project-ametrix.png"], layout: "full" },
    ],
    tags: ["Product Design", "SaaS Development", "Fintech", "Platform: Web"],
    category: "SaaS",
    region: "USA",
    year: "2026",
    listing: "/assets/project-ametrix.png",
    relatedImage: "/assets/project-ametrix.png",
    cover: "/assets/project-ametrix.png",
    gallery: ["/assets/project-ametrix.png"],
  },
  {
    slug: "emlock",
    title: "EmLock Mobile App Development",
    industry: [],
    serviceCategory: [],
    servicesProvided: [],
    scopeOfWork: [],
    liveUrl: "",
    summary: "",
    heroImage: EMLOCK_PROJECT_IMAGE,
    problems: "",
    solutions: [],
    showcase: [],
    tags: [
      "Mobile Application",
      "App Development",
      "SaaS Development",
      "UI/UX Design",
    ],
    category: "Mobile Application",
    region: "",
    year: "2026",
    listing: EMLOCK_PROJECT_IMAGE,
    relatedImage: EMLOCK_PROJECT_IMAGE,
    cover: EMLOCK_PROJECT_IMAGE,
    gallery: [],
  },
  {
    slug: "unigram",
    title: "Unigram",
    industry: ["Technology", "Startup"],
    serviceCategory: ["Web Development"],
    servicesProvided: ["Brand Identity", "Product Strategy", "UI UX Design", "Development"],
    scopeOfWork: ["Frontend Development", "Content System", "Launch Website"],
    liveUrl: "https://unigram.unicodeit.com/",
    summary: "Unigram is a modern digital platform built to help startups launch quickly and scale with confidence. Our role was to craft a bold brand identity, design a conversion-focused website, and create a flexible layout system for growth.",
    heroImage: "/assets/projects/unigram-home.png",
    problems: "The challenge was creating a premium experience that could adapt to multiple use cases without losing clarity, personality, or brand recognition.",
    solutions: ["Built a modular page system", "Established a clear typographic hierarchy", "Created reusable conversion-focused sections", "Designed a flexible visual identity", "Optimized layouts across screen sizes"],
    showcase: [
      { title: "Built to scale", body: "Every screen was designed to evolve with the product, allowing seamless updates while maintaining a consistent and recognizable brand presence.", images: ["/assets/live/detail-derivatives/TympALL88y72elDlJb40JkYTQQ-512.png"], layout: "full" },
      { images: ["/assets/live/detail-derivatives/v1cx7ZktJR9SbuHKbFlcz2sy8-512.png", "/assets/live/detail-derivatives/K8DDhk1WSJwbXIGXZ6MfaqYYgQ-512.png", "/assets/live/detail-derivatives/ZKerwx7BB5CVv1wGMXcJkjterOc-512.png"], layout: "grid" },
    ],
    tags: ["Brand Identity", "Web Development", "Startup", "Platform: Web"],
    category: "Startup",
    region: "Global",
    year: "2026",
    listing: "/assets/projects/unigram-home.png",
    relatedImage: "/assets/projects/unigram-home.png",
    cover: "/assets/projects/unigram-home.png",
    gallery: ["/assets/live/detail-derivatives/TympALL88y72elDlJb40JkYTQQ-512.png", "/assets/live/detail-derivatives/v1cx7ZktJR9SbuHKbFlcz2sy8-512.png", "/assets/live/detail-derivatives/K8DDhk1WSJwbXIGXZ6MfaqYYgQ-512.png", "/assets/live/detail-derivatives/ZKerwx7BB5CVv1wGMXcJkjterOc-512.png"],
  },
  {
    slug: "teamlink",
    title: "Teamlink",
    industry: ["Artificial Intelligence", "SaaS"],
    serviceCategory: ["AI Integration"],
    servicesProvided: ["Product Design", "UX Strategy", "Dashboard Design", "Development"],
    scopeOfWork: ["AI Integration", "Frontend Development", "Automation Flows"],
    liveUrl: "https://teamlink.unicodeit.com/",
    summary: "Teamlink is an AI-powered platform focused on automating customer interactions and improving operational efficiency. We designed the product interface, crafted the brand system, and built a website that communicates intelligence and simplicity.",
    heroImage: "/assets/live/CXFITVUIZTTvUVvRlGQbsvrVEBc.png",
    problems: "Complex AI interactions needed to feel effortless and human while remaining predictable across conversational flows, dashboards, and automated processes.",
    solutions: ["Designed conversational UI patterns", "Created intuitive automation workflows", "Reduced friction across core tasks", "Unified dashboards and conversation states", "Built a scalable interaction system"],
    showcase: [
      { title: "Clear, human automation", body: "Teamlink now delivers a powerful yet simple interface that helps businesses automate processes while maintaining a natural and engaging user journey.", images: ["/assets/live/yFQSP9qyOahJlwWLTTFBuRkvBzY.png"], layout: "full" },
      { images: ["/assets/live/detail-derivatives/KmY2SoTDQGdQqnYr5i7VsUgWK0-512.png", "/assets/live/detail-derivatives/VjisRdjvXGF1nGdrHg2D4PiQ4U-512.png", "/assets/live/detail-derivatives/GSrkjUMfCIi85Q8yLCxNVl0QNuY-512.png", "/assets/live/detail-derivatives/uk8bb3plK9moj1jpt9HVobdVwXs-512.png"], layout: "grid" },
    ],
    tags: ["AI Integration", "Dashboard", "SaaS Development", "Automation"],
    category: "AI Platform",
    region: "USA",
    year: "2026",
    listing: "/assets/live/a0Wtj8qawEzvxhakjHMoT0DWcQ.png",
    relatedImage: "/assets/live/HbC1fjEUQVC5H6CG4Jg5aY0Q.png",
    cover: "/assets/live/CXFITVUIZTTvUVvRlGQbsvrVEBc.png",
    gallery: ["/assets/live/yFQSP9qyOahJlwWLTTFBuRkvBzY.png", "/assets/live/detail-derivatives/KmY2SoTDQGdQqnYr5i7VsUgWK0-512.png", "/assets/live/detail-derivatives/VjisRdjvXGF1nGdrHg2D4PiQ4U-512.png", "/assets/live/detail-derivatives/GSrkjUMfCIi85Q8yLCxNVl0QNuY-512.png", "/assets/live/detail-derivatives/uk8bb3plK9moj1jpt9HVobdVwXs-512.png"],
  },
  {
    slug: "cognefy",
    title: "Cognefy",
    industry: ["Technology", "Artificial Intelligence"],
    serviceCategory: ["SaaS Development"],
    servicesProvided: ["Product Design", "Visual Identity", "UI UX Design", "Development"],
    scopeOfWork: ["Product Strategy", "Frontend Development", "Design System"],
    liveUrl: "https://cognefy.framer.website/",
    summary: "Cognefy is a smart digital solution focused on enhancing productivity through intelligent systems and automation. We led the design direction, built the product experience, and developed a scalable visual identity for long-term growth.",
    heroImage: "/assets/live/VAbarfhoSndjUR0wuoeESsADqnM.png",
    problems: "The challenge was balancing advanced functionality with a minimal interface that made complex workflows easy to understand and simple to complete.",
    solutions: ["Created structured product layouts", "Refined key interactions", "Simplified complex workflows", "Established a scalable visual system", "Maintained consistency across touchpoints"],
    showcase: [
      { title: "Designed for clarity", body: "Cognefy delivers a refined experience that empowers users to work smarter, with a clean interface that highlights performance and simplicity.", images: ["/assets/live/3HsuvYqWBrdgQVfGwzNFjb68.png"], layout: "full" },
      { images: ["/assets/live/detail-derivatives/jmpyVIaATFGGd3Z8tRinI8LcUYk-512.png", "/assets/live/detail-derivatives/3Istwk6eaRjLvwyqeBbRkYQbS9U-512.png", "/assets/live/detail-derivatives/A9FFNqJGq8dg679iTnxqGWsFH7s-512.png", "/assets/live/detail-derivatives/qrRXC75dzoYObbQiOo7aYb1m154-512.png"], layout: "grid" },
    ],
    tags: ["Product Design", "AI Platform", "Web Development", "Platform: Web"],
    category: "Tech",
    region: "Europe",
    year: "2026",
    listing: "/assets/live/IwywHAyPXQK7GUmAMzNEgTszhjA.png",
    relatedImage: "/assets/live/8BCQjUwYkkjnB5EUxkaSlMz3E.png",
    cover: "/assets/live/VAbarfhoSndjUR0wuoeESsADqnM.png",
    gallery: ["/assets/live/3HsuvYqWBrdgQVfGwzNFjb68.png", "/assets/live/detail-derivatives/jmpyVIaATFGGd3Z8tRinI8LcUYk-512.png", "/assets/live/detail-derivatives/3Istwk6eaRjLvwyqeBbRkYQbS9U-512.png", "/assets/live/detail-derivatives/A9FFNqJGq8dg679iTnxqGWsFH7s-512.png", "/assets/live/detail-derivatives/qrRXC75dzoYObbQiOo7aYb1m154-512.png"],
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export const workListingProjects = projects.filter((project) => project.slug !== "ametrix");

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
