import StyleDictionary from "style-dictionary";

// elevation layer (0/1 → core, 2 → cast) の変換
export const aliasElevationLayer = (path) => {
  const p = path.map(String);
  const idx = p.indexOf("elevation");
  if (idx === -1 || p.length <= idx + 2) return p;
  const layer = p[idx + 2];
  const alias =
    layer === "0" || layer === "1" ? "core" : layer === "2" ? "cast" : null;
  if (!alias) return p;
  const cloned = [...p];
  cloned[idx + 2] = alias;
  return cloned;
};

// path を正規化して case 変換する共通関数
export const normalizePath = (path, toCase) => {
  const normalized = path
    .map((seg) =>
      String(seg)
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
    )
    .flat();

  if (toCase === "kebab") {
    return normalized.join("-");
  }
  // camelCase
  return normalized
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join("");
};

// base/theme グループ化
export const groupTokensBySource = (allTokens) => {
  const baseTokens = [];
  const themeTokensByName = {};

  allTokens.forEach((token) => {
    const filePath = token.filePath || "";
    if (filePath.includes("base.tokens.json")) {
      baseTokens.push(token);
    } else if (filePath.includes("theme/") || filePath.includes("theme\\")) {
      // Windows path support
      const match =
        filePath.match(/theme[/\\](.+)\.json$/)?.[1] ||
        filePath.match(/([^/\\]+)\.json$/)?.[1];
      if (match) {
        (themeTokensByName[match] ??= []).push(token);
      }
    }
  });

  return { baseTokens, themeTokensByName };
};

// Register all custom transforms
export const registerTransforms = () => {
  // Name transforms
  ["kebab", "camel"].forEach((caseType) => {
    StyleDictionary.registerTransform({
      name: `name/${caseType}-elevation-layer`,
      type: "name",
      transform: (token, options) => {
        const name = normalizePath(
          aliasElevationLayer(token.path),
          caseType
        );
        const prefix = options?.prefix;
        if (!prefix) return name;
        return caseType === "kebab"
          ? `${prefix}-${name}`
          : `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      },
    });
  });

  // Dimension transforms
  ["swift/cgfloat", "compose/dp"].forEach((name) => {
    StyleDictionary.registerTransform({
      name: `size/${name}`,
      type: "value",
      matcher: (token) => {
        const type = token.$type || token.type;
        const value = token.$value || token.value;

        if (type !== "dimension") {
          return false;
        }

        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed.endsWith("px")) return false;
          const num = parseFloat(trimmed);
          return !isNaN(num) && isFinite(num);
        }

        if (typeof value === "number") {
          return !isNaN(value) && isFinite(value);
        }

        return false;
      },
      transform: (token) => {
        const type = token.$type || token.type;
        const value = token.$value || token.value;

        if (type !== "dimension") {
          return value;
        }

        const num = typeof value === "string" ? parseFloat(value) : value;
        return name === "swift/cgfloat" ? `CGFloat(${num})` : `${num}.dp`;
      },
    });
  });
};
