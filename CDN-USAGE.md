# CDN Usage Guide — Performance Automotive Design System

How to load the `pa-` CSS system from GitHub via **jsDelivr**, and how to embed HTML snippets in a CMS (Dealer Inspire Composer / WYSIWYG) while keeping styles isolated under `.pa-root`.

---

## Prerequisites

1. Publish this design system as a **public GitHub repository** (or a public path within an org repo).
2. Prefer a **git tag** (e.g. `v1.0.0`) in CDN URLs so production does not float on `main`.
3. Replace placeholders below:

| Placeholder | Meaning | Example |
|---|---|---|
| `{org}` | GitHub org or user | `performance-auto` |
| `{repo}` | Repository name | `pa-design-system` |
| `{tag}` | Release tag or commit | `v1.0.0` |

**Base URL pattern:**

```text
https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/
```

If this package lives in a monorepo subfolder, insert the path after `{tag}/` (e.g. `...@{tag}/pa/css/pa-core.css`). The templates below assume the repo root **is** the `pa/` package root (`css/` at repository root).

---

## Order of operations (required)

Always load stylesheets in this order:

1. **Core** — `css/pa-core.css` (layout, type, cards, buttons, tokens defaults)
2. **Brand theme** — one `css/brands/pa-brand-{oem}.css` (token overrides only)
3. **Feature modules** — only the `css/modules/*.css` files needed on that page

```text
pa-core.css  →  pa-brand-{oem}.css  →  module(s)
```

Skipping core, loading a brand before core, or loading modules without core will break layout and token inheritance.

---

## Tier 1 — Core

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/pa-core.css">
```

---

## Tier 2 — OEM brand themes (pick one per rooftop)

### Toyota

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-toyota.css">
```

### Honda

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-honda.css">
```

### Lexus

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-lexus.css">
```

### Ford

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-ford.css">
```

### CJDR

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-cjdr.css">
```

Load **exactly one** brand sheet per site/rooftop.

---

## Tier 3 — Feature modules (opt-in)

### FAQ

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/faq.css">
```

### Hero

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/hero.css">
```

### Location cards

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/location-cards.css">
```

### Deal carousel

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/deal-carousel.css">
```

### Coupons

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/coupons.css">
```

### Content + media (50/50)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/content-media.css">
```

### CTA button row

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/cta-row.css">
```

### Hours (bar + display)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/hours.css">
```

### Map + CTAs

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/map-cta.css">
```

### Form CTA

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/form-cta.css">
```

### Meet the team

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/meet-team.css">
```

### Meet the team (DI staff shortcode)

Temporary — omit after leaving Dealer Inspire.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/meet-team-di.css">
```

### Promo (trade-in / finance)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/promo.css">
```

### Page header

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/page-header.css">
```

### Store directory

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/store-directory.css">
```

**Store directory JS:** paste raw contents of `js/store-directory.js` once into Footer / Custom JS (no `<script>` tags).

---

## Full Head examples

### Toyota rooftop — FAQ + location cards only

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/pa-core.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-toyota.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/faq.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/location-cards.css">
```

### Honda rooftop — hero + deal carousel + coupons

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/pa-core.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-honda.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/hero.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/deal-carousel.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/coupons.css">
```

### CJDR rooftop — all modules

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/pa-core.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/brands/pa-brand-cjdr.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/faq.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/hero.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/location-cards.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/deal-carousel.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/{org}/{repo}@{tag}/css/modules/coupons.css">
```

### Dealer Inspire Head / Header

Paste the same `<link>` tags into the rooftop **Head** or **Header** HTML (not Tag Manager for critical CSS, and not only in Footer). Core + brand should load on every page that uses PA snippets; modules can be global or page-specific.

Until the GitHub repo is public, paste the file contents as `<style>` blocks in the **same order** (core → brand → modules).

---

## `.pa-root` isolation

Every paste-ready snippet must wrap markup in:

```html
<div class="pa-root">
  <!-- PA components only -->
</div>
```

### Why

- All design tokens hang off `.pa-root` (`--pa-primary`, `--pa-radius`, etc.).
- Core and modules scope selectors under `.pa-root`, so dealer theme chrome is not restyled.
- Without `.pa-root`, brand tokens and most component styles will not apply.

### Rules

| Do | Don’t |
|---|---|
| Keep one `.pa-root` around each snippet (or one wrapping a multi-section region) | Put PA classes outside `.pa-root` |
| Paste snippet HTML only into Composer / HTML blocks | Paste CDN `<link>` tags into every Composer widget |
| Use `pa-*` classes from the system | Mix Bootstrap / unprefixed layout classes inside the root |
| Load CSS in Head once per rooftop | Rely on inline `style=""` for brand colors |

---

## Embedding snippets in CMS WYSIWYG / HTML blocks

### 1. One section per Composer HTML widget (recommended)

**Head (site-wide):** core + brand + any modules used on the site.

**Composer HTML block:** paste a full snippet from `snippets/`, e.g. FAQ:

```html
<div class="pa-root">
  <div class="pa-container">
    <h2 class="pa-center">Frequently Asked Questions</h2>
    <div class="pa-faq">
      <details class="pa-faq-item" name="pa-faq" open>
        <summary class="pa-faq-q">Lorem ipsum dolor sit amet consectetur?</summary>
        <div class="pa-faq-a">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </details>
      <!-- more items… -->
    </div>
  </div>
</div>
```

### 2. Multiple modules on one page

Stack separate Composer blocks, each with its own `.pa-root`, **or** wrap several sections in a single root:

```html
<div class="pa-root">
  <!-- paste hero section markup (without an inner .pa-root) -->
  <!-- paste location cards markup (without an inner .pa-root) -->
  <!-- paste faq markup (without an inner .pa-root) -->
</div>
```

If you paste complete snippets that each include `.pa-root`, nested roots are harmless (tokens inherit) but unnecessary — prefer one root per widget **or** one root wrapping combined markup.

### 3. Minimal CTA-only block

```html
<div class="pa-root">
  <div class="pa-container">
    <div class="pa-row pa-row--2">
      <a class="pa-btn pa-btn--primary" href="/new-vehicles/">Shop New</a>
      <a class="pa-btn pa-btn--outline" href="/service/schedule-service/">Schedule Service</a>
    </div>
  </div>
</div>
```

Requires only core + brand (no feature module).

### 4. WYSIWYG cautions

- Use an **HTML / raw / code** block, not a visual editor that strips `<details>`, classes, or wrappers.
- Do not let the CMS wrap the snippet in `<p>` tags around block elements.
- Do not paste `<script>` into Composer for PA modules that are CSS-only (FAQ uses native `<details>`; carousel is scroll-snap).
- Replace Lorem Ipsum, `placehold.co` images, phone numbers, and URLs before go-live.

---

## Snippet → module map

| Snippet file | Module CSS required (besides core + brand) |
|---|---|
| `snippets/faq.html` | `faq.css` |
| `snippets/hero.html` | `hero.css` |
| `snippets/location-cards.html` | `location-cards.css` |
| `snippets/deal-carousel.html` | `deal-carousel.css` |
| `snippets/coupons.html` | `coupons.css` |
| `snippets/content-media.html` | `content-media.css` |
| `snippets/cta-row.html` | `cta-row.css` |
| `snippets/hours.html` | `hours.css` |
| `snippets/map-cta.html` | `map-cta.css` |
| `snippets/form-cta.html` | `form-cta.css` |
| `snippets/meet-team.html` | `meet-team.css` |
| `snippets/meet-team-di.html` | `meet-team-di.css` (DI `[staff]` only) |
| `snippets/trade-in.html` | `promo.css` |
| `snippets/finance.html` | `promo.css` |
| `snippets/page-header.html` | `page-header.css` |
| `snippets/store-directory.html` | `store-directory.css` + `js/store-directory.js` |

### Layout assemblies (`snippets/layouts/`)

| Layout | Modules |
|---|---|
| `vlp.html` | hero, deal-carousel, faq |
| `service-hub.html` | hero, coupons, location-cards |
| `group-hub.html` | hero, location-cards |
| `thank-you.html` | page-header, cta-row, content-media, promo, hours |
| `about.html` | hero, content-media, meet-team, faq |
| `rental.html` | hero, deal-carousel, map-cta, form-cta, faq |

---

## Versioning tips

- Pin `@tag` (or `@commit`) in production CDN URLs.
- After changing tokens or modules, cut a new tag and update Head links site-wide.
- jsDelivr caches aggressively; a new tag avoids stale CSS more reliably than `@main`.

---

## Quick checklist

1. [ ] `pa-core.css` linked first  
2. [ ] One `pa-brand-{oem}.css` linked second  
3. [ ] Only needed `modules/*.css` linked third  
4. [ ] Snippet HTML wrapped in `.pa-root`  
5. [ ] Composer block is raw HTML (classes preserved)  
6. [ ] CDN URLs use `{org}`, `{repo}`, and a pinned `{tag}`  

See also: `ARCHITECTURE.md` for the three-tier system rules.
