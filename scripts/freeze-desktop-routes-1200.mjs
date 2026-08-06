import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const routes = [
  ["home", "/"], ["works", "/works"], ["pricing", "/pricing"], ["about", "/about"], ["contact", "/contact"], ["404", "/404"],
  ["works-ametrix", "/works/ametrix"], ["works-notlex", "/works/notlex"], ["works-botwise", "/works/botwise"], ["works-cognefy", "/works/cognefy"],
  ["policy-our-privacy-policy", "/policy/our-privacy-policy"], ["policy-our-terms-conditions", "/policy/our-terms-conditions"],
];
const out = new URL("../artifacts/reference-desktop-1200/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
for (const [key, route] of routes) {
  await page.goto(`https://aexo.framer.website${route}`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: new URL(`${key}-1200x900-full.png`, out).pathname.slice(1), fullPage: true, animations: "disabled" });
  console.log(`Frozen ${route}`);
}
await browser.close();
