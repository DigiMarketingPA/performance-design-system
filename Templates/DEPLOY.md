# Deploying template stylesheets (final)

## Per rooftop (Head/Header)

Paste **two** stylesheets (or `<style>` blocks), in this order:

1. Full contents of `css/tpl.css`
2. Matching brand file:

| Brand | File |
|---|---|
| Toyota (3 stores) | `css/tpl-toyota.css` |
| Honda (3 stores) | `css/tpl-honda.css` |
| Lexus (2 stores) | `css/tpl-lexus.css` |
| Ford (1 store) | `css/tpl-ford.css` |
| CJDR (1 store) | `css/tpl-cjdr.css` |

## Composer

Copy HTML from `sections/*.html` as-is.

FAQ, store directory, and deal layout already include the page script at the bottom (`<script data-cfasync="false">…</script>`). Paste that whole file onto the page.

If you put more than one of those sections on the same page, keep only **one** copy of the script block (the first run sets `window.__tplJsInit`).

Do **not** also paste `tpl.js` into global Footer/Custom JS unless you strip the in-page script.

Buttons use `button button--primary button--normal`.

## Updating later

- Layout / cards / spacing → edit `tpl.css`, replace on all sites
- Brand colors / button fill → edit that brand file only
- Behavior → edit `js/tpl.js`, then run `python Templates/_generate.py`
- Section HTML → edit `_generate.py`, then regenerate
