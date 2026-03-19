/**
 * Generates src/styles/theme-tokens.css from src/config/brand.ts.
 * Run: npm run theme
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { brand } from "../src/config/brand.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../src/styles/theme-tokens.css");

const { colors, fonts } = brand.theme;

const css = `/* Auto-generated from src/config/brand.ts — do not edit manually */
@theme {
  /* Brand colors */
  --color-charcoal: ${colors.primary};
  --color-charcoal-90: ${colors.primaryLight};
  --color-gold: ${colors.accent};
  --color-gold-hover: ${colors.accentHover};
  --color-offwhite: ${colors.background};
  --color-lightgray: ${colors.backgroundAlt};

  /* Typography */
  --font-display: ${fonts.display};
  --font-body: ${fonts.body};

  /* Custom animation */
  --animate-fade-up: fade-up 0.6s ease-out forwards;
}
`;

writeFileSync(outPath, css);
console.log("✔ Generated", outPath);
