import en from './en';
import th from './th';

export type Locale = 'en' | 'th';
const dict = { en, th } as const;

export type Keys = keyof typeof en;

export function t(key: Keys, locale: Locale): string {
  const table = dict[locale] ?? dict.en;
  return table[key] ?? key;
}


