# Performance Automotive Design System — Architecture

**Status:** Foundation only — no components built yet  
**Prefix:** `pa-` (Performance Automotive)  
**Stack:** Vanilla HTML + CSS only (no Bootstrap, Tailwind, or React)  
**Distribution:** GitHub-hosted CSS, consumed via CDN (jsDelivr / unpkg)

---

## Goals

1. **Modular** — layout core, brand tokens, and feature modules stay separate so pages pull only what they need.
2. **Lightweight** — no framework bloat; small shared sheets + opt-in modules.
3. **Token-driven** — colors, radii, spacing, type, and shadows live as CSS variables. Component CSS never hardcodes brand values.
4. **Isolated** — every snippet wraps in `.pa-root` so DI / Composer chrome is not restyled.
5. **CDN-ready** — flat, versionable file layout suitable for `https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/...`

---

## Architectural Rules (non-negotiable)

| Rule | Requirement |
|---|---|
| Root isolation | All HTML outputs wrap in `<div class="pa-root">…</div>` |
| Prefix | Every utility / layout / component class starts with `pa-` |
| Design tokens only | No `style=""` on components; no hardcoded colors/sizes in component or module CSS — use `var(--pa-*)` |
| No frameworks | Pure HTML/CSS; DI button classes may be *painted* via tokens inside `.pa-root` when required |
| Three tiers | Core → Brand → Modules (load in that order) |

---

## 3-Tier CSS Structure

```
┌─────────────────────────────────────────────────────────┐
│  Tier 1 — pa-core.css                                   │
│  Reset (scoped), layout, typography, utilities, buttons │
│  References tokens only; ships safe defaults on .pa-root│
└──────────────────────────┬──────────────────────────────┘
                           │ overridden by
┌──────────────────────────▼──────────────────────────────┐
│  Tier 2 — pa-brand-{name}.css                           │
│  CSS custom properties ONLY                             │
│  --pa-primary, --pa-radius, type overrides, etc.        │
└──────────────────────────┬──────────────────────────────┘
                           │ extended by (opt-in)
┌──────────────────────────▼──────────────────────────────┐
│  Tier 3 — modules/*.css                                 │
│  Standalone feature sheets (faq, deal-carousel, …)      │
│  Still token-only; never redefine brand colors as hex   │
└─────────────────────────────────────────────────────────┘
```

### Tier 1 — `pa-core.css`

**Owns:** base layout and shared primitives used on almost every page.

- Scoped reset / box-sizing under `.pa-root`
- Containers, sections, rows/grids, stacks
- Standard typography (headings, lead, muted) via tokens
- Cards, media, dividers, checklists (generic)
- Utility helpers (`.pa-center`, `.pa-mt`, `.pa-mb-0`, …)
- Button painting for DI classes *or* `.pa-btn` — values from `var(--pa-button)`, etc.
- **Does not** contain brand hex values; defaults are neutral token fallbacks on `.pa-root`

### Tier 2 — `pa-brand-*.css`

**Owns:** design tokens only.

- One file per brand (Toyota, Honda, Lexus, Ford, CJDR, …)
- Sets / overrides CSS variables on `.pa-root` (or `:root` only if ever used outside Composer — prefer `.pa-root`)
- Colors, radii, shadows, font stacks, link/button tokens
- **No** layout rules, **no** component selectors beyond the token host (`.pa-root { --pa-… }`)

### Tier 3 — `modules/*.css`

**Owns:** complex, optional UI that most pages do not need.

- Examples: `faq.css`, `deal-carousel.css`, `store-modal.css`
- Loaded only on pages that use that feature
- Classes still use `pa-` prefix (e.g. `.pa-faq-item`, `.pa-carousel`)
- All visual values via `var(--pa-*)`
- Companion JS (if any) lives under `js/` and is page- or footer-scoped — not bundled into CSS

---

## Proposed File Tree

```
pa/
├── ARCHITECTURE.md                 ← this document
├── README.md                       ← (later) CDN install + load order
├── DEPLOY.md                       ← (later) DI Head/Header + Composer notes
│
├── css/
│   ├── pa-core.css                 ← Tier 1: layout, type, utilities, buttons
│   ├── brands/
│   │   ├── pa-brand-toyota.css     ← Tier 2: tokens only
│   │   ├── pa-brand-honda.css
│   │   ├── pa-brand-lexus.css
│   │   ├── pa-brand-ford.css
│   │   └── pa-brand-cjdr.css
│   └── modules/                    ← Tier 3: opt-in feature sheets
│       ├── faq.css
│       ├── deal-carousel.css
│       ├── store-modal.css
│       └── …                       ← add modules as features are built
│
├── js/                             ← (later) page behavior, not CSS
│   ├── faq.js
│   ├── deal-carousel.js
│   └── store-modal.js
│
├── snippets/                       ← (later) paste-ready HTML (Composer)
│   └── …                           ← each wrapped in .pa-root
│
└── preview/                        ← (later) local catalog only
    └── index.html
```

> **Note:** Folders other than this architecture doc are **not created yet**. The tree above is the target shape once implementation begins.

---

## Load Order (CDN / DI Head)

Always load in this order:

1. `css/pa-core.css`
2. `css/brands/pa-brand-{rooftop}.css`
3. Only the `css/modules/*.css` files needed on that page (or site-wide if preferred)

**Example (jsDelivr, after the repo exists):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/pa-core.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-toyota.css">
<!-- Optional modules -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/faq.css">
```

Until the GitHub repo + CDN are live, the same files can be pasted as `<style>` blocks into DI Head/Header in the same order.

---

## Token Contract (draft)

Brand files define variables. Core and modules **only consume** them.

| Token | Role |
|---|---|
| `--pa-primary` | Brand accent (underlines, checks, icons) |
| `--pa-primary-hover` | Accent hover |
| `--pa-button` | Primary button fill |
| `--pa-button-hover` | Primary button hover |
| `--pa-link` / `--pa-link-hover` | Inline links inside `.pa-root` |
| `--pa-text` / `--pa-muted` | Body / secondary text |
| `--pa-surface` / `--pa-surface-alt` | Page / alt section backgrounds |
| `--pa-card-bg` / `--pa-border` | Cards and dividers |
| `--pa-radius` | Corner radius |
| `--pa-shadow` | Elevation |
| `--pa-font` | Font stack (optional override) |
| `--pa-space-*` | Spacing scale (optional; introduce when core is built) |
| `--pa-container` | Max content width (e.g. container max-width token) |

Exact values are **not** set in this document; they land only in `pa-brand-*.css` when brands are implemented.

**Core default pattern (conceptual):**

```css
.pa-root {
  /* Neutral fallbacks only — brands override */
  --pa-primary: currentColor;
  --pa-radius: var(--pa-radius, 0.75rem); /* brands set --pa-radius */
  /* … */
}
```

Implementation must avoid hex/px literals in module CSS; any fallback literals belong only as **neutral** defaults on `.pa-root` in `pa-core.css`, never as Toyota/Honda-specific values in core or modules.

---

## HTML Contract

```html
<div class="pa-root">
  <!-- section markup using pa-* classes only -->
</div>
```

- One `.pa-root` per pasted section (or one wrapping a full Composer region).
- No `style=""` on system components.
- No unprefixed layout classes (`container`, `row`, `col-*`, etc.).

---

## Naming Conventions

| Kind | Pattern | Examples |
|---|---|---|
| Layout | `pa-{block}` | `pa-container`, `pa-section`, `pa-row` |
| Modifier | `pa-{block}--{mod}` | `pa-section--alt`, `pa-row--3` |
| Element | `pa-{block}-{el}` | `pa-card-title`, `pa-faq-q` |
| State | `pa-is-{state}` or shared `pa-open` | Prefer one state pattern site-wide |
| Brand files | `pa-brand-{oem}.css` | `pa-brand-toyota.css` |
| Modules | `{feature}.css` under `modules/` | `faq.css` (classes inside still `pa-faq-*`) |

---

## What We Are Explicitly Not Doing (this phase)

- Not building components or writing `pa-core.css` / brand / module CSS yet
- Not migrating old `tpl-` snippets in this pass
- Not publishing the CDN repo until the three tiers exist and are reviewed

---

## Next Implementation Order (when approved)

1. Scaffold the empty `pa/css/` tree and token lists in brand stubs.
2. Implement `pa-core.css` (layout + type + utilities + buttons) using tokens only.
3. Fill `pa-brand-*.css` from site intake (colors only).
4. Add modules one feature at a time (`faq`, then `deal-carousel`, etc.).
5. Add paste-ready `snippets/` and CDN `README.md`.

---

## Relation to Legacy `Templates/` (`tpl-`)

The previous `tpl-` library is **legacy**. New work follows this `pa-` architecture exclusively. Migration of old snippets is a later, explicit task — not part of this foundation document.
