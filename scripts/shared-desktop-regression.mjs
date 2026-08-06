import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const output = new URL("../artifacts/shared-desktop/", import.meta.url);
await mkdir(output, { recursive: true });

function blend(reference, local) {
  const result = new PNG({ width: reference.width, height: reference.height });
  for (let index = 0; index < result.data.length; index += 4) {
    result.data[index] = (reference.data[index] + local.data[index]) >> 1;
    result.data[index + 1] = (reference.data[index + 1] + local.data[index + 1]) >> 1;
    result.data[index + 2] = (reference.data[index + 2] + local.data[index + 2]) >> 1;
    result.data[index + 3] = 255;
  }
  return result;
}

const browser = await chromium.launch({ executablePath: edge, headless: true });
for (const width of [1200, 1440]) {
  const captures = {};
  for (const target of ["reference", "local"]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const isReference = target === "reference";
    await page.goto(isReference
      ? "https://aexo.framer.website/policy/our-privacy-policy"
      : "http://localhost:3000/policy/our-privacy-policy?motion=paused&shared=revealed", {
      waitUntil: isReference ? "networkidle" : "load",
      timeout: 60_000,
    });
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1600);
    if (isReference) {
      await page.locator('a[href*="framer.com"]').evaluateAll((elements) => elements.forEach((element) => { element.style.display = "none"; }));
    } else {
      await page.locator("[data-site-header]").evaluateAll((elements) => elements.forEach((element) => { element.style.display = "none"; }));
    }
    const cta = isReference
      ? page.locator('[data-framer-name="Desktop"]').filter({ hasText: "Ready to get started?" }).first()
      : page.locator('[data-section="cta"]');
    const footer = isReference
      ? page.locator('[data-framer-name="Desktop"]').filter({ hasText: "contact@aexo.com" }).last()
      : page.locator('[data-section="footer"]');
    captures[target] = {};
    for (const [name, locator] of [["cta", cta], ["footer", footer]]) {
      const path = new URL(`${name}-${width}-${target}.png`, output);
      await locator.screenshot({ path: path.pathname.slice(1), animations: "disabled" });
      captures[target][name] = path;
    }
    await page.close();
  }

  for (const section of ["cta", "footer"]) {
    const reference = PNG.sync.read(await readFile(captures.reference[section]));
    const local = PNG.sync.read(await readFile(captures.local[section]));
    const diff = new PNG({ width, height: reference.height });
    const pixels = pixelmatch(reference.data, local.data, diff.data, width, reference.height, { threshold: .12, alpha: .55 });
    await writeFile(new URL(`${section}-${width}-diff.png`, output), PNG.sync.write(diff));
    await writeFile(new URL(`${section}-${width}-overlay.png`, output), PNG.sync.write(blend(reference, local)));

    if (section === "cta") {
      const coreHeight = 700;
      const corePixels = pixelmatch(
        reference.data.subarray(0, width * coreHeight * 4),
        local.data.subarray(0, width * coreHeight * 4),
        null,
        width,
        coreHeight,
        { threshold: .12 },
      );
      console.log(`${width} CTA: full ${((pixels / (width * reference.height)) * 100).toFixed(2)}% / normalized core ${((corePixels / (width * coreHeight)) * 100).toFixed(2)}%`);
    } else {
      console.log(`${width} footer: ${((pixels / (width * reference.height)) * 100).toFixed(2)}%`);
    }
  }
}

await browser.close();
