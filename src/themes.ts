import standardLight from "./theme/standard-light.json" with { type: "json" };
import type { TzieTheme } from "./theme/theme-types.js";

export type { TzieTheme } from "./theme/theme-types.js";

export const themes: Record<string, TzieTheme> = {
  "standard-light": standardLight as unknown as TzieTheme,
};
