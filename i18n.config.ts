export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es", "fr", "it", "ru", "zh"],
  prefixDefault: false,
} as const;

export type Locale = (typeof i18n)["locales"][number];
