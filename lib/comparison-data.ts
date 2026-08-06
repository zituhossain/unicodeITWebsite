export type ComparisonIcon = "warning" | "negative" | "positive";

export type ComparisonValue = {
  icon: ComparisonIcon;
  text: string;
};

export type ComparisonRow = {
  label: string;
  freelancers: ComparisonValue;
  agencies: ComparisonValue;
  unicodeIt: ComparisonValue;
};

export const comparisonRows: readonly ComparisonRow[] = [
  {
    label: "Discovery & Strategy",
    freelancers: { icon: "warning", text: "Limited planning" },
    agencies: { icon: "positive", text: "Standard process" },
    unicodeIt: {
      icon: "positive",
      text: "Business-first product strategy",
    },
  },
  {
    label: "Product Thinking",
    freelancers: { icon: "negative", text: "Missing" },
    agencies: { icon: "warning", text: "Limited" },
    unicodeIt: { icon: "positive", text: "Strategic product approach" },
  },
  {
    label: "Development Quality",
    freelancers: { icon: "warning", text: "Basic implementation" },
    agencies: { icon: "positive", text: "Reliable development" },
    unicodeIt: {
      icon: "positive",
      text: "Scalable, future-ready architecture",
    },
  },
  {
    label: "Design Quality",
    freelancers: { icon: "warning", text: "Templates & AI based" },
    agencies: { icon: "positive", text: "Good but generic" },
    unicodeIt: { icon: "positive", text: "Research-driven UX" },
  },
  {
    label: "Customization",
    freelancers: { icon: "warning", text: "Limited" },
    agencies: { icon: "warning", text: "Standard customization" },
    unicodeIt: { icon: "positive", text: "Fully custom solutions" },
  },
  {
    label: "AI & Automation",
    freelancers: { icon: "warning", text: "Rarely included" },
    agencies: { icon: "warning", text: "AI available on request" },
    unicodeIt: {
      icon: "positive",
      text: "Built-in AI integration & automation",
    },
  },
  {
    label: "Delivery Speed",
    freelancers: { icon: "positive", text: "Fast execution" },
    agencies: { icon: "positive", text: "Structured timelines" },
    unicodeIt: { icon: "positive", text: "Launch-ready delivery" },
  },
  {
    label: "Business Impact",
    freelancers: { icon: "negative", text: "Task-focused" },
    agencies: { icon: "warning", text: "Project completed" },
    unicodeIt: { icon: "positive", text: "Growth-focused solutions" },
  },
  {
    label: "Long-term Value",
    freelancers: { icon: "warning", text: "Project-based engagement" },
    agencies: { icon: "warning", text: "Engagement-based" },
    unicodeIt: { icon: "positive", text: "Long-term growth partner" },
  },
  {
    label: "Post-Launch Support",
    freelancers: { icon: "warning", text: "Depends on availability" },
    agencies: { icon: "warning", text: "Contract-based support" },
    unicodeIt: { icon: "positive", text: "Long-term partnership" },
  },
];