// Store directory modals — paste once into Footer / Custom JS as RAW JavaScript
// (no <script> tags). Requires css/modules/store-directory.css + store-directory markup.

document.addEventListener("DOMContentLoaded", function () {
  if (window.__paStoreDirInit) return;
  window.__paStoreDirInit = true;

  var storeCards = document.querySelectorAll(".pa-store[data-pa-modal]");
  var storeModals = document.querySelectorAll(".pa-modal");
  var closeButtons = document.querySelectorAll(".pa-modal-close");

  storeCards.forEach(function (card) {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    function openModal() {
      var modalId = card.getAttribute("data-pa-modal");
      if (!modalId) return;
      var modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.add("pa-open");
      document.body.style.overflow = "hidden";
    }

    card.addEventListener("click", openModal);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      var modal = button.closest(".pa-modal");
      if (modal) modal.classList.remove("pa-open");
      document.body.style.overflow = "";
    });
  });

  storeModals.forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("pa-open");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    storeModals.forEach(function (modal) {
      if (modal.classList.contains("pa-open")) {
        modal.classList.remove("pa-open");
        document.body.style.overflow = "";
      }
    });
  });
});
