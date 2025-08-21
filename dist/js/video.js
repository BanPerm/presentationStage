// JS pour autoplay quand on arrive sur la slide et pause quand on quitte
Reveal.addEventListener("slidechanged", function (event) {
  // Pause toutes les vidéos
  document.querySelectorAll(".demo-video").forEach((v) => v.pause());

  // Lire la vidéo de la slide courante si elle existe
  const video = event.currentSlide.querySelector(".demo-video");
  if (video) {
    video.currentTime = 0;
  }
});

function rewindVideo(videoElement, seconds = 10) {
  // Vérifie que la vidéo est bien chargée
  if (videoElement && videoElement.currentTime !== undefined) {
    videoElement.currentTime = Math.max(videoElement.currentTime - seconds, 0);
  }
}

function forwardVideo(videoElement, seconds = 10) {
  // Vérifie que la vidéo est bien chargée
  if (videoElement && videoElement.currentTime !== undefined) {
    videoElement.currentTime = Math.max(videoElement.currentTime + seconds, 0);
  }
}

document.addEventListener("keydown", function (event) {
  const currentVideo =
    Reveal.getCurrentSlide().querySelector("video.demo-video");
  if (!currentVideo) return;

  switch (event.key) {
    case "Enter": // pause/play
      event.preventDefault();
      if (currentVideo.paused) {
        currentVideo.play();
      } else {
        currentVideo.pause();
      }
      break;

    case "f": // plein écran
      event.preventDefault();
      if (document.fullscreenElement === currentVideo) {
        document.exitFullscreen?.();
      } else {
        currentVideo.requestFullscreen?.();
      }
      break;

    case "4": // avance/recul sur touches normales
    case "Numpad4": // pavé numérique
      rewindVideo(currentVideo, 10);
      break;

    case "6":
    case "Numpad6":
      forwardVideo(currentVideo, 10);
      break;
  }
});
