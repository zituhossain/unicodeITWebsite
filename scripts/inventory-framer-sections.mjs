import { readFile, writeFile } from "node:fs/promises";

const source = await readFile(new URL("../artifacts/live-page-component.mjs", import.meta.url), "utf8");
const sectionMatches = [...source.matchAll(/"data-framer-name":`(Section-[^`]+)`/g)];
const inventory = {};

for (let index = 0; index < sectionMatches.length; index += 1) {
  const match = sectionMatches[index];
  const next = sectionMatches[index + 1];
  const section = source.slice(match.index, next?.index ?? source.length);
  inventory[match[1]] = {
    assets: [...new Set([...section.matchAll(/framerusercontent\.com\/images\/([^?`"']+)/g)].map((asset) => asset[1]))],
    classNames: [...new Set([...section.matchAll(/className:`(framer-[a-zA-Z0-9_-]+)`/g)].map((className) => className[1]))],
  };
}

await writeFile(new URL("../artifacts/framer-section-inventory.json", import.meta.url), JSON.stringify(inventory, null, 2));
console.log(`Inventoried ${Object.keys(inventory).length} sections.`);
