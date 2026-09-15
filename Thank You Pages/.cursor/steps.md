# Thank You Pages – Steps

1. **Choose template** – Use PH Thank You as the reference (HTML + CSS + JS + Schema).
2. **Create dealer set** – Copy HTML, CSS, JS; add or update Schema for the dealer. Block 3 includes video section (left) + location card (right); replace VIDEO_ID in iframe when implementing.
3. **Customize content** – Replace dealer name, address, phone, URLs, logo, map link, finance and service links.
4. **Schema** – WebPage (title, description, about, publisher) + AutoDealer (address, telephone, geo, hasMap, url).
5. **JS** – Update any hardcoded URLs (e.g. service specials, chat selector) for the dealer.
6. **Test** – Verify shortcodes, links, and schema for the target site.
7. **`.cursor` upkeep** – After changes, update `memory.md` (see `.cursor/rules/project-state.mdc`). If Composer/CMS wraps the HTML, confirm section text colors are explicit on `.ty-block` / hero so “light/dark text” does not cascade site-wide (see spec.md).
8. **Block 7 CSS** – When adjusting “While you wait” / two-column deal layout, treat **`PL Thank You/PL TY.CSS`** as the structural reference (see spec.md **Block 7 – deal layout**). Sync other dealers only when intentional; keep brand colors per dealer.
   - **PTB only (`[fixedops]`)**: If coupons show in 3 columns, the shortcode may be applying **inline** `position:absolute` + `width:calc(33.33%…)` on `.difo-card` (not fixable by flex/grid alone). **`PTB TY.CSS`** documents the working override in the Fixed Ops block; do not duplicate that pattern to other dealers unless their live markup matches.

## PT Thank You
- [x] PT Schema.html (WebPage + AutoDealer, telephone, hasMap, corrected geo).
- [x] PT TY.html (PT branding, 5676 Dixie Hwy, (513) 463-3194, performancetoyota.com, PT logo, Google Maps link).
- [x] PT TY.CSS (clone PH, same structure).
- [x] PT TY.JS (PT service URL, chat selector).

## Other dealer sets (PT/PH pattern; Schema + TY.html, TY.CSS, TY.JS)
- [x] SDT Thank You – South Dayton Toyota (Miamisburg OH).
- [x] PTB Thank You – Performance Toyota Bountiful (Bountiful UT).
- [x] PLN Thank You – Performance Lexus Northern Kentucky (Fort Wright KY); Schema JSON fixed.
- [x] PL Thank You – Performance Lexus (Cincinnati OH); Schema JSON fixed.
- [x] PHB Thank You – Performance Honda Bountiful (Bountiful UT).
- [x] PFTC Thank You – Performance Ford Truck Country (Bountiful UT).
- [x] PFB Thank You – Performance Ford Bountiful (Bountiful UT); Schema JSON fixed.
- [x] CJDR Thank You – Performance Chrysler Jeep Centerville (Centerville OH).
