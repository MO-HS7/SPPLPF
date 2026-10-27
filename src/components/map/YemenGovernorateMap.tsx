'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { Locale } from '../../lib/i18n';

/**
 * Yemen Governorate Map — SVG-based interactive vector map.
 * 
 * Data provenance (IMPORTANT):
 * - The SVG shapes below are HAND-DRAWN SCHEMATIC placeholders. They are
 *   NOT derived from OCHA/HDX or any official boundary dataset and do NOT
 *   represent real governorate geometry or borders.
 * - TODO: replace with simplified GeoJSON from a verified source
 *   (e.g. OCHA/HDX Yemen admin boundaries, COD-AB) before any public use.
 * - Presence flags (Taiz, Marib, Sana'a) come from the demo fixtures only.
 */

interface GovernorateData {
  id: string;
  nameAr: string;
  nameEn: string;
  /** SVG path for the governorate shape */
  path: string;
  /** Center point for label placement [x, y] */
  center: [number, number];
  /** Whether SPPLPF has operational presence here */
  hasPresence: boolean;
  /** Description of presence if applicable */
  presenceDescAr?: string;
  presenceDescEn?: string;
}

// Simplified Yemen governorate SVG paths (viewport: 0 0 800 500)
// These are schematic approximations for UI purposes
const governorates: GovernorateData[] = [
  {
    id: 'taiz',
    nameAr: 'تعز',
    nameEn: 'Taiz',
    path: 'M220,330 L260,310 L290,320 L295,350 L270,370 L240,365 L215,350 Z',
    center: [255, 340],
    hasPresence: true,
    presenceDescAr: 'مكتب رئيسي — وساطة مجتمعية وعيادات قانونية',
    presenceDescEn: 'Main office — community mediation & legal clinics',
  },
  {
    id: 'marib',
    nameAr: 'مأرب',
    nameEn: 'Marib',
    path: 'M420,200 L480,180 L520,190 L530,230 L510,270 L460,280 L420,260 L410,230 Z',
    center: [470, 230],
    hasPresence: true,
    presenceDescAr: 'مكتب ميداني — حماية النازحين والتماسك المجتمعي',
    presenceDescEn: 'Field office — IDP protection & social cohesion',
  },
  {
    id: 'sanaa',
    nameAr: 'صنعاء',
    nameEn: "Sana'a",
    path: 'M310,200 L350,185 L380,195 L390,220 L375,245 L340,255 L310,240 L305,220 Z',
    center: [345, 220],
    hasPresence: true,
    presenceDescAr: 'مكتب تنسيقي — مناصرة وبناء قدرات',
    presenceDescEn: 'Coordination office — advocacy & capacity building',
  },
  {
    id: 'aden',
    nameAr: 'عدن',
    nameEn: 'Aden',
    path: 'M270,380 L300,370 L320,380 L315,400 L290,410 L265,400 Z',
    center: [290, 390],
    hasPresence: false,
  },
  {
    id: 'hadramaut',
    nameAr: 'حضرموت',
    nameEn: 'Hadramaut',
    path: 'M530,150 L680,120 L750,140 L760,200 L720,250 L620,270 L540,260 L520,220 Z',
    center: [640, 190],
    hasPresence: false,
  },
  {
    id: 'al-hudaydah',
    nameAr: 'الحديدة',
    nameEn: 'Al Hudaydah',
    path: 'M140,250 L190,230 L220,240 L230,280 L210,320 L170,330 L140,310 L130,280 Z',
    center: [180, 280],
    hasPresence: false,
  },
  {
    id: 'ibb',
    nameAr: 'إب',
    nameEn: 'Ibb',
    path: 'M260,280 L295,270 L310,290 L300,320 L270,330 L250,315 Z',
    center: [280, 300],
    hasPresence: false,
  },
  {
    id: 'dhamar',
    nameAr: 'ذمار',
    nameEn: 'Dhamar',
    path: 'M290,240 L325,230 L340,250 L330,280 L300,290 L280,275 Z',
    center: [310, 260],
    hasPresence: false,
  },
  {
    id: 'al-bayda',
    nameAr: 'البيضاء',
    nameEn: 'Al Bayda',
    path: 'M350,260 L390,245 L420,260 L415,295 L380,310 L350,300 Z',
    center: [385, 280],
    hasPresence: false,
  },
  {
    id: 'shabwah',
    nameAr: 'شبوة',
    nameEn: 'Shabwah',
    path: 'M430,280 L520,260 L560,280 L550,330 L490,350 L430,330 Z',
    center: [490, 305],
    hasPresence: false,
  },
  {
    id: 'al-jawf',
    nameAr: 'الجوف',
    nameEn: 'Al Jawf',
    path: 'M370,130 L430,110 L460,120 L470,160 L440,185 L395,190 L370,170 Z',
    center: [415, 155],
    hasPresence: false,
  },
  {
    id: 'saada',
    nameAr: 'صعدة',
    nameEn: "Sa'ada",
    path: 'M250,130 L300,115 L330,130 L340,165 L310,185 L270,185 L245,165 Z',
    center: [290, 155],
    hasPresence: false,
  },
  {
    id: 'amran',
    nameAr: 'عمران',
    nameEn: 'Amran',
    path: 'M270,185 L305,180 L320,195 L315,215 L290,225 L265,215 Z',
    center: [293, 200],
    hasPresence: false,
  },
  {
    id: 'hajjah',
    nameAr: 'حجة',
    nameEn: 'Hajjah',
    path: 'M170,180 L220,165 L255,180 L260,215 L230,235 L185,235 L160,215 Z',
    center: [210, 200],
    hasPresence: false,
  },
  {
    id: 'al-mahwit',
    nameAr: 'المحويت',
    nameEn: 'Al Mahwit',
    path: 'M195,235 L225,228 L240,245 L230,270 L205,275 L190,260 Z',
    center: [215, 255],
    hasPresence: false,
  },
  {
    id: 'al-dhale',
    nameAr: 'الضالع',
    nameEn: "Ad Dali'",
    path: 'M285,325 L315,315 L330,335 L320,360 L290,365 L275,350 Z',
    center: [305, 340],
    hasPresence: false,
  },
  {
    id: 'lahij',
    nameAr: 'لحج',
    nameEn: 'Lahij',
    path: 'M240,360 L270,350 L290,365 L285,395 L255,405 L235,390 Z',
    center: [260, 375],
    hasPresence: false,
  },
  {
    id: 'abyan',
    nameAr: 'أبين',
    nameEn: 'Abyan',
    path: 'M325,350 L380,330 L420,345 L410,380 L360,400 L325,385 Z',
    center: [370, 365],
    hasPresence: false,
  },
  {
    id: 'al-mahrah',
    nameAr: 'المهرة',
    nameEn: 'Al Mahrah',
    path: 'M680,130 L760,110 L790,130 L790,190 L760,210 L710,220 L680,200 Z',
    center: [730, 165],
    hasPresence: false,
  },
  {
    id: 'raymah',
    nameAr: 'ريمة',
    nameEn: 'Raymah',
    path: 'M210,270 L240,260 L255,278 L248,300 L225,308 L205,295 Z',
    center: [230, 285],
    hasPresence: false,
  },
  {
    id: 'socotra',
    nameAr: 'سقطرى',
    nameEn: 'Socotra',
    path: 'M720,350 L770,340 L785,360 L775,380 L735,385 L715,370 Z',
    center: [750, 365],
    hasPresence: false,
  },
];

interface YemenMapProps {
  locale: Locale;
  className?: string;
  style?: React.CSSProperties;
}

export function YemenGovernorateMap({ locale, className = '', style }: YemenMapProps) {
  const [hoveredGov, setHoveredGov] = useState<string | null>(null);
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const isAr = locale === 'ar';

  const activeGov = selectedGov || hoveredGov;
  const activeData = useMemo(
    () => governorates.find((g) => g.id === activeGov),
    [activeGov]
  );

  const handleGovClick = useCallback((id: string) => {
    setSelectedGov((prev) => (prev === id ? null : id));
  }, []);

  const presenceGovs = useMemo(
    () => governorates.filter((g) => g.hasPresence),
    []
  );

  return (
    <div className={className} style={{ ...style }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="yemen-map-grid"
      >
        {/* SVG Map */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
          }}
        >
          {/* Map Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBlockEnd: '1rem',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-primary)',
                  margin: 0,
                }}
              >
                {isAr ? 'خريطة الانتشار الجغرافي' : 'Geographic Presence Map'}
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  marginTop: '0.25rem',
                }}
              >
                {isAr ? 'المحافظات ذات التواجد المؤسسي' : 'Governorates with institutional presence'}
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    background: 'var(--color-brand-accent)',
                    boxShadow: '0 0 6px rgba(194, 120, 3, 0.4)',
                  }}
                />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {isAr ? 'تواجد نشط' : 'Active presence'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    background: 'var(--color-bg-muted)',
                    border: '1px solid var(--color-border-strong)',
                  }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {isAr ? 'بدون تواجد' : 'No presence'}
                </span>
              </div>
            </div>
          </div>

          <svg
            viewBox="100 80 720 360"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '420px',
            }}
            role="img"
            aria-label={isAr ? 'خريطة اليمن التفاعلية' : 'Interactive Yemen Map'}
          >
            <defs>
              {/* Glow filter for active presence */}
              <filter id="gov-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor="var(--color-brand-accent)" floodOpacity="0.35" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Pulse animation for presence markers */}
              <radialGradient id="presence-pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-brand-accent)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Render governorate paths */}
            {governorates.map((gov) => {
              const isActive = activeGov === gov.id;
              const hasPresence = gov.hasPresence;

              return (
                <g key={gov.id}>
                  <path
                    d={gov.path}
                    fill={
                      isActive
                        ? hasPresence
                          ? 'var(--color-brand-accent-light)'
                          : 'var(--color-brand-primary-light)'
                        : hasPresence
                          ? 'rgba(194, 120, 3, 0.15)'
                          : 'var(--color-bg-subtle)'
                    }
                    stroke={
                      isActive
                        ? hasPresence
                          ? 'var(--color-brand-accent)'
                          : 'var(--color-brand-primary)'
                        : hasPresence
                          ? 'var(--color-brand-accent)'
                          : 'var(--color-border-strong)'
                    }
                    strokeWidth={isActive ? 2.5 : 1.2}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
                      filter: isActive && hasPresence ? 'url(#gov-glow)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredGov(gov.id)}
                    onMouseLeave={() => setHoveredGov(null)}
                    onClick={() => handleGovClick(gov.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={isAr ? gov.nameAr : gov.nameEn}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleGovClick(gov.id);
                      }
                    }}
                  />

                  {/* Presence pulsing dot */}
                  {hasPresence && (
                    <>
                      <circle
                        cx={gov.center[0]}
                        cy={gov.center[1]}
                        r="14"
                        fill="url(#presence-pulse)"
                        style={{ pointerEvents: 'none' }}
                        className="pulse-ring"
                      />
                      <circle
                        cx={gov.center[0]}
                        cy={gov.center[1]}
                        r="5"
                        fill="var(--color-brand-accent)"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        style={{ pointerEvents: 'none' }}
                      />
                    </>
                  )}

                  {/* Label */}
                  {(isActive || hasPresence) && (
                    <text
                      x={gov.center[0]}
                      y={gov.center[1] + (hasPresence ? 22 : 5)}
                      textAnchor="middle"
                      style={{
                        fontSize: isActive ? '11px' : '9px',
                        fontWeight: isActive ? 700 : 600,
                        fill: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                        pointerEvents: 'none',
                        transition: 'all 200ms ease',
                        fontFamily: isAr ? 'Cairo, sans-serif' : 'Inter, sans-serif',
                      }}
                    >
                      {isAr ? gov.nameAr : gov.nameEn}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <p
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              margin: 0,
              marginTop: '0.5rem',
              textAlign: 'center',
            }}
          >
            {isAr
              ? 'رسم تخطيطي توضيحي — لا يمثل الحدود الإدارية الرسمية.'
              : 'Schematic illustration — does not represent official administrative boundaries.'}
          </p>

          {/* Tooltip / Info Panel */}
          {activeData && (
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                insetInlineStart: '1rem',
                insetInlineEnd: '1rem',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem 1rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 200ms ease',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeData.hasPresence
                    ? 'var(--color-brand-accent-light)'
                    : 'var(--color-bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={activeData.hasPresence ? 'var(--color-brand-accent)' : 'var(--color-text-muted)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                  {isAr ? activeData.nameAr : activeData.nameEn}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                  {activeData.hasPresence
                    ? isAr
                      ? activeData.presenceDescAr
                      : activeData.presenceDescEn
                    : isAr
                      ? 'لا يوجد تواجد مؤسسي حالياً'
                      : 'No institutional presence currently'}
                </div>
              </div>
              {activeData.hasPresence && (
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(5, 150, 105, 0.15)',
                    color: 'var(--color-brand-success)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {isAr ? 'نشط' : 'Active'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Accessible Fallback List */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {presenceGovs.map((gov) => (
            <button
              key={gov.id}
              onClick={() => handleGovClick(gov.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1rem',
                backgroundColor:
                  selectedGov === gov.id
                    ? 'var(--color-brand-accent-light)'
                    : 'var(--color-bg-surface)',
                border: `1.5px solid ${
                  selectedGov === gov.id ? 'var(--color-brand-accent)' : 'var(--color-border-subtle)'
                }`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textAlign: isAr ? 'right' : 'left',
              }}
              className="card-hover"
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-accent-light)',
                  color: 'var(--color-brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                  {isAr ? gov.nameAr : gov.nameEn}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {isAr ? gov.presenceDescAr : gov.presenceDescEn}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
