import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Frozen Framer modules and visual-regression output are third-party test
  // fixtures, not application source.
  globalIgnores([".next/**", "node_modules/**", "artifacts/**"]),
]);
