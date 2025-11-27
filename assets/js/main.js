document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");

  // Load header component first
  if (headerPlaceholder) {
    fetch("../../components/Header.html")
      .then((res) => res.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;

        const hamburger = document.querySelector(".hamburger");
        const nav = document.querySelector(".nav");

        hamburger.addEventListener("click", () => {
          nav.classList.toggle("open");
          hamburger.classList.toggle("open");
        });

        const siteHeader = document.querySelector("#header");
        const hero =
          document.querySelector("#hero") || document.querySelector("#post");

        if (hero && siteHeader) {
          const heroHeight = siteHeader.offsetHeight;
          hero.style.marginTop = `${heroHeight}px`;
        }

        const pathname = window.location.href;
        const pathLinks = document.querySelector("nav").querySelectorAll("a");

        pathLinks.forEach((element) => {
          const href = element.href;

          if (pathname.includes(href)) {
            element.classList.add("active");
          }
        });
      })
      .catch((error) => console.error("Error loading header:", error));
  }

  const form = document.getElementById("contact-form");
  const phoneNumber = "2348153048175"; // your WhatsApp number

  form?.addEventListener("submit", function (e) {
    e.preventDefault(); // stop normal form submit

    const name = document.getElementById("first-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // WhatsApp message format
    let whatsappMessage =
      `*New Audit Booking*\n\n` +
      `👤 Name: ${name}\n` +
      `📧 Email: ${email}\n` +
      `💬 Message: ${message}`;

    // Encode for URL
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappURL, "_blank");
  });

  // Load footer component
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    fetch("../../components/Footer.html")
      .then((res) => res.text())
      .then((html) => {
        footerPlaceholder.innerHTML = html;

        const scrollBtn = document.querySelector(".scroll-up");

        scrollBtn.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });

        const copryright = document.querySelector(".copyright");
        const year = new Date().getFullYear();
        copryright.innerHTML = `
              © ${year} Forjar Labs. All rights reserved
          `;
      })
      .catch((error) => console.error("Error loading footer:", error));
  }
});

// Mobile nav toggle
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".mobile-nav");
menuBtn?.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  if (nav.style.display === "flex") nav.style.display = "none";
  else nav.style.display = "flex";
  nav.style.flexDirection = "column";
  nav.style.position = "absolute";
  nav.style.left = "0";
  nav.style.top = "100%";
  nav.style.width = "100%";
  nav.style.background = "white";
  nav.style.padding = "12px";
  nav.style.borderRadius = "10px";
  nav.style.boxShadow = "0 8px 30px rgba(2,6,23,0.08)";
});

// FAQ accordion
document.querySelectorAll(".faq .question").forEach((q) => {
  q.addEventListener("click", () => {
    const next = q.nextElementSibling;
    const open = next.style.display === "block";
    document
      .querySelectorAll(".faq .answer")
      .forEach((a) => (a.style.display = "none"));
    if (!open) next.style.display = "block";
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const items = document.querySelectorAll(".faq-item");

items.forEach((item) => {
  item.addEventListener("click", () => {
    // Close others
    items.forEach((i) => {
      if (i !== item) {
        i.classList.remove("open");
        i.querySelector(".toggle").textContent = "+";
      }
    });

    // Toggle selected
    const isOpen = item.classList.contains("open");
    item.classList.toggle("open");
    item.querySelector(".toggle").textContent = isOpen ? "+" : "−";
  });
});

// Scroll reveal logic
const revealEls = document.querySelectorAll(".fade-in");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);
revealEls.forEach((el) => revealObserver.observe(el));

//  Testimonial slider logic

const cards = document.querySelectorAll(".testimonial-card");
let index = 1;

function showCard(i) {
  cards.forEach((card) => card.classList.remove("active"));
  cards[i].classList.add("active");
}

document.querySelector(".next").addEventListener("click", () => {
  index = (index + 1) % cards.length;
  showCard(index);
});

document.querySelector(".prev").addEventListener("click", () => {
  index = (index - 1 + cards.length) % cards.length;
  showCard(index);
});

// Start with the first card
showCard(index);

// Select all nav links (desktop + mobile)
const navLinks = document.querySelectorAll("nav a, .mobile-nav a");

// Add click listener to each
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all links
    navLinks.forEach((l) => l.classList.remove("active"));

    // Add active to clicked link
    link.classList.add("active");
  });
});

async function detectCountryAndSetPrices() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const userCountry = data.country_name;
    const prices = document.querySelectorAll(".price");

    prices.forEach((p) => {
      const ngn = p.dataset.priceNgn;
      const intl = p.dataset.priceInt;

      if (userCountry === "Nigeria") {
        p.textContent = ngn;
      } else {
        p.textContent = intl;
      }

      if (p.classList.contains("retainer")) {
        p.innerHTML += `<span style="font-size: 16px">/month</span>`;
      }
    });
  } catch (e) {
    console.error("Location detection failed", e);
  }
}

detectCountryAndSetPrices();
