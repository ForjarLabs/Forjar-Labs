// ============== NAV ==============
function toggleNav() {
  const nav = document.getElementById("nav");
  const hamburger = document.querySelector(".hamburger");
  if (!nav || !hamburger) return;

  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  nav.classList.toggle("open");
  hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", (!expanded).toString());

  // Lock scroll on mobile when open
  document.documentElement.style.overflow = nav.classList.contains("open")
    ? "hidden"
    : "";
}

// Esc closes mobile nav
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const nav = document.getElementById("nav");
    const hamburger = document.querySelector(".hamburger");
    if (nav && hamburger && nav.classList.contains("open")) {
      nav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
    }
  }
});

// Close mobile nav on internal link click
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href") || "";
  if (!href.startsWith("#")) return; // internal only

  const nav = document.getElementById("nav");
  const hamburger = document.querySelector(".hamburger");
  if (nav && hamburger && nav.classList.contains("open")) {
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  }
});

// ============== SMOOTH SCROLL (internal anchors) ==============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    const target = id && document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update hash without jumping
      history.pushState(null, "", id);
    }
  });
});

// ============== SCROLL EFFECTS (rAF-throttled) ==============
(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const header = document.getElementById("header");
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;

      // Header state
      if (header) {
        if (y > 100) {
          header.style.background = "rgba(255, 255, 255, 0.92)";
          header.style.boxShadow = "0 6px 18px rgba(2,8,23,.06)";
        } else {
          header.style.background = "rgba(255, 255, 255, 0.92)";
          header.style.boxShadow = "none";
        }
      }

      // Parallax (skip if reduced motion)
      if (!prefersReduced) {
        document.documentElement.style.setProperty(
          "--parallax-a",
          `${y * 0.2}px`
        );
        document.documentElement.style.setProperty(
          "--parallax-b",
          `${y * 0.1}px`
        );
      }

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ============== SCROLL REVEAL (IntersectionObserver) ==============
(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  items.forEach((el) => obs.observe(el));
})();

// ============== FAQ (Details as accordion with auto-close) ==============
(() => {
  const details = Array.from(document.querySelectorAll(".faq-item"));
  if (!details.length) return;

  // Normalize initial state
  details.forEach((d) => {
    d.classList.toggle("active", d.open === true);
    const t = d.querySelector(".faq-toggle");
    if (t) t.textContent = d.open ? "−" : "+";
  });

  document.querySelector(".faq-grid")?.addEventListener(
    "toggle",
    (e) => {
      const el = e.target;
      if (!el.classList || !el.classList.contains("faq-item")) return;

      if (el.open) {
        // Close others
        details.forEach((d) => {
          if (d !== el) {
            d.open = false;
            d.classList.remove("active");
            const t = d.querySelector(".faq-toggle");
            if (t) t.textContent = "+";
          }
        });
        el.classList.add("active");
        const t = el.querySelector(".faq-toggle");
        if (t) t.textContent = "−";
      } else {
        el.classList.remove("active");
        const t = el.querySelector(".faq-toggle");
        if (t) t.textContent = "+";
      }
    },
    true
  );
})();

// ============== SCROLL TO TOP BUTTON API ==============
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============== MOBILE FIXED CTA VISIBILITY ==============
function checkMobileButton() {
  const mobileBtn = document.querySelector(".mobile-whatsapp-fixed");
  if (!mobileBtn) return;
  mobileBtn.style.display = window.innerWidth > 768 ? "none" : "inline-flex";
}
window.addEventListener("resize", checkMobileButton);
document.addEventListener("DOMContentLoaded", checkMobileButton);

// Weekly countdown → Friday 23:59:59 WAT (auto-restart every week)
(() => {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minsEl = document.getElementById("minutes");
  const secsEl = document.getElementById("seconds");
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const MS = 1000;
  const SEC = MS;
  const MIN = 60 * SEC;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const WAT_OFFSET_MS = 1 * HOUR; // Africa/Lagos = UTC+1 year-round (no DST)
  const FRIDAY = 5; // 0=Sun ... 5=Fri

  function nextFriday2359UTCms(nowUTC) {
    // Represent "local WAT clock" by shifting UTC +1h and using UTC getters.
    const nowWAT = new Date(nowUTC.getTime() + WAT_OFFSET_MS);

    const y = nowWAT.getUTCFullYear();
    const m = nowWAT.getUTCMonth();
    const d = nowWAT.getUTCDate();
    const dow = nowWAT.getUTCDay();

    // Days to this week's Friday (or 0 if already Friday)
    const addDays = (FRIDAY - dow + 7) % 7;

    // 23:59:59 WAT == 22:59:59 UTC
    let targetUTC = Date.UTC(y, m, d + addDays, 22, 59, 59, 0);

    // If we've already passed this week's Friday 23:59:59 WAT, push to next Friday
    if (nowUTC.getTime() >= targetUTC) targetUTC += 7 * DAY;

    return targetUTC;
  }

  function update() {
    const now = new Date();
    const target = nextFriday2359UTCms(now);
    let diff = target - now.getTime();
    if (diff < 0) diff = 0; // safety

    const days = Math.floor(diff / DAY);
    const hours = Math.floor((diff % DAY) / HOUR);
    const minutes = Math.floor((diff % HOUR) / MIN);
    const seconds = Math.floor((diff % MIN) / SEC);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  const id = setInterval(update, 1000);

  // Stop ticking if elements disappear
  const mo = new MutationObserver(() => {
    if (!document.body.contains(daysEl)) {
      clearInterval(id);
      mo.disconnect();
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

// ============== FOOTER YEAR ==============
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".copyright");
  if (el)
    el.textContent = `©️ ${new Date().getFullYear()} Forjar Labs. All rights reserved.`;
});
