import { readFile, writeFile } from "node:fs/promises";

const source = await readFile(new URL("../artifacts/live-page-component.mjs", import.meta.url), "utf8");
const rules = [];

for (const match of source.matchAll(/`([^`]*(?:\.framer-zu2aA|\.framer-[a-zA-Z0-9_-]+)[^`]*)`/g)) {
  const value = match[1]
    .replaceAll("\\n", "\n")
    .replaceAll("\\`", "`");
  if (value.includes("{") && value.includes("}")) rules.push(value);
}

await writeFile(new URL("../artifacts/live-page-rules.css", import.meta.url), `${[...new Set(rules)].join("\n")}\n`);
console.log(`Extracted ${rules.length} Framer CSS rule blocks.`);
