// sd.config.mjs
import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

register(StyleDictionary);

export default {
    // DTCGトークン
    source: ["src/**/*.json"],
    // sd-transforms 0.16.0+ は preprocessor が必須
    preprocessors: ["tokens-studio"],

    platforms: {
        // 1) JS + d.ts 出力
        js: {
            prefix: "tz",
            transformGroup: "tokens-studio",
            // JS識別子を安全にするため name 変換を追加（camel/pascalなど任意）
            transforms: ["name/camel"],
            buildPath: "dist/js/",
            files: [
                { destination: "tokens.js", format: "javascript/es6" }, // ESM定数
                {
                    destination: "tokens.d.ts",
                    format: "typescript/es6-declarations",
                    // 文字列リテラル型を出したいなら true（必要に応じて）
                    options: { outputStringLiterals: true },
                },
            ],
            options: { outputReferences: true }, // 参照維持
        },

        // 2) CSS Variables 出力
        css: {
            prefix: "tz",
            transformGroup: "tokens-studio",
            transforms: ["name/kebab"], // --semantic-primary-bg など
            buildPath: "dist/css/",
            files: [
                {
                    destination: "tokens.css",
                    format: "css/variables",
                    options: {
                        selector: ":root", // ルートセレクタ
                        outputReferences: true, // var(--x) 参照を維持
                    },
                },
            ],
        },

        // 3) Compose（Kotlinコード）出力
        compose: {
            // Compose向けTransform Group（color/composeColor 等）:contentReference[oaicite:4]{index=4}
            transformGroup: "compose",
            buildPath: "dist/compose/",
            files: [
                {
                    destination: "Tokens.kt",
                    format: "compose/object", // Kotlin object に val を並べるビルトイン:contentReference[oaicite:5]{index=5}
                    options: {
                        packageName: "com.tzie.tokens", // 任意（ドキュメント化されているオプション）:contentReference[oaicite:6]{index=6}
                        className: "DesignTokens",
                    },
                },
            ],
        },

        // 4) iOS Swift 出力
        iosSwift: {
            // Swift向けTransform Group（name=camel, color/UIColorSwift 等）:contentReference[oaicite:7]{index=7}
            transformGroup: "ios-swift",
            buildPath: "dist/ios/",
            files: [
                {
                    destination: "DesignTokens.swift",
                    // Swiftの enum で値を並べるビルトインフォーマット :contentReference[oaicite:8]{index=8}
                    format: "ios-swift/enum.swift",
                },
                // もっと柔軟に struct/class にしたければ 'ios-swift/any.swift' を使い、
                // objectType/accessControl/import を指定できる（公式に記載あり）。:contentReference[oaicite:9]{index=9}
            ],
        },
    },
};
