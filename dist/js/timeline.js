(function () {
  // ——— CSS à avoir sur le conteneur ———
  // .timeline-container { max-height: 62vh; overflow: auto; overscroll-behavior: contain; scroll-behavior: smooth; }

  function setupForSlide(slide) {
    if (!slide) return;
    const scroller = slide.querySelector('.timeline-container');
    if (!scroller || scroller.dataset.bound) return;

    scroller.dataset.bound = '1';
    scroller.tabIndex = 0;

    // — Wheel: empêcher Reveal + scroller nous-mêmes (même en butée)
    scroller.addEventListener('wheel', (e) => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) return; // pas scrollable → laisser Reveal

      e.stopPropagation();
      e.preventDefault();

      const next = Math.min(max, Math.max(0, scroller.scrollTop + e.deltaY));
      scroller.scrollTop = next;
      // DEBUG
      // console.log('scrollTop:', scroller.scrollTop, 'max:', max);
    }, { passive: false });

    // — Touch (mobile)
    let lastY = 0;
    scroller.addEventListener('touchstart', (e) => { lastY = e.touches[0].clientY; }, { passive: true });
    scroller.addEventListener('touchmove', (e) => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) return;

      e.stopPropagation();
      e.preventDefault();

      const y = e.touches[0].clientY;
      const dy = lastY - y;
      lastY = y;

      const next = Math.min(max, Math.max(0, scroller.scrollTop + dy));
      scroller.scrollTop = next;
    }, { passive: false });
  }

  // — Auto-centre le fragment visible dans le container
  function scrollFragmentIntoView(el) {
    if (!el) return;
    const scroller = el.closest('.timeline-container');
    if (!scroller) return;

    const rect = el.getBoundingClientRect();
    const srect = scroller.getBoundingClientRect();
    const targetTop = scroller.scrollTop + (rect.top - srect.top) - (srect.height * 0.25);

    scroller.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  // Bind quand Reveal est prêt / change de slide
  Reveal.on('ready', (e) => setupForSlide(e.currentSlide || Reveal.getCurrentSlide()));
  Reveal.on('slidechanged', (e) => setupForSlide(e.currentSlide));

  // Suivre les fragments
  Reveal.on('fragmentshown', (e) => {
    if (e.fragment && e.fragment.closest('.timeline-container')) {
      scrollFragmentIntoView(e.fragment);
    }
  });

  Reveal.on('fragmenthidden', (e) => {
    const scroller = e.fragment && e.fragment.closest('.timeline-container');
    if (!scroller) return;
    const visibles = scroller.querySelectorAll('.fragment.visible');
    if (visibles.length) {
      scrollFragmentIntoView(visibles[visibles.length - 1]);
    } else {
      scroller.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
