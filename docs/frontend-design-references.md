# SPPLPF Frontend Visual Redesign — Research & Design References Matrix

**Author:** Antigravity AI Assistant & Engineering Lead  
**Accountable Lead:** Mohannad Hassan (@MO-HS7)  
**Date:** 25 October 2026  
**Branch:** `feat/frontend-visual-refresh`  
**Purpose:** Record external design references, source analysis, adapted patterns, license verification, and concrete architectural/visual decisions for the visual overhaul of the SPPLPF institutional portal and administrative dashboard.

---

## 1. Research Sources & Decision Matrix

| Source & URL | Core Focus & Artifact Studied | Patterns Adapted for SPPLPF | Patterns Rejected / Not Copied | License & Stack Compatibility | Concrete Design Decisions Adopted |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EPISA Peacebuilding Nonprofit Case Study**<br>[`https://dracode.dev/episa`](https://dracode.dev/episa)<br>[`https://episa.org/`](https://episa.org/) | Bilingual (Arabic/English) peacebuilding platform built on Next.js 16 + React 19. Case study on visual dignity for sensitive contexts. | - Warm off-white / parchment surfaces (`#FAF8F5`, `#F4EFEA`) providing institutional warmth.<br>- Layered hero composition with split text and floating visual factsheet badges.<br>- Program cards with distinct thematic badges and visual iconography.<br>- Dignified framing: presenting communities as active protagonists rather than passive aid recipients. | - Do not copy specific proprietary Syrian geographic assets.<br>- Do not adopt heavy dark-mode-only themes that feel like commercial tech products. | **MIT / Fair Use Case Study**<br>Directly compatible with Next.js 16 and React 19. | - Replaced flat dark-navy block hero with an asymmetric editorial hero featuring an institutional badge, mission headline, high-contrast primary CTA, distinct outline secondary CTA, and a layered preview factsheet.<br>- Adopted warm institutional surface palette with refined elevation. |
| **Latte Creative Humanitarian Case Study**<br>[`https://www.lattecreative.com/en/projects/we-build-bridges-not-walls/`](https://www.lattecreative.com/en/projects/we-build-bridges-not-walls/) | Campaign & visual storytelling for bridge-building and legal human rights organizations. | - High-impact editorial typography pairing.<br>- Content-aware cards with distinct visual hierarchies (quotes for stories, metadata for publications, dates for statements).<br>- Intentional whitespace and clear section transitions. | - Avoid campaign-heavy, marketing-style oversized slogans that detract from institutional neutrality.<br>- Avoid excessive decorative motion or video auto-play that distracts from reading. | **Creative Agency Showcase (Proprietary)**<br>Studied for UX principles and layouts only. No proprietary assets or code copied. | - Transformed generic card grids into content-specific layouts: news cards with category/date hierarchy, impact stories with quote styling and community focus, publications with document metadata. |
| **Nonprofit Headless Next.js Template**<br>[`https://github.com/cosmicjs/nextjs-non-profit-website`](https://github.com/cosmicjs/nextjs-non-profit-website) | Next.js nonprofit template with donor & story modules. | - Structured program catalogue with status indicators.<br>- Clean multi-column footer with office hubs, legal links, and institutional mandate. | - Do not copy Stripe/donor checkout flows (SPPLPF is an institutional foundation not conducting public e-commerce donations).<br>- Do not adopt outdated Next.js Pages router patterns. | **MIT License**<br>Permissive open source. Compatible with Next.js App Router design paradigms. | - Refactored footer into 4 structured columns (Institutional Identity, Programs & Hubs, Resources & Governance, Legal & Neutrality) with bidirectional RTL/LTR support. |
| **Kiranism Next.js Dashboard Starter**<br>[`https://github.com/Kiranism/next-shadcn-dashboard-starter`](https://github.com/Kiranism/next-shadcn-dashboard-starter) | High-density admin dashboard built with shadcn/ui patterns and App Router. | - Compact, professional information hierarchy for admin tables, filters, and forms.<br>- Crisp sidebar navigation with collapsible groups and clear active indicators.<br>- Metric cards with subtle trend indicators and contextual status badges.<br>- Structured modal dialogs for multi-step workflows. | - Do not import third-party auth vendors (Clerk/NextAuth); preserve existing Argon2id/session/RBAC foundation.<br>- Do not introduce unnecessary third-party table dependencies when clean native components suffice. | **MIT License**<br>Permissive open source. Highly compatible with modern React 19 and Next.js 16. | - Redesigned administrative dashboard with an enterprise-grade layout: refined dark slate sidebar (`#0d1526`), clean top navigation bar, high-density metric widgets, filtered audit log viewer, and accessible modal dialogs for RBAC role assignment and editorial workflow reviews. |
| **shadcn/ui & Origin UI**<br>[`https://github.com/shadcn-ui/ui`](https://github.com/shadcn-ui/ui)<br>[`https://github.com/shadcn/originui`](https://github.com/shadcn/originui) | Accessible, modern UI component primitives with micro-interactions. | - Unified design tokens for radii, borders, and shadows.<br>- Form fields with floating labels, clear helper text, and accessible error messaging.<br>- High-contrast focus rings (`outline: 2px solid var(--color-primary-light)`).<br>- Clean dropdown menus with directional chevrons. | - Avoid copying Tailwind v3 classes directly into CSS without mapping to project CSS custom properties. | **MIT License**<br>Permissive open source. | - Upgraded UI primitives (`Button`, `Card`, `Badge`, `Input`, `Select`, `Modal`, `Tabs`, `Pagination`) to match shadcn/Origin UI visual fidelity and micro-interactions using pure CSS custom properties. |
| **Lucide React Icon System**<br>[`https://lucide.dev/guide/react/`](https://lucide.dev/guide/react/) | Industry-standard React icon library with 1,400+ cohesive vector icons. | - Consistent 24px/20px/16px bounding box and uniform 1.75px stroke width.<br>- Native SVG rendering with `stroke="currentColor"`, `aria-hidden="true"`, and tree-shaking support.<br>- Complete coverage for institutional, administrative, and navigational needs. | - Strictly eliminate all handcrafted custom SVG paths, emojis, and Unicode glyphs used as interface icons. | **ISC License**<br>Strictly compatible, zero vulnerabilities, supports React 19 peer dependencies (`^19.0.0`). Pinned at `1.61.0`. | - Fully migrated [`src/components/icons/index.tsx`](file:///e:/SPPLPF/src/components/icons/index.tsx) to import, configure, and re-export genuine Lucide React icons. |

---

## 2. Library & Styling Strategy Decision

### A. Evaluated Options
1. **Option A: Full Migration to Tailwind CSS v4 + Tailwind UI**
   - *Pros:* Utility-first syntax.
   - *Cons:* High risk of breaking the existing Next.js 16.4.2 + React 19 setup, heavy diff, potential hydration issues with RTL/LTR logical utilities, unnecessary rebuild of working prototype structure.
2. **Option B (Selected): Refined CSS Token Architecture + shadcn/ui Inspired Primitives**
   - *Rationale:* The existing application already possesses a clean CSS custom property architecture in `src/styles/tokens.css` and `src/styles/globals.css`. By upgrading these tokens with modern HSL color scales, refined elevation shadows, CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`), and pairing them with genuine Lucide React icons and shadcn-level component styling, we achieve the highest visual distinction and polish without touching application plumbing or introducing risky framework churn.

---

## 3. Visual System & Design Language

### A. Refined Institutional Color Palette
- **Anchor Navy (Primary):**
  - `--color-primary`: `#0d274c` (Deep authoritative institutional navy)
  - `--color-primary-light`: `#163e72` (Interactive hover & active states)
  - `--color-primary-dark`: `#07152b` (Deepest contrast borders and footer backgrounds)
  - `--color-primary-subtle`: `rgba(13, 39, 76, 0.06)`
- **Dynamic Azure / Law Protection (Secondary):**
  - `--color-secondary`: `#0284c7` (Refined ocean azure)
  - `--color-secondary-hover`: `#0369a1`
  - `--color-secondary-subtle`: `rgba(2, 132, 199, 0.08)`
- **Restrained Warm Gold (Accent):**
  - `--color-accent`: `#c27803` (Warm ochre gold for community peacebuilding highlights)
  - `--color-accent-subtle`: `rgba(194, 120, 3, 0.10)`
- **Surfaces & Backgrounds:**
  - `--color-bg`: `#f8fafd` (Crisp light institutional canvas)
  - `--color-surface`: `#ffffff` (Pure white card and modal containers)
  - `--color-surface-subtle`: `#f1f5f9` (Subtle container backgrounds)
  - `--color-border`: `#e2e8f0` (Clean structural divider)
  - `--color-border-hover`: `#cbd5e1`
- **Text Scale:**
  - `--color-text`: `#0f172a` (Slate 900 for high-contrast readability)
  - `--color-text-muted`: `#475569` (Slate 600 for supporting copy)
  - `--color-text-subtle`: `#64748b` (Slate 500 for metadata and timestamps)

### B. Typography & Reading Hierarchy
- **Arabic Display Headings:** Tajawal / Cairo font family with `-0.02em` letter-spacing, generous line-height (`1.25` to `1.4`), and weighted visual emphasis.
- **English Display Headings:** Outfit / Inter with crisp tracking.
- **Body & Data:** 16px base with 1.6 line-height for effortless bilingual reading.

### C. Elevation & Depth
- `--shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
- `--shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`
- `--shadow-lg`: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`
- `--shadow-xl`: `0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`

---

## 4. Icon System Implementation Standard

- **Library:** `lucide-react` pinned at exact version `1.61.0`.
- **Standard Dimensions:**
  - Standard button/menu icon: `18px` (`size={18}`)
  - Mini table/badge icon: `14px` (`size={14}`)
  - Hero/pillar card icon: `24px` (`size={24}`)
- **Stroke Width:** Uniform `1.75px` across the application.
- **Directional Awareness:** Directional arrows (`ChevronRight`, `ChevronLeft`, `ArrowRight`, `ArrowLeft`) are flipped or chosen based on current active locale (`ar` vs `en`).
- **Accessibility:** Purely decorative icons receive `aria-hidden="true"`; standalone icon buttons feature `aria-label`.
