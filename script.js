(function () {

  var toggle = document.querySelector(".menu-toggle");
  var overlay = document.querySelector(".menu-overlay");
  var menuLinks = document.querySelectorAll("#site-menu a");

  function isOpen() {
    return document.body.classList.contains("menu-open");
  }

  function setMenu(open, returnFocus) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (open && menuLinks.length) {
      
      window.setTimeout(function () {
        if (isOpen()) {
          menuLinks[0].focus();
        }
      }, 50);
    } else if (!open && returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setMenu(!isOpen(), true);
  });

  overlay.addEventListener("click", function () {
    setMenu(false, false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setMenu(false, true);
    }
  });

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

  
  function ramp(progress, start, end) {
    return clamp((progress - start) / (end - start));
  }

  function update() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    var taglineIn = ramp(progress, 0.04, 0.14);
    var taglineOut = ramp(progress, 0.30, 0.42);
    var synopsisIn = ramp(progress, 0.46, 0.58);

    tagline.style.opacity = taglineIn * (1 - taglineOut);

    if (synopsis) {
      synopsis.style.opacity = synopsisIn;
      
      synopsis.classList.toggle("is-visible", synopsisIn > 0.5);
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
