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
        const hero = document.querySelector("#hero") || document.querySelector("#post");

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
