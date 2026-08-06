import { mkdir, readFile, writeFile } from "node:fs/promises";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const base = new URL("../artifacts/desktop-inspection/", import.meta.url);
const localBase = new URL("../artifacts/desktop-inspection/local/", import.meta.url);
const out = new URL("../artifacts/desktop-inspection/diff/", import.meta.url);
await mkdir(out, { recursive: true });

for (const width of [1200, 1440]) {
  const reference = PNG.sync.read(await readFile(new URL(`home-${width}x900-full.png`, base)));
  const local = PNG.sync.read(await readFile(new URL(`home-${width}x900-full.png`, localBase)));
  const height = Math.min(reference.height, local.height);
  const referenceCrop = new PNG({ width, height });
  const localCrop = new PNG({ width, height });
  PNG.bitblt(reference, referenceCrop, 0, 0, width, height, 0, 0);
  PNG.bitblt(local, localCrop, 0, 0, width, height, 0, 0);
  const diff = new PNG({ width, height });
  const pixels = pixelmatch(referenceCrop.data, localCrop.data, diff.data, width, height, { threshold: .12, alpha: .55 });
  await writeFile(new URL(`home-${width}-diff.png`, out), PNG.sync.write(diff));
  console.log(`${width}: ${((pixels / (width * height)) * 100).toFixed(2)}% differing pixels (${reference.height}px reference, ${local.height}px local)`);

  const sections = {
    hero: "hero",
    works: "works",
    partners: "our-partners",
    intro: "services",
    selected: "selected-works",
    brands: "brands",
    services: "what-we-do",
    benefits: "benefits",
    comparison: "comparison",
    stats: "stats",
    tools: "tools",
    pricing: "pricing",
    process: "process",
    testimonials: "testimonials",
    faq: "faq",
    cta: "cta",
  };
  for (const [localName, referenceName] of Object.entries(sections)) {
    try {
      const ref = PNG.sync.read(await readFile(new URL(`home-${width}-${referenceName}.png`, base)));
      const own = PNG.sync.read(await readFile(new URL(`home-${width}-${localName}.png`, localBase)));
      const sectionWidth = Math.min(ref.width, own.width);
      const sectionHeight = Math.min(ref.height, own.height);
      const refCrop = new PNG({ width: sectionWidth, height: sectionHeight });
      const ownCrop = new PNG({ width: sectionWidth, height: sectionHeight });
      PNG.bitblt(ref, refCrop, 0, 0, sectionWidth, sectionHeight, 0, 0);
      PNG.bitblt(own, ownCrop, 0, 0, sectionWidth, sectionHeight, 0, 0);
      const sectionDiff = new PNG({ width: sectionWidth, height: sectionHeight });
      const sectionPixels = pixelmatch(refCrop.data, ownCrop.data, sectionDiff.data, sectionWidth, sectionHeight, { threshold: .12, alpha: .55 });
      console.log(`  ${localName}: ${((sectionPixels / (sectionWidth * sectionHeight)) * 100).toFixed(2)}%`);
    } catch {}
  }
}
