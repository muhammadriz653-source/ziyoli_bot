/**
 * ====================================================================
 * ABOUT US PAGE SCRIPT (about.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  renderTeam();
  renderTestimonials();
  renderFAQ();
  initContactForm();
  initBackToTop();

  if (typeof updateFavoriteBadges === "function") {
    updateFavoriteBadges();
  }
});

// ==========================================
// 1. NAVIGATION
// ==========================================
const navigationItems = [
  { id: 1, title: "Bosh sahifa", href: "../../index.html" },
  { id: 2, title: "Sayohat yo‘nalishlari", href: "../02-destinations/destinations.html" },
  { id: 3, title: "Tur paketlari", href: "../04-tour-packages/tour-packages.html" },
  { id: 4, title: "Mehmonxonalar", href: "../05-hotels/hotels.html" },
  { id: 5, title: "Sayohat rejalashtirish", href: "../06-trip-planner/trip-planner.html" },
  { id: 6, title: "Biz haqimizda", href: "about.html", active: true }
];

function initNavigation() {
  const desktopNav = document.getElementById("desktop-nav");
  const mobileNav = document.getElementById("mobile-nav");

  if (desktopNav) {
    desktopNav.innerHTML = navigationItems.map(item => `
      <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">${item.title}</a>
    `).join("");
  }

  if (mobileNav) {
    mobileNav.innerHTML = navigationItems.map(item => `
      <a href="${item.href}" class="mobile-nav-link ${item.active ? 'active' : ''}">
        <span>${item.title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    `).join("");
  }
}

function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-toggle-btn");
  const closeBtn = document.getElementById("close-mobile-menu");
  const overlay = document.getElementById("mobile-overlay");
  const drawer = document.getElementById("mobile-drawer");

  const openDrawer = () => {
    overlay.classList.add("open");
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    overlay.classList.remove("open");
    drawer.classList.remove("open");
    document.body.style.overflow = "";
  };

  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  const favBtn = document.getElementById("open-favorites-btn");
  if (favBtn && typeof openFavoritesDrawer === "function") {
    favBtn.addEventListener("click", openFavoritesDrawer);
  }
}

// ==========================================
// 2. RENDER TEAM MEMBERS
// ==========================================
function renderTeam() {
  const container = document.getElementById("team-grid-container");
  if (!container || !window.TRAVEL_DATA) return;

  container.innerHTML = window.TRAVEL_DATA.teamMembers.map(member => `
    <div class="team-card">
      <div class="team-thumb-wrap">
        <img src="${member.image}" alt="${member.name}" class="team-thumb" loading="lazy">
      </div>
      <div class="team-info">
        <h3 class="team-name">${member.name}</h3>
        <p class="team-role">${member.role}</p>
        <p class="team-bio">${member.bio}</p>
      </div>
    </div>
  `).join("");
}

// ==========================================
// 3. RENDER TESTIMONIALS
// ==========================================
function renderTestimonials() {
  const container = document.getElementById("testimonials-grid-container");
  if (!container || !window.TRAVEL_DATA) return;

  container.innerHTML = window.TRAVEL_DATA.testimonials.map(item => `
    <div class="testimonial-card">
      <div class="testimonial-rating">
        ${"★".repeat(item.rating)}
      </div>
      <p class="testimonial-text">"${item.comment}"</p>
      <div class="testimonial-user">
        <img src="${item.avatar}" alt="${item.name}" class="user-avatar" loading="lazy">
        <div class="user-info">
          <h4>${item.name}</h4>
          <span class="user-trip">${item.trip} &bull; ${item.city}</span>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================
// 4. RENDER & INTERACTIVE FAQ ACCORDION
// ==========================================
function renderFAQ() {
  const container = document.getElementById("faq-accordion-container");
  if (!container || !window.TRAVEL_DATA) return;

  container.innerHTML = window.TRAVEL_DATA.faqs.map((faq, idx) => `
    <div class="faq-item ${idx === 0 ? 'active' : ''}">
      <button type="button" class="faq-question-btn" aria-expanded="${idx === 0}">
        <span>${faq.q}</span>
        <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-answer" style="${idx === 0 ? 'max-height: 200px;' : ''}">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join("");

  // Accordion Toggle Logic
  container.querySelectorAll(".faq-question-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".faq-item");
      const answer = parent.querySelector(".faq-answer");
      const isActive = parent.classList.contains("active");

      // Close all other items
      container.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
        item.querySelector(".faq-question-btn").setAttribute("aria-expanded", "false");
        item.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isActive) {
        parent.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// ==========================================
// 5. CONTACT FORM HANDLER
// ==========================================
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Iltimos, to'g'ri elektron pochta manzilini kiriting!", "error");
      return;
    }

    if (!name || !message) {
      showToast("Iltimos, ism va xabaringizni yozing!", "error");
      return;
    }

    showToast(`Rahmat, ${name}! Xabaringiz muvaffaqiyatli yuborildi. Mutaxassislarimiz tez orada siz bilan bog'lanishadi.`, "success", 5000);
    form.reset();
  });
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
