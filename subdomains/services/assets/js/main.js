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
        const hero = document.querySelector("#hero");

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
