import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const routes = [
  ["home", "/"], ["works", "/works"], ["pricing", "/pricing"], ["about", "/about"], ["contact", "/contact"], ["404", "/404"],
  ["works-ametrix", "/works/ametrix"], ["works-notlex", "/works/notlex"], ["works-botwise", "/works/botwise"], ["works-cognefy", "/works/cognefy"],
  ["policy-our-privacy-policy", "/policy/our-privacy-policy"], ["policy-our-terms-conditions", "/policy/our-terms-conditions"],
];
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
const frozen = new URL("../artifacts/reference-2026-07-13/", import.meta.url);
const out = new URL("../artifacts/routes/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: edge, headless: true });

function padded(source, width, height) {
  const target = new PNG({ width, height });
  for (let i = 0; i < target.data.length; i += 4) target.data[i + 3] = 255;
  PNG.bitblt(source, target, 0, 0, source.width, source.height, 0, 0);
  return target;
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const [key, route] of routes) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle", timeout: 60_000 });
    const localPath = new URL(`${key}-${viewport.width}x${viewport.height}-local.png`, out);
    await page.screenshot({ path: localPath.pathname.slice(1), fullPage: true, animations: "disabled" });
    const reference = PNG.sync.read(await readFile(new URL(`${key}-${viewport.width}x${viewport.height}-full.png`, frozen)));
    const local = PNG.sync.read(await readFile(localPath));
    const width = Math.max(reference.width, local.width);
    const height = Math.max(reference.height, local.height);
    const refCanvas = padded(reference, width, height);
    const localCanvas = padded(local, width, height);
    for (let y = Math.max(0, reference.height - 64); y < reference.height; y++) for (let x = Math.max(0, reference.width - 175); x < reference.width; x++) {
      const offset = (y * width + x) * 4;
      refCanvas.data.set(localCanvas.data.subarray(offset, offset + 4), offset);
    }
    const diff = new PNG({ width, height });
    const pixels = pixelmatch(refCanvas.data, localCanvas.data, diff.data, width, height, { threshold: .12, alpha: .55 });
    await writeFile(new URL(`${key}-${viewport.width}x${viewport.height}-diff.png`, out), PNG.sync.write(diff));
    console.log(`${key} ${viewport.width}x${viewport.height}: ref ${reference.height}px / local ${local.height}px / ${((pixels / (width * height)) * 100).toFixed(2)}%`);
  }
  await context.close();
}
await browser.close();
