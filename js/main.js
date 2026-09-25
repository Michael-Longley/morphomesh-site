document.getElementById("year").textContent = new Date().getFullYear();

// 3D Printopia promo banner (and signup popup, below) — auto-remove after
// the event so no manual deploy step is needed to take them down (there's
// no build/CI pipeline here).
const printopiaCutoff = new Date("2026-09-28T00:00:00");
const isAfterPrintopia = new Date() >= printopiaCutoff;
const promoBanner = document.querySelector(".promo-banner");
if (promoBanner && isAfterPrintopia) {
  promoBanner.remove();
}

// Close the mobile nav disclosure after a link is clicked.
document.querySelectorAll(".nav-disclosure .nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-disclosure")?.removeAttribute("open");
  });
});

// Reveal the fixed header only after scrolling past the hero wordmark —
// at the top of the page, "Morphomesh" itself is the header.
const siteHeader = document.querySelector(".site-header");
const revealHeaderThreshold = 80;

function updateHeaderVisibility() {
  siteHeader.classList.toggle("is-visible", window.scrollY > revealHeaderThreshold);
}

window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
updateHeaderVisibility();

// Hero floaters: a maintained pool of real product photos, randomly
// sampled into a fixed set of position "slots" on each load. True
// directory listing isn't available here — GitHub Pages serves files, not
// folder indexes, and there's no backend to ask "what's in this folder" —
// so this array is the practical equivalent: add a path to the pool and
// it's in the rotation next load, no other changes needed.
const heroFloaterPool = [
  "assets/tools/model-painter/card.jpg",
  "assets/tools/model-painter/gallery-1.jpg",
  "assets/tools/model-painter/Flower-Panda_PLA_21h18m_20260825160813-poster.jpg",
  "assets/tools/model-painter/PXL_20260824_172337851-poster.jpg",
  "assets/tools/model-painter/PXL_20260827_163330833-poster.jpg",
  "assets/tools/color-puzzle-generator/card.jpg",
  "assets/tools/color-puzzle-generator/gallery-1.jpg",
  "assets/tools/color-puzzle-generator/gallery-2.jpg",
  "assets/tools/color-puzzle-generator/gallery-3.jpg",
  "assets/tools/color-puzzle-generator/PXL_20260902_195515162-poster.jpg",
  "assets/tools/color-puzzle-generator/PXL_20260903_183203418-poster.jpg",
];

const heroFloaterSlots = [
  { x: "10%", y: "16%", rot: "-8deg", delay: "0s" },
  { x: "90%", y: "14%", rot: "6deg", delay: "1.4s" },
  { x: "9%", y: "56%", rot: "5deg", delay: "2.6s" },
  { x: "91%", y: "54%", rot: "-6deg", delay: "0.7s" },
  { x: "18%", y: "84%", rot: "-4deg", delay: "1.9s" },
  { x: "82%", y: "82%", rot: "6deg", delay: "1.1s" },
];

const heroFloaters = document.querySelector(".hero-floaters");
if (heroFloaters) {
  const picks = [...heroFloaterPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, heroFloaterSlots.length);

  heroFloaters.replaceChildren(
    ...picks.map((src, i) => {
      const slot = heroFloaterSlots[i];
      const img = document.createElement("img");
      img.className = "hero-floater";
      img.src = src;
      img.alt = "";
      img.style.setProperty("--x", slot.x);
      img.style.setProperty("--y", slot.y);
      img.style.setProperty("--rot", slot.rot);
      img.style.setProperty("--delay", slot.delay);
      return img;
    })
  );
}

// Media carousel (inside a tool modal): manual prev/next + a thumbnail
// strip, no auto-advance. Native scroll-snap does the sliding; JS drives
// the buttons/thumbnails and keeps them in sync with whichever slide is
// in view, so every thumbnail is visible at once and clicking one jumps
// the main view to that slide (image or video) at full size.
let activeCarouselObserver = null;

function initCarousel(carousel) {
  activeCarouselObserver?.disconnect();
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const thumbsContainer = carousel.querySelector(".carousel-thumbs");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  if (!track || slides.length === 0) return;

  // Navigating (button or thumbnail) should stop whatever's currently
  // playing immediately, rather than waiting on the scroll-driven
  // IntersectionObserver below to notice the old slide left view.
  const pauseAllVideos = () => {
    slides.forEach((slide) => slide.querySelector("video")?.pause());
  };

  // These videos must never produce sound — but native <video controls>
  // is all-or-nothing (no attribute hides just the volume button while
  // keeping play/seek/fullscreen). So keep the full native control bar,
  // and instead snap volume/mute back the instant anything changes them
  // (the unmute button, a dragged volume slider), making that control
  // present but functionally inert rather than removing it outright.
  slides.forEach((slide) => {
    const video = slide.querySelector("video");
    if (!video) return;
    video.muted = true;
    video.volume = 0;
    video.addEventListener("volumechange", () => {
      if (!video.muted || video.volume !== 0) {
        video.muted = true;
        video.volume = 0;
      }
    });
  });

  thumbsContainer?.replaceChildren(
    ...slides.map((slide, i) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "carousel-thumb";
      thumb.setAttribute("aria-label", `Go to slide ${i + 1}`);

      const img = slide.querySelector("img");
      const video = slide.querySelector("video");
      if (img) {
        const thumbImg = document.createElement("img");
        thumbImg.src = img.src;
        thumbImg.alt = "";
        thumb.appendChild(thumbImg);
      } else if (video?.poster) {
        const thumbImg = document.createElement("img");
        thumbImg.src = video.poster;
        thumbImg.alt = "";
        thumb.appendChild(thumbImg);
      } else if (video) {
        const icon = document.createElement("span");
        icon.className = "carousel-thumb-video-icon";
        icon.textContent = "▶";
        icon.setAttribute("aria-hidden", "true");
        thumb.appendChild(icon);
      }

      thumb.addEventListener("click", () => {
        pauseAllVideos();
        slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      return thumb;
    })
  );
  const thumbs = thumbsContainer ? Array.from(thumbsContainer.children) : [];

  const setActive = (index) => {
    thumbs.forEach((thumb, i) => thumb.classList.toggle("is-active", i === index));
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  };
  setActive(0);

  prevBtn?.addEventListener("click", () => {
    pauseAllVideos();
    track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
  });
  nextBtn?.addEventListener("click", () => {
    pauseAllVideos();
    track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
  });

  // Track which slide is in view (covers button nav and manual swipe/drag
  // alike), and pause any video as soon as its slide scrolls out of view.
  activeCarouselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          setActive(slides.indexOf(entry.target));
        }
        if (!entry.isIntersecting) {
          entry.target.querySelector("video")?.pause();
        }
      });
    },
    { root: track, threshold: [0, 0.6, 1] }
  );
  slides.forEach((slide) => activeCarouselObserver.observe(slide));
}

// Tool detail modals: clone per-tool <template> content into one shared
// <dialog> on open, so a 5th/6th tool only needs a new template + trigger.
const toolModal = document.getElementById("tool-modal");
const toolModalBody = toolModal?.querySelector(".tool-modal-body");
let toolModalTrigger = null;

document.querySelectorAll(".tool-card-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const template = document.getElementById(`tpl-${trigger.dataset.tool}`);
    if (!toolModal || !toolModalBody || !template) return;

    toolModalBody.replaceChildren(template.content.cloneNode(true));
    const heading = toolModalBody.querySelector("h2");
    if (heading) toolModal.setAttribute("aria-labelledby", heading.id);
    initCarousel(toolModalBody.querySelector(".carousel"));

    toolModalTrigger = trigger;
    document.body.classList.add("modal-open");
    toolModal.showModal();
  });
});

// Backdrop click closes the dialog (Escape and the in-form close button
// already work natively).
toolModal?.addEventListener("click", (event) => {
  if (event.target === toolModal) toolModal.close();
});

// On close: empty the body so any playing video stops, unlock scroll, and
// return focus to whatever card button opened the modal.
toolModal?.addEventListener("close", () => {
  activeCarouselObserver?.disconnect();
  toolModalBody?.replaceChildren();
  document.body.classList.remove("modal-open");
  toolModalTrigger?.focus();
});

// 3D Printopia signup popup: open the mailing-list form as soon as the page
// loads, so QR-code scanners at the booth don't have to scroll to find it.
// It's a copy of the #early-access form, so closing it leaves that one in
// place. Deliberately shown on every page load (no "already seen" memory)
// since it's only up for the show.
const signupModal = document.getElementById("signup-modal");

if (signupModal && isAfterPrintopia) {
  signupModal.remove();
} else if (signupModal) {
  signupModal.addEventListener("click", (event) => {
    if (event.target === signupModal) signupModal.close();
  });

  signupModal.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
  });

  document.body.classList.add("modal-open");
  signupModal.showModal();
  // showModal() focuses the first control (the X), which draws a focus
  // ring on page load — focus the dialog itself instead.
  signupModal.focus();
}

// Card-face media: play the looping preview on hover (desktop) or when
// scrolled into view (touch, as the nearest equivalent to hover), and fall
// back to a static placeholder image if a tool has no clip yet or the
// visitor prefers reduced motion.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelectorAll('.tool-card-media[data-role="video"]').forEach((video) => {
  const fallback = video.nextElementSibling;
  video.playbackRate = 2;

  if (prefersReducedMotion) {
    video.classList.add("is-hidden");
    fallback?.classList.add("is-visible");
    return;
  }

  video.addEventListener("error", () => {
    video.classList.add("is-hidden");
    fallback?.classList.add("is-visible");
  });

  const card = video.closest(".tool-card, .tool-featured");
  if (!card) return;

  // Show the video on hover/in-view, and revert to the static cover image
  // (rather than leaving the video paused mid-frame) once it ends.
  const showPreview = () => {
    fallback?.classList.remove("is-visible");
    video.classList.remove("is-hidden");
    video.play().catch(() => {});
  };

  const showCover = () => {
    video.pause();
    video.currentTime = 0;
    video.classList.add("is-hidden");
    fallback?.classList.add("is-visible");
  };

  if (supportsHover) {
    card.addEventListener("mouseenter", showPreview);
    card.addEventListener("mouseleave", showCover);
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showPreview();
          } else {
            showCover();
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(card);
  }
});
