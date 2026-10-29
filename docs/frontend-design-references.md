# SPPLPF Frontend Visual Redesign — Research & Design References Matrix

**Author:** Antigravity AI Assistant & Engineering Lead  
**Accountable Lead:** Mohannad Hassan (@MO-HS7)  
**Date:** 29 October 2026  
**Branch:** `feat/institutional-redesign-v2`  
**Purpose:** Record external design references, source analysis, adapted patterns, license verification, geographic dataset provenance, and concrete architectural/visual decisions for the end-to-end visual overhaul, interaction engineering, and design-system implementation of the SPPLPF institutional portal and administrative dashboard.

---

## 1. Research Sources & Decision Matrix

### A. Institutional & Nonprofit Website Design

| Source & URL | Core Focus & Artifact Studied | Patterns Adapted for SPPLPF | Patterns Rejected / Not Copied | License & Stack Compatibility | Concrete Design Decisions Adopted |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EPISA Peacebuilding Nonprofit (Primary Reference)**<br>[`https://episa.org/ar/`](https://episa.org/ar/)<br>[`https://dracode.dev/episa`](https://dracode.dev/episa) | Bilingual (Arabic/English) peacebuilding platform built on Next.js App Router + React. Case study on visual dignity, editorial rhythm, and true RTL layout for sensitive humanitarian contexts. | - Warm off-white / parchment surfaces (`#fcfbf9`, `#f5f3ee`) providing institutional warmth and dignity.<br>- Transparent-over-hero header transitioning smoothly into a compact sticky translucent bar on scroll.<br>- Editorial serif display typography paired with crisp sans-serif UI/body typography (`Amiri` + `Cairo` for Arabic; `Playfair Display` + `Inter` for English).<br>- Dignified visual storytelling presenting local communities as active protagonists.<br>- Distinct section compositions rather than repetitive generic card grids. | - Do not copy proprietary Syrian geographic assets or exact brand colors.<br>- Do not copy unverified statistics or partner logos. | **Case Study / Reference Inspiration**<br>Directly compatible with Next.js 16.4.2 and React 19.2.7. Studied for architectural rhythm, typography, and RTL hierarchy. | - Implemented transparent-over-hero header with scroll-aware sticky transition.<br>- Adopted editorial serif/sans pairing (`--font-display-ar`, `--font-display-en`) for authoritative institutional headlines.<br>- Designed asymmetric hero with curated Yemeni highland architectural and dialogue imagery (`hero-highland-dawn.jpg`, `dialogue-table.jpg`, `arch-detail.jpg`). |
| **FinalTouch Nonprofit Template**<br>[`https://github.com/FinalTouch-Web/ft-template-nonprofit`](https://github.com/FinalTouch-Web/ft-template-nonprofit) | Organization-focused content hierarchy, programs catalogue, news, impact stories, event layouts, forms, and animated metrics. | - Structured program catalogue with pillar identity badges, search, and clear project factsheets.<br>- Editorial impact story layouts with pull-quotes and attribution.<br>- Restrained animated metric counters with explicit provenance labels. | - Do not import commercial donation checkout flows or fabricated numerical claims. | **Open-Source Reference**<br>Patterns adapted into native React 19 + CSS token components. | - Redesigned `/[locale]/programs` and `/[locale]/programs/[slug]` with thematic color accents, visual header banners, and structured factsheets.<br>- Built accessible `AnimatedCounter` with explicit provisional/verified labels. |
| **Next.js Bilingual Landing Page Starter**<br>[`https://github.com/LvvUP/shadcn-landing-page`](https://github.com/LvvUP/shadcn-landing-page) | Reusable page sections, light/dark theme conventions, component organization, responsive layout, and localization approach. | - Semantic light/dark surface tokens that preserve contrast across cards, dropdowns, headers, and map controls.<br>- Clean section header rhythm (eyebrow pill + display title + supporting copy). | - Do not replace the existing i18n dictionary architecture or rewrite all styles in Tailwind utility classes. | **MIT License**<br>Permissive open source. Patterns adapted to SPPLPF CSS custom property tokens. | - Expanded `tokens.css` with complete light/dark semantic tokens for elevated surfaces, interactive states, map layers, and focus outlines. |
| **Modern Next.js Multi-Page Website Starter**<br>[`https://github.com/anibalalpizar/modern-nextjs-shadcn-landing`](https://github.com/anibalalpizar/modern-nextjs-shadcn-landing) | Page-specific layouts, navigation, calls to action, and shared component organization across a multi-page website. | - Differentiated internal page templates: editorial reader layout for articles, document-cover layout for publications, vertical timeline for milestones, and high-clarity legal charter reader. | - Do not adopt generic SaaS pricing/feature sections. | **MIT License**<br>Permissive open source. | - Created distinct, purpose-built layouts for all 16 public routes (`about`, `values`, `goals`, `milestones`, `programs`, `news`, `activities`, `stories`, `publications`, `presence`, `contact`, and `legal/*`). |

### B. Motion & Interactive UI

| Source & URL | Core Focus & Artifact Studied | Patterns Adapted for SPPLPF | Patterns Rejected / Not Copied | License & Stack Compatibility | Concrete Design Decisions Adopted |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Magic UI**<br>[`https://magicui.design/docs/components`](https://magicui.design/docs/components)<br>[`https://github.com/magicuidesign/magicui`](https://github.com/magicuidesign/magicui) | Button micro-interactions, text reveals, number tickers, and subtle surface effects. | - Viewport-triggered number ticker (`AnimatedCounter`) with `easeOutExpo` easing and locale number formatting.<br>- Directional arrow micro-shift on CTA button hover (`.btn-arrow`). | - Reject flashy neon borders, meteors, or character-by-character text splitting that breaks Arabic cursive ligatures (`تشكيل` and word joining). | **MIT License**<br>Permissive open source. | - Standardized `AnimatedCounter` with `aria-live="off"` final value accessibility and `prefers-reduced-motion` immediate fallback.<br>- Preserved whole-word/whole-line Arabic shaping in all hero and section reveals. |
| **React Bits**<br>[`https://reactbits.dev/`](https://reactbits.dev/)<br>[`https://github.com/DavidHDev/react-bits`](https://github.com/DavidHDev/react-bits) | Card interactions, subtle backgrounds, and responsive motion patterns. | - Subtle radial spotlight/elevation transitions on interactive cards (`.card-interactive`). | - Reviewed MIT + Commons Clause restrictions; zero proprietary or Pro code copied. Avoided heavy WebGL/canvas backgrounds that degrade mobile performance. | **MIT + Commons Clause (Studied Only — No Code Copied)**<br>Implemented clean native CSS/React equivalents. | - Built custom CSS token-driven card elevation and spotlight border transitions without external runtime overhead. |
| **Motion for React & Scroll Observation**<br>[`https://motion.dev/docs/react`](https://motion.dev/docs/react)<br>[`https://motion-primitives.com/`](https://motion-primitives.com/) | Scroll-aware animations, `whileInView` one-time reveals, hover/tap interactions, and smooth transitions. | - One-time viewport intersection reveals (`RevealOnScroll`, `HeroEntrance`, `StaggeredReveal`) with cubic-bezier `(0.22, 1, 0.36, 1)` easing.<br>- Restrained button press scale (`scale(0.98)`). | - Avoided repeated scroll re-triggering that causes visual fatigue. | **MIT License**<br>`motion@14.6.0` installed; paired with lightweight `IntersectionObserver` primitives for zero-CLS server-component compatibility. | - Applied one-time viewport reveals across homepage and internal route sections with strict `prefers-reduced-motion: reduce` support. |

### C. Dashboard, Component Systems & Geographic Mapping

| Source & URL | Core Focus & Artifact Studied | Patterns Adapted for SPPLPF | Patterns Rejected / Not Copied | License & Stack Compatibility | Concrete Design Decisions Adopted |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kiranism Next.js Dashboard Starter & shadcn/ui**<br>[`https://github.com/Kiranism/next-shadcn-dashboard-starter`](https://github.com/Kiranism/next-shadcn-dashboard-starter)<br>[`https://ui.shadcn.com/`](https://ui.shadcn.com/) | Admin information density, grouped sidebar navigation, tables, forms, filters, status indicators, and modal workflows. | - Grouped operational sidebar (`Content & Editorial`, `Catalogues & Outreach`, `Governance & System`).<br>- Compact top bar with dynamic breadcrumbs, active demo persona indicator, and theme toggle.<br>- Responsive mobile drawer for admin navigation on tablet/mobile viewports.<br>- High-density metric cards, status badges, and horizontally scrollable tables. | - Do not import Clerk, SaaS billing, or third-party auth providers. Preserve existing Argon2id, session, rate-limiter, and RBAC backend modules untouched. | **MIT License**<br>Permissive open source. | - Upgraded `AdminShell`, `AdminSidebar`, `AdminHeader`, and all 14 admin routes with breadcrumb awareness, mobile sidebar drawer, high-density filter toolbars, and clear simulation notices. |
| **Leaflet & React Leaflet + geoBoundaries / Yemen-info**<br>[`https://leafletjs.com/examples/geojson/`](https://leafletjs.com/examples/geojson/)<br>[`https://react-leaflet.js.org/`](https://react-leaflet.js.org/)<br>[`https://github.com/YemenOpenSource/Yemen-info`](https://github.com/YemenOpenSource/Yemen-info)<br>[`https://github.com/wmgeolab/geoBoundaries`](https://github.com/wmgeolab/geoBoundaries) | Real interactive GeoJSON map of Yemen's 22 governorates (ADM1) with bilingual Arabic/English labels and operational hub selection. | - Real client-only Leaflet GeoJSON map (`leaflet@1.9.4`) rendering verified ADM1 governorate polygons.<br>- Bilingual Arabic/English governorate nomenclature verified against `YemenOpenSource/Yemen-info` and `open-admin-data/yemen-administrative-divisions`.<br>- Strict operational presence highlighting for **Taiz, Marib, and Sana'a** only, with honest approximate governorate-level markers.<br>- Synchronized keyboard-accessible governorate filter/selection list alongside the map. | - Replaced the earlier hand-drawn schematic SVG placeholder map (`YemenGovernorateMap.tsx` commit `2ac3284`).<br>- Do not expose sensitive frontline coordinates or invent unapproved branch offices. | **BSD-2-Clause (`leaflet`), MIT (`react-leaflet`), CC-BY 4.0 (`geoBoundaries-YEM-ADM1`), GPL/Open Reference (`Yemen-info` names only)** | - Stored `public/data/yemen-adm1-simplified.geojson` (WGS84 / EPSG:4326, CC-BY 4.0 attribution to Runfola et al. / geoBoundaries).<br>- Built client-only Leaflet map with custom dark/light theme polygon styling, zoom controls, attribution, and synchronized info panel on both `/[locale]` and `/[locale]/presence`. |

---

## 2. Library & Styling Strategy Decision

### Evaluated Architecture Options
1. **Option A: Wholesale Tailwind CSS + shadcn CLI Rewrite**
   - *Rejected:* Introducing a full Tailwind build pipeline and rewriting 33 routes would create massive churn, risk RTL/LTR specificity conflicts, and is unnecessary given the project's clean semantic CSS variable architecture.
2. **Option B (Adopted): Expanded Semantic CSS Token System (`tokens.css` + `globals.css`) + Genuine Lucide Icons + Leaflet GeoJSON + Restrained Motion Primitives**
   - *Justification:* Preserves 100% compatibility with Next.js 16.4.2 (Turbopack), React 19.2.7, and the existing 87 unit tests while delivering an authentic editorial visual system, responsive layout utilities, dark/light parity, and real interactive GeoJSON mapping.

---

## 3. Distinctive Institutional Art Direction & Token System

### A. Semantic Color & Surface Architecture
- **Brand Primary (Institutional Navy):** `#0f325a` (Light) / `#38bdf8` (Dark interactive) anchored by deep navy hero/footer surfaces (`#051324` to `#0f325a`).
- **Brand Secondary (Rule of Law Azure):** `#0284c7` / `#0ea5e9` for legal protection highlights, active indicators, and focus outlines.
- **Brand Accent (Social Peace Ochre Gold):** `#c27803` / `#f59e0b` for mediation highlights, active map governorates, and primary hero CTAs.
- **Warm Editorial Surfaces:**
  - Light mode: Canvas `#fcfbf9`, Surface `#ffffff`, Subtle `#f5f3ee`, Elevated `#efece5`, Border `#eae7df`.
  - Dark mode: Canvas `#070d17`, Surface `#0c1829`, Subtle `#122137`, Elevated `#172a45`, Border `#1e3352`.
- **Map Semantic Tokens:**
  - Active Presence Governorate Fill/Stroke (`Taiz`, `Marib`, `Sana'a`): Warm Gold / Azure highlight with interactive hover/selection elevation.
  - Non-Presence Governorate Fill/Stroke: Muted neutral surface (`#e5e2db` in light mode, `#172a45` in dark mode) with subtle borders.

### B. Typography & Bilingual Hierarchy
- **Arabic Typography:**
  - *Editorial Display Headlines (`--font-display-ar`):* `'Amiri'`, `'Cairo'`, serif — used for major hero headlines, editorial pull-quotes, and charter titles with generous line-height (`1.3`–`1.45`) and zero letter-spacing to preserve Arabic cursive connections.
  - *UI & Body Copy (`--font-arabic`):* `'Cairo'`, `'IBM Plex Sans Arabic'`, sans-serif — clear, modern, highly legible across dense tables, navigation, and long-form articles.
- **English Typography:**
  - *Editorial Display Headlines (`--font-display-en`):* `'Playfair Display'`, `'Inter'`, serif.
  - *UI & Body Copy (`--font-english`):* `'Inter'`, system-ui, sans-serif.

### C. Curated Imagery & Asset Licensing
All visual assets are stored locally in `public/` with verified open/first-party provenance:
1. `public/images/editorial/hero-highland-dawn.jpg` — First-party editorial illustration of Yemeni highland architecture at dawn viewed through stone arches (dignified geographic grounding, no identifiable individuals).
2. `public/images/editorial/dialogue-table.jpg` — First-party symbolic illustration of a community dialogue roundtable with an olive branch and scales of justice in a warm stone courtyard.
3. `public/images/editorial/arch-detail.jpg` — First-party architectural detail illustration symbolizing institutional threshold, rule of law, and heritage.
4. `public/data/yemen-adm1-simplified.geojson` — Verified ADM1 boundaries for Yemen (22 governorates, CRS: EPSG:4326 / WGS84) from **geoBoundaries** (William & Mary geoLab, Commit `9469f09`), licensed under **CC-BY 4.0** (Attribution: *Runfola, D. et al. (2020) geoBoundaries: A global database of political administrative boundaries. PLoS ONE 15(4): e0231866*).
5. **Provisional Brand Mark:** Rendered as an honest, explicitly labeled typographic monogram (`SP / LPF` — `علامة تعريفية مؤقتة`) until an official vector emblem is provided.
