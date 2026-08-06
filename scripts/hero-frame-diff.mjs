import { mkdir, readFile, writeFile } from "node:fs/promises";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";

const [referencePath, localPath, outputStem, requestedHeight = "765"] = process.argv.slice(2);
if (!referencePath || !localPath || !outputStem) {
  throw new Error("Usage: node scripts/hero-frame-diff.mjs <reference.png> <local.png> <output-stem> [height]");
}

async function decode(path) {
  const buffer = await sharp(await readFile(path)).png().toBuffer();
  return PNG.sync.read(buffer);
}

const referenceSource = await decode(referencePath);
const localSource = await decode(localPath);
const width = Math.min(referenceSource.width, localSource.width);
const height = Math.min(Number(requestedHeight), referenceSource.height, localSource.height);
const reference = new PNG({ width, height });
const local = new PNG({ width, height });

PNG.bitblt(referenceSource, reference, 0, 0, width, height, 0, 0);
PNG.bitblt(localSource, local, 0, 0, width, height, 0, 0);

const diff = new PNG({ width, height });
const overlay = new PNG({ width, height });
for (let index = 0; index < overlay.data.length; index += 4) {
  overlay.data[index] = Math.round((reference.data[index] + local.data[index]) / 2);
  overlay.data[index + 1] = Math.round((reference.data[index + 1] + local.data[index + 1]) / 2);
  overlay.data[index + 2] = Math.round((reference.data[index + 2] + local.data[index + 2]) / 2);
  overlay.data[index + 3] = 255;
}

const different = pixelmatch(reference.data, local.data, diff.data, width, height, {
  threshold: .12,
  alpha: .55,
});
await mkdir(new URL("../artifacts/hero-correction/", import.meta.url), { recursive: true });
await writeFile(`${outputStem}-reference.png`, PNG.sync.write(reference));
await writeFile(`${outputStem}-local.png`, PNG.sync.write(local));
await writeFile(`${outputStem}-overlay.png`, PNG.sync.write(overlay));
await writeFile(`${outputStem}-diff.png`, PNG.sync.write(diff));

console.log(JSON.stringify({
  width,
  height,
  different,
  mismatch: Number((different / (width * height) * 100).toFixed(3)),
}));
