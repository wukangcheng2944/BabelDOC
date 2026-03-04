import { zh } from './zh';
import { en } from './en';

export type Locale = 'zh' | 'en';

export const translations = { zh, en } as const;

export type TranslationKeys = typeof zh;

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let result: unknown = translations[locale];
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof result === 'string' ? result : key;
}
