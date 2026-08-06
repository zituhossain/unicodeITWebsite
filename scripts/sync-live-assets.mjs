import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const root = new URL("../public/assets/live/", import.meta.url);
const inventory = JSON.parse(await readFile(new URL("../artifacts/reference-2026-07-13/inventory.json", import.meta.url), "utf8"));
await mkdir(root, { recursive: true });
const manifest = {};
const sources = new Map();
for (const source of Object.keys(inventory.assets)) {
  const url = new URL(source);
  const filename = decodeURIComponent(url.pathname.split("/").pop());
  const local = `/assets/live/${filename}`;
  manifest[source] = local;
  if (!sources.has(filename)) sources.set(filename, `${url.origin}${url.pathname}`);
}
const archivedModule = await readFile(new URL("../artifacts/live-page-component.mjs", import.meta.url), "utf8");
for (const match of archivedModule.matchAll(/https:\/\/framerusercontent\.com\/images\/([^?`"']+)/g)) {
  const filename = decodeURIComponent(match[1]);
  if (!sources.has(filename)) sources.set(filename, `https://framerusercontent.com/images/${match[1]}`);
}

let downloaded = 0;
for (const [filename, source] of sources) {
  const destination = new URL(filename, root);
  try { await access(destination, constants.F_OK); continue; } catch {}
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${response.status} while downloading ${source}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  downloaded += 1;
  if (downloaded % 20 === 0) console.log(`Downloaded ${downloaded}/${sources.size}`);
}
await writeFile(new URL("manifest.json", root), JSON.stringify({ frozenAt: inventory.capturedAt, assets: manifest }, null, 2));
console.log(`Live asset library: ${sources.size} files (${downloaded} downloaded)`);
