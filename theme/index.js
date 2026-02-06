// theme/index.js
// Centralized theme + tokens for a sleek karaoke-style UI.

import { MD3DarkTheme as PaperDarkTheme } from "react-native-paper";

export const tokens = {
  colors: {
    bg: "#0f1724",
    surface: "#0b1220",
    surface2: "#111b2b",
    border: "rgba(148, 163, 184, 0.16)",
    text: "#ffffff",
    textMuted: "rgba(255, 255, 255, 0.72)",
    textFaint: "rgba(255, 255, 255, 0.55)",
    primary: "#a5b4fc", // indigo accent
    secondary: "#22c55e", // green (success)
    danger: "#fb7185",
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    titleXL: 34,
    titleLG: 22,
    titleMD: 18,
    body: 14,
    caption: 12,
  },
};

export const paperTheme = {
  ...PaperDarkTheme,
  roundness: tokens.radius.md,
  colors: {
    ...PaperDarkTheme.colors,

    // Core colors
    primary: tokens.colors.primary,
    secondary: tokens.colors.secondary,
    background: tokens.colors.bg,
    surface: tokens.colors.surface,

    // Text
    onSurface: tokens.colors.text,
    onBackground: tokens.colors.text,
    onPrimary: tokens.colors.bg,

    // Optional / nice to have
    error: tokens.colors.danger,
    outline: tokens.colors.border,
  },
};
