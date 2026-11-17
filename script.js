(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* Hero: print the scan one line at a time, once. */
  var lines = Array.prototype.slice.call(document.querySelectorAll('#term .t-line'));
  if (reduce) {
    lines.forEach(function (l) { l.classList.add('is-shown'); });
  } else {
    var i = 0;
    (function next() {
      if (i >= lines.length) return;
      lines[i].classList.add('is-shown');
      var delay = i === 0 ? 650 : 330;
      i += 1;
      setTimeout(next, delay);
    })();
  }

  /* Nav: mark the section in view. */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      var a = map[e.target.id];
      if (a) a.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });
})();
