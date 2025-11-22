import StyleDictionary from "style-dictionary";
import {
    register as registerTokensStudio,
    expandTypesMap,
} from "@tokens-studio/sd-transforms";

registerTokensStudio(StyleDictionary);

/**
 * elevation.* の layer インデックスを
 *  0 / 1 → 'core'
 *  2     → 'cast'
 * に置き換えた path を返す。
 */
const aliasElevationLayer = (path) => {
    const p = path.map(String);
    const idx = p.indexOf("elevation");
    if (idx === -1) return p;
    if (p.length <= idx + 2) return p;

    const layer = p[idx + 2];
    let alias = null;

    if (layer === "0" || layer === "1") {
        alias = "core";
    } else if (layer === "2") {
        alias = "cast";
    }

    if (!alias) return p;

    const cloned = [...p];
    cloned[idx + 2] = alias;
    return cloned;
};

/**
 * path から kebab-case 名を作る簡易実装
 * 例: ["semantic", "surface", "primary"] → "semantic-surface-primary"
 */
const kebabFromPath = (path) => {
    return path
        .map((seg) =>
            String(seg)
                // 非英数字 → ハイフン
                .replace(/[^a-zA-Z0-9]+/g, "-")
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .toLowerCase()
        )
        .join("-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};

/**
 * path から camelCase 名を作る簡易実装
 * 例: ["semantic", "surface", "primary"] → "semanticSurfacePrimary"
 */
const camelFromPath = (path) => {
    return path
        .map((seg, index) => {
            const base = String(seg)
                .replace(/[^a-zA-Z0-9]+/g, " ")
                .toLowerCase()
                .split(" ")
                .filter(Boolean)
                .join("");
            if (index === 0) return base;
            return base.charAt(0).toUpperCase() + base.slice(1);
        })
        .join("");
};

/**
 * CSS 用: kebab-case で core / cast を含めた名前を生成
 */
StyleDictionary.registerTransform({
    name: "name/kebab-elevation-layer",
    type: "name",
    transform: (token, options) => {
        const aliasedPath = aliasElevationLayer(token.path);
        const baseName = kebabFromPath(aliasedPath);

        const prefix = options && options.prefix;

        return prefix ? `${prefix}-${baseName}` : baseName;
    },
});

/**
 * JS / Compose / iOS 用: camelCase で core / cast を含めた名前を生成
 */
StyleDictionary.registerTransform({
    name: "name/camel-elevation-layer",
    type: "name",
    transform: (token, options) => {
        const aliasedPath = aliasElevationLayer(token.path);
        const baseName = camelFromPath(aliasedPath);

        const prefix = options && options.prefix;
        if (!prefix) {
            return baseName;
        }

        return `${prefix}${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}`;
    },
});

export default {
    source: ["src/**/*.json"],

    preprocessors: ["tokens-studio"],

    platforms: {
        // 1) JSON出力
        json: {
            prefix: "tz",
            transformGroup: "tokens-studio",
            buildPath: "dist/json/",
            expand: {
                typesMap: expandTypesMap,
                include: ["typography", "shadow"],
            },
            files: [
                {
                    destination: "tokens.nested.json",
                    format: "json/nested",
                    options: { outputReferences: true },
                },
                {
                    destination: "tokens.flat.json",
                    format: "json/flat",
                    options: { outputReferences: true },
                },
            ],
        },

        // 2) JS + d.ts 出力
        js: {
            prefix: "tz",
            transformGroup: "tokens-studio",
            transforms: ["name/camel-elevation-layer"],
            buildPath: "dist/js/",
            expand: {
                typesMap: expandTypesMap,
                include: ["typography", "shadow"],
            },
            files: [
                {
                    destination: "tokens.js",
                    format: "javascript/es6",
                },
                {
                    destination: "tokens.d.ts",
                    format: "typescript/es6-declarations",
                    options: {
                        outputStringLiterals: true,
                    },
                },
            ],
            options: {
                outputReferences: true,
            },
        },

        // 3) CSS Variables 出力
        css: {
            prefix: "tz",
            transformGroup: "tokens-studio",
            transforms: ["name/kebab-elevation-layer"],
            buildPath: "dist/css/",
            files: [
                {
                    destination: "tokens.css",
                    format: "css/variables",
                    options: {
                        selector: ":root",
                        outputReferences: true,
                    },
                },
            ],
        },

        // 5) Compose（Kotlinコード）出力
        compose: {
            prefix: "tz",
            transformGroup: "compose",
            // ここでも camelCase の elevation layer 名を使う
            transforms: ["name/camel-elevation-layer"],
            buildPath: "dist/compose/",
            expand: {
                typesMap: expandTypesMap,
                include: ["typography", "shadow"],
            },
            files: [
                {
                    destination: "Tokens.kt",
                    format: "compose/object",
                    options: {
                        packageName: "com.tzie.tokens",
                        className: "DesignTokens",
                        outputReferences: true,
                    },
                },
            ],
        },

        // 6) iOS Swift 出力
        iosSwift: {
            prefix: "tz",
            transformGroup: "ios-swift",
            transforms: ["name/camel-elevation-layer"],
            buildPath: "dist/ios/",
            expand: {
                typesMap: expandTypesMap,
                include: ["typography", "shadow"],
            },
            files: [
                {
                    destination: "DesignTokens.swift",
                    format: "ios-swift/enum.swift",
                    options: {
                        outputReferences: true,
                    },
                },
            ],
        },
    },
};
