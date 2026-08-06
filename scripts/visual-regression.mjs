import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const viewports = [{ width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 430, height: 932 }, { width: 390, height: 844 }];
const out = new URL("../artifacts/visual/", import.meta.url);
const frozen = new URL("../artifacts/reference-2026-07-13/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: edge, headless: true });

for (const viewport of viewports) {
  const key = `${viewport.width}x${viewport.height}`;
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.__AEXO_MOTION__?.pause());
  await page.screenshot({ path: new URL(`local-${key}.png`, out).pathname.slice(1), animations: "disabled" });
  const reference = PNG.sync.read(await readFile(new URL(`home-${key}-viewport.png`, frozen)));
  const local = PNG.sync.read(await readFile(new URL(`local-${key}.png`, out)));
  // The Framer hosting badge is deliberately outside the reproduced site UI.
  for (let y = Math.max(0, viewport.height - 64); y < viewport.height; y++) {
    for (let x = Math.max(0, viewport.width - 175); x < viewport.width; x++) {
      const offset = (y * viewport.width + x) * 4;
      reference.data.set(local.data.subarray(offset, offset + 4), offset);
    }
  }
  await writeFile(new URL(`reference-${key}.png`, out), PNG.sync.write(reference));
  const diff = new PNG({ width: viewport.width, height: viewport.height });
  const pixels = pixelmatch(reference.data, local.data, diff.data, viewport.width, viewport.height, { threshold: .12, alpha: .55 });
  await writeFile(new URL(`diff-${key}.png`, out), PNG.sync.write(diff));
  console.log(`${key}: ${((pixels / (viewport.width * viewport.height)) * 100).toFixed(2)}% differing pixels`);
  await context.close();
}
await browser.close();
