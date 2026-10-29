'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Locale } from '../../lib/i18n';
import type { GovernorateMeta } from './YemenLeafletCanvas';
import { Badge, Button } from '../ui';
import {
  IconMapPin,
  IconShield,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconBuilding,
} from '../icons';

const YemenLeafletCanvas = dynamic(() => import('./YemenLeafletCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '430px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--map-water)',
        border: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
      }}
    >
      <div
        style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid var(--color-border-strong)',
          borderTopColor: 'var(--color-brand-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span>جارٍ تحميل الخريطة الجغرافية التفاعلية... / Loading Interactive Map...</span>
    </div>
  ),
});

/**
 * Verified Yemen ADM1 Governorates Metadata (22 Governorates)
 * Cross-referenced with:
 * - geoBoundaries-YEM-ADM1 (CC-BY 4.0, Runfola et al. 2020)
 * - YemenOpenSource/Yemen-info & open-admin-data/yemen-administrative-divisions
 * - SPPLPF Canonical Operational Scope: Strictly Taiz, Marib, and Sana'a
 */
export const YEMEN_GOVERNORATES_META: Record<string, GovernorateMeta> = {
  'YE-TA': {
    iso: 'YE-TA',
    id: 'taiz',
    nameAr: 'محافظة تعز',
    nameEn: 'Taiz Governorate',
    hasPresence: true,
    hubRoleAr: 'المقر الرئيسي ومركز القيادة والعمليات',
    hubRoleEn: 'Headquarters & Core Operational Command',
    scopeAr:
      'إدارة وتنسيق كافة البرامج والعمليات الميدانية والمؤسسية، وتقديم العون القضائي، وتيسير مبادرات الوساطة المجتمعية وحماية المدنيين انطلاقاً من المقر الرئيسي في مدينة تعز.',
    scopeEn:
      'Overall operational command, governance, legal aid clinics, and community mediation initiatives coordinated from headquarters in Taiz.',
    approxCoords: [13.578, 44.017],
    programsAr: [
      'الوساطة المحلية وفض النزاعات المجتمعية',
      'العيادات القانونية ومراقبة ضمانات الاحتجاز',
      'تمكين النساء والشباب في قيادة السلام',
    ],
    programsEn: [
      'Local Mediation & Conflict Resolution',
      'Legal Aid Clinics & Detention Safeguards',
      'Women & Youth Peace Leadership',
    ],
  },
  'YE-MA': {
    iso: 'YE-MA',
    id: 'marib',
    nameAr: 'محافظة مأرب',
    nameEn: 'Marib Governorate',
    hasPresence: true,
    hubRoleAr: 'الفرع الميداني والتنفيذي',
    hubRoleEn: 'Field & Executive Branch Office',
    scopeAr:
      'تنفيذ برامج التماسك الاجتماعي، دعم لجان المصالحة المجتمعية، وتقديم الحماية القانونية للنازحين والمجتمعات المضيفة في عموم مديريات محافظة مأرب.',
    scopeEn:
      'Executing social cohesion programs, supporting community reconciliation committees, and extending legal protection for IDPs and host communities across Marib.',
    approxCoords: [15.462, 45.325],
    programsAr: [
      'لجنة المصالحة المجتمعية والوساطة المحلية',
      'الحماية القانونية للنازحين والمجتمعات المضيفة',
      'تأهيل الشباب في بناء السلم المجتمعي',
    ],
    programsEn: [
      'Community Reconciliation Committee & Mediation',
      'Legal Protection for IDPs & Host Communities',
      'Youth Capacity Building in Social Peace',
    ],
  },
  'YE-SA': {
    iso: 'YE-SA',
    id: 'sanaa',
    nameAr: 'صنعاء (أمانة العاصمة والمحافظة)',
    nameEn: "Sana'a (Capital & Governorate)",
    hasPresence: true,
    hubRoleAr: 'مكتب التنسيق والمهام القانونية المتخصصة',
    hubRoleEn: 'Specialized Coordination & Legal Office',
    scopeAr:
      'متابعة ملفات الرصد القانوني، التنسيق الإنساني المحايد لتبادل المحتجزين، وبناء قدرات منظمات المجتمع المدني في الحوكمة والنزاهة المؤسسية.',
    scopeEn:
      'Coordinating impartial humanitarian detainee initiatives, legal procedural monitoring, and CSO governance capacity building.',
    approxCoords: [15.369, 44.191],
    programsAr: [
      'التنسيق الإنساني المحايد ومبادرات المحتجزين',
      'برنامج سيادة القانون والدفاع عن الحقوق المدنية',
      'الحوكمة والنزاهة المؤسسية للمجتمع المدني',
    ],
    programsEn: [
      'Impartial Humanitarian & Detainee Coordination',
      'Rule of Law & Civil Rights Defense',
      'CSO Institutional Governance & Transparency',
    ],
  },
  'YE-SN': {
    iso: 'YE-SN',
    id: 'sanaa-gov',
    nameAr: 'محافظة صنعاء',
    nameEn: "Sana'a Governorate",
    hasPresence: true,
    hubRoleAr: 'نطاق تغطية مكتب صنعاء التنسيقي',
    hubRoleEn: "Covered by Sana'a Coordination Office",
    scopeAr: 'ضمن النطاق التنسيقي لمكتب صنعاء المتخصص في المهام الإنسانية والقانونية المحايدة.',
    scopeEn: "Covered under the operational coordination scope of the Sana'a specialized office.",
  },
  'YE-AD': { iso: 'YE-AD', id: 'aden', nameAr: 'محافظة عدن', nameEn: 'Aden Governorate', hasPresence: false },
  'YE-HD': { iso: 'YE-HD', id: 'hadramaut', nameAr: 'محافظة حضرموت', nameEn: 'Hadhramaut Governorate', hasPresence: false },
  'YE-HU': { iso: 'YE-HU', id: 'hudaydah', nameAr: 'محافظة الحديدة', nameEn: 'Al Hudaydah Governorate', hasPresence: false },
  'YE-IB': { iso: 'YE-IB', id: 'ibb', nameAr: 'محافظة إب', nameEn: 'Ibb Governorate', hasPresence: false },
  'YE-DH': { iso: 'YE-DH', id: 'dhamar', nameAr: 'محافظة ذمار', nameEn: 'Dhamar Governorate', hasPresence: false },
  'YE-BA': { iso: 'YE-BA', id: 'bayda', nameAr: 'محافظة البيضاء', nameEn: 'Al Bayda Governorate', hasPresence: false },
  'YE-SH': { iso: 'YE-SH', id: 'shabwah', nameAr: 'محافظة شبوة', nameEn: 'Shabwah Governorate', hasPresence: false },
  'YE-JA': { iso: 'YE-JA', id: 'jawf', nameAr: 'محافظة الجوف', nameEn: 'Al Jawf Governorate', hasPresence: false },
  'YE-SD': { iso: 'YE-SD', id: 'saada', nameAr: 'محافظة صعدة', nameEn: "Sa'dah Governorate", hasPresence: false },
  'YE-AM': { iso: 'YE-AM', id: 'amran', nameAr: 'محافظة عمران', nameEn: "'Amran Governorate", hasPresence: false },
  'YE-HJ': { iso: 'YE-HJ', id: 'hajjah', nameAr: 'محافظة حجة', nameEn: 'Hajjah Governorate', hasPresence: false },
  'YE-MW': { iso: 'YE-MW', id: 'mahwit', nameAr: 'محافظة المحويت', nameEn: 'Al Mahwit Governorate', hasPresence: false },
  'YE-DA': { iso: 'YE-DA', id: 'dhale', nameAr: 'محافظة الضالع', nameEn: "Ad Dali' Governorate", hasPresence: false },
  'YE-LA': { iso: 'YE-LA', id: 'lahij', nameAr: 'محافظة لحج', nameEn: 'Lahij Governorate', hasPresence: false },
  'YE-AB': { iso: 'YE-AB', id: 'abyan', nameAr: 'محافظة أبين', nameEn: 'Abyan Governorate', hasPresence: false },
  'YE-MR': { iso: 'YE-MR', id: 'mahrah', nameAr: 'محافظة المهرة', nameEn: 'Al Mahrah Governorate', hasPresence: false },
  'YE-RA': { iso: 'YE-RA', id: 'raymah', nameAr: 'محافظة ريمة', nameEn: 'Raymah Governorate', hasPresence: false },
  'YE-SU': { iso: 'YE-SU', id: 'socotra', nameAr: 'أرخبيل سقطرى', nameEn: 'Socotra Governorate', hasPresence: false },
};

export interface YemenMapProps {
  locale: Locale;
  className?: string;
  style?: React.CSSProperties;
}

export function YemenGovernorateMap({ locale, className = '', style }: YemenMapProps) {
  const isAr = locale === 'ar';
  const [selectedIso, setSelectedIso] = useState<string>('YE-TA');
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<
    Geometry,
    { shapeName: string; shapeISO: string; shapeID: string }
  > | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);

  const NextArrow = isAr ? IconArrowLeft : IconArrowRight;

  useEffect(() => {
    let active = true;
    fetch('/data/yemen-adm1-simplified.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then((data) => {
        if (active) setGeoJsonData(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const primaryHubs = useMemo(
    () => [
      YEMEN_GOVERNORATES_META['YE-TA'],
      YEMEN_GOVERNORATES_META['YE-MA'],
      YEMEN_GOVERNORATES_META['YE-SA'],
    ],
    []
  );

  const otherGovernorates = useMemo(
    () =>
      Object.values(YEMEN_GOVERNORATES_META).filter(
        (g) => !g.hasPresence
      ),
    []
  );

  const activeMeta =
    YEMEN_GOVERNORATES_META[selectedIso] || YEMEN_GOVERNORATES_META['YE-TA'];

  return (
    <div className={className} style={{ ...style }}>
      {/* Interactive Map + Details Panel Split Layout */}
      <div className="yemen-map-layout">
        {/* Left/Start Column: Real Interactive GeoJSON Map */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Map Header Bar & Legend */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginBlockEnd: '1rem',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  color: 'var(--color-brand-primary)',
                  margin: 0,
                }}
              >
                {isAr
                  ? 'خريطة الجمهورية اليمنية — نطاق التواجد المؤسسي'
                  : 'Republic of Yemen — Institutional Operational Footprint'}
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  marginTop: '0.2rem',
                }}
              >
                {isAr
                  ? 'انقر على أي محافظة لاستعراض حالة التواجد ونطاق البرامج المعتمدة'
                  : 'Select any governorate polygon or hub button to inspect operational status'}
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--color-brand-accent)',
                    border: '1px solid var(--color-gold-700)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {isAr ? 'مكاتب ومقرات معتمدة (3)' : 'Verified Operational Hubs (3)'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--map-gov-fill)',
                    border: '1px solid var(--map-gov-stroke)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {isAr ? 'محافظات أخرى' : 'Other Governorates'}
                </span>
              </div>
            </div>
          </div>

          {/* Leaflet GeoJSON Map or Fallback */}
          {loadError ? (
            <div
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <p style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                {isAr
                  ? 'تعذر تحميل طبقة الحدود الجغرافية — يرجى استخدام قائمة المحافظات التفاعلية.'
                  : 'Map boundary layer unavailable — please use the interactive governorate selector.'}
              </p>
            </div>
          ) : geoJsonData ? (
            <YemenLeafletCanvas
              geoJsonData={geoJsonData}
              governoratesMeta={YEMEN_GOVERNORATES_META}
              selectedIso={selectedIso}
              onSelectIso={setSelectedIso}
              locale={locale}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '430px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--map-water)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
              }}
            >
              {isAr ? 'جارٍ تهيئة الخريطة الجغرافية...' : 'Initializing geographic boundaries...'}
            </div>
          )}

          {/* Honest Provenance & Safety Footnote */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginTop: '0.85rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>
              {isAr
                ? 'المصدر الجغرافي: حدود المحافظات اليمنية (ADM1 - WGS84) من قاعدة بيانات geoBoundaries المفتوحة (ترخيص CC-BY 4.0).'
                : 'Geographic Data: Yemen ADM1 boundaries (WGS84) via geoBoundaries Open Database (CC-BY 4.0).'}
            </span>
            <span>
              {isAr
                ? 'ملاحظة أمنية: النقاط تمثل مراكز المحافظات التقريبية ولا تكشف إحداثيات ميدانية حساسة.'
                : 'Safety Note: Markers indicate approximate governorate centers without exposing sensitive coordinates.'}
            </span>
          </div>
        </div>

        {/* Right/End Column: Synchronized Governorate Info Panel & Keyboard Selector */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Active Governorate Detail Card */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: activeMeta.hasPresence
                ? '1.5px solid var(--color-brand-accent)'
                : '1px solid var(--color-border-subtle)',
              padding: 'clamp(1.25rem, 2vw, 1.75rem)',
              boxShadow: 'var(--shadow-md)',
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            aria-live="polite"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  marginBlockEnd: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '2.65rem',
                      height: '2.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: activeMeta.hasPresence
                        ? 'var(--color-gold-100)'
                        : 'var(--color-bg-subtle)',
                      color: activeMeta.hasPresence
                        ? 'var(--color-brand-accent)'
                        : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {activeMeta.hasPresence ? <IconBuilding size={20} /> : <IconMapPin size={20} />}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'var(--color-brand-primary)',
                        margin: 0,
                      }}
                    >
                      {isAr ? activeMeta.nameAr : activeMeta.nameEn}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {activeMeta.hasPresence
                        ? isAr
                          ? activeMeta.hubRoleAr
                          : activeMeta.hubRoleEn
                        : isAr
                          ? 'محافظة يمنية (ADM1)'
                          : 'Yemeni Governorate (ADM1)'}
                    </span>
                  </div>
                </div>

                <Badge variant={activeMeta.hasPresence ? 'success' : 'neutral'} size="sm">
                  {activeMeta.hasPresence
                    ? isAr
                      ? 'تواجد معتمد'
                      : 'Verified Hub'
                    : isAr
                      ? 'لا يوجد مكتب حالي'
                      : 'No Active Office'}
                </Badge>
              </div>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBlockEnd: '1rem',
                }}
              >
                {activeMeta.hasPresence
                  ? isAr
                    ? activeMeta.scopeAr
                    : activeMeta.scopeEn
                  : isAr
                    ? 'لا تمتلك المؤسسة مكتباً ميدانياً مقيماً في هذه المحافظة حالياً. يتركز النطاق العملياتي المعتمد للمؤسسة في كل من محافظة تعز (المقر الرئيسي)، محافظة مأرب (فرع ميداني)، وصنعاء (مكتب تنسيقي متخصص).'
                    : 'SPPLPF does not currently maintain a permanent resident office in this governorate. Approved institutional operations are anchored in Taiz (Headquarters), Marib (Field Branch), and Sanaa (Coordination Office).'}
              </p>

              {activeMeta.hasPresence && activeMeta.programsAr && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.9rem 1rem',
                    border: '1px solid var(--color-border-subtle)',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-primary)',
                      marginBlockEnd: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <IconShield size={14} style={{ color: 'var(--color-brand-secondary)' }} />
                    <span>
                      {isAr ? 'مسارات التدخل الرئيسية في المحافظة:' : 'Key Intervention Tracks in Governorate:'}
                    </span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {(isAr ? activeMeta.programsAr : activeMeta.programsEn || []).map((prog, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <IconCheck size={13} style={{ color: 'var(--color-brand-success)', flexShrink: 0 }} />
                        <span>{prog}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--color-border-subtle)',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <Link href={`/${locale}/presence`} style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm" icon={<NextArrow size={14} />}>
                  {isAr ? 'دليل المكاتب والتصاريح' : 'Offices & Scope Directory'}
                </Button>
              </Link>
              <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">
                  {isAr ? 'تواصل مع المكتب' : 'Contact Hub'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Keyboard-Accessible Location Switcher */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border-subtle)',
              padding: '1.15rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBlockEnd: '0.65rem',
              }}
            >
              {isAr
                ? 'الوصول السريع للمقرات المعتمدة (ملائم للوحة المفاتيح):'
                : 'Quick Keyboard Hub Selector (Verified Presence):'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBlockEnd: '0.85rem' }}>
              {primaryHubs.map((hub) => {
                const isSelected = selectedIso === hub.iso;
                return (
                  <button
                    key={hub.iso}
                    type="button"
                    onClick={() => setSelectedIso(hub.iso)}
                    aria-pressed={isSelected}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected
                        ? '1.5px solid var(--color-brand-accent)'
                        : '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected
                        ? 'var(--color-gold-50)'
                        : 'var(--color-bg-subtle)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'start',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'var(--color-brand-accent)' : 'var(--color-brand-secondary)',
                        }}
                      />
                      <span style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                        {isAr ? hub.nameAr : hub.nameEn}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {isAr ? hub.hubRoleAr : hub.hubRoleEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown to inspect any of the other 18 governorates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label
                htmlFor="yemen-gov-select"
                style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                {isAr ? 'استعراض محافظة أخرى:' : 'Inspect Governorate:'}
              </label>
              <select
                id="yemen-gov-select"
                value={selectedIso}
                onChange={(e) => setSelectedIso(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-strong)',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <optgroup label={isAr ? 'المقرات المعتمدة (تواجد نشط)' : 'Approved Operational Hubs'}>
                  {primaryHubs.map((g) => (
                    <option key={g.iso} value={g.iso}>
                      {isAr ? g.nameAr : g.nameEn}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={isAr ? 'بقية محافظات الجمهورية اليمنية' : 'Other Yemen Governorates'}>
                  {otherGovernorates.map((g) => (
                    <option key={g.iso} value={g.iso}>
                      {isAr ? g.nameAr : g.nameEn}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
