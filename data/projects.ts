export type ProjectShowcaseBlock = {
  title?: string;
  body?: string;
  images: readonly string[];
  layout?: "full" | "grid";
};

export type ProjectDetailListItem = string | { lead: string; body: string };

export type ProjectDetailBlock =
  | {
      type: "copy";
      title: string;
      paragraphs?: readonly string[];
      bullets?: readonly ProjectDetailListItem[];
      closingParagraphs?: readonly string[];
      groups?: readonly {
        title: string;
        bullets: readonly string[];
      }[];
    }
  | {
      type: "image";
      image: string;
      alt: string;
      aspectRatio: string;
    };

export type Project = {
  slug: string;
  title: string;
  detailTitle?: string;
  detailLayout?: "figma-longform";
  detailBlocks?: readonly ProjectDetailBlock[];
  industry: readonly string[];
  serviceCategory: readonly string[];
  servicesProvided: readonly string[];
  scopeOfWork: readonly string[];
  liveUrl: string;
  links?: readonly { label: string; url: string }[];
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
    servicesProvided: [
      "Product Discovery",
      "User Research",
      "UI UX Design",
      "Development",
    ],
    scopeOfWork: ["React Development", "Node.js Development", "Admin Portal"],
    liveUrl: "https://ametrix.com/",
    summary:
      "Ametrix is a productivity-focused SaaS platform designed to simplify inbox management through AI-powered automation. We were tasked with shaping the product experience, refining the brand identity, and building a high-converting marketing website. Our approach focused on clarity, speed, and a modern visual system that reflects efficiency and intelligence.",
    heroImage: "/assets/project-ametrix.png",
    problems:
      "The product needed to make complex financial workflows feel clear and approachable while maintaining consistency across a growing set of screens and user journeys.",
    solutions: [
      "Implemented referral tracking",
      "Introduced leadership and collection boards",
      "Supported department-wide and individual job posts",
      "Revamped navigation for ease of use",
      "Created personalized dashboards for relevant information and actions",
    ],
    showcase: [
      {
        title: "The final experience",
        body: "The final experience combines strong visuals with usability, helping users manage workflows effortlessly while reinforcing Ametrix as a modern, AI-first platform.",
        images: ["/assets/project-ametrix.png"],
        layout: "full",
      },
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
    detailTitle:
      "EmLock - EMI-Based Mobile Application for Smart Installment Sales & Device Locking",
    detailLayout: "figma-longform",
    industry: ["Fintech", "Mobile Commerce", "SaaS"],
    serviceCategory: [
      "Mobile App Development",
      "UI/UX Design",
      "SaaS Product Development",
    ],
    servicesProvided: [
      "Market Research",
      "UI UX Design",
      "MVP App Development",
      "Android App Development",
    ],
    scopeOfWork: [
      "Product Discovery",
      "User Research",
      "UI UX Design",
      "Payment Tracking",
      "Mobile Locking System",
      "EMI Management",
      "Kotlin, Asp.Net, Firebase\nREST API, PostgreSQL, \nGoogle Maps API, \nAndroid Device Management APIs ",
    ],
    liveUrl: "",
    links: [],
    summary:
      "EmLock is a SaaS mobile application that helps shop owners sell mobile phones on EMI (installments) and secure collections through an automated device lock/unlock system. See how we designed and developed this app.",
    heroImage: EMLOCK_PROJECT_IMAGE,
    problems: "",
    solutions: [],
    showcase: [],
    detailBlocks: [
      {
        type: "copy",
        title: "About the Project",
        paragraphs: [
          "EmLock is an EMI-based mobile application designed to help mobile retailers sell smartphones through flexible installment plans while reducing the risk of missed payments.",
          "The platform connects two key user groups mobile buyers and mobile shop owners. Buyers can discover nearby shops offering mobile phones on EMI, while shop owners can manage customers, installment plans, payments, and device access from a dedicated system.",
          "The core of EmLock is its Android mobile locking system, which allows authorized shop owners to restrict device access when an EMI payment remains overdue. Once the payment is completed, the device can be unlocked through the authorized process.",
          "From market research and product planning to UI/UX design and MVP Android development, we worked across the complete product lifecycle to turn the concept into a functional digital product and built the Android version natively using Kotlin.",
        ],
      },
      {
        type: "copy",
        title: "Problems",
        paragraphs: [
          "EMI-based mobile phone sales are a popular practice in the retail market, but they come with a major risk for shop owners: customers disappearing or going unreachable before completing their installment payments.",
          "The key problems we identified:",
        ],
        bullets: [
          "Shop owners had no way to track or control a device once a customer defaulted or delayed payment.",
          "Manual installment tracking was error-prone and time-consuming.",
          "There was no structured system for sending payment reminders or notifications to customers.",
          "Customers struggled to find trustworthy, verified EMI shops nearby.",
          "Without a secure, remotely controllable locking mechanism, the entire EMI business model carried a high risk of financial loss.",
        ],
      },
      {
        type: "copy",
        title: "Challenges",
        paragraphs: [
          "Across research, design, and development, we faced several key challenges:",
        ],
        groups: [
          {
            title: "Research Challenges",
            bullets: [
              "Understanding the EMI business model and local mobile retail industry behavior.",
              "Analyzing the needs of two distinct user personas, buyers and sellers at the same time.",
            ],
          },
          {
            title: "Design Challenges",
            bullets: [
              "Translating a complex installment management system into a simple, user-friendly interface.",
              "Designing separate dashboards for two different user types, ensuring a clear and intuitive experience for both.",
            ],
          },
          {
            title: "Development Challenges",
            bullets: [
              "Building a secure and reliable device lock/unlock system in Kotlin that couldn't be bypassed by end-users.",
              "Developing an automated lock-trigger system based on payment deadlines.",
              "Integrating real-time notifications so customers receive alerts before their installment due date.",
              "Making the location-based shop search feature accurate and reliable.",
            ],
          },
        ],
      },
      {
        type: "image",
        image: "/assets/projects/emlock/_mobileapp_project_details_img.png",
        alt: "EmLock mobile application screens and installment management features",
        aspectRatio: "2000 / 1280",
      },
      {
        type: "copy",
        title: "Our Solutions",
        paragraphs: [
          "To address these challenges, we built a complete, secure, and user-friendly system that makes EMI-based mobile sales far more organized and risk-free:",
        ],
        bullets: [
          {
            lead: "Designed a dual-user architecture -",
            body: " separate dashboards and feature sets for End-users and Shop Owners, so each user gets exactly what they need.",
          },
          {
            lead: "Built a smart, location-based shop search feature -",
            body: " allowing customers to easily find verified EMI shops near them.",
          },
          {
            lead: "Created customizable EMI plans -",
            body: " shop owners can set installment amounts, durations, and terms based on their own business needs.",
          },
          {
            lead: "Integrated an automated payment reminder system -",
            body: " customers receive notifications before their installment due date.",
          },
          {
            lead: "Developed an automated device lock/unlock system as the app's core feature -",
            body: " the device automatically locks once a payment deadline (3/7 days) is missed, and unlocks automatically once the payment is made. Customers cannot bypass or unlock the device on their own; it can only be unlocked through the shop owner.",
          },
          {
            lead: "Added a full-payment app disable option -",
            body: " once all installments are paid off, the device becomes fully independent and usable without restriction.",
          },
          {
            lead: "Built a native Android app using Kotlin -",
            body: " ensuring reliable performance, stability, and security.",
          },
        ],
      },
      {
        type: "copy",
        title: "The Final Result",
        paragraphs: [
          "Through our research, design, and development process, EmLock has become a fully functional MVP that makes EMI-based mobile phone sales safer, more organized, and more profitable for retailers.",
        ],
        bullets: [
          "Shop owners can now sell mobile phones on EMI with confidence, knowing the device will automatically lock if a payment is missed.",
          "Customers can easily find trustworthy EMI shops in their area and track their installment details.",
          "The automated reminder and lock/unlock system has significantly improved collection rates and reduced manual overhead for shop owners.",
        ],
        closingParagraphs: [
          "Overall, EmLock demonstrates how a simple, technology-driven solution can transform a traditional business model into something smarter, safer, and more scalable - and we're proud to have been part of this project from concept to launch.",
        ],
      },
    ],
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
    servicesProvided: [
      "Brand Identity",
      "Product Strategy",
      "UI UX Design",
      "Development",
    ],
    scopeOfWork: ["Frontend Development", "Content System", "Launch Website"],
    liveUrl: "https://unigram.unicodeit.com/",
    summary:
      "Unigram is a modern digital platform built to help startups launch quickly and scale with confidence. Our role was to craft a bold brand identity, design a conversion-focused website, and create a flexible layout system for growth.",
    heroImage: "/assets/projects/unigram-home.png",
    problems:
      "The challenge was creating a premium experience that could adapt to multiple use cases without losing clarity, personality, or brand recognition.",
    solutions: [
      "Built a modular page system",
      "Established a clear typographic hierarchy",
      "Created reusable conversion-focused sections",
      "Designed a flexible visual identity",
      "Optimized layouts across screen sizes",
    ],
    showcase: [
      {
        title: "Built to scale",
        body: "Every screen was designed to evolve with the product, allowing seamless updates while maintaining a consistent and recognizable brand presence.",
        images: [
          "/assets/live/detail-derivatives/TympALL88y72elDlJb40JkYTQQ-512.png",
        ],
        layout: "full",
      },
      {
        images: [
          "/assets/live/detail-derivatives/v1cx7ZktJR9SbuHKbFlcz2sy8-512.png",
          "/assets/live/detail-derivatives/K8DDhk1WSJwbXIGXZ6MfaqYYgQ-512.png",
          "/assets/live/detail-derivatives/ZKerwx7BB5CVv1wGMXcJkjterOc-512.png",
        ],
        layout: "grid",
      },
    ],
    tags: ["Brand Identity", "Web Development", "Startup", "Platform: Web"],
    category: "Startup",
    region: "Global",
    year: "2026",
    listing: "/assets/projects/unigram-home.png",
    relatedImage: "/assets/projects/unigram-home.png",
    cover: "/assets/projects/unigram-home.png",
    gallery: [
      "/assets/live/detail-derivatives/TympALL88y72elDlJb40JkYTQQ-512.png",
      "/assets/live/detail-derivatives/v1cx7ZktJR9SbuHKbFlcz2sy8-512.png",
      "/assets/live/detail-derivatives/K8DDhk1WSJwbXIGXZ6MfaqYYgQ-512.png",
      "/assets/live/detail-derivatives/ZKerwx7BB5CVv1wGMXcJkjterOc-512.png",
    ],
  },
  {
    slug: "teamlink",
    title: "Teamlink",
    industry: ["Artificial Intelligence", "SaaS"],
    serviceCategory: ["AI Integration"],
    servicesProvided: [
      "Product Design",
      "UX Strategy",
      "Dashboard Design",
      "Development",
    ],
    scopeOfWork: ["AI Integration", "Frontend Development", "Automation Flows"],
    liveUrl: "https://teamlink.unicodeit.com/",
    summary:
      "Teamlink is an AI-powered platform focused on automating customer interactions and improving operational efficiency. We designed the product interface, crafted the brand system, and built a website that communicates intelligence and simplicity.",
    heroImage: "/assets/live/CXFITVUIZTTvUVvRlGQbsvrVEBc.png",
    problems:
      "Complex AI interactions needed to feel effortless and human while remaining predictable across conversational flows, dashboards, and automated processes.",
    solutions: [
      "Designed conversational UI patterns",
      "Created intuitive automation workflows",
      "Reduced friction across core tasks",
      "Unified dashboards and conversation states",
      "Built a scalable interaction system",
    ],
    showcase: [
      {
        title: "Clear, human automation",
        body: "Teamlink now delivers a powerful yet simple interface that helps businesses automate processes while maintaining a natural and engaging user journey.",
        images: ["/assets/live/yFQSP9qyOahJlwWLTTFBuRkvBzY.png"],
        layout: "full",
      },
      {
        images: [
          "/assets/live/detail-derivatives/KmY2SoTDQGdQqnYr5i7VsUgWK0-512.png",
          "/assets/live/detail-derivatives/VjisRdjvXGF1nGdrHg2D4PiQ4U-512.png",
          "/assets/live/detail-derivatives/GSrkjUMfCIi85Q8yLCxNVl0QNuY-512.png",
          "/assets/live/detail-derivatives/uk8bb3plK9moj1jpt9HVobdVwXs-512.png",
        ],
        layout: "grid",
      },
    ],
    tags: ["AI Integration", "Dashboard", "SaaS Development", "Automation"],
    category: "AI Platform",
    region: "USA",
    year: "2026",
    listing: "/assets/live/a0Wtj8qawEzvxhakjHMoT0DWcQ.png",
    relatedImage: "/assets/live/HbC1fjEUQVC5H6CG4Jg5aY0Q.png",
    cover: "/assets/live/CXFITVUIZTTvUVvRlGQbsvrVEBc.png",
    gallery: [
      "/assets/live/yFQSP9qyOahJlwWLTTFBuRkvBzY.png",
      "/assets/live/detail-derivatives/KmY2SoTDQGdQqnYr5i7VsUgWK0-512.png",
      "/assets/live/detail-derivatives/VjisRdjvXGF1nGdrHg2D4PiQ4U-512.png",
      "/assets/live/detail-derivatives/GSrkjUMfCIi85Q8yLCxNVl0QNuY-512.png",
      "/assets/live/detail-derivatives/uk8bb3plK9moj1jpt9HVobdVwXs-512.png",
    ],
  },
  {
    slug: "cognefy",
    title: "Cognefy",
    industry: ["Technology", "Artificial Intelligence"],
    serviceCategory: ["SaaS Development"],
    servicesProvided: [
      "Product Design",
      "Visual Identity",
      "UI UX Design",
      "Development",
    ],
    scopeOfWork: ["Product Strategy", "Frontend Development", "Design System"],
    liveUrl: "https://cognefy.framer.website/",
    summary:
      "Cognefy is a smart digital solution focused on enhancing productivity through intelligent systems and automation. We led the design direction, built the product experience, and developed a scalable visual identity for long-term growth.",
    heroImage: "/assets/live/VAbarfhoSndjUR0wuoeESsADqnM.png",
    problems:
      "The challenge was balancing advanced functionality with a minimal interface that made complex workflows easy to understand and simple to complete.",
    solutions: [
      "Created structured product layouts",
      "Refined key interactions",
      "Simplified complex workflows",
      "Established a scalable visual system",
      "Maintained consistency across touchpoints",
    ],
    showcase: [
      {
        title: "Designed for clarity",
        body: "Cognefy delivers a refined experience that empowers users to work smarter, with a clean interface that highlights performance and simplicity.",
        images: ["/assets/live/3HsuvYqWBrdgQVfGwzNFjb68.png"],
        layout: "full",
      },
      {
        images: [
          "/assets/live/detail-derivatives/jmpyVIaATFGGd3Z8tRinI8LcUYk-512.png",
          "/assets/live/detail-derivatives/3Istwk6eaRjLvwyqeBbRkYQbS9U-512.png",
          "/assets/live/detail-derivatives/A9FFNqJGq8dg679iTnxqGWsFH7s-512.png",
          "/assets/live/detail-derivatives/qrRXC75dzoYObbQiOo7aYb1m154-512.png",
        ],
        layout: "grid",
      },
    ],
    tags: ["Product Design", "AI Platform", "Web Development", "Platform: Web"],
    category: "Tech",
    region: "Europe",
    year: "2026",
    listing: "/assets/live/IwywHAyPXQK7GUmAMzNEgTszhjA.png",
    relatedImage: "/assets/live/8BCQjUwYkkjnB5EUxkaSlMz3E.png",
    cover: "/assets/live/VAbarfhoSndjUR0wuoeESsADqnM.png",
    gallery: [
      "/assets/live/3HsuvYqWBrdgQVfGwzNFjb68.png",
      "/assets/live/detail-derivatives/jmpyVIaATFGGd3Z8tRinI8LcUYk-512.png",
      "/assets/live/detail-derivatives/3Istwk6eaRjLvwyqeBbRkYQbS9U-512.png",
      "/assets/live/detail-derivatives/A9FFNqJGq8dg679iTnxqGWsFH7s-512.png",
      "/assets/live/detail-derivatives/qrRXC75dzoYObbQiOo7aYb1m154-512.png",
    ],
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export const workListingProjects = projects.filter(
  (project) => project.slug !== "ametrix",
);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
