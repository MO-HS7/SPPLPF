import { arDictionary } from './dictionaries/ar';
import { enDictionary } from './dictionaries/en';
import type { Dictionary, Direction, Locale } from './types';

export * from './types';

export const DEFAULT_LOCALE: Locale = 'ar';
export const LOCALES: Locale[] = ['ar', 'en'];

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

export function getDictionary(locale: string): Dictionary {
  if (locale === 'en') {
    return enDictionary;
  }
  return arDictionary;
}

export function getDirection(locale: string): Direction {
  return locale === 'en' ? 'ltr' : 'rtl';
}

export function getOppositeLocale(locale: string): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  if (!pathname) return `/${targetLocale}`;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;
  if (LOCALES.includes(segments[0] as Locale)) {
    segments[0] = targetLocale;
    return '/' + segments.join('/');
  }
  return `/${targetLocale}/${segments.join('/')}`;
}
