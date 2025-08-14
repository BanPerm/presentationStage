/* improved reveal-hero-fill: uses existing #global-hero-overlay if present */
(function () {
  const overlayIdHtml = "global-hero-overlay";
  const existing = document.getElementById(overlayIdHtml);

  // use DOM node if present, otherwise create one (backwards compatible)
  const revealRoot = document.querySelector(".reveal");
  if (!revealRoot) return;
  const overlay =
    existing ||
    (function create() {
      const o = document.createElement("div");
      o.id = overlayIdHtml;
      o.setAttribute("aria-hidden", "true");
      revealRoot.appendChild(o);
      return o;
    })();

  // inject SVG but keep it idempotent
  overlay.innerHTML = `
    <svg id="rhfSvg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="uniformShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="-8" dy="5" stdDeviation="4" flood-color="black" flood-opacity="0.5"/>
        </filter>
  
        <mask id="rhfMask">
          <rect width="100%" height="100%" fill="black"/>
          <!-- texte du masque avec ombre uniforme -->
          <text id="rhfTextMask" x="50%" y="55%" text-anchor="middle" fill="white" filter="url(#uniformShadow)">PLACEHOLDER</text>
        </mask>
      </defs>
  
      <!-- texte de fallback avec ombre uniforme -->
      <text id="rhfTextFallback" x="50%" y="55%" text-anchor="middle" filter="url(#uniformShadow)">PLACEHOLDER</text>
  
      <g mask="url(#rhfMask)">
        <image id="rhfImage" href="" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"></image>
      </g>
    </svg>
    `.trim();

  const svg = overlay.querySelector("#rhfSvg");
  const textFallback = overlay.querySelector("#rhfTextFallback");
  const textMask = overlay.querySelector("#rhfTextMask");
  const svgImage = overlay.querySelector("#rhfImage");

  // small helper to set text content safely
  function setText(t) {
    textFallback.textContent = t;
    textMask.textContent = t;
  }

  // fit text: compute font px relative to slide height and ensure not cut
  function fitAndApply(w, h, textEl, fallbackEl) {
    // base % of height (tweak this multiplier to taste)
    let fontPx = Math.round(h * 0.18);
    textEl.style.fontSize = fontPx + "px";
    fallbackEl.style.fontSize = fontPx + "px";

    // try to shrink if bbox exceeds allowed space
    try {
      let bbox = textEl.getBBox();
      const maxW = w * 0.92;
      const maxH = h * 0.9;
      let safety = 0;
      while (safety < 12 && (bbox.width > maxW || bbox.height > maxH)) {
        const ratioW = maxW / (bbox.width || 1);
        const ratioH = maxH / (bbox.height || 1);
        const ratio = Math.min(ratioW, ratioH);
        fontPx = Math.max(8, Math.floor(fontPx * Math.max(0.9, ratio)));
        textEl.style.fontSize = fontPx + "px";
        fallbackEl.style.fontSize = fontPx + "px";
        bbox = textEl.getBBox();
        safety++;
      }
    } catch (e) {
      // some browsers might fail briefly; ignore
    }
  }

  // sync function
  function syncToSlide(slideEl) {
    if (
      !slideEl ||
      (!slideEl.classList.contains("hero-fill") &&
        !slideEl.hasAttribute("data-fill-text"))
    ) {
      overlay.style.display = "none";
      return;
    }

    // text selection
    const text =
      slideEl.getAttribute("data-fill-text") ||
      (slideEl.querySelector("h1") &&
        slideEl.querySelector("h1").textContent.trim()) ||
      slideEl.dataset.title ||
      " ";
    setText(text);

    // image selection
    const img =
      slideEl.getAttribute("data-fill-image") ||
      slideEl.getAttribute("data-background") ||
      "";
    if (img) svgImage.setAttribute("href", img);
    else svgImage.removeAttribute("href");

    // measure reveal container
    const revealRect = revealRoot.getBoundingClientRect();
    const w = Math.round(revealRect.width) || 1280;
    const h = Math.round(revealRect.height) || 720;

    // set viewBox + explicit pixel sizes
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);

    // place texts
    const centerX = Math.round(w / 2);
    const centerY = Math.round(h * 0.55);
    textMask.setAttribute("x", centerX);
    textMask.setAttribute("y", centerY);
    textFallback.setAttribute("x", centerX);
    textFallback.setAttribute("y", centerY);

    // fit sizes
    fitAndApply(w, h, textMask, textFallback);

    // show overlay
    overlay.style.display = "block";
  }

  // debounce
  let t;
  const debounced = (slide) => {
    clearTimeout(t);
    t = setTimeout(() => syncToSlide(slide), 25);
  };

  // event hooks
  function onReady(e) {
    const cur =
      (e && e.currentSlide) ||
      (window.Reveal && Reveal.getCurrentSlide && Reveal.getCurrentSlide());
    debounced(cur);
  }
  function onSlide(e) {
    const cur =
      (e && (e.currentSlide || (e.detail && e.detail.currentSlide))) ||
      (window.Reveal && Reveal.getCurrentSlide && Reveal.getCurrentSlide());
    debounced(cur);
  }

  // observe resize
  const ro = new ResizeObserver(() =>
    debounced(
      window.Reveal && Reveal.getCurrentSlide && Reveal.getCurrentSlide()
    )
  );
  ro.observe(revealRoot);

  if (window.Reveal && window.Reveal.addEventListener) {
    window.Reveal.addEventListener("ready", onReady);
    window.Reveal.addEventListener("slidechanged", onSlide);
  } else {
    document.addEventListener("DOMContentLoaded", () =>
      onReady({
        currentSlide: document.querySelector(".reveal .slides section"),
      })
    );
  }
  window.addEventListener("resize", () =>
    debounced(
      window.Reveal && Reveal.getCurrentSlide && Reveal.getCurrentSlide()
    )
  );

  // expose quick debug helper in console
  window._rhf_debug_show = function () {
    document.body.classList.add("debug");
    console.log("debug ON");
  };
  window._rhf_debug_hide = function () {
    document.body.classList.remove("debug");
    console.log("debug OFF");
  };
})();
