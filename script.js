/* ═══════════════════════════════════════════════════════════════
   ARKANI — PERSONAL DOSSIER · interactions
   Vanilla JS · no dependencies · reduced-motion aware
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  /* ── Section registry ── */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main .section[data-page]')
  );

  /* ── 1. Build TOC, rail index, overlay nav ── */
  var toc = document.getElementById('toc');
  var railNav = document.querySelector('.rail__index');
  var overlayNav = document.querySelector('.overlay__nav');

  function displayPage(i) {
    var n = i + 1;
    return n < 10 ? '0' + n : String(n);
  }

  sections.forEach(function (sec, i) {
    var page = sec.dataset.page;
    var name = sec.dataset.name;
    var label = i === 0 ? 'cover' : '§ ' + displayPage(i);

    /* TOC row */
    var row = document.createElement('a');
    row.href = '#' + sec.id;
    row.innerHTML =
      '<span class="toc__n">' + displayPage(i) + '</span>' +
      '<span class="toc__name">' + name + '</span>' +
      '<span class="toc__leaders" aria-hidden="true"></span>' +
      '<span class="toc__page">§ ' + displayPage(i) + '</span>';
    toc.appendChild(row);

    /* Rail index link */
    var rail = document.createElement('a');
    rail.href = '#' + sec.id;
    rail.textContent = page;
    rail.dataset.section = sec.id;
    railNav.appendChild(rail);

    /* Overlay link */
    var ov = document.createElement('a');
    ov.href = '#' + sec.id;
    ov.innerHTML = '<span>' + page + '</span>' + name;
    ov.dataset.section = sec.id;
    overlayNav.appendChild(ov);
  });

  /* ── 2. Overlay open / close ── */
  var menuBtn = document.getElementById('menu-btn');
  var overlay = document.getElementById('overlay');
  function openOverlay() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }
  menuBtn.addEventListener('click', function () {
    overlay.classList.contains('is-open') ? closeOverlay() : openOverlay();
  });
  overlayNav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeOverlay();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeOverlay();
      menuBtn.focus();
    }
  });

  /* ── 3. Scroll-spy ── */
  var pageInd = document.getElementById('page-indicator');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      document.querySelectorAll('.rail__index a, .overlay__nav a').forEach(function (a) {
        a.classList.toggle('is-active', a.dataset.section === id);
      });
      if (pageInd) pageInd.textContent = entry.target.dataset.page;
    });
  }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
  sections.forEach(function (s) { spy.observe(s); });

  /* ── 4. Cover entrance ── */
  function load() { body.classList.add('is-loaded'); }
  if (reduceMotion) load();
  else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(load, 60); });
  } else setTimeout(load, 60);

  /* ── 5. Reveals ── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ── 6. Work index accordion ── */
  document.querySelectorAll('.index__entry').forEach(function (entry) {
    var hit = entry.querySelector('.index__hit');
    if (!hit) return;
    var toggle = entry.querySelector('.index__toggle');
    hit.addEventListener('click', function () {
      var isOpen = entry.classList.contains('is-open');
      document.querySelectorAll('.index__entry').forEach(function (e) {
        var wasOpen = e.classList.contains('is-open');
        e.classList.remove('is-open');
        var b = e.querySelector('.index__hit');
        if (b) b.setAttribute('aria-expanded', 'false');
        var t = e.querySelector('.index__toggle');
        if (t) t.textContent = '+';
      });
      if (!isOpen) {
        entry.classList.add('is-open');
        hit.setAttribute('aria-expanded', 'true');
        if (toggle) toggle.textContent = '\u2212';
      }
    });
  });
})();