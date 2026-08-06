import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const cases = [
  { width: 1200, height: 900, state: "revealed", reference: new URL("../artifacts/reference-desktop-1200/about-1200x900-full.png", import.meta.url) },
  { width: 1440, height: 900, state: "initial", reference: new URL("../artifacts/reference-2026-07-13/about-1440x900-full.png", import.meta.url) },
];
const namedStates = ["initial", "revealed", "hover", "culture-revealed"];
const out = new URL("../artifacts/about-work/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: edge, headless: true });

function padded(source, width, height) {
  const target = new PNG({ width, height });
  for (let index = 0; index < target.data.length; index += 4) target.data[index + 3] = 255;
  PNG.bitblt(source, target, 0, 0, source.width, source.height, 0, 0);
  return target;
}

for (const test of cases) {
  const context = await browser.newContext({ viewport: { width: test.width, height: test.height }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(`http://localhost:3000/about?motion=paused&aboutState=${test.state}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForLoadState("load");
  await page.waitForTimeout(1600);
  const localUrl = new URL(`about-${test.width}-${test.state}-local.png`, out);
  await page.screenshot({ path: localUrl.pathname.slice(1), fullPage: true, animations: "disabled" });

  const reference = PNG.sync.read(await readFile(test.reference));
  const local = PNG.sync.read(await readFile(localUrl));
  const width = Math.max(reference.width, local.width);
  const height = Math.max(reference.height, local.height);
  const refCanvas = padded(reference, width, height);
  const localCanvas = padded(local, width, height);

  // Ignore only Framer's external fixed hosting badge.
  for (let y = 0; y < height; y++) for (let x = Math.max(0, width - 190); x < width; x++) {
    const offset = (y * width + x) * 4;
    const isBadgeBand = (y >= 650 && y <= 810) || (y >= height - 80);
    if (isBadgeBand) refCanvas.data.set(localCanvas.data.subarray(offset, offset + 4), offset);
  }

  const diff = new PNG({ width, height });
  const pixels = pixelmatch(refCanvas.data, localCanvas.data, diff.data, width, height, { threshold: .12, alpha: .55 });
  await writeFile(new URL(`about-${test.width}-${test.state}-diff.png`, out), PNG.sync.write(diff));
  console.log(`${test.width}x${test.height} [${test.state}]: ref ${reference.height}px / local ${local.height}px / ${((pixels / (width * height)) * 100).toFixed(2)}%`);

  for (const state of namedStates.filter((state) => state !== test.state)) {
    const statePage = await context.newPage();
    await statePage.goto(`http://localhost:3000/about?motion=paused&aboutState=${state}`, { waitUntil: "load", timeout: 30_000 });
    await statePage.waitForFunction(() => [...document.images].every((image) => image.complete));
    await statePage.evaluate((captureState) => {
      const target = captureState === "culture-revealed"
        ? document.querySelector("[data-section='culture']")
        : captureState === "revealed" || captureState === "hover"
          ? document.querySelector("[data-section='team']")
          : null;
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 80);
    }, state);
    if (state === "hover") await statePage.locator("[data-team-card]").first().hover();
    await statePage.waitForTimeout(350);
    await statePage.screenshot({ path: new URL(`about-${test.width}-${state}-local.png`, out).pathname.slice(1), animations: "disabled" });
    await statePage.close();
  }
  await context.close();
}

await browser.close();
