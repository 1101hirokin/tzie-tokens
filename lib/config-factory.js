import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expandTypesMap } from "@tokens-studio/sd-transforms";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get default base tokens path
export const getDefaultBasePath = () => {
  return join(__dirname, "..", "src", "base.tokens.json");
};

// Create Style Dictionary config for a specific platform
export const createPlatformConfig = (platform, buildPath, options = {}) => {
  const configs = {
    json: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      buildPath: `${buildPath}/json/`,
      files: [{ destination: "tokens.json", format: "json/themed" }],
    },
    js: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: ["name/camel-elevation-layer"],
      buildPath: `${buildPath}/js/`,
      expand: { typesMap: expandTypesMap, include: ["typography", "shadow"] },
      files: [{ destination: "tokens.js", format: "javascript/themed" }],
    },
    css: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: ["name/kebab-elevation-layer"],
      buildPath: `${buildPath}/css/`,
      files: [
        {
          destination: "tokens.css",
          format: "css/unified-themes",
          options: { outputReferences: true, themeOnly: true },
        },
      ],
    },
    compose: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: [
        "name/camel-elevation-layer",
        "color/composeColor",
        "size/compose/dp",
      ],
      buildPath: `${buildPath}/compose/`,
      expand: { typesMap: expandTypesMap, include: ["typography", "shadow"] },
      files: [
        {
          destination: "Tokens.kt",
          format: "compose/themed",
          options: { packageName: options.packageName || "com.tzie.tokens" },
        },
      ],
    },
    ios: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: [
        "name/camel-elevation-layer",
        "color/UIColorSwift",
        "content/swift/literal",
        "asset/swift/literal",
        "size/swift/cgfloat",
      ],
      buildPath: `${buildPath}/ios/`,
      expand: { typesMap: expandTypesMap, include: ["typography", "shadow"] },
      files: [{ destination: "DesignTokens.swift", format: "ios-swift/themed" }],
    },
  };

  return configs[platform];
};

// Create complete Style Dictionary config
export const createConfig = ({ themePath, basePath, buildPath, platforms }) => {
  const sources = [basePath || getDefaultBasePath(), themePath].filter(Boolean);

  const platformConfigs = {};
  const requestedPlatforms =
    platforms === "all" ? ["json", "js", "css", "compose", "ios"] : [platforms];

  requestedPlatforms.forEach((platform) => {
    const config = createPlatformConfig(platform, buildPath);
    if (config) {
      platformConfigs[platform] = config;
    }
  });

  return {
    source: sources,
    preprocessors: ["tokens-studio"],
    platforms: platformConfigs,
  };
};
