import { createContext, useContext } from "react";
import { t, type Locale } from "@/i18n";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: "zh",
  setLocale: () => {},
  t: (key: string) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function useTranslation() {
  const { locale, t: translate } = useContext(I18nContext);
  return { locale, t: translate };
}

export function createI18nValue(
  locale: Locale,
  setLocale: (locale: Locale) => void
): I18nContextValue {
  return {
    locale,
    setLocale,
    t: (key: string) => t(locale, key),
  };
}
