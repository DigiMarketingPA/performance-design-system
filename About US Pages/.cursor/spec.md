# Spec

Project alignment and expectations.

## Scope
- **About US Pages** — Styling for dynamic hours displayed via WordPress shortcode in `Phone number.html`.
- **Output** — Two blocks: Sales (with optional special hours) and Service. Inline, centered, pipe-separated, no bullets.

## Constraints
- Shortcode outputs `ul.hours`; class on `ul` cannot be changed.
- Wrapper divs use `.wkhrs1` (Sales block) and `.wkhrs2` (Service block).
- No structural HTML changes; all behavior via CSS.

## Done
- Centered, inline hours with `|` separators (padding 0.35em each side).
- Sales / Service labels and "Special hours" section for dated exceptions.
- Spacing via padding/margin only: pipe both sides, after titles (margin-right), between date and hours (.right padding-left).
