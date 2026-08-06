export const contactServiceOptions = [
  "Software Development",
  "Mobile App Development",
  "Web Development",
  "AI Integration & Automation",
  "Framer & Webflow",
  "UI UX Design",
] as const;

export type ContactServiceOption = (typeof contactServiceOptions)[number];
