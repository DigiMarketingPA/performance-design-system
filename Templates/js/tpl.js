// Section Template Library — FAQ, store modals, deal carousel
// Included at the bottom of faq / store-directory / deal-layout section HTML.
// data-cfasync="false" on the <script> tag keeps Cloudflare Rocket Loader off this block.

document.addEventListener("DOMContentLoaded", function () {
  if (window.__tplJsInit) return;
  window.__tplJsInit = true;

  // FAQ
  var faqItems = document.querySelectorAll(".tpl-faq-item");

  faqItems.forEach(function (faqItem) {
    var faqHeader = faqItem.querySelector(".tpl-faq-q");
    if (!faqHeader) return;

    faqHeader.addEventListener("click", function () {
      faqItem.classList.toggle("tpl-open");

      faqItems.forEach(function (otherItem) {
        if (otherItem !== faqItem) {
          otherItem.classList.remove("tpl-open");
        }
      });
    });
  });

  // Store modals
  var storeCards = document.querySelectorAll(".tpl-store[data-tpl-modal]");
  var storeModals = document.querySelectorAll(".tpl-modal");
  var closeButtons = document.querySelectorAll(".tpl-modal-close");

  storeCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      var modalId = card.getAttribute("data-tpl-modal");
      if (!modalId) return;
      e.preventDefault();
      var modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("tpl-open");
        document.body.style.overflow = "hidden";
      }
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      var modal = button.closest(".tpl-modal");
      if (modal) {
        modal.classList.remove("tpl-open");
        document.body.style.overflow = "";
      }
    });
  });

  storeModals.forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("tpl-open");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      storeModals.forEach(function (modal) {
        if (modal.classList.contains("tpl-open")) {
          modal.classList.remove("tpl-open");
          document.body.style.overflow = "";
        }
      });
    }
  });

  // Deal carousel — scroll by ~3 cards (matches thank-you page)
  document.querySelectorAll(".tpl-carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".tpl-carousel-track");
    var prev = carousel.querySelector(".tpl-carousel-prev");
    var next = carousel.querySelector(".tpl-carousel-next");
    if (!track) return;

    var gapPx = 24;

    function firstCard() {
      return (
        track.querySelector(".tpl-vcard") ||
        track.querySelector(".result-wrap") ||
        null
      );
    }

    function getScrollStep() {
      var card = firstCard();
      if (card) {
        return card.getBoundingClientRect().width * 3 + gapPx * 2;
      }
      return track.clientWidth || 900;
    }

    function updateArrows() {
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 0;
      if (next) next.disabled = maxScroll <= 0 || track.scrollLeft >= maxScroll - 1;
    }

    function move(dir) {
      track.scrollBy({ left: getScrollStep() * dir, behavior: "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { move(-1); });
    if (next) next.addEventListener("click", function () { move(1); });
    track.addEventListener("scroll", updateArrows);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(updateArrows).observe(track);
    }
    updateArrows();
  });
});
