import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const output = resolve("artifacts/final-integration/initial-views");
const requestedRoutes = new Set((process.env.ROUTES || "").split(",").filter(Boolean));
const localOrigin = process.env.LOCAL_ORIGIN || "http://localhost:3000";
const routes = [
  ["home", "/"],
  ["works", "/works"],
  ["pricing", "/pricing"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["404", "/404"],
  ["works-ametrix", "/works/ametrix"],
  ["works-notlex", "/works/notlex"],
  ["works-botwise", "/works/botwise"],
  ["works-cognefy", "/works/cognefy"],
  ["policy-our-privacy-policy", "/policy/our-privacy-policy"],
  ["policy-our-terms-conditions", "/policy/our-terms-conditions"],
].filter(([, route]) => requestedRoutes.size === 0 || requestedRoutes.has(route));

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: edge, headless: true });
const report = { generatedAt: new Date().toISOString(), checkpointMilliseconds: 1_300, captures: [] };

async function ready(page, url, live) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (live) {
    await page.addStyleTag({
      content: "#__framer-badge-container, #__framer-badge-container__{display:none!important;visibility:hidden!important}",
    }).catch(() => undefined);
  }
  await page.evaluate(async () => {
    const cap = (promise, milliseconds) => Promise.race([
      promise.catch(() => undefined),
      new Promise((resolveWait) => setTimeout(resolveWait, milliseconds)),
    ]);
    await cap(document.fonts.ready, 5_000);
    const visibleImages = [...document.images].filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.bottom >= -innerHeight && rect.top <= innerHeight * 2;
    });
    visibleImages.forEach((image) => { image.loading = "eager"; });
    await cap(Promise.all(visibleImages.map((image) => {
      if (image.complete) return image.decode?.().catch(() => undefined) ?? Promise.resolve();
      return new Promise((resolveImage) => {
        image.addEventListener("load", resolveImage, { once: true });
        image.addEventListener("error", resolveImage, { once: true });
      });
    })), 8_000);
  });
  await page.evaluate(() => new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
}

try {
  for (const width of [1200, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
      colorScheme: "dark",
    });
    for (const [key, route] of routes) {
      const live = await context.newPage();
      const local = await context.newPage();
      await Promise.all([
        ready(live, `https://aexo.framer.website${route}`, true),
        ready(local, `${localOrigin}${route}`, false),
      ]);
      await Promise.all([live.waitForTimeout(1_300), local.waitForTimeout(1_300)]);
      const [referenceBuffer, localBuffer] = await Promise.all([
        live.screenshot({ animations: "allow", type: "png" }),
        local.screenshot({ animations: "allow", type: "png" }),
      ]);
      const reference = PNG.sync.read(referenceBuffer);
      const implementation = PNG.sync.read(localBuffer);
      const diff = new PNG({ width, height: 900 });
      const mismatchPixels = pixelmatch(
        reference.data,
        implementation.data,
        diff.data,
        width,
        900,
        { threshold: .12, alpha: .55 },
      );
      const stem = `${key}-${width}x900`;
      await Promise.all([
        writeFile(resolve(output, `${stem}-reference.png`), referenceBuffer),
        writeFile(resolve(output, `${stem}-local.png`), localBuffer),
        writeFile(resolve(output, `${stem}-diff.png`), PNG.sync.write(diff)),
      ]);
      const mismatchPercent = Number((mismatchPixels / (width * 900) * 100).toFixed(4));
      report.captures.push({ route, width, height: 900, mismatchPixels, mismatchPercent });
      console.log(`${width}px ${route}: ${mismatchPercent.toFixed(4)}%`);
      await Promise.all([live.close(), local.close()]);
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));
