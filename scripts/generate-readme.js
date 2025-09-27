import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import mustache from "mustache";

import { safeConfig, generateTypingSvg } from "../config.js";

// ensure assets dir exists
const ASSETS_DIR = path.join(process.cwd(), "assets");
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

await generateTypingSvg(safeConfig.name, ASSETS_DIR);

async function getQuote() {
  try {
    const res = await fetch("https://zenquotes.io/api/random");
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.q) {
      return `${data[0].q} — *${data[0].a}*`;
    }
  } catch {
    return "Keep building, keep shipping 🚀";
  }
}

async function generate() {
  const TEMPLATE = fs.readFileSync("template.md", "utf8");
  const quote = await getQuote();

  const rendered = mustache.render(TEMPLATE, { ...safeConfig, quote });

  fs.writeFileSync("README.md", rendered);
  console.log("✅ README.md updated!");
}

generate();
