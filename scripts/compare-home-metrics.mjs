import { chromium } from "playwright";

const labels = [
  "Building brands is never easy.",
  "CRAFTED TO GROW YOUR BRAND",
  "WHY WE",
  "COMPARE WHAT TRULY MATTERS",
  "REAL FEEDBACK.",
  "FREQUENTLY ASKED",
  "READY TO SCALE NOW",
];

const browser = await chromium.launch({ headless: true });
for (const width of [1200, 1440]) {
  for (const [name, url] of [["live", "https://aexo.framer.website/"], ["local", "http://localhost:3000/"]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    const metrics = await page.evaluate((texts) => {
      const all = [...document.querySelectorAll("h1,h2,h3,p,span")];
      return Object.fromEntries(texts.map((text) => {
        const needle = text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        const node = all.find((element) => {
          const value = element.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? "";
          return value === needle;
        });
        if (!node) return [text, null];
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return [text, {
          tag: node.tagName,
          x: box.x,
          y: box.y + scrollY,
          width: box.width,
          height: box.height,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
        }];
      }));
    }, labels);
    console.log(JSON.stringify({ width, name, metrics }, null, 2));
    await page.close();
  }
}
await browser.close();
