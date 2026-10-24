'use client';

import React, { useState } from 'react';
import type { Locale } from '../../../lib/i18n';
import type { PublicationDemo } from '../../../lib/demo/types';
import { Badge, Button, Card, CardContent, CardFooter, CardTitle, EmptyState, Input } from '../../../components/ui';
import { IconCalendar, IconDownload, IconFileText, IconSearch } from '../../../components/icons';

export interface PublicationsClientProps {
  publications: PublicationDemo[];
  locale: Locale;
}

export function PublicationsClient({ publications, locale }: PublicationsClientProps) {
  const isAr = locale === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filtered = publications.filter((pub) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      pub.titleAr.toLowerCase().includes(q) ||
      pub.titleEn.toLowerCase().includes(q) ||
      pub.summaryAr.toLowerCase().includes(q) ||
      pub.summaryEn.toLowerCase().includes(q) ||
      pub.category.toLowerCase().includes(q)
    );
  });

  const handleDownload = (pub: PublicationDemo) => {
    pub.downloadCount += 1;
    const msg = isAr
      ? `محاكاة التحميل: تم بدء تحميل ملف "${pub.titleAr}" (${pub.fileSize})`
      : `Download Simulated: Downloading "${pub.titleEn}" (${pub.fileSize})`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

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
            ? `عرض ${filtered.length} إصدار ودراسة بحثية`
            : `Showing ${filtered.length} publications & policy briefs`}
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Input
            placeholder={isAr ? 'بحث في الإصدارات...' : 'Search publications...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={isAr ? 'لم يتم العثور على إصدارات مطابقة' : 'No Publications Found'}
          description={isAr ? 'جرّب البحث بكلمات أخرى' : 'Try searching with different terms'}
          action={
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              {isAr ? 'مسح البحث' : 'Clear Search'}
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
          {filtered.map((pub) => (
            <Card key={pub.id} hoverEffect>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {pub.publishedAt}
                </span>
                <Badge variant="primary" size="sm">{pub.category}</Badge>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', marginBlockEnd: 'var(--space-3)' }}>
                <div
                  style={{
                    width: '3.5rem',
                    height: '4.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-navy-900)',
                    color: 'var(--color-brand-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconFileText size={30} />
                </div>
                <CardTitle style={{ margin: 0 }}>
                  {isAr ? pub.titleAr : pub.titleEn}
                </CardTitle>
              </div>

              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {isAr ? pub.summaryAr : pub.summaryEn}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    marginBlockStart: 'var(--space-4)',
                    paddingBlockStart: 'var(--space-2)',
                    borderBlockStart: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <span>{isAr ? 'الصفحات:' : 'Pages:'} {pub.pages}</span>
                  <span>•</span>
                  <span>{isAr ? 'الحجم:' : 'Size:'} {pub.fileSize}</span>
                  <span>•</span>
                  <span>{isAr ? 'مرات التحميل:' : 'Downloads:'} {pub.downloadCount}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(pub)}
                  style={{ width: '100%' }}
                >
                  <IconDownload size={16} />
                  <span>{isAr ? 'تحميل التقرير (PDF)' : 'Download PDF Report'}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-brand-primary)',
            color: '#ffffff',
            padding: 'var(--space-3) var(--space-6)',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 10001,
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
