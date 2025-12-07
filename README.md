# @tzie/tokens

Tzie デザインシステムの **デザイントークン**群です。  
DTCG 形式の tokens.json を **Style Dictionary v5 + @tokens-studio/sd-transforms** で各プラットフォーム向けにビルドしています。

- ソース: `src/**/*.json`（DTCG / Tokens Studio 互換）
- ビルド先: `dist/` 以下に各 PF 向け成果物を出力

このリポジトリは「トークン専用」です。  
各 UI 実装（React / Lit / SwiftUI / Compose など）は、このパッケージを依存として参照します。

---

## 対応プラットフォーム / 成果物

ビルド後の出力構成（例）:

    dist/
      js/
        tokens.js          # JS 向け ESM 定数
        tokens.d.ts        # TypeScript 型定義
      css/
        tokens.css         # CSS カスタムプロパティ (--tz-*)
      json/
        tokens.nested.json # ネスト構造 JSON
        tokens.flat.json   # フラットキー JSON
      ios/
        DesignTokens.swift # Swift 用 enum
      compose/
        Tokens.kt          # Jetpack Compose / Kotlin 用 object

---

## JS / TS / CSS（npm 推奨）

推奨パッケージマネージャは **npm** です（他のツールからも利用可能）。

### インストール

    npm install @tzie/tokens
    # or
    pnpm add @tzie/tokens
    # or
    yarn add @tzie/tokens

### JS / TS からの利用例

    import * as TOKENS from '@tzie/tokens';

    // semantic color
    const primaryBg = TOKENS.tzSemanticSurfacePrimaryBg;

    // elevation (core / cast)
    const cardShadowCoreBlur = TOKENS.tzElevation6CoreBlur;
    const cardShadowCastBlur = TOKENS.tzElevation6CastBlur;

    // typography のサブプロパティ（展開後）
    const heading1FontSize   = TOKENS.tzTypographyHeading1FontSize;
    const bodyLineHeight     = TOKENS.tzTypographyBody1LineHeight;

### CSS 変数として利用

    @import '@tzie/tokens/css';

    .button {
      background-color: var(--tz-semantic-surface-primary-bg);
      color: var(--tz-semantic-surface-primary-fg);
      box-shadow: var(--tz-elevation-6-core); /* elevation core (複合 shadow) */
    }

> 実際のトークン名は `src/**/*.json` の設計に依存します。  
> CSS では `--tz-<path-kebab-case>` 形式になります。

---

## JSON（raw tokens）

ビルド結果の JSON には次のようにアクセスできます。

ネスト形式:

    import nested from '@tzie/tokens/json' assert { type: 'json' };

フラット形式:

    import flat from '@tzie/tokens/json/flat' assert { type: 'json' };

    const primaryBg = flat['semantic.surface.primary.bg'];

- `tokens.nested.json` … DTCG の構造に近いネスト形式
- `tokens.flat.json` … `semantic.surface.primary.bg` のようなフラットキー形式

---

## iOS（SwiftPM）

このリポジトリを **Swift Package Manager** から参照する想定です。

1. Xcode: “Add Package Dependencies…” でこのリポジトリの Git URL を指定
2. タグ（例: `0.0.0-alpha.0`）またはブランチを選択
3. `TzieTokens` を依存として追加

`Package.swift` 例（このリポジトリ側・参考）:

    // swift-tools-version: 5.9
    import PackageDescription

    let package = Package(
        name: "TzieTokens",
        platforms: [
            .iOS(.v14),
            .macOS(.v12)
        ],
        products: [
            .library(
                name: "TzieTokens",
                targets: ["TzieTokens"]
            )
        ],
        targets: [
            .target(
                name: "TzieTokens",
                path: "dist/ios",
                sources: [
                    "DesignTokens.swift"
                ]
            )
        ]
    )

利用例:

    import TzieTokens

    let primaryBg   = DesignTokens.tzSemanticSurfacePrimaryBg
    let headingSize = DesignTokens.tzTypographyHeading1FontSize

---

## Android / Jetpack Compose（Kotlin）

`dist/compose/Tokens.kt` をソースとして、Kotlin ライブラリとして配布する想定です。

### ライブラリ側（このリポジトリ or サブプロジェクト例）

`kotlin/build.gradle.kts` 例:

    plugins {
        kotlin("jvm") version "2.0.21"
        `maven-publish`
    }

    group = "com.tzie"
    version = "0.0.0-alpha.0"

    java {
        withSourcesJar()
    }

    repositories {
        mavenCentral()
    }

    sourceSets {
        named("main") {
            // tokens リポのルートから見た相対パスを調整
            kotlin.srcDir("../dist/compose")
        }
    }

    publishing {
        publications {
            create<MavenPublication>("tokensCompose") {
                from(components["java"])
                groupId = "com.tzie"
                artifactId = "tokens-compose"
                version = project.version.toString()
            }
        }
        // repositories { ... } は利用する Maven レジストリに合わせて設定
    }

### 利用側（Compose プロジェクト）

    dependencies {
        implementation("com.tzie:tokens-compose:0.0.0-alpha.0")
    }

利用例:

    import com.tzie.tokens.DesignTokens

    val primary = DesignTokens.semanticSurfacePrimaryBg
    // Color に変換する場合はアプリ側のユーティリティでラップ

---

## CLI（カスタムテーマのビルド）

このパッケージは、ユーザーが独自のテーマファイルをビルドできる CLI ツールを提供します。

### 前提条件

- Node.js 18+

### 基本的な使い方

```bash
# CSS のみビルド
npx @tzie/tokens build --theme ./my-theme.json --platform css

# すべてのプラットフォームをビルド
npx @tzie/tokens build --theme ./my-theme.json --platform all

# カスタム出力先を指定
npx @tzie/tokens build --theme ./my-theme.json --platform css --output ./public/styles
```

### オプション

- `--theme <path>` **(必須)** - テーマ JSON ファイルのパス
- `--platform <name>` - ビルド対象プラットフォーム: `css`, `js`, `compose`, `ios`, `all` (デフォルト: `all`)
- `--output <dir>` - 出力ディレクトリ (デフォルト: `./dist`)
- `--base <path>` - カスタムベーストークンファイル（オプション、デフォルトはパッケージに含まれる `base.tokens.json`）

### テーマファイルの作成

テーマファイルは、ベーストークンを参照してセマンティックカラーなどを定義する JSON ファイルです。

例（`my-theme.json`）:

```json
{
  "color": {
    "semantic": {
      "primary": {
        "bg": { "$value": "#3b82f6", "$type": "color" },
        "fg": { "$value": "#ffffff", "$type": "color" }
      }
    }
  }
}
```

ベーストークンの参照も可能です:

```json
{
  "color": {
    "semantic": {
      "primary": {
        "bg": { "$value": "{color.blue.600}", "$type": "color" }
      }
    }
  }
}
```

### ヘルプの表示

```bash
npx @tzie/tokens --help
npx @tzie/tokens build --help
```

---

## 開発者向け（このリポジトリの運用）

### 前提

- Node.js 22+
- Style Dictionary v5
- @tokens-studio/sd-transforms v2

### ディレクトリ構成（例）

    src/
      base.tokens.json # Tzie デザインシステム共通・基礎トークン
      theme/ # テーマごとに1ファイル

    sd.config.mjs        # Style Dictionary 設定
    Package.swift        # SwiftPM 向け設定（任意）
    kotlin/              # Kotlin / Compose ライブラリ用設定（任意）
    dist/                # ビルド成果物（gitignore 対象）

> `dist/` 以下は Style Dictionary により自動生成される成果物です。  
> リポジトリにはコミットせず、`.gitignore` に含める前提です。

### ビルド

    npm install
    npm run build

`sd.config.mjs` では、以下を定義しています。

- DTCG / Tokens Studio 形式トークンの取り込み (`preprocessors: ['tokens-studio']`)
- typography / shadow（elevation）の展開（展開対象 PF と CSS 複合出力 PF の切り分け）
- elevation の影レイヤー名
    - 1つ目の shadow: `core`
    - 2つ目の shadow: `cast`
    - 例:
        - CSS: `--tz-elevation-6-core-blur`
        - JS: `tzElevation6CoreBlur`

---

## 命名・設計ポリシー（要約）

- ソーストークン
    - DTCG 準拠 (`$value`, `$type`)
    - 大分類: `core`, `semantic`, `component`（想定）
- elevation（shadow）
    - 各レベルは複数レイヤを持つ
    - 1つ目: `core`
    - 2つ目: `cast`
- typography
    - `fontSize`, `lineHeight`, `letterSpacing` などをサブプロパティとして展開
    - 例:
        - JS: `tzTypographyHeading1FontSize`
        - CSS: `--tz-typography-heading1-font-size`
