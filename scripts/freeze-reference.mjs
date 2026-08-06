import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const out = new URL("../artifacts/reference-2026-07-13/", import.meta.url);
const routes = ["/", "/works", "/pricing", "/about", "/contact", "/works/ametrix", "/works/notlex", "/works/botwise", "/works/cognefy", "/policy/our-privacy-policy", "/policy/our-terms-conditions", "/404"];
const keyViewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
const homeViewports = [{ width: 1920, height: 1080 }, { width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 1280, height: 800 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 430, height: 932 }, { width: 390, height: 844 }, { width: 375, height: 812 }, { width: 360, height: 800 }];
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
const inventory = { capturedAt: new Date().toISOString(), pages: {}, assets: {} };

for (const route of routes) {
  for (const viewport of keyViewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(`https://aexo.framer.website${route}`, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(1400);
    await page.screenshot({ path: new URL(`${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${viewport.width}x${viewport.height}-full.png`, out).pathname.slice(1), fullPage: true, animations: "disabled" });
    if (viewport.width === 1440) {
      inventory.pages[route] = await page.evaluate(() => ({
        title: document.title,
        text: [...document.querySelectorAll("h1,h2,h3,p,li,button,a")].map((element) => element.textContent?.trim()).filter(Boolean),
        links: [...document.querySelectorAll("a[href]")].map((element) => ({ text: element.textContent?.trim(), href: element.href })),
        forms: [...document.querySelectorAll("input,select,textarea,button")].map((element) => ({ tag: element.tagName, type: element.type, name: element.name, placeholder: element.placeholder, text: element.textContent?.trim() })),
        images: [...document.images].map((image) => ({ src: image.currentSrc || image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight })),
      }));
      for (const image of inventory.pages[route].images) inventory.assets[image.src] = { width: image.width, height: image.height };
    }
    await context.close();
  }
  console.log(`Frozen ${route}`);
}

for (const viewport of homeViewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto("https://aexo.framer.website/", { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: new URL(`home-${viewport.width}x${viewport.height}-viewport.png`, out).pathname.slice(1), animations: "disabled" });
  await context.close();
}

await writeFile(new URL("inventory.json", out), JSON.stringify(inventory, null, 2));
await browser.close();
