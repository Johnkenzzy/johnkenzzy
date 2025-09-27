import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  name: z.string().default("Your Name"),
  tagline: z
    .string()
    .default("Full-Stack Engineer | Open Source Enthusiast | Builder 🚀"),
  username: z.string().default("yourusername"),
  socials: z.string().default(defaultSocials()),
  tech_stack: z.string().default(defaultTechStack()),
  projects: z.string().default(defaultProjects()),
});

export const safeConfig = schema.parse({
  name: process.env.PROFILE_NAME,
  tagline: process.env.PROFILE_TAGLINE,
  username: process.env.GITHUB_USERNAME,
  socials: fs.readFileSync("snippets/socials.md", "utf8"),
  tech_stack: fs.readFileSync("snippets/tech-stack.md", "utf8"),
  projects: fs.readFileSync("snippets/projects.md", "utf8"),
});

function defaultSocials() {
  return `
[![LinkedIn](...)](...)
[![Twitter](...)](...)
[![Portfolio](...)](...)
`;
}

function defaultTechStack() {
  return `
![JS](...)
![TS](...)
![React](...)
![Node](...)
`;
}

function defaultProjects() {
  return `
- 🔥 [Awesome Project](...project) – Tagline
- 🎨 [UI Library](...ui-lib) – Tagline
`;
}

/** Fetch and save typing SVG locally to avoid URL encoding & proxy issues */
export async function generateTypingSvg(name, assetsDir) {
  // Build lines array (edit as you wish)
  const lines = [
    `Hey I'm ${name} 👋`,
    "Full-Stack Developer 🚀",
    "Problem Solver 🛠️",
    "Always learning new things 📚",
  ].join(";");

  // Use URLSearchParams to encode params safely
  const params = new URLSearchParams({
    font: "Fira Code",
    weight: "500",
    size: "26",
    duration: "3000",
    pause: "800",
    color: "00F5FF",
    center: "true",
    vCenter: "true",
    width: "600",
    lines, // URLSearchParams will encode this for us
  });

  const url = `https://readme-typing-svg.demolab.com?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch typing svg: ${res.status} ${res.statusText}`);
  }

  const svg = await res.text();
  const outPath = path.join(assetsDir, "typing.svg");
  fs.writeFileSync(outPath, svg, "utf8");
  return path.relative(process.cwd(), outPath).replace(/\\/g, "/"); // cross-platform path
}