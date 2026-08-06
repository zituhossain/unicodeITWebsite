import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const localOrigin = process.env.LOCAL_ORIGIN ?? "http://localhost:3000";
const output = resolve("artifacts/final-integration/hero-initial-corrected");
const checkpointMilliseconds = 1_300;

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: edge, headless: true });
const report = { generatedAt: new Date().toISOString(), checkpointMilliseconds, localOrigin, captures: [] };

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
    const images = [...document.images].filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.bottom >= -innerHeight && rect.top <= innerHeight * 2;
    });
    images.forEach((image) => { image.loading = "eager"; });
    await cap(Promise.all(images.map((image) => image.decode?.().catch(() => undefined))), 8_000);
  });
  await page.evaluate(() => new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
}

function geometryScript() {
  const rect = (selector) => {
    const node = document.querySelector(selector);
    if (!node) return null;
    const value = node.getBoundingClientRect();
    return { x: value.x, y: value.y, width: value.width, height: value.height };
  };
  const style = (selector) => {
    const node = document.querySelector(selector);
    if (!node) return null;
    const value = getComputedStyle(node);
    return { opacity: value.opacity, transform: value.transform };
  };
  return {
    hero: rect("[data-section='hero']"),
    trust: rect("[data-hero='trust']"),
    heading: rect("[data-hero='heading']"),
    description: rect("[data-hero='description']"),
    buttons: rect("[data-hero='buttons']"),
    skills: rect("[data-hero='skills']"),
    leftArt: style("[data-hero-shape='left']"),
    rightArt: style("[data-hero-shape='right']"),
    skillsTrack: style("[data-hero-skills-track]"),
  };
}

try {
  for (const width of [1200, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
      colorScheme: "dark",
    });
    const referencePage = await context.newPage();
    const localPage = await context.newPage();
    await Promise.all([
      ready(referencePage, "https://aexo.framer.website/", true),
      ready(localPage, `${localOrigin}/`, false),
    ]);
    await Promise.all([
      referencePage.waitForTimeout(checkpointMilliseconds),
      localPage.waitForTimeout(checkpointMilliseconds),
    ]);
    const [referenceBuffer, localBuffer, referenceGeometry, localGeometry] = await Promise.all([
      referencePage.screenshot({ animations: "allow", type: "png" }),
      localPage.screenshot({ animations: "allow", type: "png" }),
      referencePage.evaluate(geometryScript),
      localPage.evaluate(geometryScript),
    ]);
    const reference = PNG.sync.read(referenceBuffer);
    const implementation = PNG.sync.read(localBuffer);
    const diff = new PNG({ width, height: 900 });
    const mismatchPixels = pixelmatch(reference.data, implementation.data, diff.data, width, 900, {
      threshold: .12,
      alpha: .55,
    });
    const mismatchPercent = Number((mismatchPixels / (width * 900) * 100).toFixed(4));
    const stem = `home-${width}x900`;
    await Promise.all([
      writeFile(resolve(output, `${stem}-reference.png`), referenceBuffer),
      writeFile(resolve(output, `${stem}-local.png`), localBuffer),
      writeFile(resolve(output, `${stem}-diff.png`), PNG.sync.write(diff)),
    ]);
    report.captures.push({ width, height: 900, mismatchPixels, mismatchPercent, referenceGeometry, localGeometry });
    console.log(`${width}px /: ${mismatchPercent.toFixed(4)}%`);
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));
