import { chromium } from "playwright";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const viewports = [[1920,1080],[1440,900],[1366,768],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[375,812],[360,800]];
const browser = await chromium.launch({ executablePath: edge, headless: true });
for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, header: !!document.querySelector("header"), main: !!document.querySelector("main") }));
  if (!geometry.header || !geometry.main || geometry.scrollWidth > geometry.width + 1) throw new Error(`${width}x${height} failed geometry: ${JSON.stringify(geometry)}`);
  if (width <= 809) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: /Works/ }).first().waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Close menu" }).last().click();
  }
  console.log(`${width}x${height}: responsive shell OK`);
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
const rail = page.locator("[aria-label='Project carousel controls']").locator("..").locator("div").first();
const before = await rail.getAttribute("style");
await page.getByRole("button", { name: "Next project", exact: true }).click();
await page.waitForTimeout(700);
if ((await rail.getAttribute("style")) === before) throw new Error("Carousel did not advance");
const firstFaq = page.getByRole("button", { name: /Who is this agency best suited for/ });
await firstFaq.scrollIntoViewIfNeeded();
await firstFaq.click();
if ((await firstFaq.getAttribute("aria-expanded")) !== "true") throw new Error("FAQ did not expand");
await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
for (const name of ["Name", "Email", "Message"]) if (!(await page.getByLabel(name, { exact: true }).isVisible())) throw new Error(`Missing contact field: ${name}`);
if (!(await page.getByRole("combobox").isVisible())) throw new Error("Missing contact field: Budget");
console.log("carousel, FAQ, navigation, and contact controls OK");
await browser.close();
