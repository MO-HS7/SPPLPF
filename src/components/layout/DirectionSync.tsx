'use client';

import { useEffect } from 'react';
import type { Locale } from '../../lib/i18n';

export function DirectionSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    const dir = locale === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.body.setAttribute('data-lang', locale);
  }, [locale]);

  return null;
}
