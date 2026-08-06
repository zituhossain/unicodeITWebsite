import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const out = new URL("../artifacts/desktop-inspection/", import.meta.url);
const anchorsOnly = process.argv.includes("--anchors-only");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

for (const width of [1200, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto("https://aexo.framer.website/", { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1400);
  const sections = await page.evaluate(() => [...document.querySelectorAll("[data-framer-name]")]
    .map((element) => {
      const name = element.getAttribute("data-framer-name") ?? "";
      const rect = element.getBoundingClientRect();
      return {
        name,
        tag: element.tagName.toLowerCase(),
        className: element.className,
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    })
    .filter(({ name, width, height }) => name.startsWith("Section") && width > 0 && height > 0));
  await writeFile(new URL(`home-${width}-sections.json`, out), JSON.stringify(sections, null, 2));
  const sectionTrees = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll("[data-framer-name^='Section']")].map((section) => {
    const rootName = section.getAttribute("data-framer-name") ?? "";
    return [rootName, [...section.querySelectorAll(":scope [data-framer-name]")].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        name: element.getAttribute("data-framer-name"),
        className: element.className,
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }).filter(({ width, height }) => width > 0 && height > 0)];
  })));
  await writeFile(new URL(`home-${width}-section-trees.json`, out), JSON.stringify(sectionTrees, null, 2));
  const anchors = await page.evaluate(() => {
    const phrases = ["REAL FEEDBACK.", "FREQUENTLY ASKED", "THINK. DESIGN.", "BRANDS WE'VE BUILT WITH", "CREATED BY"];
    return Object.fromEntries(phrases.map((phrase) => {
      const candidates = [...document.querySelectorAll("h1,h2,h3,p,span")].filter((node) => node.textContent?.toUpperCase().includes(phrase));
      const element = candidates.at(-1);
      const ancestors = [];
      let current = element;
      while (current && ancestors.length < 12) {
        const rect = current.getBoundingClientRect();
        ancestors.push({ tag: current.tagName.toLowerCase(), name: current.getAttribute("data-framer-name"), className: current.className, x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height });
        current = current.parentElement;
      }
      return [phrase, ancestors];
    }));
  });
  await writeFile(new URL(`home-${width}-anchors.json`, out), JSON.stringify(anchors, null, 2));
  if (!anchorsOnly) for (const section of sections) {
    const slug = section.name.replace(/^Section-/, "").replaceAll(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
    await page.locator(`[data-framer-name="${section.name}"]`).first().screenshot({
      path: new URL(`home-${width}-${slug}.png`, out).pathname.slice(1),
      animations: "disabled",
    });
  }
  if (!anchorsOnly) await page.screenshot({
    path: new URL(`home-${width}x900-full.png`, out).pathname.slice(1),
    fullPage: true,
    animations: "disabled",
  });
  await context.close();
}

await browser.close();
