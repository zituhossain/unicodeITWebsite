import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const localOrigin = "http://localhost:3000";
const liveOrigin = "https://aexo.framer.website";
const routes = [
  ["home", "/"], ["works", "/works"], ["pricing", "/pricing"], ["about", "/about"], ["contact", "/contact"], ["404", "/404"],
  ["works-ametrix", "/works/ametrix"], ["works-notlex", "/works/notlex"], ["works-botwise", "/works/botwise"], ["works-cognefy", "/works/cognefy"],
  ["policy-privacy", "/policy/our-privacy-policy"], ["policy-terms", "/policy/our-terms-conditions"],
];
const animatedLoads = new Set(["home", "about", "contact"]);
const allMilestones = [0, 100, 200, 300, 500, 1000, 1300];
const namedStates = ["initial", "revealed", "hover", "expanded", "loop"];
const full = process.argv.includes("--full");
const lifecycleOnly = process.argv.includes("--lifecycle-only");
const out = new URL("../artifacts/motion-audit/", import.meta.url);
await mkdir(out, { recursive: true });

function target(name) {
  return new URL(name, out).pathname.replace(/^\/(.:\/)/, "$1");
}

async function hideBadge(page) {
  await page.addStyleTag({ content: "#__framer-badge-container, #__framer-badge-container__ { display:none!important }" }).catch(() => undefined);
}

async function captureAt(page, url, milliseconds, path) {
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await hideBadge(page);
  if (milliseconds) await page.waitForTimeout(milliseconds);
  await page.screenshot({ path, animations: "allow" });
}

async function compare(referencePath, localPath, diffPath) {
  const reference = PNG.sync.read(await readFile(referencePath));
  const local = PNG.sync.read(await readFile(localPath));
  if (reference.width !== local.width || reference.height !== local.height) return null;
  const diff = new PNG({ width: reference.width, height: reference.height });
  const pixels = pixelmatch(reference.data, local.data, diff.data, reference.width, reference.height, { threshold: .12, alpha: .55 });
  await writeFile(diffPath, PNG.sync.write(diff));
  return Number(((pixels / (reference.width * reference.height)) * 100).toFixed(3));
}

const browser = await chromium.launch({ executablePath: edge, headless: true });
const report = { generatedAt: new Date().toISOString(), timed: [], deterministic: [], lifecycle: [] };

for (const width of lifecycleOnly ? [] : [1200, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  for (const [name, route] of routes) {
    const milestones = full || animatedLoads.has(name) ? allMilestones : [0, 1300];
    for (const milestone of milestones) {
      const key = `${name}-${width}-load-${milestone}`;
      const referencePath = target(`${key}-reference.png`);
      const localPath = target(`${key}-local.png`);
      const diffPath = target(`${key}-diff.png`);
      await captureAt(page, `${liveOrigin}${route}`, milestone, referencePath);
      await captureAt(page, `${localOrigin}${route}`, milestone, localPath);
      const mismatch = await compare(referencePath, localPath, diffPath);
      report.timed.push({ route, width, milestone, mismatch });
    }

    for (const state of namedStates) {
      const separator = route.includes("?") ? "&" : "?";
      await page.goto(`${localOrigin}${route}${separator}motion=paused&state=${state}`, { waitUntil: "load", timeout: 60_000 });
      await page.waitForFunction(() => typeof window.__AEXO_MOTION__ === "object", undefined, { timeout: 10_000 });
      await page.evaluate(({ routeName, stateName }) => {
        window.__AEXO_MOTION__.setState(stateName);
        if (routeName === "home") {
          window.__AEXO_MOTION__.setCarousel("home-projects", 2);
          window.__AEXO_MOTION__.setCarousel("selected-works", 1);
        }
        if (routeName === "works") window.__AEXO_MOTION__.setCarousel("works-featured", 2);
        if (routeName === "pricing") window.__AEXO_MOTION__.setCarousel("pricing-quotes", 2);
        if (stateName === "loop") {
          for (const id of ["partners-left", "services-ring-inner", "benefits-words", "testimonials", "footer-ruler", "contact-logos", "about-culture-ruler"]) {
            window.__AEXO_MOTION__.setLoopPhase(id, .5);
          }
        }
      }, { routeName: name, stateName: state });
      const snapshot = await page.evaluate(() => window.__AEXO_MOTION__.snapshot());
      await page.screenshot({ path: target(`${name}-${width}-${state}-local.png`), animations: "disabled" });
      report.deterministic.push({ route, width, state, snapshot });
    }
  }
  await context.close();
}

const lifecycleContext = await browser.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: "no-preference" });
const lifecyclePage = await lifecycleContext.newPage();
await lifecyclePage.goto(`${localOrigin}/?motion=paused&state=revealed`, { waitUntil: "load" });
await lifecyclePage.waitForFunction(() => typeof window.__AEXO_MOTION__ === "object", undefined, { timeout: 10_000 });
const initial = await lifecyclePage.evaluate(() => window.__AEXO_MOTION__.snapshot());
for (const route of ["/works", "/pricing", "/about", "/contact", "/"]) {
  const selector = route === "/" ? "a[aria-label='Aexo home']" : `header a[href='${route}']`;
  await lifecyclePage.locator(selector).first().click();
  await lifecyclePage.waitForURL(`${localOrigin}${route}`);
  await lifecyclePage.waitForFunction(() => typeof window.__AEXO_MOTION__ === "object", undefined, { timeout: 10_000 });
  const snapshot = await lifecyclePage.evaluate(() => window.__AEXO_MOTION__.snapshot());
  report.lifecycle.push(snapshot);
}
const revisited = report.lifecycle.at(-1);
if (revisited.scrollTriggerCount > initial.scrollTriggerCount + 1) throw new Error(`Route revisit leaked ScrollTriggers: ${initial.scrollTriggerCount} -> ${revisited.scrollTriggerCount}`);
await lifecyclePage.setViewportSize({ width: 1440, height: 900 });
await lifecyclePage.setViewportSize({ width: 1200, height: 900 });
const resized = await lifecyclePage.evaluate(() => window.__AEXO_MOTION__.snapshot());
if (resized.scrollTriggerCount > initial.scrollTriggerCount + 1) throw new Error(`Resize duplicated ScrollTriggers: ${initial.scrollTriggerCount} -> ${resized.scrollTriggerCount}`);
await lifecycleContext.close();

await writeFile(new URL("report.json", out), JSON.stringify(report, null, 2));
await browser.close();
console.log(`Motion audit complete: ${report.timed.length} timed comparisons, ${report.deterministic.length} deterministic states, ${report.lifecycle.length} client navigations.`);
