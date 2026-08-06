import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const out = new URL("../artifacts/desktop-inspection/local/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const width of [1200, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const selectors = {
    hero: "main > section:nth-of-type(1)",
    works: "main > section:nth-of-type(2)",
    partners: "#partners",
    intro: "#services",
    selected: "#works",
    brands: "[data-brand-story]",
    services: "#what-we-do",
    benefits: "#benefits",
    comparison: "#comparison",
    stats: "[data-section='stats']",
    tools: "[data-section='tools']",
    pricing: "[data-section='pricing']",
    process: "[data-section='process']",
    testimonials: "[data-section='testimonials']",
    faq: "[data-section='faq']",
    cta: "[data-section='cta']",
    footer: "[data-section='footer']",
  };
  for (const [name, selector] of Object.entries(selectors)) {
    const locator = page.locator(selector).first();
    await locator.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(1100);
    await locator.screenshot({ animations: "disabled", path: new URL(`home-${width}-${name}.png`, out).pathname.slice(1) });
  }
  await page.close();
}

await browser.close();
