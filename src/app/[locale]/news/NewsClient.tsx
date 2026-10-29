'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '../../../lib/i18n';
import type { ContentItemDemo } from '../../../lib/demo/types';
import { Badge, Button, Card, CardContent, CardFooter, CardTitle, EmptyState, Input, Pagination } from '../../../components/ui';
import { IconArrowLeft, IconArrowRight, IconCalendar } from '../../../components/icons';

export interface NewsClientProps {
  items: ContentItemDemo[];
  locale: Locale;
}

export function NewsClient({ items, locale }: NewsClientProps) {
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? IconArrowLeft : IconArrowRight;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.titleAr.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.summaryAr.toLowerCase().includes(q) ||
      item.summaryEn.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Search Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBlockEnd: 'var(--space-8)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {isAr
            ? `عرض ${filtered.length} مادة إخبارية وبيان صحفي`
            : `Showing ${filtered.length} news articles & statements`}
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Input
            placeholder={isAr ? 'بحث في الأخبار...' : 'Search news...'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Grid of News Items */}
      {paginated.length === 0 ? (
        <EmptyState
          title={isAr ? 'لم يتم العثور على أخبار مطابقة' : 'No News Found'}
          description={isAr ? 'جرّب البحث بكلمات مفتاحية أخرى' : 'Try searching with different keywords'}
          action={
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              {isAr ? 'مسح البحث' : 'Clear Search'}
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {paginated.map((item) => (
            <Card key={item.id} hoverEffect>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconCalendar size={13} />
                  <span>{item.publishedAt}</span>
                </span>
                <Badge variant="primary" size="sm">{item.category}</Badge>
              </div>

              <CardTitle>
                <Link href={`/${locale}/news/${item.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {isAr ? item.titleAr : item.titleEn}
                </Link>
              </CardTitle>

              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {isAr ? item.summaryAr : item.summaryEn}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBlockStart: 'var(--space-3)' }}>
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
                        backgroundColor: 'var(--color-bg-elevated)',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/${locale}/news/${item.slug}`} className="link-arrow" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)', textDecoration: 'none' }}>
                  <span>{isAr ? 'قراءة البيان كاملاً' : 'Read Full Statement'}</span>
                  <ArrowIcon size={14} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        direction={isAr ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
