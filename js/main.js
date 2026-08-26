document.getElementById("year").textContent = new Date().getFullYear();

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
  toolModalBody?.replaceChildren();
  document.body.classList.remove("modal-open");
  toolModalTrigger?.focus();
});

// Card-face media: play the looping preview on hover (desktop) or when
// scrolled into view (touch, as the nearest equivalent to hover), and fall
// back to a static placeholder image if a tool has no clip yet or the
// visitor prefers reduced motion.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelectorAll('.tool-card-media[data-role="video"]').forEach((video) => {
  const fallback = video.nextElementSibling;

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

  if (supportsHover) {
    card.addEventListener("mouseenter", () => video.play().catch(() => {}));
    card.addEventListener("mouseleave", () => video.pause());
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(card);
  }
});
