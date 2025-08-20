// Associer chaque fragment à une image
const images = [
  "img/logger.png", // pour Logger
  "img/monitoring.jpg", // pour Monitoring
  "img/exception_handler.png", // pour Exception handler
];

Reveal.on("fragmentshown", (event) => {
  const idx = event.fragment.dataset.index;
  event.fragment.classList.add("visible");
  if (idx !== undefined) {
    document.getElementById("practice-image").src = images[idx];
  } else {
    document.getElementById("practice-image").src = "img/main.png"; // image par défaut
  }
});

Reveal.on("fragmenthidden", (event) => {
  const idx = event.fragment.dataset.index;
  if (idx !== undefined && idx > 0) {
    document.getElementById("practice-image").src = images[idx - 1];
  }
});
