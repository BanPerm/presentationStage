(function(){
  const scroller = document.querySelector('.timeline-container');
  if (!scroller) return;

  scroller.setAttribute('tabindex','0'); // permet focus + scroll clavier si besoin

  scroller.addEventListener('wheel', (e) => {
    const canScrollUp = scroller.scrollTop > 0;
    const canScrollDown = scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight;

    if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
      // on veut scroller dans le container -> empêcher la propagation vers Reveal
      e.stopPropagation();
    }
    // sinon laisser le scroll se propager (changement de slide)
  }, { passive: false });

  // Touch pour mobile
  scroller.addEventListener('touchstart', (e) => {
    scroller._startY = e.touches[0].clientY;
  }, { passive: true });

  scroller.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const dy = scroller._startY - currentY;
    const canScrollUp = scroller.scrollTop > 0;
    const canScrollDown = scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight;

    if ((dy < 0 && canScrollUp) || (dy > 0 && canScrollDown)) {
      e.stopPropagation();
    }
  }, { passive: false });
})();
