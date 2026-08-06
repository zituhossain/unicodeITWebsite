export const technologyCategories = [
  "All",
  "CMS",
  "Back-End",
  "Mobile",
  "AI",
  "Database",
  "DevOps",
  "Front-End",
  "Design",
] as const;

export type TechnologyCategory = (typeof technologyCategories)[number];
export type TechnologyFilter = Exclude<TechnologyCategory, "All">;

export type Technology = {
  name: string;
  category: TechnologyFilter;
  icon: string;
};

const defaultIcon = "/assets/live/technology-placeholder.svg";
const aws = "/assets/stack/aws.svg";
const Elastic = "/assets/stack/Elastic.svg";
const firebase = "/assets/stack/firebase.svg";
const flutter = "/assets/stack/flutter.svg";
const hetzner = "/assets/stack/hetzner.svg";
const javascript = "/assets/stack/javascript.svg";
const mongodb = "/assets/stack/mongodb.svg";
const mysql = "/assets/stack/mysql.svg";
const wordpress = "/assets/stack/wordpress.svg";
const next = "/assets/stack/next.js.svg";
const nodejs = "/assets/stack/nodejs.svg";
const nuxt = "/assets/stack/nuxt.js.svg";
const laravel = "/assets/stack/laravel.svg";
const postgresql = "/assets/stack/postgresql.svg";
const react_native = "/assets/stack/react_native.svg";
const react = "/assets/stack/react.js.svg";
const redis = "/assets/stack/redis.svg";
const strapi_cms = "/assets/stack/strapi_cms.svg";
const supabase = "/assets/stack/supabase.svg";
const typescript = "/assets/stack/typescript.svg";
const vue = "/assets/stack/vue.js.svg";
const webflow = "/assets/stack/webflow.svg";
const framer = "/assets/stack/framer.svg";
const kotlin = "/assets/stack/kotlin.svg";
const swift = "/assets/stack/swift.svg";
const python = "/assets/stack/python.svg";
const chat = "/assets/stack/chat-gpt.svg";
const figma = "/assets/stack/figma.svg";
const claude = "/assets/stack/claude.svg";
const gemini = "/assets/stack/gemini.svg";

export const technologies: Technology[] = [
  { name: "AWS", category: "DevOps", icon: aws },
  { name: "Elastic", category: "Database", icon: Elastic },
  { name: "Firebase", category: "Database", icon: firebase },
  { name: "Flutter", category: "Mobile", icon: flutter },
  { name: "Hetzner", category: "DevOps", icon: hetzner },
  { name: "JavaScript", category: "Front-End", icon: javascript },
  { name: "MongoDB", category: "Database", icon: mongodb },
  { name: "MySQL", category: "Database", icon: mysql },
  { name: "WordPress", category: "CMS", icon: wordpress },
  { name: "Next.js", category: "Front-End", icon: next },
  { name: "Node.js", category: "Back-End", icon: nodejs },
  { name: "Nuxt.js", category: "Front-End", icon: nuxt },
  { name: "Laravel", category: "Back-End", icon: laravel },
  { name: "PostgreSQL", category: "Database", icon: postgresql },
  { name: "React Native", category: "Mobile", icon: react_native },
  { name: "React", category: "Front-End", icon: react },
  { name: "Redis", category: "Database", icon: redis },
  { name: "Strapi", category: "CMS", icon: strapi_cms },
  { name: "Supabase", category: "Database", icon: supabase },
  { name: "TypeScript", category: "Front-End", icon: typescript },
  { name: "Vue.js", category: "Front-End", icon: vue },
  { name: "Webflow", category: "CMS", icon: webflow },
  { name: "Framer", category: "Design", icon: framer },
  { name: "Kotlin", category: "Mobile", icon: kotlin },
  { name: "Swift", category: "Mobile", icon: swift },
  { name: "Python", category: "Back-End", icon: python },
  { name: "OpenAI", category: "AI", icon: chat },
  { name: "Figma", category: "Design", icon: figma },
  { name: "Claude", category: "AI", icon: claude },
  { name: "Gemini", category: "AI", icon: gemini },
];
