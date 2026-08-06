import { chromium } from "playwright";

const routes = [
  "/",
  "/works",
  "/pricing",
  "/about",
  "/contact",
  "/404",
  "/works/ametrix",
  "/works/notlex",
  "/works/botwise",
  "/works/cognefy",
  "/policy/our-privacy-policy",
  "/policy/our-terms-conditions",
];

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

const checkedLocalLinks = new Set();

for (const width of [1366, 1920]) {
  const context = await browser.newContext({ viewport: { width, height: width === 1366 ? 768 : 1080 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    // Trigger intentionally lazy route imagery before checking natural sizes.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    const result = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
      headings: document.querySelectorAll("main h1, main h2").length,
    }));
    if (result.scrollWidth > result.clientWidth + 1) throw new Error(`${route} overflows at ${width}px: ${JSON.stringify(result)}`);
    if (result.brokenImages.length) throw new Error(`${route} has broken images: ${result.brokenImages.join(", ")}`);
    if (!result.headings) throw new Error(`${route} has no page heading`);
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== "http://localhost:3000" || checkedLocalLinks.has(url.pathname)) continue;
      checkedLocalLinks.add(url.pathname);
      const response = await page.request.get(url.toString());
      if (response.status() >= 400) throw new Error(`${route} links to ${url.pathname}, which returned ${response.status()}`);
    }
    console.log(`${width}px ${route}: geometry and assets OK`);
  }
  await page.goto("http://localhost:3000/404", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Back to Home Page" }).click();
  await page.waitForURL("http://localhost:3000/");
  console.log(`${width}px 404 navigation OK`);
  await context.close();
}

await browser.close();
