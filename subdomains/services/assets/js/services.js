// Mobile nav
function toggleNav() {
  const nav = document.getElementById("nav");
  const hamburger = document.querySelector(".hamburger");
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  nav.classList.toggle("open");
  hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", (!expanded).toString());
}

// FAQ with auto-close
function toggleFaq(el) {
  const active = document.querySelector(".faq-item.active");
  if (active && active !== el) {
    active.classList.remove("active");
    active.querySelector(".faq-toggle").textContent = "+";
  }
  el.classList.toggle("active");
  const q = el.querySelector(".faq-toggle");
  if (q) q.textContent = el.classList.contains("active") ? "−" : "+";
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Close mobile nav on link click
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("nav");
    const hamburger = document.querySelector(".hamburger");
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// Header on scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.9)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.8)";
  }
});

// Mobile fixed CTA visibility
function checkMobileButton() {
  const mobileBtn = document.querySelector(".mobile-whatsapp-fixed");
  if (!mobileBtn) return;
  mobileBtn.style.display = window.innerWidth > 768 ? "none" : "inline-flex";
}
window.addEventListener("resize", checkMobileButton);
document.addEventListener("DOMContentLoaded", checkMobileButton);

// Parallax hero
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.documentElement.style.setProperty(
    "--parallax-a",
    `${scrollY * 0.2}px`
  );
  document.documentElement.style.setProperty(
    "--parallax-b",
    `${scrollY * 0.1}px`
  );
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);
reveals.forEach((reveal) => observer.observe(reveal));

// Live countdown timer (example to Oct 15, 2025)
function updateCountdown() {
  const endDate = new Date("2025-10-15T00:00:00");
  const now = new Date();
  const diff = endDate - now;
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  } else {
    document
      .querySelectorAll(".timer-number")
      .forEach((el) => (el.textContent = "00"));
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Update footer year
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".copyright");
  if (el) {
    el.textContent = `©️ ${new Date().getFullYear()} Forjar Labs. All rights reserved.`;
  }
});
