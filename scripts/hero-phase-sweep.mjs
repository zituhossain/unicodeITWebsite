import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const localOrigin = process.env.LOCAL_ORIGIN ?? "http://localhost:3000";
const referenceImage = process.env.REFERENCE_IMAGE;
const width = Number(process.env.WIDTH ?? 1200);
const browser = await chromium.launch({ executablePath: edge, headless: true });
const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
const referencePage = await context.newPage();
const localPage = await context.newPage();

async function decode(page) {
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 5_000))]);
    await Promise.race([
      Promise.all([...document.images].map((image) => image.decode?.().catch(() => undefined))),
      new Promise((resolve) => setTimeout(resolve, 8_000)),
    ]);
  });
}

try {
  await Promise.all([
    referenceImage ? Promise.resolve() : referencePage.goto("https://aexo.framer.website/", { waitUntil: "domcontentloaded" }),
    localPage.goto(`${localOrigin}/?motion=paused&state=revealed`, { waitUntil: "domcontentloaded" }),
  ]);
  if (!referenceImage) await referencePage.addStyleTag({ content: "#__framer-badge-container, #__framer-badge-container__{display:none!important}" }).catch(() => undefined);
  await Promise.all([referenceImage ? Promise.resolve() : decode(referencePage), decode(localPage)]);
  await localPage.waitForFunction(() => document.documentElement.dataset.motionReady === "true", undefined, { timeout: 15_000 });
  await localPage.evaluate(() => window.__AEXO_MOTION__?.seek(1.3));
  if (!referenceImage) await referencePage.waitForTimeout(1_300);
  const reference = PNG.sync.read(referenceImage ? await readFile(referenceImage) : await referencePage.screenshot({ type: "png", animations: "allow" }));
  const results = [];
  for (let index = 0; index <= 40; index += 1) {
    const phase = index * .0025;
    await localPage.evaluate((value) => window.__AEXO_MOTION__?.setLoopPhase("hero-art", value), phase);
    await localPage.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const local = PNG.sync.read(await localPage.screenshot({ type: "png", animations: "allow" }));
    const mismatchPixels = pixelmatch(reference.data, local.data, null, width, 900, { threshold: .12 });
    results.push({ phase, degrees: phase * 360, mismatchPercent: mismatchPixels / (width * 9) });
  }
  console.log(JSON.stringify({
    snapshot: await localPage.evaluate(() => window.__AEXO_MOTION__?.snapshot()),
    transform: await localPage.locator("[data-hero-shape='left']").evaluate((node) => getComputedStyle(node).transform),
  }, null, 2));
  results.sort((a, b) => a.mismatchPercent - b.mismatchPercent);
  console.log(JSON.stringify(results.slice(0, 10), null, 2));
} finally {
  await browser.close();
}
