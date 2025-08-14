document.querySelectorAll("#sommaire li").forEach((item) => {
  item.addEventListener("click", () => {
    let slideIndex = parseInt(item.dataset.slide);
    Reveal.slide(slideIndex + 1);
  });
});
