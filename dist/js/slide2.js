document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#sommaire li").forEach((item) => {
    item.addEventListener("click", () => {
      const slideIndex = parseInt(item.dataset.slide, 10);
      if (typeof Reveal !== "undefined" && Reveal.slide) {
        Reveal.slide(slideIndex + 1);
      } else {
        console.warn("Reveal non disponible au clic du sommaire");
      }
    });
  });

  // effet feuilles
  (function () {
    if (typeof gsap === "undefined") {
      console.error(
        "GSAP non chargé. Assure-toi d'inclure gsap avant ce script."
      );
      return;
    }

    const leafCount = 30;
    const container = document.getElementById("leaves-end");
    if (!container) {
      console.error("#leaves manquant");
      return;
    }

    const rand = (a, b) => a + Math.random() * (b - a);

    // crée les feuilles
    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      container.appendChild(leaf);

      const startX = Math.random() * window.innerWidth;
      const startY = -50 - Math.random() * 300;

      leaf.style.left = startX + "px";
      gsap.set(leaf, { x: 0, y: startY, rotation: rand(-10, 10), opacity: 1 });

      createSwing(leaf);
      // démarrer la chute avec un petit délai échelonné
      startFall(leaf, rand(0, 2 * i));
    }

    function createSwing(leaf) {
      const sway = rand(40, 120);
      const dur = rand(1.2, 2.2);
      const rot = rand(6, 22);
      if (leaf._swingTween) leaf._swingTween.kill();
      leaf._swingTween = gsap.to(leaf, {
        x: "+=" + sway,
        rotation: "+=" + rot,
        duration: dur,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    function startFall(leaf, delay = 0) {
      // kill si existait déjà
      if (leaf._fallTween) {
        leaf._fallTween.kill();
        leaf._fallTween = null;
      }

      // lire y courant (transform)
      const currentY = gsap.getProperty(leaf, "y"); // number
      const targetY = window.innerHeight + 120;
      const remaining = Math.max(0, targetY - currentY);

      // vitesse approximative (px / sec)
      const baseSpeed = rand(60, 120);
      const duration = Math.max(1, remaining / baseSpeed);

      leaf._fallTween = gsap.to(leaf, {
        y: targetY,
        duration: duration,
        ease: "linear",
        delay: delay,
        onComplete: () => {
          // reset propre
          const newX = Math.random() * window.innerWidth;
          const newStartY = -50 - Math.random() * 300;
          leaf.style.left = newX + "px";
          gsap.set(leaf, {
            x: 0,
            y: newStartY,
            rotation: rand(-10, 10),
            opacity: 1,
          });

          // petit délai aléatoire avant relancer la chute
          const respawnDelay = rand(0, 1.5);
          startFall(leaf, respawnDelay);
        },
      });
    }
  })();
});
