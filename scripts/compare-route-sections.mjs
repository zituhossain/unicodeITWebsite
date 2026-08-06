import { readFile } from "node:fs/promises";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const route = process.env.ROUTE_KEY ?? "contact";
const width = Number(process.env.WIDTH ?? 1440);
const sections = {
  contact: [["hero",0,1038],["cards",1038,1767.546875],["testimonials",1767.546875,2644.546875],["faq",2644.546875,3760.546875],["cta",3760.546875,4626.546875],["footer",4626.546875,5207.546875]],
  works: [["hero",0,1382.78125],["all-works",1382.78125,width === 1200 ? 2350.84375 : 2357.65625],["testimonials",width === 1200 ? 2350.84375 : 2357.65625,width === 1200 ? 3227.84375 : 3234.65625]],
  about: [["hero",0,width === 1200 ? 2131.984375 : 2239.578125],["thinkers",width === 1200 ? 2131.984375 : 2239.578125,width === 1200 ? 3135.984375 : 3243.578125],["team",width === 1200 ? 3135.984375 : 3243.578125,width === 1200 ? 4315.953125 : 4423.546875],["culture",width === 1200 ? 4315.953125 : 4423.546875,width === 1200 ? 5712.3125 : 5819.90625]],
};

const referenceRoot = width === 1200 ? "reference-desktop-1200" : "reference-2026-07-13";
const reference = PNG.sync.read(await readFile(new URL(`../artifacts/${referenceRoot}/${route}-${width}x900-full.png`, import.meta.url)));
const local = PNG.sync.read(await readFile(new URL(`../artifacts/routes-desktop/${route}-${width}-local.png`, import.meta.url)));

for (const [name, rawStart, rawEnd] of sections[route]) {
  const start = Math.round(rawStart);
  const end = Math.min(Math.round(rawEnd), reference.height, local.height);
  const height = end - start;
  const refData = Buffer.alloc(width * height * 4);
  const localData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    reference.data.copy(refData, y * width * 4, (start + y) * width * 4, (start + y + 1) * width * 4);
    local.data.copy(localData, y * width * 4, (start + y) * width * 4, (start + y + 1) * width * 4);
  }
  const diff = Buffer.alloc(width * height * 4);
  const pixels = pixelmatch(refData, localData, diff, width, height, { threshold: .12 });
  console.log(`${name}: ${((pixels / (width * height)) * 100).toFixed(2)}%`);
}
