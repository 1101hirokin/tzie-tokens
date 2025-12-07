import StyleDictionary from "style-dictionary";
import { register as registerTokensStudio } from "@tokens-studio/sd-transforms";
import { resolve } from "node:path";
import { access } from "node:fs/promises";
import { registerTransforms } from "./transforms.js";
import { registerFormats } from "./formats.js";
import { createConfig } from "./config-factory.js";

// Initialize Style Dictionary with custom transforms and formats
const initializeStyleDictionary = () => {
  registerTokensStudio(StyleDictionary);
  registerTransforms();
  registerFormats();
};

// Validate file exists
const validateFile = async (filePath, description) => {
  try {
    await access(resolve(filePath));
  } catch {
    throw new Error(`${description} not found: ${filePath}`);
  }
};

// Build tokens with provided options
export const buildTokens = async (options) => {
  const { theme, base, output = "./dist", platform = "all" } = options;

  // Validate theme file
  await validateFile(theme, "Theme file");

  // Validate custom base file if provided
  if (base) {
    await validateFile(base, "Base tokens file");
  }

  // Initialize Style Dictionary
  initializeStyleDictionary();

  // Create configuration
  const config = createConfig({
    themePath: resolve(theme),
    basePath: base ? resolve(base) : null,
    buildPath: resolve(output),
    platforms: platform,
  });

  // Build
  console.log(`📦 Building tokens for platform(s): ${platform}`);
  console.log(`📄 Theme: ${theme}`);
  console.log(`📂 Output: ${output}\n`);

  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();
};
