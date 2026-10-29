'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { Locale } from '../../lib/i18n';
import { useTheme } from '../../lib/theme/ThemeProvider';

export interface GovernorateMeta {
  iso: string;
  id: string;
  nameAr: string;
  nameEn: string;
  hasPresence: boolean;
  hubRoleAr?: string;
  hubRoleEn?: string;
  scopeAr?: string;
  scopeEn?: string;
  approxCoords?: [number, number]; // [lat, lng] approximate governorate center
  programsAr?: string[];
  programsEn?: string[];
}

export interface YemenLeafletCanvasProps {
  geoJsonData: FeatureCollection<Geometry, { shapeName: string; shapeISO: string; shapeID: string }>;
  governoratesMeta: Record<string, GovernorateMeta>;
  selectedIso: string;
  onSelectIso: (iso: string) => void;
  locale: Locale;
}

export default function YemenLeafletCanvas({
  geoJsonData,
  governoratesMeta,
  selectedIso,
  onSelectIso,
  locale,
}: YemenLeafletCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { theme } = useTheme();
  const isAr = locale === 'ar';
  const isDark = theme === 'dark';

  // Helper to compute polygon style based on theme, presence, and selection state
  const getFeatureStyle = (iso: string, isHovered = false): L.PathOptions => {
    const meta = governoratesMeta[iso];
    const hasPresence = meta?.hasPresence ?? false;
    const isSelected = selectedIso === iso || (selectedIso === 'YE-SN' && iso === 'YE-SA') || (selectedIso === 'YE-SA' && iso === 'YE-SN');

    if (hasPresence) {
      if (isSelected || isHovered) {
        return {
          fillColor: isDark ? '#f59e0b' : '#c27803',
          fillOpacity: isSelected ? 0.58 : 0.45,
          color: isDark ? '#fde68a' : '#78350f',
          weight: isSelected ? 2.5 : 2,
        };
      }
      return {
        fillColor: isDark ? '#d97706' : '#d97706',
        fillOpacity: isDark ? 0.32 : 0.26,
        color: isDark ? '#fbbf24' : '#b45309',
        weight: 1.6,
      };
    }

    if (isSelected || isHovered) {
      return {
        fillColor: isDark ? '#1e3a5f' : '#cbd5e1',
        fillOpacity: 0.65,
        color: isDark ? '#38bdf8' : '#0f325a',
        weight: 2,
      };
    }

    return {
      fillColor: isDark ? '#13233b' : '#e6e2d8',
      fillOpacity: 0.85,
      color: isDark ? '#264063' : '#c7c1b4',
      weight: 1,
    };
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [15.55, 47.6],
      zoom: 6,
      minZoom: 5,
      maxZoom: 9,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.control.zoom({ position: isAr ? 'topleft' : 'topright' }).addTo(map);

    map.attributionControl.setPrefix(
      isAr
        ? 'الحدود الإدارية: <a href="https://www.geoboundaries.org" target="_blank" rel="noopener noreferrer">geoBoundaries ADM1</a> (CC-BY 4.0)'
        : 'Boundaries: <a href="https://www.geoboundaries.org" target="_blank" rel="noopener noreferrer">geoBoundaries ADM1</a> (CC-BY 4.0)'
    );

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render / Update GeoJSON Layer & Hub Markers when data, theme, locale, or selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
    }

    const layer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const iso = feature?.properties?.shapeISO || '';
        return getFeatureStyle(iso, false);
      },
      onEachFeature: (feature: Feature<Geometry, { shapeName: string; shapeISO: string }>, lyr) => {
        const iso = feature.properties?.shapeISO || '';
        const meta = governoratesMeta[iso];
        const label = meta
          ? `${isAr ? meta.nameAr : meta.nameEn}${meta.hasPresence ? (isAr ? ' • تواجد مؤسسي' : ' • Active Hub') : ''}`
          : feature.properties?.shapeName || iso;

        lyr.bindTooltip(label, {
          sticky: true,
          direction: 'top',
          className: 'spplpf-map-tooltip',
        });

        lyr.on({
          mouseover: (e) => {
            const target = e.target as L.Path;
            target.setStyle(getFeatureStyle(iso, true));
            target.bringToFront();
          },
          mouseout: (e) => {
            const target = e.target as L.Path;
            target.setStyle(getFeatureStyle(iso, false));
          },
          click: () => {
            // Normalize Amanat Al Asimah (YE-SA) and Sana'a Governorate (YE-SN) to YE-SA hub
            const normalizedIso = iso === 'YE-SN' ? 'YE-SA' : iso;
            onSelectIso(normalizedIso);
          },
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = layer;

    // Render approximate hub markers for the 3 verified presence governorates
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
      Object.values(governoratesMeta)
        .filter((m) => m.hasPresence && m.approxCoords && m.iso !== 'YE-SN')
        .forEach((hub) => {
          if (!hub.approxCoords) return;
          const isSelected = selectedIso === hub.iso;

          const circle = L.circleMarker(hub.approxCoords, {
            radius: isSelected ? 9 : 7,
            fillColor: isSelected ? '#0284c7' : '#c27803',
            color: '#ffffff',
            weight: 2.5,
            opacity: 1,
            fillOpacity: 1,
          });

          const hubLabel = `${isAr ? hub.nameAr : hub.nameEn} — ${isAr ? hub.hubRoleAr : hub.hubRoleEn}`;
          circle.bindTooltip(hubLabel, {
            direction: 'top',
            offset: [0, -8],
            className: 'spplpf-map-tooltip',
          });

          circle.on('click', () => onSelectIso(hub.iso));
          circle.addTo(markersLayerRef.current!);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJsonData, selectedIso, theme, locale]);

  return (
    <div
      ref={containerRef}
      className="spplpf-leaflet-container"
      style={{
        width: '100%',
        height: '430px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
        zIndex: 1,
      }}
      role="region"
      aria-label={
        isAr
          ? 'خريطة اليمن الجغرافية التفاعلية للمحافظات (Leaflet GeoJSON)'
          : 'Interactive Yemen Governorate GeoJSON Map (Leaflet)'
      }
    />
  );
}

