# Memory

Track progress and decisions for this project.

## Project
About US Pages — WordPress shortcode styling for dynamic hours (Phone number.html).

## Key decisions
- Hours blocks use wrapper classes `.wkhrs1` and `.wkhrs2`; the shortcode outputs `ul.hours` (do not change).
- `.wkhrs1` = Sales + special hours; `.wkhrs2` = Service.
- Labels "Sales:" and "Service:" added via CSS `::before` on `.hours`.
- Special hours (e.g. dated Sunday hours) get a "Special hours:" label and new line via nth-child(4) in `.wkhrs1 > .hours`.
- **Spacing** — Use padding/margin only (not space characters in `content`): pipe uses `li::after` with `content: "|"` + `padding-left/right: 0.35em`; titles use `margin-right: 0.35em`; gap between date and hours uses `padding-left: 0.35em` on `.right`.

## Progress
- [x] Remove bullets, pipe separators, inline hours
- [x] Center text, remove WordPress paragraph spacing
- [x] Switch to .wkhrs1 / .wkhrs2 wrappers with ul.hours unchanged
- [x] Add Sales/Service labels and Special hours section
- [x] Spacing: left/right of pipe, after titles, between date and hours (padding/margin 0.35em)
