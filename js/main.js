/* main.js
   1. Marks <html> as .js so CSS can enable scroll-reveal progressively.
   2. Keeps the footer year current.
   3. Scroll-in reveal via IntersectionObserver (falls back to visible). */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // --- footer year -----------------------------------------------------
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = year;
  });

  // --- scroll-in reveal --------------------------------------------------
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll("[data-reveal]");

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  function revealAll() {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // rootBounds === null means the observer can't measure (e.g. some
        // embedded contexts) — fail safe: show everything.
        if (entry.rootBounds === null) {
          io.disconnect();
          revealAll();
          return;
        }
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  targets.forEach(function (el) {
    // Anything already on screen at load reveals immediately.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("is-in");
    } else {
      io.observe(el);
    }
  });

  // Last-resort safety net: never leave content hidden.
  setTimeout(function () {
    var pending = document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (pending.length) {
      var y = window.scrollY || 0;
      var vh = window.innerHeight;
      var anyVisibleHidden = false;
      pending.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) { anyVisibleHidden = true; }
      });
      if (anyVisibleHidden) {
        io.disconnect();
        revealAll();
      }
    }
  }, 1200);
})();
