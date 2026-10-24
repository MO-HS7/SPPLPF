import React from 'react';
import Link from 'next/link';
import type { Locale } from '../../lib/i18n';
import { IconChevronLeft, IconChevronRight } from '../icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale?: Locale;
}

export function Breadcrumbs({ items, locale = 'ar' }: BreadcrumbsProps) {
  const isRtl = locale === 'ar';
  const Separator = isRtl ? IconChevronLeft : IconChevronRight;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        marginBlockEnd: 'var(--space-4)',
      }}
    >
      <Link href={`/${locale}`} style={{ color: 'var(--color-text-muted)' }}>
        {locale === 'ar' ? 'الرئيسية' : 'Home'}
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <span style={{ display: 'inline-flex', opacity: 0.5 }}>
              <Separator size={14} />
            </span>
            {isLast || !item.href ? (
              <span style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} style={{ color: 'var(--color-text-muted)' }}>
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
