# Steps

Reference for alignment when implementing features.

1. **Structure** — Wrappers are `.wkhrs1` and `.wkhrs2`. Inner list is always `ul.hours` (shortcode output; do not change).
2. **Styling** — All layout and labels in CSS only (no inline styles; HTML structure fixed by shortcode).
3. **Labels** — Use `::before` on `.wkhrs1 > .hours` and `.wkhrs2 > .hours` for "Sales:" and "Service:".
4. **Special hours** — First special-hours line in `.wkhrs1` is 4th `li`; add "Special hours:" and line break via CSS.
5. **Spacing** — Do not rely on space characters in `content`. Use: `li::after` for pipe with `content: "|"` + `display: inline-block` + `padding-left/right: 0.35em`; title `::before` with `margin-right: 0.35em`; `.right` with `padding-left: 0.35em` for gap before hours.
