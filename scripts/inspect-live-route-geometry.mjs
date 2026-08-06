import { chromium } from "playwright";

const routes = process.env.ROUTES?.split(",") ?? ["/works", "/pricing", "/about", "/contact", "/404", "/works/ametrix", "/policy/our-privacy-policy"];
const baseUrl = process.env.BASE_URL ?? "https://aexo.framer.website";
const viewportWidth = Number(process.env.VIEWPORT_WIDTH ?? 1440);
const browser = await chromium.launch({ headless: true });
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: viewportWidth, height: 900 } });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  const result = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("[data-framer-name], [data-section]",)];
    return nodes.map((element) => {
      const name = element.getAttribute("data-framer-name") ?? element.getAttribute("data-section");
      const rect = element.getBoundingClientRect();
      return { name, x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
    }).filter((item) => item.width >= innerWidth * .8 && item.height >= 250 && (item.name?.startsWith("Section") || item.x === 0 || item.name));
  });
  console.log(`\n${route} (${await page.evaluate(() => document.documentElement.scrollHeight)}px)`);
  console.table(result);
  if (process.env.DETAILS === "1") {
    const details = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,p,img")].map((element) => {
      const rect = element.getBoundingClientRect();
      const text = element instanceof HTMLImageElement ? (element.currentSrc.split("/").pop() ?? "image") : (element.textContent?.trim().replace(/\s+/g, " ").slice(0, 72) ?? "");
      return { tag: element.tagName, text, x: Math.round(rect.x * 10) / 10, y: Math.round((rect.y + scrollY) * 10) / 10, width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
    }).filter((item) => item.width >= 300 && item.height >= 20));
    console.table(details);
  }
  await page.close();
}
await browser.close();
