import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("https://aexo.framer.website/", { waitUntil: "networkidle", timeout: 60_000 });
await page.waitForTimeout(1300);
const icons = await page.locator('[data-framer-name="Section-Process"] svg[data-framer-name="Icon"]').evaluateAll((nodes) => nodes.map((node) => node.outerHTML));
await mkdir(new URL("../public/assets/live/", import.meta.url), { recursive: true });
for (const [index, source] of icons.entries()) {
  const svg = source
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/ class="[^"]*"/g, "")
    .replace(/ style="[^"]*"/g, "")
    .replace("</svg>", '<style>path[stroke-dasharray]:not([stroke-dasharray=""]){animation:aexo-process-draw 2s cubic-bezier(.44,0,.56,1) infinite}@keyframes aexo-process-draw{to{stroke-dashoffset:0}}</style></svg>');
  await writeFile(new URL(`../public/assets/live/process-icon-${index + 1}.svg`, import.meta.url), svg);
}
await browser.close();
console.log(`Extracted ${icons.length} exact process icons.`);
