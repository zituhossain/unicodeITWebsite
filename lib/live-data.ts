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
    "Who is this agency best suited for?",
    "We work best with ambitious startups, technology companies, and growing brands that value thoughtful design, clear strategy, and fast execution.",
  ],
  [
    "What tools and technologies do you use?",
    "Our core toolkit includes Figma, Framer, Webflow, modern frontend technologies, and collaborative tools selected around each project.",
  ],
  [
    "What services do you offer exactly?",
    "We provide product design, web development, branding, landing pages, UI/UX design, motion design, and Framer development.",
  ],
  [
    "Can I request revisions during the project?",
    "Yes. Every engagement includes structured feedback and revision rounds so the final result is aligned and production ready.",
  ],
  [
    "Do you offer ongoing design support plans?",
    "Yes. Our Growth Retainer provides continuous design and development support, priority turnaround, and regular strategy sessions.",
  ],
  [
    "Do you help with strategy and planning?",
    "Yes. Discovery, research, positioning, user flows, scope, and launch planning are built into our process.",
  ],
  [
    "How do we get started with you?",
    "Book an introductory call or send the project details through our contact form. We will respond with the next steps within one business day.",
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
