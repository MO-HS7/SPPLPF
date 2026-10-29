'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '../../../lib/i18n';
import type { ProgramDemo } from '../../../lib/demo/types';
import { Badge, Button, Card, CardContent, CardFooter, CardTitle, EmptyState, Input } from '../../../components/ui';
import { IconArrowLeft, IconArrowRight, IconMapPin } from '../../../components/icons';

export interface ProgramsClientProps {
  programs: ProgramDemo[];
  locale: Locale;
}

export function ProgramsClient({ programs, locale }: ProgramsClientProps) {
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? IconArrowLeft : IconArrowRight;
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = programs.filter((p) => {
    const matchesPillar = selectedPillar === 'all' || p.pillar === selectedPillar;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.titleAr.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.descriptionAr.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);
    return matchesPillar && matchesQuery;
  });

  const filterTabs = [
    { id: 'all', label: isAr ? 'جميع البرامج' : 'All Programs' },
    { id: 'mediation', label: isAr ? 'الوساطة وفض النزاعات' : 'Mediation & Peace' },
    { id: 'legal', label: isAr ? 'الحماية وسيادة القانون' : 'Legal Protection' },
    { id: 'empowerment', label: isAr ? 'تمكين المرأة والشباب' : 'Women & Youth' },
    { id: 'governance', label: isAr ? 'الحوكمة والنزاهة' : 'Governance & Integrity' },
  ];

  return (
    <div>
      {/* Search & Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBlockEnd: 'var(--space-8)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        {/* Pillar Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {filterTabs.map((tab) => {
            const isActive = selectedPillar === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedPillar(tab.id)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--color-brand-primary)' : 'var(--color-bg-elevated)',
                  color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <Input
            placeholder={isAr ? 'بحث في البرامج...' : 'Search programs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBlockEnd: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        {isAr
          ? `عرض ${filtered.length} برنامج من أصل ${programs.length}`
          : `Showing ${filtered.length} of ${programs.length} programs`}
      </div>

      {/* Grid of Programs */}
      {filtered.length === 0 ? (
        <EmptyState
          title={isAr ? 'لا توجد برامج مطابقة' : 'No Programs Found'}
          description={isAr ? 'جرّب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً' : 'Try searching with different terms or selecting another category'}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPillar('all');
                setSearchQuery('');
              }}
            >
              {isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {filtered.map((p) => (
            <Card key={p.id} hoverEffect style={{ borderBlockStart: '4px solid var(--color-brand-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                <Badge variant={p.pillar === 'mediation' ? 'primary' : p.pillar === 'legal' ? 'secondary' : 'accent'} size="sm">
                  {p.pillar}
                </Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <IconMapPin size={14} />
                  <span>{p.location}</span>
                </div>
              </div>

              <CardTitle>
                <Link href={`/${locale}/programs/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {isAr ? p.titleAr : p.titleEn}
                </Link>
              </CardTitle>

              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {isAr ? p.descriptionAr : p.descriptionEn}
                </p>

                <div style={{ marginBlockStart: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: 'var(--space-1)' }}>
                    {isAr ? 'الأهداف الرئيسية:' : 'Key Objectives:'}
                  </span>
                  <ul style={{ paddingInlineStart: '1rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', listStyle: 'disc', margin: 0, lineHeight: 1.65 }}>
                    {(isAr ? p.objectivesAr : p.objectivesEn).slice(0, 2).map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/${locale}/programs/${p.slug}`} className="link-arrow" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)', textDecoration: 'none' }}>
                  <span>{isAr ? 'تفاصيل البرنامج' : 'Program Details'}</span>
                  <ArrowIcon size={14} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
