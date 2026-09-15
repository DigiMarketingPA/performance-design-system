/* Thank You page – Performance Toyota. Inject in WordPress script area. Runs when DOM is ready. */
(function () {
    'use strict';

    function run() {
      var stickyBar = document.getElementById('sticky-bar');
      var financeSection = document.getElementById('finance');
      if (stickyBar && financeSection) {
        function updateStickyBar() {
          var rect = financeSection.getBoundingClientRect();
          if (rect.bottom < 0) stickyBar.removeAttribute('hidden');
          else stickyBar.setAttribute('hidden', '');
        }
        window.addEventListener('scroll', function () { requestAnimationFrame(updateStickyBar); });
        updateStickyBar();
      }

      var track = document.getElementById('carousel-track');
      var prevBtn = document.getElementById('carousel-prev');
      var nextBtn = document.getElementById('carousel-next');
      if (track && (prevBtn || nextBtn)) {
        var slideWidth = 196;
        function scrollCarousel(direction) {
          track.scrollBy({ left: direction === 'next' ? slideWidth : -slideWidth, behavior: 'smooth' });
        }
        if (prevBtn) prevBtn.addEventListener('click', function () { scrollCarousel('prev'); });
        if (nextBtn) nextBtn.addEventListener('click', function () { scrollCarousel('next'); });
      }

      var quizWrap = document.getElementById('quiz-wrap');
      if (quizWrap) {
        var steps = quizWrap.querySelectorAll('.ty-quiz-step');
        var resultEl = document.getElementById('quiz-result');
        var matchNameEl = document.getElementById('quiz-match-name');
        if (steps.length && resultEl) {
          var quizAnswers = [];
          var matches = { family: 'Toyota Highlander', fuel: 'Toyota Corolla', fun: 'Toyota Camry', under: 'Toyota Corolla', mid: 'Toyota RAV4', flex: 'Toyota Highlander', new: 'New', cp: 'Certified Pre-Owned' };
          function showStep(stepIndex) {
            steps.forEach(function (s, i) { s.classList.toggle('ty-hidden', i !== stepIndex); });
            resultEl.classList.add('ty-hidden');
          }
          function showResult() {
            steps.forEach(function (s, i) { s.classList.add('ty-hidden'); });
            resultEl.classList.remove('ty-hidden');
            if (matchNameEl) matchNameEl.textContent = matches[quizAnswers[0]] || 'Toyota RAV4';
          }
          quizWrap.addEventListener('click', function (e) {
            var opt = e.target.closest('.ty-quiz-opt');
            if (!opt) return;
            var value = opt.getAttribute('data-value');
            if (!value) return;
            quizAnswers.push(value);
            if (quizAnswers.length >= 3) showResult();
            else showStep(quizAnswers.length);
          });
        }
      }

      var videoPlay = document.getElementById('video-play');
      var videoPlaceholder = document.getElementById('video-placeholder');
      if (videoPlay && videoPlaceholder) {
        videoPlay.addEventListener('click', function () {
          var p = document.createElement('p');
          p.className = 'ty-video-placeholder-msg';
          p.textContent = 'Video embed URL goes here.';
          videoPlaceholder.textContent = '';
          videoPlaceholder.appendChild(p);
        });
      }

      /* Similar vehicles carousel: scroll by exactly 3 cards so each page aligns */
      var similarRow = document.querySelector('.ty-similar-vehicles-carousel .ty-similar-vehicles-row');
      var similarPrev = document.getElementById('similar-vehicles-prev');
      var similarNext = document.getElementById('similar-vehicles-next');
      if (similarRow && (similarPrev || similarNext)) {
        var hits = similarRow.querySelector('#hits.columns-Auto, .lvrp-container #hits.columns-Auto');
        var gapPx = 24; /* 1.5rem to match CSS gap */
        function getScrollStep() {
          var firstCard = (hits && hits.querySelector('.result-wrap')) || similarRow.querySelector('.result-wrap');
          if (firstCard) {
            var cardWidth = firstCard.offsetWidth;
            return cardWidth * 3 + gapPx * 2; /* 3 cards + 2 gaps per page */
          }
          return similarRow.clientWidth;
        }
        function updateSimilarArrows() {
          var scrollLeft = similarRow.scrollLeft;
          var maxScroll = similarRow.scrollWidth - similarRow.clientWidth;
          if (similarPrev) similarPrev.disabled = scrollLeft <= 0;
          if (similarNext) similarNext.disabled = maxScroll <= 0 || scrollLeft >= maxScroll - 1;
        }
        function scrollSimilar(dir) {
          var step = getScrollStep();
          similarRow.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
        }
        if (similarPrev) similarPrev.addEventListener('click', function () { scrollSimilar('prev'); });
        if (similarNext) similarNext.addEventListener('click', function () { scrollSimilar('next'); });
        similarRow.addEventListener('scroll', updateSimilarArrows);
        if (typeof ResizeObserver !== 'undefined') {
          var similarRo = new ResizeObserver(updateSimilarArrows);
          similarRo.observe(similarRow);
        }
        updateSimilarArrows();
      }

      /* Text Us Now: open the site chat bubble/panel instead of navigating away */
      var textUsNowBtn = document.getElementById('text-us-now');
      if (textUsNowBtn) {
        textUsNowBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var chatToggle = document.querySelector('[data-testid="chat-icon-engagement-button"]');
          if (chatToggle) {
            chatToggle.click();
          }
        });
      }

      /* Service specials: point all coupon links to Performance Toyota service page; wrap title in link if needed; scroll arrows */
      var serviceSpecialsUrl = 'https://www.performancetoyota.com/service/';
      var tileServiceEl = document.querySelector('.ty-tile.ty-tile-service');
      var difoWrapper = tileServiceEl && tileServiceEl.querySelector('.difo-wrapper');
      if (difoWrapper) {
        var cards = difoWrapper.querySelectorAll('.difo-card');
        cards.forEach(function (card) {
          var headerInner = card.querySelector('.coupon-header-inner');
          if (!headerInner) return;
          var title = headerInner.querySelector('.coupon-title');
          var existingLink = headerInner.querySelector('a[href]');
          if (existingLink) {
            existingLink.setAttribute('href', serviceSpecialsUrl);
            existingLink.setAttribute('target', '_blank');
            existingLink.setAttribute('rel', 'noopener noreferrer');
            return;
          }
          if (title) {
            var wrap = document.createElement('a');
            wrap.setAttribute('href', serviceSpecialsUrl);
            wrap.setAttribute('target', '_blank');
            wrap.setAttribute('rel', 'noopener noreferrer');
            wrap.setAttribute('class', 'ty-coupon-title-link');
            title.parentNode.insertBefore(wrap, title);
            wrap.appendChild(title);
          }
        });
        var couponLinks = difoWrapper.querySelectorAll('.difo-card a[href]');
        couponLinks.forEach(function (link) {
          link.setAttribute('href', serviceSpecialsUrl);
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        });
        /* Scroll arrows for coupon list */
        var couponList = difoWrapper.querySelector('.difo-default-coupon');
        if (tileServiceEl && couponList) {
          var scrollStep = 60;
          var arrowsWrap = document.createElement('div');
          arrowsWrap.setAttribute('class', 'ty-coupon-scroll-arrows');
          arrowsWrap.setAttribute('aria-label', 'Scroll coupon list');
          var btnUp = document.createElement('button');
          btnUp.setAttribute('type', 'button');
          btnUp.setAttribute('class', 'ty-coupon-scroll-btn');
          btnUp.setAttribute('aria-label', 'Scroll up');
          btnUp.innerHTML = '\u25b2';
          var btnDown = document.createElement('button');
          btnDown.setAttribute('type', 'button');
          btnDown.setAttribute('class', 'ty-coupon-scroll-btn');
          btnDown.setAttribute('aria-label', 'Scroll down');
          btnDown.innerHTML = '\u25bc';
          function updateArrowState() {
            var maxScroll = couponList.scrollHeight - couponList.clientHeight;
            btnUp.disabled = couponList.scrollTop <= 0;
            btnDown.disabled = maxScroll <= 0 || couponList.scrollTop >= maxScroll - 1;
          }
          btnUp.addEventListener('click', function () {
            couponList.scrollBy({ top: -scrollStep, behavior: 'smooth' });
          });
          btnDown.addEventListener('click', function () {
            couponList.scrollBy({ top: scrollStep, behavior: 'smooth' });
          });
          couponList.addEventListener('scroll', updateArrowState);
          if (typeof ResizeObserver !== 'undefined') {
            var ro = new ResizeObserver(updateArrowState);
            ro.observe(couponList);
          }
          arrowsWrap.appendChild(btnUp);
          arrowsWrap.appendChild(btnDown);
          tileServiceEl.appendChild(arrowsWrap);
          updateArrowState();
        }
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  })();
