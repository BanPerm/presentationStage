// Image par défaut au chargement
document.getElementById("practice-image").src = "img/main.png";

// Associer chaque fragment à une image
const images = [
  "img/logger.png",
  "img/monitoring.jpg",
  "img/exception_handler.png",
];

Reveal.on("fragmentshown", (event) => {
  const idx = parseInt(event.fragment.dataset.index); // convertit en nombre
  if (!isNaN(idx) && idx >= 0 && idx < images.length) {
    document.getElementById("practice-image").src = images[idx];
  } else {
    document.getElementById("practice-image").src = "img/main.png";
  }
});

Reveal.on("fragmenthidden", (event) => {
  const idx = parseInt(event.fragment.dataset.index);
  if (!isNaN(idx) && idx > 0) {
    document.getElementById("practice-image").src = images[idx - 1];
  } else {
    document.getElementById("practice-image").src = "img/main.png";
  }
});
