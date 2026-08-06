import { chromium } from "playwright";

const origin = process.env.LOCAL_ORIGIN ?? "http://localhost:3000";
const routes = [
  "/", "/works", "/pricing", "/about", "/contact", "/404",
  "/works/ametrix", "/works/notlex", "/works/botwise", "/works/cognefy",
  "/policy/our-privacy-policy", "/policy/our-terms-conditions",
];
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

try {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(350);
    const buttons = page.locator("[data-rolling-button]");
    const count = await buttons.count();
    const samples = [];
    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible())) continue;
      const before = await button.evaluate((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return { text: node.textContent?.trim(), x: rect.x, y: rect.y, width: rect.width, height: rect.height, transform: style.transform, padding: style.padding, background: style.backgroundColor };
      });
      await button.hover();
      await page.waitForTimeout(450);
      const after = await button.evaluate((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, transform: style.transform, padding: style.padding, background: style.backgroundColor };
      });
      samples.push({ before, after });
      if (samples.length >= 4) break;
    }
    console.log(JSON.stringify({ route, samples }));
    await page.close();
  }
} finally {
  await browser.close();
}
