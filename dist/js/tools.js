// Associer chaque fragment à une image
const images = [
  "img/logger.png", // pour Logger
  "img/monitoring.jpg", // pour Monitoring
  "img/exceptions.png", // pour Exception handler
];

Reveal.on("fragmentshown", (event) => {
  const idx = event.fragment.dataset.index;
  if (idx !== undefined) {
    document.getElementById("practice-image").src = images[idx];
  }
});

Reveal.on("fragmenthidden", (event) => {
  const idx = event.fragment.dataset.index;
  if (idx !== undefined && idx > 0) {
    document.getElementById("practice-image").src = images[idx - 1];
  }
});
