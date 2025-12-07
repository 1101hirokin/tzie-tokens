import StyleDictionary from "style-dictionary";
import { register as registerTokensStudio, expandTypesMap } from "@tokens-studio/sd-transforms";
import { registerTransforms } from "./lib/transforms.js";
import { registerFormats } from "./lib/formats.js";

// Initialize Style Dictionary with tokens-studio and custom extensions
registerTokensStudio(StyleDictionary);
registerTransforms();
registerFormats();

// Export configuration for local development builds
export default {
  source: ["src/**/*.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    json: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      buildPath: "dist/json/",
      files: [{ destination: "tokens.json", format: "json/themed" }],
    },
    js: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: ["name/camel-elevation-layer"],
      buildPath: "dist/js/",
      expand: { typesMap: expandTypesMap, include: ["typography", "shadow"] },
      files: [{ destination: "tokens.js", format: "javascript/themed" }],
    },
    css: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: ["name/kebab-elevation-layer"],
      buildPath: "dist/css/",
      files: [{
        destination: "tokens.css",
        format: "css/unified-themes",
        options: { outputReferences: true },
      }],
    },
    compose: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: ["name/camel-elevation-layer", "color/composeColor", "size/compose/dp"],
      buildPath: "dist/compose/",
      expand: { typesMap: expandTypesMap, include: ["typography", "shadow"] },
      files: [{
        destination: "Tokens.kt",
        format: "compose/themed",
        options: { packageName: "com.tzie.tokens" },
      }],
    },
    iosSwift: {
      prefix: "tz",
      transformGroup: "tokens-studio",
      transforms: ["name/camel-elevation-layer", "color/UIColorSwift", "content/swift/literal", "asset/swift/literal", "size/swift/cgfloat"],
      buildPath: "dist/ios/",
      expand: { typesMap: expandTypesMap, include: ["typography", "shadow"] },
      files: [{ destination: "DesignTokens.swift", format: "ios-swift/themed" }],
    },
  },
};
