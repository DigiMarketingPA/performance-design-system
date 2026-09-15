# -*- coding: utf-8 -*-
"""Generate final paste-ready section snippets.

Requires on each rooftop (Head/Header):
  1) css/tpl.css
  2) css/tpl-{brand}.css

No Bootstrap required. Buttons: button button--primary button--normal
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SECTIONS = ROOT / "sections"
JS_DIR = ROOT / "js"

IPSUM = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod "
    "tempor incididunt ut labore et dolore magna aliqua."
)
IPSUM2 = (
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi "
    "ut aliquip ex ea commodo consequat."
)
IPSUM3 = (
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia "
    "deserunt mollit anim id est laborum."
)

BTN = "button button--primary button--normal"

NEEDS_JS = {"faq.html", "store-directory.html", "deal-layout.html"}


def img(w, h, text, dark=False):
    bg, fg = ("1a365d", "ffffff") if dark else ("e2e8f0", "64748b")
    return f"https://placehold.co/{w}x{h}/{bg}/{fg}?text={text.replace(' ', '+')}"


def pack(name, html, needs_js=False):
    """Paste-ready Composer snippet. Interactive sections append tpl.js on the page."""
    parts = [
        f"<!-- {name} start -->",
        "<!-- Requires: css/tpl.css + css/tpl-{brand}.css in Head/Header. -->",
        html.strip(),
        f"<!-- {name} end -->",
    ]
    if needs_js:
        js_path = JS_DIR / "tpl.js"
        js_body = js_path.read_text(encoding="utf-8").strip() if js_path.exists() else ""
        # data-cfasync="false" = leave this script alone (Rocket Loader)
        parts += [
            "",
            "<!-- Page JS: paste with this section. Skip if tpl.js is already on the page. -->",
            '<script data-cfasync="false">',
            js_body,
            "</script>",
        ]
    return "\n".join(parts) + "\n"


def hero_overlay(_p):
    return f"""
<div class="tpl-root">
  <header class="tpl-hero">
    <img class="tpl-hero-bg" src="{img(1600, 500, 'Hero Image', True)}" alt="Hero placeholder">
    <div class="tpl-hero-scrim"></div>
    <div class="tpl-hero-inner">
      <h1 class="tpl-hero-title">Lorem Ipsum Dolor Sit Amet</h1>
    </div>
  </header>
</div>
"""


def hero_banner(_p):
    return f"""
<div class="tpl-root">
  <section class="tpl-hero tpl-hero--banner">
    <img class="tpl-hero-bg" src="{img(1900, 633, 'Banner Image', True)}" alt="Banner placeholder">
    <div class="tpl-hero-scrim"></div>
    <div class="tpl-hero-inner">
      <h1 class="tpl-hero-title">Lorem Ipsum Dolor Sit Amet</h1>
      <hr class="tpl-divider tpl-divider--light">
      <p class="tpl-hero-lead">{IPSUM}</p>
      <div class="tpl-hero-actions">
        <a class="{BTN}" href="tel:5555555555">(555) 555-5555</a>
        <a class="{BTN}" href="#content">Consectetur Adipiscing</a>
      </div>
    </div>
  </section>
</div>
"""


def page_header(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <img class="tpl-media tpl-mb" src="{img(1400, 400, 'Page Header Image')}" alt="Page header placeholder">
      <h1 class="tpl-center tpl-headline-lined">Lorem Ipsum Dolor Sit Amet</h1>
      <p class="tpl-lead tpl-center">{IPSUM} {IPSUM2}</p>
      <p class="tpl-center tpl-mb-0">{IPSUM3}</p>
    </div>
  </div>
</div>
"""


def next_steps(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-row tpl-row--2 tpl-row--split">
        <div>
          <h2>Lorem Ipsum — Consectetur Adipiscing</h2>
          <p class="tpl-lead">{IPSUM}</p>
          <ul class="tpl-checklist tpl-checklist--stack">
            <li><span class="tpl-check" aria-hidden="true"></span><span>{IPSUM}</span></li>
            <li><span class="tpl-check" aria-hidden="true"></span><span>{IPSUM2}</span></li>
            <li><span class="tpl-check" aria-hidden="true"></span><span>Questions? Call <a href="tel:5555555555">(555) 555-5555</a>.</span></li>
          </ul>
          <p class="tpl-mb-0"><a class="{BTN}" href="#">Lorem Ipsum CTA</a></p>
        </div>
        <div>
          <img class="tpl-media" src="{img(600, 400, 'Next Steps Image')}" alt="Image placeholder" width="600" height="400">
        </div>
      </div>
    </div>
  </div>
</div>
"""


def _loc_card(title, logo, addr, phone_display="(555) 555-5555", phone_href="tel:5555555555", maps_href="#"):
    return f"""
          <div class="tpl-loc-card">
            <div class="tpl-loc-card-banner">
              <img src="{img(600, 120, logo)}" alt="{title} logo placeholder" loading="lazy">
            </div>
            <div class="tpl-loc-card-body">
              <h3 class="tpl-loc-card-title">{title}</h3>
              <div class="tpl-loc-card-stack">
                <p class="tpl-loc-card-address">📍 {addr}</p>
                <p class="tpl-loc-card-link"><a href="{maps_href}" target="_blank" rel="noopener">Get directions on Google Maps</a></p>
                <p class="tpl-loc-card-phone">📞 <a href="{phone_href}">{phone_display}</a></p>
              </div>
              <div class="tpl-loc-card-hours"><strong>[di_display_open_hours]</strong></div>
            </div>
          </div>
"""


def location_video(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section tpl-section--alt">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Lorem Ipsum Location</h2>
      <p class="tpl-lead tpl-center">{IPSUM}</p>
      <div class="tpl-row tpl-row--2">
        <div class="tpl-video">
          <div class="tpl-video-ph">Video Placeholder</div>
          <!-- <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0" title="Dealership video" allowfullscreen loading="lazy"></iframe> -->
        </div>
        {_loc_card("Lorem Ipsum Dealership", "Dealer Logo", "1234 Placeholder Ave, City, ST 00000")}
      </div>
    </div>
  </div>
</div>
"""


def location_cards(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section tpl-section--alt">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Lorem Ipsum Locations</h2>
      <p class="tpl-lead tpl-center">{IPSUM}</p>
      <div class="tpl-row tpl-row--2">
        {_loc_card("Location One", "Location One Logo", "1234 Placeholder Ave, City, ST 00000")}
        {_loc_card("Location Two", "Location Two Logo", "5678 Example Blvd, City, ST 00000")}
      </div>
    </div>
  </div>
</div>
"""


def split_media(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-row tpl-row--2 tpl-row--split">
        <div><img class="tpl-media" src="{img(600, 400, 'Split Image')}" alt="Image placeholder"></div>
        <div>
          <h3>Lorem Ipsum Dolor Sit Amet</h3>
          <p>{IPSUM}</p>
          <p class="tpl-mb-0">{IPSUM2}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-row tpl-row--2 tpl-row--split">
        <div>
          <h3>Lorem Ipsum Mission</h3>
          <p class="tpl-mb-0">{IPSUM2}</p>
        </div>
        <div class="tpl-video">
          <div class="tpl-video-ph">Video Placeholder</div>
        </div>
      </div>
    </div>
  </div>
</div>
"""


def feature_cards(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Lorem Ipsum Feature Cards</h2>
      <p class="tpl-lead tpl-center">{IPSUM}</p>
      <div class="tpl-row tpl-row--2">
        <article class="tpl-card"><div class="tpl-card-body"><h3 class="tpl-card-title">Lorem Ipsum One</h3><p class="tpl-mb-0">{IPSUM}</p></div></article>
        <article class="tpl-card"><div class="tpl-card-body"><h3 class="tpl-card-title">Lorem Ipsum Two</h3><p class="tpl-mb-0">{IPSUM2}</p></div></article>
        <article class="tpl-card"><div class="tpl-card-body"><h3 class="tpl-card-title">Lorem Ipsum Three</h3><p class="tpl-mb-0">{IPSUM3}</p></div></article>
        <article class="tpl-card"><div class="tpl-card-body"><h3 class="tpl-card-title">Lorem Ipsum Four</h3><p class="tpl-mb-0">{IPSUM}</p></div></article>
      </div>
    </div>
  </div>
</div>
"""


def highlight_features(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section tpl-section--alt">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Lorem Ipsum Experience</h2>
      <p class="tpl-lead tpl-center">{IPSUM}</p>
      <div class="tpl-row tpl-row--3">
        <article class="tpl-card tpl-center"><div class="tpl-card-body"><h3 class="tpl-card-title">Customization</h3><p class="tpl-mb-0">{IPSUM3}</p></div></article>
        <article class="tpl-card tpl-center"><div class="tpl-card-body"><h3 class="tpl-card-title">Expert Service</h3><p class="tpl-mb-0">{IPSUM3}</p></div></article>
        <article class="tpl-card tpl-center"><div class="tpl-card-body"><h3 class="tpl-card-title">Consultative Approach</h3><p class="tpl-mb-0">{IPSUM3}</p></div></article>
      </div>
    </div>
  </div>
</div>
"""


def icon_features(_p):
    items = [("1", "Lorem Ipsum", IPSUM3), ("2", "Dolor Sit Amet", IPSUM2), ("3", "Adipiscing Elit", IPSUM), ("4", "Tempor Incididunt", IPSUM3)]
    cols = "".join(
        f"""
        <div class="tpl-card tpl-center">
          <div class="tpl-card-body">
            <div class="tpl-icon-mark" aria-hidden="true">{n}</div>
            <h3 class="tpl-card-title">{title}</h3>
            <p class="tpl-muted tpl-mb-0">{desc}</p>
          </div>
        </div>
"""
        for n, title, desc in items
    )
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-row tpl-row--4">{cols}
      </div>
    </div>
  </div>
</div>
"""


def trade_in(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-card">
        <div class="tpl-promo-visual">
          <img src="{img(1400, 400, 'Trade In Image')}" alt="Trade-in image placeholder">
        </div>
        <div class="tpl-card-body">
          <h2>Lorem Ipsum Valuation</h2>
          <p class="tpl-lead">{IPSUM}</p>
          <div class="tpl-promo-box">
            <p>{IPSUM3}</p>
            <!-- <div class="tp_trade"></div> -->
            <a class="{BTN}" href="#">Start Your Valuation</a>
          </div>
          <p class="tpl-muted tpl-mb-0">Lorem ipsum dolor sit amet — placeholder disclaimer.</p>
        </div>
      </div>
    </div>
  </div>
</div>
"""


def finance(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-row tpl-row--2 tpl-row--split">
        <div>
          <img class="tpl-media" src="{img(600, 400, 'Finance Image')}" alt="Finance image placeholder" width="600" height="400">
        </div>
        <div>
          <h2>Lorem Ipsum Financing</h2>
          <p class="tpl-lead">{IPSUM}</p>
          <ul class="tpl-checklist tpl-checklist--stack">
            <li><span class="tpl-check" aria-hidden="true"></span><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span></li>
            <li><span class="tpl-check" aria-hidden="true"></span><span>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</span></li>
            <li><span class="tpl-check" aria-hidden="true"></span><span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></li>
          </ul>
          <p><a class="{BTN}" href="#">Start My Application</a></p>
          <p class="tpl-muted tpl-mb-0">*Lorem ipsum dolor sit amet. See dealer for details.</p>
        </div>
      </div>
    </div>
  </div>
</div>
"""


def meet_team(_p):
    people = [("Staff 1", "Jane Doe", "Lorem Ipsum Role"), ("Staff 2", "John Smith", "Consectetur Role"), ("Staff 3", "Alex Rivera", "Adipiscing Role"), ("Staff 4", "Sam Lee", "Tempor Role")]
    cols = "".join(
        f"""
        <div class="tpl-center">
          <div class="tpl-team-photo"><img src="{img(280, 280, photo)}" alt="Staff placeholder"></div>
          <p class="tpl-mb-0"><strong>{name}</strong></p>
          <p class="tpl-muted">{role}</p>
        </div>
"""
        for photo, name, role in people
    )
    return f"""
<div class="tpl-root">
  <div class="tpl-section tpl-section--alt">
    <div class="tpl-container tpl-center">
      <h2 class="tpl-headline-lined">Lorem Ipsum Team</h2>
      <p class="tpl-lead">{IPSUM}</p>
      <!-- Live: [staff department="Sales"] -->
      <div class="tpl-row tpl-row--4 tpl-mt">{cols}
      </div>
      <p class="tpl-mt tpl-mb-0"><a class="{BTN}" href="#">Come Say Hi in Person</a></p>
    </div>
  </div>
</div>
"""


def deal_layout(_p):
    vehicles = [
        ("Vehicle 1", "2024 Lorem Ipsum LX", "$32,500"),
        ("Vehicle 2", "2023 Dolor Sit Amet", "$28,900"),
        ("Vehicle 3", "2025 Adipiscing Elit", "$41,200"),
        ("Vehicle 4", "2022 Tempor Incididunt", "$24,750"),
        ("Vehicle 5", "2024 Sed Do Eiusmod", "$36,100"),
        ("Vehicle 6", "2023 Magna Aliqua", "$29,450"),
    ]
    vcards = "".join(
        f"""
              <article class="tpl-vcard">
                <img src="{img(400, 300, photo)}" alt="Vehicle placeholder">
                <div class="tpl-vcard-body">
                  <p class="tpl-mb-0"><strong>{name}</strong></p>
                  <p class="tpl-mb-0"><strong>{price}</strong></p>
                </div>
              </article>
"""
        for photo, name, price in vehicles
    )
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container tpl-container--deal">
      <h2>While Our Team Works on Your Deal…</h2>
      <div class="tpl-deal">
        <div class="tpl-deal-main">
          <h3 class="tpl-deal-title">Other Vehicles You May Like</h3>
          <div class="tpl-carousel">
            <button type="button" class="tpl-carousel-btn tpl-carousel-prev" aria-label="Previous vehicles">&#10094;</button>
            <button type="button" class="tpl-carousel-btn tpl-carousel-next" aria-label="Next vehicles">&#10095;</button>
            <div class="tpl-carousel-track">
              <!-- Live: [inventory_vehicle_cards sort-index="days_in_stock_high_to_low" type="New"] -->
              {vcards}
            </div>
          </div>
        </div>
        <div class="tpl-deal-side">
          <div class="tpl-deal-tile">
            <h3 class="tpl-deal-tile-title">🏷️ Current Service Specials 🏷️</h3>
            <p class="tpl-lead">Save on your next service with our current specials. Click on the buttons below to learn more.</p>
            <div class="tpl-deal-tile-actions">
              <a class="{BTN}" href="/service-parts-special-coupons/" target="_blank" rel="noopener">Service Specials</a>
              <a class="{BTN}" href="/service/schedule-service/" target="_blank" rel="noopener">Schedule Service</a>
              <a class="{BTN}" href="/parts/" target="_blank" rel="noopener">Order Parts</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
"""


def store_directory(p):
    stores = [("1", "Store Logo 1", "1234 Placeholder Ave", "1111", IPSUM), ("2", "Store Logo 2", "5678 Example Blvd", "2222", IPSUM2), ("3", "Store Logo 3", "9101 Lorem Street", "3333", IPSUM3)]
    cards = "".join(
        f"""
        <div class="tpl-card tpl-store" data-tpl-modal="{p}modal-{n}">
          <div class="tpl-card-body">
            <img class="tpl-store-logo" src="{img(400, 140, logo)}" alt="Store logo placeholder">
            <p class="tpl-mb-0">{addr}<br>City, ST 00000</p>
            <p class="tpl-mb-0">(555) 555-{phone}</p>
            <span class="{BTN}">View Additional Information</span>
          </div>
        </div>
"""
        for n, logo, addr, phone, _c in stores
    )
    modals = "".join(
        f"""
  <div class="tpl-modal" id="{p}modal-{n}">
    <div class="tpl-modal-dialog">
      <button class="tpl-modal-close" type="button" aria-label="Close">&times;</button>
      <img class="tpl-store-logo" src="{img(400, 140, logo)}" alt="Store logo placeholder">
      <p><strong>Address:</strong> {addr}, City, ST 00000</p>
      <p><strong>Phone:</strong> (555) 555-{phone}</p>
      <p><strong>Hours:</strong> Mon–Sat 9AM–8PM | Sun Closed</p>
      <p>{copy}</p>
      <a class="{BTN}" href="#">Visit Website</a>
    </div>
  </div>
"""
        for n, logo, addr, phone, copy in stores
    )
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Our Stores</h2>
      <div class="tpl-row tpl-row--3 tpl-mt">{cards}
      </div>
    </div>
  </div>
{modals}
</div>
"""


def faq(_p):
    faqs = [
        ("Lorem ipsum dolor sit amet consectetur?", f"{IPSUM} {IPSUM3}", True),
        ("Ut enim ad minim veniam quis nostrud?", IPSUM2, False),
        ("Duis aute irure dolor in reprehenderit?", IPSUM, False),
        ("Excepteur sint occaecat cupidatat non proident?", IPSUM2, False),
        ("Sed do eiusmod tempor incididunt ut labore?", IPSUM3, False),
    ]
    items = "".join(
        f"""
        <div class="tpl-faq-item{' tpl-open' if open else ''}">
          <h3 class="tpl-faq-q">{q}</h3>
          <p class="tpl-faq-a">{a}</p>
        </div>
"""
        for q, a, open in faqs
    )
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Frequently Asked Questions</h2>
      <div class="tpl-faq tpl-mt">{items}
      </div>
    </div>
  </div>
</div>
"""


def corporate(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-panel">
        <h2>About Lorem Ipsum Network</h2>
        <p>{IPSUM} {IPSUM2}</p>
        <hr class="tpl-divider">
        <h3>Why Choose Lorem Ipsum?</h3>
        <ul class="tpl-checklist">
          <li><span class="tpl-check" aria-hidden="true"></span><span>Lorem ipsum dolor sit amet</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Consectetur adipiscing elit</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Sed do eiusmod tempor</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Incididunt ut labore et dolore</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Ut enim ad minim veniam</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Quis nostrud exercitation</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Ullamco laboris nisi ut aliquip</span></li>
          <li><span class="tpl-check" aria-hidden="true"></span><span>Ex ea commodo consequat</span></li>
        </ul>
        <h3 class="tpl-mt">What This Means for You</h3>
        <hr class="tpl-divider">
        <p class="tpl-mb-0">{IPSUM3}</p>
      </div>
    </div>
  </div>
</div>
"""


def map_cta(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-row tpl-row--map">
        <div class="tpl-map">
          <iframe src="https://maps.google.com/maps?q=Cincinnati+OH&amp;output=embed" title="Map placeholder" loading="lazy"></iframe>
        </div>
        <div class="tpl-btn-stack">
          <a class="{BTN}" href="tel:5555555555">Call to Reserve</a>
          <a class="{BTN}" href="#form">Contact Us Form</a>
          <a class="{BTN}" href="#">Contact Us Page</a>
          <a class="{BTN}" href="#faq">FAQ</a>
          <a class="{BTN}" href="#fleet">Fleet</a>
        </div>
      </div>
    </div>
  </div>
</div>
"""


def contact_buttons(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-btn-row">
        <a class="{BTN}" href="/service/schedule-service/">Schedule Service</a>
        <a class="{BTN}" href="/new-vehicles/">Shop New Vehicles</a>
        <a class="{BTN}" href="/used-vehicles/">Shop Used Vehicles</a>
      </div>
    </div>
  </div>
</div>
"""


def hours_bar(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-hours-bar">
    <div class="tpl-hours-bar-inner">
      <span>[di_display_open_hours departments="Service"]</span>
      <span>Call us at: <strong><a href="tel:5555555555">(555) 555-5555</a></strong></span>
    </div>
  </div>
</div>
"""


def hours_display(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-hours">
        <ul>
          <li><span class="tpl-hours-label">Sales:</span> Mon - Sat 9:00 AM - 9:00 PM</li>
          <li>Sun Closed</li>
        </ul>
      </div>
      <div class="tpl-hours">
        <ul>
          <li><span class="tpl-hours-label">Service:</span> Mon - Fri 7:00 AM - 6:00 PM</li>
          <li>Sat 8:00 AM - 5:00 PM</li>
          <li>Sun Closed</li>
        </ul>
      </div>
      <!-- Live: [di_hours department="Sales"] / [di_hours department="Service & Parts"] -->
    </div>
  </div>
</div>
"""


def fleet_grid(_p):
    fleet = [("Vehicle A", "Lorem Ipsum A", "$45"), ("Vehicle B", "Lorem Ipsum B", "$60"), ("Vehicle C", "Lorem Ipsum C", "$75"), ("Vehicle D", "Lorem Ipsum D", "$99")]
    cols = "".join(
        f"""
        <div class="tpl-card tpl-center">
          <img class="tpl-card-media" src="{img(300, 225, photo)}" alt="Vehicle placeholder" width="300" height="225">
          <div class="tpl-card-body">
            <h3 class="tpl-card-title">{title}</h3>
            <div class="tpl-fleet-price"><span>{price}</span>/day</div>
            <p class="tpl-muted tpl-mb-0">{IPSUM3}</p>
          </div>
        </div>
"""
        for photo, title, price in fleet
    )
    return f"""
<div class="tpl-root" id="fleet">
  <div class="tpl-section">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Lorem Ipsum Fleet</h2>
      <p class="tpl-lead tpl-center">{IPSUM}</p>
      <div class="tpl-row tpl-row--4 tpl-mt">{cols}
      </div>
    </div>
  </div>
</div>
"""


def checklist(_p):
    items = [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor incididunt",
        "Ut enim ad minim veniam",
        "Quis nostrud exercitation ullamco",
        "Duis aute irure dolor in voluptate",
    ]
    lis = "".join(f'<li><span class="tpl-check" aria-hidden="true"></span><span>{t}</span></li>\n        ' for t in items)
    return f"""
<div class="tpl-root">
  <div class="tpl-section tpl-section--alt">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">What You'll Need</h2>
      <ul class="tpl-checklist">
        {lis}
      </ul>
    </div>
  </div>
</div>
"""


def form_cta(p):
    return f"""
<div class="tpl-root" id="form">
  <div class="tpl-section">
    <div class="tpl-container">
      <div class="tpl-panel">
        <h2>Lorem Ipsum Contact Form</h2>
        <p class="tpl-lead">Call <a href="tel:5555555555"><strong>(555) 555-5555</strong></a>. {IPSUM}</p>
        <!-- Live: [gravityform id="3" title="false" description="false"] -->
        <form class="tpl-form" action="#" method="post">
          <div>
            <label for="{p}name">Name</label>
            <input id="{p}name" name="name" type="text" placeholder="Lorem Ipsum">
          </div>
          <div>
            <label for="{p}email">Email</label>
            <input id="{p}email" name="email" type="email" placeholder="lorem@ipsum.com">
          </div>
          <div>
            <label for="{p}phone">Phone</label>
            <input id="{p}phone" name="phone" type="tel" placeholder="(555) 555-5555">
          </div>
          <div>
            <label for="{p}message">Message</label>
            <textarea id="{p}message" name="message" placeholder="{IPSUM}"></textarea>
          </div>
          <button class="{BTN}" type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>
"""


def directions_map(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <h2>Visit Our Lorem Ipsum Location</h2>
      <div class="tpl-row tpl-row--2 tpl-row--split tpl-mt">
        <div>
          <h3>Directions from Downtown</h3>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
            <li>Sed do eiusmod tempor incididunt ut labore</li>
            <li>Ut enim ad minim veniam, quis nostrud</li>
            <li>Duis aute irure dolor in reprehenderit</li>
            <li>Excepteur sint occaecat cupidatat non proident</li>
          </ul>
        </div>
        <div class="tpl-map">
          <iframe src="https://maps.google.com/maps?q=Cincinnati+OH&amp;output=embed" title="Directions map placeholder" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  </div>
</div>
"""


def cta_button_row(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <p class="tpl-lead tpl-center">{IPSUM}</p>
      <div class="tpl-btn-row tpl-btn-row--4">
        <a class="{BTN}" href="/new-vehicles/">New Vehicles</a>
        <a class="{BTN}" href="/used-vehicles/">Used Vehicles</a>
        <a class="{BTN}" href="/finance/apply-for-financing/">Apply Online</a>
        <a class="{BTN}" href="/contact-us/">Contact Us</a>
      </div>
    </div>
  </div>
</div>
"""


def content_sidebar(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section">
    <div class="tpl-container">
      <h2>Lorem Ipsum Vehicles</h2>
      <div class="tpl-row tpl-row--sidebar tpl-mt">
        <div>
          <h3>New Vehicles from Your Local Dealership</h3>
          <p>{IPSUM} {IPSUM2}</p>
          <p>{IPSUM3}</p>
          <p class="tpl-mb-0">{IPSUM}</p>
        </div>
        {_loc_card("Lorem Ipsum Dealership", "Dealer Logo", "1234 Placeholder Ave, City, ST 00000")}
      </div>
    </div>
  </div>
</div>
"""


def two_column_cards(_p):
    return f"""
<div class="tpl-root">
  <div class="tpl-section tpl-section--alt">
    <div class="tpl-container">
      <h2 class="tpl-center tpl-headline-lined">Financing &amp; Service</h2>
      <div class="tpl-row tpl-row--2 tpl-mt">
        <article class="tpl-card">
          <div class="tpl-card-body">
            <h3 class="tpl-card-title">Lorem Ipsum Financial Center</h3>
            <p>{IPSUM}</p>
            <p>{IPSUM2}</p>
            <p class="tpl-mb-0">{IPSUM3}</p>
          </div>
        </article>
        <article class="tpl-card">
          <div class="tpl-card-body">
            <h3 class="tpl-card-title">Lorem Ipsum Service Center</h3>
            <p>{IPSUM2}</p>
            <p>{IPSUM}</p>
            <p class="tpl-mb-0">Questions? Call <a href="tel:5555555555">(555) 555-5555</a>.</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</div>
"""


SECTION_SPECS = [
    ("hero-overlay.html", "Hero Overlay", "heroov-", hero_overlay, "Full-width hero image with overlay headline."),
    ("hero-banner.html", "Hero Banner", "herobn-", hero_banner, "Banner hero with lead copy and two CTAs."),
    ("page-header.html", "Page Header", "pghead-", page_header, "Banner image, title, and intro copy."),
    ("next-steps.html", "Next Steps", "nxtstp-", next_steps, "Copy + image split with checklist and CTA."),
    ("location-video.html", "Location + Video", "locvid-", location_video, "Video beside a location card."),
    ("location-cards.html", "Location Cards", "locards-", location_cards, "Two location cards."),
    ("split-media.html", "Split Media", "splitmd-", split_media, "Image/text row plus reverse video row."),
    ("feature-cards.html", "Feature Cards", "featcrd-", feature_cards, "2×2 text cards."),
    ("highlight-features.html", "Highlight Features", "hlfeat-", highlight_features, "Three centered highlight cards."),
    ("icon-features.html", "Icon Features", "iconft-", icon_features, "Four icon benefit cards."),
    ("trade-in.html", "Trade-In Promo", "tradein-", trade_in, "Valuation promo with image and CTA."),
    ("finance.html", "Finance Split", "finance-", finance, "Image + benefits checklist + CTA."),
    ("meet-team.html", "Meet the Team", "meetm-", meet_team, "Staff grid (swap for [staff])."),
    ("deal-layout.html", "Deal Layout", "deallay-", deal_layout, "Thank-you deal row: inventory carousel + service CTAs. Needs tpl.js."),
    ("store-directory.html", "Store Directory", "strdir-", store_directory, "Store cards + modals. Needs tpl.js."),
    ("faq.html", "FAQ Accordion", "faqacc-", faq, "Click-to-expand FAQ. Needs tpl.js."),
    ("corporate.html", "Corporate / Why Choose", "corpw-", corporate, "Centered about panel with checklist."),
    ("map-cta.html", "Map + CTAs", "mapcta-", map_cta, "Map with stacked action buttons."),
    ("contact-buttons.html", "Contact Buttons", "ctabtns-", contact_buttons, "Three equal CTAs in one row."),
    ("hours-bar.html", "Hours Bar", "hrsbar-", hours_bar, "Dark hours/phone strip."),
    ("hours-display.html", "Hours Display", "hrsdisp-", hours_display, "Sales & service hours lines."),
    ("fleet-grid.html", "Fleet Grid", "fleetgd-", fleet_grid, "Product/vehicle grid with prices."),
    ("checklist.html", "Checklist", "chklist-", checklist, "Two-column requirements list."),
    ("form-cta.html", "Form CTA", "formcta-", form_cta, "Contact form placeholder (swap Gravity Form)."),
    ("directions-map.html", "Directions + Map", "dirmap-", directions_map, "Directions list beside map."),
    ("cta-button-row.html", "Four CTA Buttons", "ctarow-", cta_button_row, "Four equal utility CTAs."),
    ("content-sidebar.html", "Content + Sidebar", "contsb-", content_sidebar, "Main copy with thank-you contact card ([di_display_open_hours])."),
    ("two-column-cards.html", "Two Column Cards", "twocards-", two_column_cards, "Finance and service cards."),
]


def index_html():
    cards = []
    for filename, title, _prefix, _fn, blurb in SECTION_SPECS:
        cards.append(f"""
        <article class="tpl-card">
          <div class="tpl-card-body">
            <p class="tpl-muted tpl-mb-0">{filename}</p>
            <h2 class="tpl-card-title">{title}</h2>
            <p>{blurb}</p>
            <p class="tpl-mb-0"><a class="{BTN}" href="sections/{filename}">Open snippet</a></p>
          </div>
        </article>""")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Section Template Library</title>
  <link rel="stylesheet" href="css/tpl.css">
  <link rel="stylesheet" href="css/tpl-honda.css">
</head>
<body>
  <header class="tpl-hero" style="min-height: 220px;">
    <div class="tpl-hero-scrim"></div>
    <div class="tpl-hero-inner">
      <h1 class="tpl-hero-title">Section Template Library</h1>
      <p class="tpl-hero-lead">Final snippets · tpl.css + brand sheet · no Bootstrap required</p>
    </div>
  </header>
  <main class="tpl-container tpl-section">
    <h2>How to use</h2>
    <ol>
      <li>Paste <code>css/tpl.css</code> then <code>css/tpl-{{brand}}.css</code> into Head/Header (one rooftop at a time).</li>
      <li>Copy a section HTML file into Composer. FAQ / store directory / deal layout include their JS on the page.</li>
      <li>Replace Lorem Ipsum / images. Buttons use <code>{BTN}</code>.</li>
    </ol>
    <p class="tpl-muted">See <a href="DEPLOY.md">DEPLOY.md</a>.</p>
    <h2 class="tpl-mt">Sections ({len(SECTION_SPECS)})</h2>
    <div class="tpl-row tpl-row--3 tpl-mt">{''.join(cards)}
    </div>
  </main>
  <script src="js/tpl.js"></script>
</body>
</html>
"""


def main():
    SECTIONS.mkdir(parents=True, exist_ok=True)
    # Remove retired / redundant section files
    for stale in ("extra-locations.html",):
        path = SECTIONS / stale
        if path.exists():
            path.unlink()

    for filename, title, prefix, builder, _blurb in SECTION_SPECS:
        html = builder(prefix)
        (SECTIONS / filename).write_text(pack(title, html, needs_js=filename in NEEDS_JS), encoding="utf-8")

    (ROOT / "index.html").write_text(index_html(), encoding="utf-8")
    print(f"Wrote {len(SECTION_SPECS)} final sections + index.html")


if __name__ == "__main__":
    main()
