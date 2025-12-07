#!/usr/bin/env node

import { cac } from "cac";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTokens } from "../lib/builder.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  await readFile(join(__dirname, "..", "package.json"), "utf-8")
);

const cli = cac("tzie-tokens");

cli
  .command("build", "Build design tokens from a theme file")
  .option("--theme <path>", "Path to theme JSON file (required)")
  .option(
    "--platform <name>",
    "Target platform: css, js, compose, ios, all (default: all)",
    { default: "all" }
  )
  .option("--output <dir>", "Output directory (default: ./dist)", {
    default: "./dist",
  })
  .option("--base <path>", "Custom base tokens file (optional)")
  .action(async (options) => {
    if (!options.theme) {
      console.error("❌ Error: --theme option is required");
      process.exit(1);
    }

    try {
      await buildTokens(options);
      console.log("✅ Build completed successfully");
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      process.exit(1);
    }
  });

cli.help();
cli.version(pkg.version);

cli.parse();
