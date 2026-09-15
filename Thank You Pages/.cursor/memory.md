# Thank You Pages – Project Memory

## Current focus
- **All dealer Thank You sets**: Complete (Schema + TY.html, TY.CSS, TY.JS) per steps.md and spec.md.
- **Block 3 video section**: PH styling (video left of location card, `.ty-location-split` + YouTube iframe) is the reference. Applied to: PT, PH, PTB, PLN, PHB, PFTC, PFB, PL, SDT. **Two-location, no-video** pattern (PKH-style `.ty-location-cards` grid, `repeat(2, 1fr)`): **PKH**, **CJDR** (Centerville Showroom 95 Loop Rd + Performance JeepLand 6950 Loop Rd).
- **Block 7 (While you wait)**: **`PL Thank You/PL TY.CSS`** is the layout reference for the deal row and right-hand service specials column (see spec.md **Block 7 – deal layout**). `SDT TY.CSS` was aligned to this pattern (stretch row, 320px right column, tile flex/`height: 100%`, mobile `max-width: 400px` on `.ty-deal-right`). **CJDR, PHB, PFB, PFTC, PTB** TY.CSS now use the same deal-row structure (stretch, nested carousel flex, `.text-center`, `h3.ty-tile-title.text-center` + service lead rules, `.ty-btn-spcl`, LVRP `minmax(280px, 320px)` on flex-row) plus Composer-safe `.ty-block` / headline colors.
- **PTB Block 7 `[fixedops]` (verified)**: `PTB TY.CSS` overrides DI Fixed Ops **inline** `position:absolute` / fractional `width` on `.difo-card` (`data-columns="3"`) so coupons **stack in one column**; **verified** displaying correctly on thank-you page. Details: `PTB TY.CSS` Fixed Ops block header comment, `spec.md` Block 7, `steps.md` step 8.

## Recent changes
- **2026-04-03 – PFTC paragraph & subheading scale (+25%)**: `PFTC Thank You/PFTC TY.CSS` — all explicit `font-size` rules for copy on `p` / `h3` / `h4` utilities (`.ty-lead`, `.ty-small`, `.ty-trust`, tile & similar-vehicles titles, staff names, location card lines & hours, LVRP `p|h3|h4|h5.result-title` and static card name/price) multiplied by 1.25; unclassed `p` and unclassed `h3`/`h4` plus `h5` under `.ty-block` / `.ty-page` use `font-size: 1.25em`. Other dealers unchanged.
- **2026-03-24 – PTB Block 7 service specials (verified)**: `PTB TY.CSS` — column flex on `.difo-default-coupon`; `position:static !important` + full width on `.difo-default-coupon > .difo-card`; `height:auto !important` on coupon wrap; borders on direct `.difo-card`. **User confirmed** single-column display correct. Documented in file header, `spec.md` Block 7, `steps.md` step 8.
- **2026-03-20 – CJDR TY.html Block 3**: Fixed missing closing quote on first `.ty-location-card-image` `style` attribute (was breaking markup before the CDJR logo `<img>`).
- **2026-03-20 – CJDR location cards grid override**: `#directions .ty-location-cards` uses `display: grid !important` and two columns (`minmax(0, 1fr)`) so desktop stays side-by-side when theme CSS forces block layout on divs; stacks to one column at `max-width: 768px`.
- **2026-03-20 – CJDR Block 7 height + buttons**: `CJDR TY.CSS` – `#while-wait` overrides: `.ty-deal-layout` `max-height: none !important`, `.ty-deal-left` `overflow: visible`, service tile `max-height: none !important` so LVRP vehicle cards are not capped (raising px alone did not win over layout/theme). `.ty-btn` / `.ty-btn-lg` font-size reduced by `0.45rem` vs prior calc.
- **2026-03-20 – CJDR unclassed `p` in blocks**: `CJDR TY.CSS` – `.ty-block p:not([class])` uses `font-size: calc(1em - 0.25rem)` for shortcode/CMS paragraphs that only inherit `.ty-block`. `.ty-location-hours p` scoped to `.ty-location-card-body` so open-hours markup keeps the explicit hours size.
- **2026-03-20 – CJDR paragraph text −0.5rem**: `CJDR TY.CSS` – `.ty-lead`, `.ty-small`, `.ty-trust`, location lines (`.ty-location-address` / link / phone), and `.ty-location-hours p` use `calc(... + 1rem - 0.5rem)` so body/disclaimer paragraphs sit slightly below the global +1rem bump.
- **2026-03-20 – CJDR list item text vs .ty-block**: `CJDR TY.CSS` – `.ty-timeline-item` and `.ty-benefits li` use `font-size: calc(1em - 0.75rem)` (extra −0.25rem vs prior) so bullets stay slightly smaller than body.
- **2026-03-20 – CJDR typography ~+1rem**: `CJDR TY.CSS` – `.ty-block` and `.ty-hero-headline` use `font-size: calc(100% + 1rem)` for inherited copy; explicit `font-size` values use `calc(... + 1rem)` (headlines `clamp` min/max, buttons px, tiles, LVRP, staff, locations, coupons). `.ty-check` and `.ty-coupon-scroll-btn` enlarged so checkmark / arrows stay balanced. Documented in `spec.md` (Per-dealer customization).
- **2026-03-20 – CJDR Block 3 → PKH two-card layout**: `CJDR TY.html` directions block drops video/split; uses two `.ty-location-card`s (Centerville Showroom / Performance JeepLand) like `PKH TY.HTML`. `CJDR TY.CSS` location section matches PKH grid (`repeat(2, 1fr)`); removed `.ty-location-split` / video / address-stack rules. Meet-team map CTA points to 95 Loop Road search URL. `CJDR Schema.html` WebPage description mentions both addresses.
- **CJDR + PHB + PFB + PFTC + PTB TY alignment** (earlier): PHB/PFB/PFTC/PTB TY.CSS get Block 7 layout + carousel column flex + service tile title helpers + `.ty-btn-spcl` + explicit block text colors (spec **CMS / Composer**). **Brand**: CJDR, PHB, PFB, PFTC remain PH blue palette (#2198DC / #1a365d / #2b94d8 accents); **PTB** remains Toyota red (#EB0A1E / #6b0510) matching SDT.
- **SDT Block 7 / right column → PL reference**: `SDT TY.CSS` deal layout matches `PL TY.CSS`: `.ty-deal-layout` `align-items: stretch`, `.ty-deal-right` `flex: 0 0 320px`, removed `.ty-deal-right .ty-tile` 80% width hack; `.ty-tile.ty-tile-service` uses `height: 100%` (no duplicate `max-height` on tile—limit stays on `.ty-tile-service`); mobile breakpoint matches PL (`max-width: 400px`, static tile). `.ty-btn-spcl` rules match PL (stack spacing). Earlier SDT-only tweaks: similar-vehicles column flex inside deal row, LVRP grid `minmax(280px, 320px)` fix (was typo `3000px`), `h3.ty-tile-title.text-center` + `.text-center` helper for Block 7 markup.
- **SDT buttons**: `.ty-btn` keeps slightly narrower horizontal padding (`12px 18px`) vs full PL (`12px 24px`) for a slimmer pill; colors stay Toyota red.
- **SDT Composer text inheritance**: `SDT TY.CSS` – explicit `color` on `.ty-block` / `.ty-block .ty-headline` and `.ty-hero .ty-hero-headline` so CMS “light/dark text” on a parent wrapper does not inherit into all sections (see spec.md **CMS / Composer**).
- **PLN & PL brand colors**: Thank You pages (PLN TY.CSS, PL TY.CSS) updated to silver/black palette: primary black #111, hover #333, accent silver #C0C0C0, card gradient silver→black; memory.md brand colors updated.
- **PL CSS sync to PLN**: `PL TY.CSS` updated to match `PLN TY.CSS` for deal layout overflow/sticky service tile, service-title button styling, staff typography, directions/video split (`.ty-location-split`), and one extra VRP element hide rule.
- **SDT text size increased**: `SDT TY.CSS` updated with `+1rem` font-size bump for `.ty-lead`, `.ty-small`, `.ty-trust`, and `.ty-location-*` text to address “text too small”.
- **SDT Block 3 video added**: Updated `SDT TY.html` to include the `.ty-location-split` layout with an iframe video (matching PT/PL/PLN structure) and added `.ty-location-split` / `.ty-location-video*` CSS rules in `SDT TY.CSS`.
- **SDT styling aligned to PT**: Updated `SDT TY.CSS` Block 3 layout numeric values to match `PT TY.CSS` (`.ty-location-split` column widths + `.ty-location-video-embed` aspect-ratio + `.ty-location-cards` width/margins).
- **SDT font sizes adjusted down**: `SDT TY.CSS` reverted `.ty-lead`, `.ty-small`, `.ty-trust`, and `.ty-location-*` font sizes back to PT baseline after the page appeared too large.
- **Block 3 pattern**: Visit/Directions block uses `.ty-location-split`: video column left, location card(s) right; responsive (stacks on mobile). Video is optional YouTube embed (`VIDEO_ID` placeholder); per-dealer colors unchanged.
- **PT Thank You**: Block 3 video left of card; YouTube iframe (PT video ID in use).
- **PH Thank You**: User-updated Block 3 CSS/HTML; source of truth for video-section styling.
- **PTB, PLN, PHB, PFTC, PFB**: Block 3 updated to same video-left layout and shared CSS (video embed + address-stack); VIDEO_ID placeholder per site.

## Project structure
- **PH Thank You**: Reference thank you page (Performance Honda Fairfield) – PH TY.html, PH TY.CSS, PH TY.JS, PH Schema.html.
- **PKH Thank You**: Performance Kings Honda variant.
- **PT Thank You**: Performance Toyota – PT TY.html, PT TY.CSS, PT TY.JS, PT Schema.html. Address 5676 Dixie Hwy, Fairfield OH 45014; phone (513) 463-3194; hasMap https://maps.app.goo.gl/zEx43uf8GN4Fqm7k6.
- **SDT Thank You**: South Dayton Toyota (Miamisburg OH) – full set; Schema WebPage + AutoDealer; service URL southdaytontoyota.com/service/.
- **PTB Thank You**: Performance Toyota Bountiful (Bountiful UT) – full set; Schema WebPage + AutoDealer; service URL toyotabountiful.com/service/.
- **PLN Thank You**: Performance Lexus Northern Kentucky (Fort Wright KY) – full set; Schema JSON fixed; service URL performancelexusnky.com/service/.
- **PL Thank You**: Performance Lexus (Cincinnati OH) – full set; Schema JSON fixed (addressCountry, geo); service URL performancelexus.com/service/.
- **PHB Thank You**: Performance Honda Bountiful (Bountiful UT) – full set; service URL performancehondabountiful.com/service/.
- **PFTC Thank You**: Performance Ford Truck Country (Bountiful UT) – full set; service URL performancefordtruckcountry.com/service/.
- **PFB Thank You**: Performance Ford Bountiful (Bountiful UT) – full set; Schema JSON fixed; service URL performancefordbountiful.com/service/.
- **CJDR Thank You**: Performance Chrysler Jeep Centerville (Centerville OH) – full set; logo in Schema; service URL performancechryslerjeepcenterville.com/service/; Block 3: two store cards (95 Loop Rd showroom + 6950 Loop Rd JeepLand), PKH-style grid.

## Brand colors
- **Toyota** (PT, SDT, PTB): Primary #EB0A1E; hover #c90819; gradient #d0091b → #a80715; dark sections #6b0510; icon bg #8B0712.
- **Lexus** (PLN, PL): Silver / Black. Primary black #111; hover #333; accent silver #C0C0C0; card gradient #C0C0C0 → #111; dark sections #111; icon bg #333.

## Conventions (.cursor)
- **Every session with file changes**: update `memory.md` (and `spec.md` / `steps.md` when patterns change). See `.cursor/rules/project-state.mdc`.
- Stay aligned with steps.md and spec.md.
