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
