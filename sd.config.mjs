import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

register(StyleDictionary);

export default {
    source: ["src/**/*.json"],
    preprocessors: ["tokens-studio"],
    platforms: {
        ts: {
            transformGroup: "tokens-studio",
            transforms: ["name/camel"],
            buildPath: "dist/ts/",
            files: [
                { destination: "tokens.ts", format: "javascript/es6" },
                {
                    destination: "tokens.d.ts",
                    format: "typescript/es6-declarations",
                },
            ],
            options: { outputReferences: true },
        },
    },
};
