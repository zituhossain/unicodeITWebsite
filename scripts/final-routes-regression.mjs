import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const routes = [
  ["404", "/404"],
  ["policy-our-privacy-policy", "/policy/our-privacy-policy"],
  ["policy-our-terms-conditions", "/policy/our-terms-conditions"],
];
const output = new URL("../artifacts/final-routes/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: edge, headless: true });

function canvas(source, width, height) {
  const result = new PNG({ width, height });
  result.data.fill(255);
  PNG.bitblt(source, result, 0, 0, source.width, source.height, 0, 0);
  return result;
}

for (const width of [1200, 1440]) for (const [name, route] of routes) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`http://localhost:3000${route}?motion=paused`, { waitUntil: "load" });
  await page.waitForTimeout(650);
  const ownedEnd = await page.evaluate(() => {
    const element = document.querySelector('[data-section="policy-main"]');
    return element ? Math.ceil(element.getBoundingClientRect().bottom + scrollY) : null;
  });
  const localPath = new URL(`${name}-${width}-local.png`, output);
  await page.screenshot({ path: localPath.pathname.slice(1), fullPage: true, animations: "disabled" });

  const referencePath = new URL(width === 1200
    ? `../artifacts/reference-desktop-1200/${name}-1200x900-full.png`
    : `../artifacts/reference-2026-07-13/${name}-1440x900-full.png`, import.meta.url);
  const reference = PNG.sync.read(await readFile(referencePath));
  const local = PNG.sync.read(await readFile(localPath));
  const w = Math.max(reference.width, local.width);
  const h = Math.max(reference.height, local.height);
  const refCanvas = canvas(reference, w, h);
  const localCanvas = canvas(local, w, h);

  for (let y = 0; y < h; y++) for (let x = Math.max(0, w - 190); x < w; x++) {
    if ((y >= 650 && y <= 820) || y >= h - 80) {
      const offset = (y * w + x) * 4;
      refCanvas.data.set(localCanvas.data.subarray(offset, offset + 4), offset);
    }
  }

  const diff = new PNG({ width: w, height: h });
  const pixels = pixelmatch(refCanvas.data, localCanvas.data, diff.data, w, h, { threshold: .12, alpha: .55 });
  await writeFile(new URL(`${name}-${width}-diff.png`, output), PNG.sync.write(diff));
  let owned = "";
  if (ownedEnd) {
    const ownedPixels = pixelmatch(
      refCanvas.data.subarray(0, ownedEnd * w * 4),
      localCanvas.data.subarray(0, ownedEnd * w * 4),
      null,
      w,
      ownedEnd,
      { threshold: .12 },
    );
    owned = ` / owned ${((ownedPixels / (w * ownedEnd)) * 100).toFixed(2)}% through ${ownedEnd}px`;
  }
  console.log(`${width} ${name}: ref ${reference.height}px / local ${local.height}px / ${((pixels / (w * h)) * 100).toFixed(2)}%${owned}`);
  await page.close();
}

await browser.close();
