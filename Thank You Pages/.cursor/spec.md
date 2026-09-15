# Thank You Pages – Spec

## Purpose
Dealer-specific thank you pages shown after lead submission (contact, trade-in, finance, etc.). Each page reinforces the brand, sets expectations (next steps), and drives actions: visit, trade-in valuation, finance application, service specials, similar vehicles.

## Page pattern (from PH Thank You)
1. **Hero** – Headline (“Welcome to the [Dealer] Family”).
2. **Next steps** – Timeline (concierge contact 24–48 hrs, quote/perks, phone/chat CTA); dealer logo image.
3. **Visit / Directions** – **Single location + optional video**: video (left column, YouTube embed); location card (right): address, Google Maps link, phone, hours placeholder `[di_display_open_hours]`. Layout: `.ty-location-split` (two columns, stacks on mobile). **Two locations (no video)**: use a single `.ty-location-cards` grid with two `.ty-location-card` children and `grid-template-columns: repeat(2, 1fr)` (see **PKH Thank You**, **CJDR Thank You**). On Composer/live sites, a parent theme may set `display: block` on generic divs; **CJDR** scopes `#directions .ty-location-cards` with `display: grid !important` so the two-column layout survives.
4. **Trade-in** – Valuation CTA; `[tp_trade]` / “Start Your Valuation” button.
5. **Finance** – Benefits list; link to dealer finance application.
6. **Meet team** – `[staff department="Sales"]`; “Come Say Hi” map CTA.
7. **While you wait** – Similar vehicles `[inventory_vehicle_cards ...]`; service/parts specials `[fixedops type="service-specials,parts-specials"]`.

### Block 7 – deal layout (CSS reference: `PL Thank You/PL TY.CSS`)
- **Container**: `.ty-container-deal` (wider max-width than `.ty-container`).
- **Row**: `.ty-deal-layout` — flex, `align-items: stretch`, `gap: 2rem`, `max-height: 450px` (desktop).
- **Left**: `#similar-vehicles` with classes `.ty-similar-vehicles.ty-deal-left` — vehicles carousel + arrows; should shrink correctly (`min-width: 0`, optional inner flex for carousel/row height).
- **Right**: `.ty-deal-right` — `flex: 0 0 320px`, column flex, `min-height: 0`.
- **Service tile**: `.ty-tile.ty-tile-service` — `display: flex; flex-direction: column; overflow: hidden; height: 100%`; parent `.ty-tile-service` handles sticky + `max-height: 450px` + `flex: 1` inside `.ty-deal-right`.
- **Mobile** (`max-width: 900px`): column stack; `.ty-deal-right` full width with `max-width: 400px`; `.ty-tile-service { position: static; }`.
- **CJDR / Block 7 height**: `CJDR TY.CSS` uses `#while-wait` scoped rules: `max-height: none !important` on `.ty-deal-layout` and service tile, `overflow: visible` on `.ty-deal-left`, so the row is not hard-capped at 450px (theme-safe). Coupon list still scrolls inside `.difo-default-coupon`.
- **Do not** narrow the service tile with an extra `width: 80%` on `.ty-deal-right .ty-tile` unless a dealer explicitly asks—PL reference is full width within the right column.
- **Service CTA links**: optional `.ty-btn.ty-btn-spcl` in markup (e.g. PL); `width: 100%` with `margin-bottom` between items and `:last-child` reset—see PL. CJDR, PHB, PFB, PFTC, and PTB include the `.ty-btn-spcl` rules in TY.CSS for parity.
- **Carousel inside deal row**: `.ty-deal-layout > .ty-similar-vehicles.ty-deal-left` flex column rules (title shrink-0, carousel flex 1, row min-height 0) match SDT/PL—applied on CJDR, PHB, PFB, PFTC, PTB.
- **PTB / DI Fixed Ops `[fixedops]`**: Some instances output `.difo-default-coupon` with `data-columns="3"` and **inline** `position:absolute` + fractional `width`/`left` on each `.difo-card` (not `.difo-grid-coupons`). CSS must reset those with `!important` for a single-column stack—see `PTB TY.CSS` Fixed Ops header comment + rules under `.difo-default-coupon` / `.difo-default-coupon > .difo-card`. **Verified** on PTB thank-you page (single column, stacked coupons).

## CMS / Composer (Dealer Inspire)
- **Text “light / dark”** on a block often sets `color` on a **parent** that wraps the entire thank-you HTML. `color` **inherits**; headings and leads without their own `color` will all match that setting.
- **Mitigation**: set explicit text colors on `.ty-block` (body copy) and `.ty-block .ty-headline`, and on the hero headline (e.g. `.ty-hero .ty-hero-headline` → light on image). Apply the same pattern on new dealer TY.CSS files if the issue appears.

## Tech
- **HTML**: Block-based layout, `ty-` prefixed classes; Dealer Inspire shortcodes where noted.
- **CSS**: Single file, `ty-` prefix; responsive; matches site modal/button styles where applicable.
- **JS**: Sticky bar, carousels (similar vehicles, coupons), chat toggle (“Text Us”), service specials links/scroll.
- **Schema**: WebPage + AutoDealer JSON-LD; address, telephone, hasMap, geo where available.

## Per-dealer customization
- **Typography (CJDR)**: `CJDR TY.CSS` bumps copy ~1rem site-wide: `.ty-block` uses `font-size: calc(100% + 1rem)` so inherited text (timeline items, shortcode output) scales once; `.ty-hero-headline` uses the same pattern; other sizes use `calc(<previous> + 1rem)`. Paragraph-scale classes (`.ty-lead`, `.ty-small`, `.ty-trust`, location `p` lines, hours `p`) subtract `0.5rem` so prose is slightly tighter than the full bump. Bare `p` inside `.ty-block` (no `class`) uses `calc(1em - 0.25rem)` vs inherited `.ty-block` size. Next-steps timeline (`.ty-timeline-item`) and finance bullets (`.ty-benefits li`) use `calc(1em - 0.75rem)` vs `.ty-block` inherited size. Checkmarks / coupon scroll buttons were widened so larger glyphs still fit.
- Dealer name, tagline, address, phone, URLs (site, finance, service specials, map).
- Logo and image URLs.
- Schema: name, address, telephone, url, hasMap, image.
- **Brand colors**: Toyota pages (PT, SDT, PTB) use Toyota red #EB0A1E and variants (hover #c90819, gradient #d0091b/#a80715, dark #6b0510, icon #8B0712). Other dealers keep default blue palette.
