export type DTCGToken<TType extends string, TValue> = {
    $value: TValue;
    $type: TType;
    $description?: string;
};

export type SchemeToken = DTCGToken<"string", "light" | "dark">;

export type ColorToken = DTCGToken<"color", string>;

export type AppColorTokens = {
    system: ColorToken;
    background: ColorToken;
    foreground: ColorToken;
};

export type SemanticColorTokens = {
    bg: ColorToken;
    fg: ColorToken;
    border: ColorToken;
    icon: ColorToken;
    "focus-ring": ColorToken;
    "bg-hover": ColorToken;
    "bg-pressed": ColorToken;
    "soft-bg": ColorToken;
    "soft-fg": ColorToken;
    "soft-border": ColorToken;
    "soft-bg-hover": ColorToken;
    "soft-bg-pressed": ColorToken;
};

export type TzieColorScaleTokens = {
    "50": ColorToken;
    "100": ColorToken;
    "200": ColorToken;
    "300": ColorToken;
    "400": ColorToken;
    "500": ColorToken;
    "600": ColorToken;
    "700": ColorToken;
    "800": ColorToken;
    "900": ColorToken;
};

export type TzieTheme = {
    scheme: SchemeToken;
    color: {
        app: AppColorTokens;
        semantic: Record<string, SemanticColorTokens>;
        [colorName: string]:
            | AppColorTokens
            | Record<string, SemanticColorTokens>
            | TzieColorScaleTokens;
    };
};
