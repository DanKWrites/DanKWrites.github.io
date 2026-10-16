(function () {
  // ---------- Sidebar menu ----------
  var toggle = document.querySelector(".menu-toggle");
  var overlay = document.querySelector(".menu-overlay");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });

  overlay.addEventListener("click", function () {
    setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  // ---------- Tagline fades in and out with scrolling (home page only) ----------
  var tagline = document.querySelector(".tagline");
  var cue = document.querySelector(".scroll-cue");
  var synopsis = document.querySelector(".synopsis");
  var shade = document.querySelector(".shade");

  if (!tagline) {
    return;
  }

  function clamp(value) {
    return Math.min(1, Math.max(0, value));
  }

  // 0 before "start", 1 after "end", smooth in between
  function ramp(progress, start, end) {
    return clamp((progress - start) / (end - start));
  }

  function update() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    // Timeline, as a share of the total scroll (0 = top, 1 = bottom).
    // Change these numbers to speed up or slow down each fade.
    var taglineIn = ramp(progress, 0.04, 0.14);
    var taglineOut = ramp(progress, 0.30, 0.42);
    var synopsisIn = ramp(progress, 0.46, 0.58);

    tagline.style.opacity = taglineIn * (1 - taglineOut);

    if (synopsis) {
      synopsis.style.opacity = synopsisIn;
    }

    if (shade) {
      shade.style.opacity = synopsisIn;
    }

    if (cue) {
      cue.style.opacity = 1 - ramp(progress, 0, 0.04);
    }
  }

  var waiting = false;
  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(function () {
        update();
        waiting = false;
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
