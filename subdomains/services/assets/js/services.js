// ------- Testimonial Carousel -------
const carouselContainer = document.querySelector(".carousel-container");
const items = document.querySelectorAll(".carousel-item");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const carouselItem = document.querySelector(".carousel-item");
const itemWidth = carouselItem.offsetWidth;

let index = 0;

function updateCarousel() {
  carouselContainer.style.transform = `translateX(-${index * itemWidth}px)`;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % items.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + items.length) % items.length;
  updateCarousel();
});

// Auto-slide every 6s
setInterval(() => {
  index = (index + 1) % items.length;
  updateCarousel();
}, 6000000);

// ------- FAQ Accordion -------
const faqItems = document.querySelectorAll(".FAQ-item");

faqItems.forEach((item) => {
  const showBtn = item.querySelector(".show-extra-info");
  const hideBtn = item.querySelector(".hide-extra-info");

  showBtn.addEventListener("click", () => {
    item.classList.add("active");
  });

  hideBtn.addEventListener("click", () => {
    item.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("auditForm").addEventListener("submit", function(e) {
    e.preventDefault(); // prevent normal form submission

    // Get form values
    let name = document.getElementById("first-name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    // Format WhatsApp message
    let whatsappMessage = `*New Audit Booking*%0A%0A👤 Name: ${name}%0A📧 Email: ${email}%0A💬 Message: ${message}`;

    // Replace with your WhatsApp number (with country code, no + sign or spaces)
    let phoneNumber = "+2348153048175";

    // Open WhatsApp chat
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    window.open(whatsappURL, "_blank");
  });

  const siteHeader = document.querySelector("#header");
  const hero = document.querySelector("#hero");

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
    hamburger.classList.toggle("open");
  });

  if (hero && siteHeader) {
    const heroHeight = siteHeader.offsetHeight;
    hero.style.marginTop = `${heroHeight}px`;
  }

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
});

const track = document.getElementById("scrollTrack");
let position = 0;
const speed = 1; // pixels per frame

// Clone content so it loops seamlessly
track.innerHTML += track.innerHTML;

// Optional: Pause on hover
const container = document.querySelector(".scroll-container");
let paused = false;

container.addEventListener("mouseenter", () => (paused = true));
container.addEventListener("mouseleave", () => (paused = false));

function scrollTextWithPause() {
  if (!paused) {
    position -= speed;
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0;
    }
    track.style.transform = `translateX(${position}px)`;
  }
  requestAnimationFrame(scrollTextWithPause);
}

// Use this instead if you want pause-on-hover
scrollTextWithPause();
