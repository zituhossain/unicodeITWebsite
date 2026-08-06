import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const allRoutes = [
  ["home", "/"], ["works", "/works"], ["pricing", "/pricing"], ["about", "/about"], ["contact", "/contact"], ["404", "/404"],
  ["works-ametrix", "/works/ametrix"], ["works-notlex", "/works/notlex"], ["works-botwise", "/works/botwise"], ["works-cognefy", "/works/cognefy"],
  ["policy-our-privacy-policy", "/policy/our-privacy-policy"], ["policy-our-terms-conditions", "/policy/our-terms-conditions"],
];
const routes = process.env.ROUTE ? allRoutes.filter(([, route]) => route === process.env.ROUTE) : allRoutes;
const out = new URL("../artifacts/routes-desktop/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

function padded(source, width, height) {
  const target = new PNG({ width, height });
  for (let index = 0; index < target.data.length; index += 4) target.data[index + 3] = 255;
  PNG.bitblt(source, target, 0, 0, source.width, source.height, 0, 0);
  return target;
}

const widths = process.env.WIDTH ? [Number(process.env.WIDTH)] : [1200, 1440];
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
  for (const [key, route] of routes) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    // Match the frozen live captures: page-load motion has completed, while
    // below-fold scroll reveals remain in their initial state.
    await page.waitForTimeout(1_400);
    const localPath = new URL(`${key}-${width}-local.png`, out);
    await page.screenshot({ path: localPath.pathname.slice(1), fullPage: true, animations: "disabled" });
    const referenceRoot = width === 1200 ? new URL("../artifacts/reference-desktop-1200/", import.meta.url) : new URL("../artifacts/reference-2026-07-13/", import.meta.url);
    const reference = PNG.sync.read(await readFile(new URL(`${key}-${width}x900-full.png`, referenceRoot)));
    const local = PNG.sync.read(await readFile(localPath));
    const canvasWidth = Math.max(reference.width, local.width);
    const canvasHeight = Math.max(reference.height, local.height);
    const refCanvas = padded(reference, canvasWidth, canvasHeight);
    const localCanvas = padded(local, canvasWidth, canvasHeight);
    const diff = new PNG({ width: canvasWidth, height: canvasHeight });
    const pixels = pixelmatch(refCanvas.data, localCanvas.data, diff.data, canvasWidth, canvasHeight, { threshold: .12, alpha: .55 });
    await writeFile(new URL(`${key}-${width}-diff.png`, out), PNG.sync.write(diff));
    console.log(`${key} ${width}: ref ${reference.height}px / local ${local.height}px / ${((pixels / (canvasWidth * canvasHeight)) * 100).toFixed(2)}%`);
  }
  await page.close();
}
await browser.close();
