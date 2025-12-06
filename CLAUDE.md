# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a design tokens repository for the Tzie design system. It uses Style Dictionary v5 with @tokens-studio/sd-transforms to transform DTCG-format tokens into platform-specific outputs (JS/TS, CSS, Swift, Kotlin/Compose).

## Build Commands

```bash
# Install dependencies
npm install

# Build all platform outputs
npm run build

# Copy JSON outputs to packages directory
npm run copy-json
```

The build process generates platform-specific outputs in the `dist/` directory (gitignored):
- `dist/js/` - JavaScript/TypeScript ESM exports and type definitions
- `dist/css/` - CSS custom properties with `--tz-*` naming
- `dist/json/` - Nested and flat JSON formats
- `dist/ios/` - Swift enum for iOS/macOS (SwiftPM)
- `dist/compose/` - Kotlin object for Jetpack Compose

## Source Structure

- `src/base.tokens.json` - Base/core design tokens (colors, typography, elevation, spacing, etc.) in DTCG format
- `src/theme/` - Theme-specific token overrides (e.g., `standard-light.json`)
- `sd.config.mjs` - Style Dictionary configuration with custom transforms

## Key Architecture Details

### Token Format

All source tokens follow DTCG specification with `$value` and `$type` properties. Theme files may use simplified format without `$` prefix for convenience (parsed by tokens-studio preprocessor).

### Elevation (Shadow) Layer Naming

The `elevation.*` tokens contain multiple shadow layers that are renamed during transformation:
- Layer index `0` or `1` → `core` (first shadow layer)
- Layer index `2` → `cast` (second shadow layer)

Example output names:
- CSS: `--tz-elevation-6-core-blur`, `--tz-elevation-6-cast-blur`
- JS: `tzElevation6CoreBlur`, `tzElevation6CastBlur`

This custom mapping is handled by the `aliasElevationLayer()` function in `sd.config.mjs`.

### Typography & Shadow Expansion

The configuration expands composite tokens differently per platform:

- **Platforms with expansion** (`expand.include: ["typography", "shadow"]`): JS, JSON, Compose, iOS
  - `typography` tokens are split into individual properties: `fontFamily`, `fontWeight`, `fontSize`, `lineHeight`
  - `shadow` tokens are split into individual properties: `color`, `offsetX`, `offsetY`, `blur`, `spread`

- **Platform without expansion**: CSS
  - Typography and shadows remain as composite values
  - Elevation outputs combined shadow values (e.g., `--tz-elevation-6-core`)

### Custom Transforms

Two custom name transforms in `sd.config.mjs`:

1. **`name/kebab-elevation-layer`** (CSS)
   - Converts token path to kebab-case
   - Applies elevation layer aliasing (0/1 → core, 2 → cast)
   - Adds prefix via options

2. **`name/camel-elevation-layer`** (JS/Compose/iOS)
   - Converts token path to camelCase
   - Applies elevation layer aliasing
   - Adds prefix via options

### Token Naming Convention

- Source tokens use semantic hierarchy: `color.semantic.primary.bg`
- Output prefix: `tz` (e.g., `tzSemanticPrimaryBg` in JS, `--tz-semantic-primary-bg` in CSS)

## Theme Switching (CSS)

The build process automatically generates theme-specific CSS files for dynamic theme switching:

### Output Structure
- `dist/css/tokens.css` - All tokens with `:root` selector (default/fallback)
- `dist/css/themes/<theme-name>.css` - Theme-specific CSS with `:root[data-theme="<theme-name>"]` selector

### How It Works
1. Build detects all JSON files in `src/theme/` directory (via `globSync`)
2. For each theme file, generates a separate CSS file with themed selector
3. Theme CSS includes all tokens (base + theme) for proper reference resolution
4. CSS cascade allows theme-specific values to override defaults

### Usage Example
```html
<!-- Load base tokens -->
<link rel="stylesheet" href="dist/css/tokens.css">

<!-- Load theme-specific overrides -->
<link rel="stylesheet" href="dist/css/themes/standard-light.css">
```

Switch themes dynamically:
```javascript
// Activate theme
document.documentElement.setAttribute('data-theme', 'standard-light');

// Remove theme (fallback to :root defaults)
document.documentElement.removeAttribute('data-theme');
```

### Adding New Themes
1. Create new JSON file in `src/theme/` (e.g., `dark.json`)
2. Run `npm run build`
3. Theme CSS will be automatically generated at `dist/css/themes/dark.css`
4. All theme files must use DTCG format (`$value`, `$type`)

## Platform-Specific Notes

### JavaScript/TypeScript (npm)
- Main entry: `dist/js/tokens.js` (ESM)
- TypeScript definitions: `dist/js/tokens.d.ts`
- CSS import: `@tzie/tokens/tokens.css`

### iOS/SwiftPM
- `Package.swift` defines the SwiftPM package
- Targets `dist/ios/DesignTokens.swift` as source
- Platforms: iOS 14+, macOS 12+

### Kotlin/Compose
- Gradle configuration in `kotlin/build.gradle.kts`
- Sources `dist/compose/Tokens.kt`
- Package: `com.tzie.tokens`
- Artifact: `tokens-compose`

## Important Development Notes

- The `dist/` directory is gitignored and auto-generated by Style Dictionary
- Always run `npm run build` after modifying source tokens
- Token references use curly brace syntax: `{color.semantic.primary.fg}`
- When adding new elevation levels, remember the layer index mapping (0/1=core, 2=cast)

### Critical: Do NOT Create Unnecessary Files

**NEVER** create example files, demo files, or sample HTML/usage files unless explicitly requested by the user. This includes:
- Example HTML files (e.g., `example-*.html`)
- Demo applications
- Sample usage files
- Tutorial files

Focus only on:
- Actual source code modifications
- Configuration file updates
- Documentation updates (README.md, CLAUDE.md)
- Build/tooling improvements

If you believe an example would be helpful, **ask first** rather than creating it.
