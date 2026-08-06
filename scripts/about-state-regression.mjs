import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const output = new URL("../artifacts/about-states/", import.meta.url);
const states = ["initial", "revealed", "hover", "culture-revealed"];
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ executablePath: edge, headless: true });

async function settle(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => document.fonts.status === "loaded");
  await page.waitForTimeout(900);
}

async function position(page, state, local) {
  if (state === "initial") {
    await page.evaluate(() => window.scrollTo(0, 0));
    return;
  }

  if (local) {
    const selector = state === "culture-revealed" ? "[data-section='culture']" : "[data-section='team']";
    await page.evaluate((targetSelector) => {
      const section = document.querySelector(targetSelector);
      const target = section?.querySelector("h2");
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 125);
    }, selector);
  } else {
    const label = state === "culture-revealed" ? "Culture That" : "Meet the team";
    await page.evaluate((text) => {
      const target = [...document.querySelectorAll("h1,h2,h3,p,span")].find((element) => element.textContent?.trim().startsWith(text));
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 125);
    }, label);
  }

  await page.waitForTimeout(1100);
  if (state !== "hover") return;

  if (local) {
    await page.locator("[data-team-card]").first().hover();
  } else {
    const point = await page.evaluate(() => {
      const name = [...document.querySelectorAll("*")].find((element) => element.children.length === 0 && element.textContent?.trim() === "Alex Sameni");
      let card = name?.parentElement;
      while (card) {
        const rect = card.getBoundingClientRect();
        if (rect.width > 250 && rect.width < 310 && rect.height > 330) return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        card = card.parentElement;
      }
      return null;
    });
    if (point) await page.mouse.move(point.x, point.y);
  }
  await page.waitForTimeout(500);
}

for (const width of [1200, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });

  for (const state of states) {
    const referencePath = new URL(`${width}-${state}-reference.png`, output);
    const localPath = new URL(`${width}-${state}-local.png`, output);

    if (!existsSync(referencePath)) {
      const referencePage = await context.newPage();
      await referencePage.goto("https://aexo.framer.website/about", { waitUntil: "domcontentloaded", timeout: 30_000 });
      await settle(referencePage);
      await position(referencePage, state, false);
      await referencePage.screenshot({ path: referencePath.pathname.slice(1), animations: "disabled" });
      await referencePage.close();
    }

    const localPage = await context.newPage();
    await localPage.goto(`http://localhost:3000/about?motion=paused&aboutState=${state}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await settle(localPage);
    await position(localPage, state, true);
    await localPage.screenshot({ path: localPath.pathname.slice(1), animations: "disabled" });
    await localPage.close();

    const reference = PNG.sync.read(await readFile(referencePath));
    const local = PNG.sync.read(await readFile(localPath));
    const diff = new PNG({ width, height: 900 });

    // The external Framer badge is not part of the purchased Aexo UI.
    for (let y = 650; y < 820; y++) for (let x = width - 200; x < width; x++) {
      const offset = (y * width + x) * 4;
      reference.data.set(local.data.subarray(offset, offset + 4), offset);
    }

    const pixels = pixelmatch(reference.data, local.data, diff.data, width, 900, { threshold: .12, alpha: .55 });
    await writeFile(new URL(`${width}-${state}-diff.png`, output), PNG.sync.write(diff));
    console.log(`${width} [${state}]: ${((pixels / (width * 900)) * 100).toFixed(2)}%`);
  }

  await context.close();
}

await browser.close();
