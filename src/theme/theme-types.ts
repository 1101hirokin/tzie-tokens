export type TzieDtcgToken<TType extends string, TValue> = {
    $value: TValue;
    $type: TType;
    $description?: string;
};

export type TzieSchemeToken = TzieDtcgToken<"string", "light" | "dark">;

export type TzieColorToken = TzieDtcgToken<"color", string>;

export type TzieAppColorTokens = Partial<{
    system: TzieColorToken;
    background: TzieColorToken;
    foreground: TzieColorToken;
}>;

export type TzieSemanticColorTokens = Partial<{
    bg: TzieColorToken;
    fg: TzieColorToken;
    border: TzieColorToken;
    icon: TzieColorToken;
    "focus-ring": TzieColorToken;
    "bg-hover": TzieColorToken;
    "bg-pressed": TzieColorToken;
    "soft-bg": TzieColorToken;
    "soft-fg": TzieColorToken;
    "soft-border": TzieColorToken;
    "soft-bg-hover": TzieColorToken;
    "soft-bg-pressed": TzieColorToken;
}>;

export type TzieColorScaleTokens = Partial<{
    "50": TzieColorToken;
    "100": TzieColorToken;
    "200": TzieColorToken;
    "300": TzieColorToken;
    "400": TzieColorToken;
    "500": TzieColorToken;
    "600": TzieColorToken;
    "700": TzieColorToken;
    "800": TzieColorToken;
    "900": TzieColorToken;
}>;

export type TzieTheme = {
    scheme?: TzieSchemeToken;
    color?: {
        app?: TzieAppColorTokens;
        semantic?: Record<string, TzieSemanticColorTokens>;
        [colorName: string]:
            | TzieAppColorTokens
            | Record<string, TzieSemanticColorTokens>
            | TzieColorScaleTokens
            | undefined;
    };
};
