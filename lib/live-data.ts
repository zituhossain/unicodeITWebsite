import { workListingProjects } from "@/data/projects";
import { CALENDLY_URL } from "@/lib/calendly";

export const liveServices = [
  {
    title: "Software Development",
    copy: "Custom software solutions engineered for performance, scalability, and long-term business growth.",
    cta: "Start Your Project",
    icon: "software",
    features: [
      "Custom Software Development",
      "SaaS Application Development",
      "Enterprise Software Solutions",
      "API Development & Integration",
      "Cloud-Based Architecture",
      "MVP Development",
    ],
  },
  {
    title: "Mobile App Development",
    copy: "High-performance mobile apps designed for seamless experiences across iOS and Android devices.",
    cta: "Build Your App",
    icon: "mobile",
    features: [
      "iOS App Development",
      "Android App Development",
      "Cross-Platform Apps",
      "UI/UX for Mobile Apps",
      "API & Backend Integration",
      "App Store Deployment",
    ],
  },
  {
    title: "Custom Web Development",
    copy: "Fast, secure, and scalable websites built to strengthen your online presence and growth.",
    cta: "Build Your Website",
    icon: "web",
    features: [
      "Custom Website Development",
      "Frontend & Backend Development",
      "CMS Development",
      "API & Third-Party Integrations",
      "Performance Optimization",
      "SEO-Friendly Architecture",
    ],
  },
  {
    title: "AI Integration & Automation",
    copy: "AI-powered automation solutions that streamline workflows and improve business productivity.",
    cta: "Automate Your Business",
    icon: "ai",
    features: [
      "AI Chatbot Integration",
      "OpenAI / Claude Integration",
      "Workflow Automation",
      "Business Process Automation",
      "CRM & Email Automation",
      "AI Agents Development",
    ],
  },
  {
    title: "Framer & Webflow",
    copy: "Modern no-code websites crafted for speed, flexibility, and effortless content management.",
    cta: "Launch Your Website",
    icon: "framer",
    features: [
      "Framer Website Development",
      "Webflow Development",
      "CMS Configuration",
      "Responsive Layouts",
      "Custom Animations",
      "SEO Optimization",
    ],
  },
  {
    title: "UI/UX Design",
    copy: "Expert product and UI/UX design services to create intuitive, visually appealing interfaces for web and mobile applications.",
    cta: "Design Your Product",
    icon: "uiux",
    features: [
      "UX Research & Strategy",
      "Wireframes & User Flows",
      "UI Design Systems",
      "Interactive Prototyping",
      "Usability Testing",
      "Design Handoff & Documentation",
    ],
  },
] as const;
export const calLink = CALENDLY_URL;

export const liveNavigation = [
  { label: "Services", href: "/#what-we-do" },
  { label: "Works", href: "/works" },
  // { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const liveWorks = workListingProjects;

export const livePricing = [
  {
    name: "Single project",
    subtitle: "Perfect for focused one-time builds",
    price: "$1,499",
    availability: "2 slot available",
    features: [
      "Custom page design",
      "Responsive across devices",
      "Framer development setup",
      "Fast turnaround delivery",
      "Conversion-focused layout",
      "UX research insights",
      "Strategy onboarding call",
      "Revision rounds included",
    ],
  },
  {
    name: "Growth Retainer",
    subtitle: "Ongoing design and dev support",
    price: "$2,499",
    availability: "2 slot available",
    features: [
      "Unlimited design requests",
      "Continuous product improvements",
      "Priority turnaround time",
      "Dedicated communication channel",
      "Monthly strategy sessions",
      "Design system updates",
      "Performance optimization support",
      "Flexible iteration cycles",
    ],
  },
] as const;

export const liveTestimonials = [
  {
    quote:
      "They understood our vision instantly and delivered a product that feels premium, performs well, and stands out clearly in our market.",
    name: "Alex Morgan",
    role: "Product Lead",
  },
  {
    quote:
      "The process was smooth, communication was clear, and the final outcome exceeded expectations while helping us improve conversions significantly.",
    name: "Sarah Kim",
    role: "Marketing Head",
  },
  {
    quote:
      "Working with them felt effortless, they combined design and strategy perfectly to create an experience that truly connects with our users.",
    name: "Daniel Ross",
    role: "Founder",
  },
  {
    quote:
      "Their attention to detail and structured approach helped us launch faster while maintaining a high level of quality across the product.",
    name: "Emily Carter",
    role: "UX Manager",
  },
  {
    quote:
      "They didn’t just design, they brought clarity to our ideas and transformed them into a product that feels polished and scalable.",
    name: "Ryan Patel",
    role: "Startup Founder",
  },
  {
    quote:
      "From start to finish, the team delivered consistently, helping us elevate our brand and create a much stronger digital presence overall.",
    name: "Olivia Bennett",
    role: "Brand Manager",
  },
] as const;

export const contactSocialProofCard = {
  text: "Why risk your business with the wrong partner? Partner with experts who deliver real business value and long-term growth.",
  trustText: "Trusted by 100+ founders & growing global brands",
  avatarImage: {
    src: "/assets/live/contact_client_img.png",
    alt: "A group of Aexo clients",
  },
} as const;

export const liveFaqs = [
  [
    "What software development services does Unicode IT provide?",
    "Unicode IT provides end-to-end digital product development services, including custom software development, SaaS development, web development, mobile app development, AI integration and automation, UI/UX design, and Framer & Webflow development. We work with businesses and startups to design, build, launch, and improve scalable digital products.",
  ],
  [
    "How much does custom software development cost?",
    "Custom software development costs vary based on the product scope, number of features, UI/UX requirements, integrations, technology stack, and project complexity. A focused MVP usually requires a smaller investment than a complex SaaS or enterprise platform. Unicode IT reviews your requirements first and provides a project-specific estimate rather than using a one-size-fits-all price.",
  ],
  [
    "How long does it take to build a website, mobile app, or custom software product?",
    "The development timeline depends on the project's complexity and scope. A focused website or MVP can often be completed faster than a large SaaS platform or custom business system. Our process typically covers discovery, UI/UX design, development, testing, deployment, and post-launch improvements, with the timeline defined after reviewing the requirements.",
  ],
  [
    "Does Unicode IT develop mobile apps for both Android and iOS?",
    "Yes. Unicode IT provides Android and iOS mobile app development, including cross-platform applications. We can handle UI/UX design, frontend development, backend APIs, authentication, database integration, third-party services, testing, and deployment as part of the mobile app development process.",
  ],
  [
    "Can Unicode IT integrate AI and automation into my existing business or software?",
    "Yes. We provide AI integration and automation services for both existing systems and new products. Solutions can include AI chatbots, OpenAI or Claude integrations, AI agents, workflow automation, CRM and email automation, intelligent data processing, and custom API-based AI features.",
  ],
  [
    "Does Unicode IT build SaaS platforms and MVPs for startups?",
    "Yes. Unicode IT helps startups and businesses develop SaaS platforms, MVPs, and custom web applications from initial product planning through launch. Depending on the project, this can include product discovery, UI/UX design, frontend and backend development, APIs, databases, integrations, testing, and deployment.",
  ],
  [
    "What technologies does Unicode IT use?",
    "We select technologies based on each project's performance, scalability, maintainability, and business requirements. Our technology stack can include Next.js, React, Node.js, Laravel, Flutter, React Native, PostgreSQL, MySQL, MongoDB, WordPress, Framer, Webflow, and AI APIs such as OpenAI and Claude.",
  ],
  [
    "Does Unicode IT provide support after a project is launched?",
    "es. We can provide post-launch software maintenance and support for websites, SaaS products, mobile apps, and custom software. Depending on the engagement, this may include bug fixes, performance improvements, security updates, new features, integrations, infrastructure improvements, and ongoing product development.",
  ],
] as const;

export type LiveTeamMember = {
  name: string;
  role: string;
  portrait: string;
  links: {
    instagram: string;
    x: string;
    linkedin: string;
  };
};

const teamLinks = {
  instagram: "https://instagram.com/",
  x: "https://x.com/",
  linkedin: "https://linkedin.com/",
} as const;

export const liveTeam: readonly LiveTeamMember[] = [
  {
    name: "Alex Sameni",
    role: "Cofounder",
    portrait: "/assets/live/Ow5uP2GsY6Pb5iLhJWLgwW3L6I.png",
    links: teamLinks,
  },
  {
    name: "Paul Johnson",
    role: "Cofounder",
    portrait: "/assets/live/PiSLZ9hYjm5LPW10dYS7Wo9I.png",
    links: teamLinks,
  },
  {
    name: "Emily Cole",
    role: "Product Designer",
    portrait: "/assets/live/7AnuLUsWlaYUhFeMcOAue3I9g.png",
    links: teamLinks,
  },
  {
    name: "Liam Foster",
    role: "Frontend Developer",
    portrait: "/assets/live/cNuIqk17JCcsQ1vlxxuBd1XL9d0.png",
    links: teamLinks,
  },
  {
    name: "Lucas Meyer",
    role: "Motion Designer",
    portrait: "/assets/live/HV8sExcKkE07O3LPnLQqXeYJjc.png",
    links: teamLinks,
  },
  {
    name: "Chloe Laurent",
    role: "Project Manager",
    portrait: "/assets/live/iqFKNaD7Ng6kt39JY4ikK8yuLI.png",
    links: teamLinks,
  },
  {
    name: "Alex Roy",
    role: "UI Designer",
    portrait: "/assets/live/7qwUXqAZmyqdG1eENimWt7cUD4.png",
    links: teamLinks,
  },
  {
    name: "Ben Johns",
    role: "UI Designer",
    portrait: "/assets/live/jgJSSH9oenHiziC1jk5wi8eBrwg.png",
    links: teamLinks,
  },
] as const;
