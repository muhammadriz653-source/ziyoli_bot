/**
 * ====================================================================
 * DESTINATION DETAIL PAGE SCRIPT (destination-detail.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  loadDestinationData();
  initBookingModal();
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
  { id: 2, title: "Sayohat yo‘nalishlari", href: "../02-destinations/destinations.html", active: true },
  { id: 3, title: "Tur paketlari", href: "../04-tour-packages/tour-packages.html" },
  { id: 4, title: "Mehmonxonalar", href: "../05-hotels/hotels.html" },
  { id: 5, title: "Sayohat rejalashtirish", href: "../06-trip-planner/trip-planner.html" },
  { id: 6, title: "Biz haqimizda", href: "../07-about/about.html" }
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
// 2. LOAD DESTINATION DATA
// ==========================================
let currentDestination = null;

function loadDestinationData() {
  if (!window.TRAVEL_DATA) return;

  // URL query parametridan ID olish
  const urlParams = new URLSearchParams(window.location.search);
  let id = parseInt(urlParams.get("id"), 10);

  // Agar ID berilmagan bo'lsa, default 1 (Paris)
  if (!id || isNaN(id)) {
    id = 1;
  }

  currentDestination = window.TRAVEL_DATA.destinations.find(d => d.id === id) || window.TRAVEL_DATA.destinations[0];
  const d = currentDestination;

  // 1. Page Title & Meta
  document.title = `${d.city}, ${d.country} - Sayohat Qo'llanmasi | TravelUX`;

  // 2. Breadcrumbs
  const crumbCity = document.getElementById("breadcrumb-city");
  if (crumbCity) crumbCity.textContent = `${d.city}, ${d.country}`;

  // 3. Hero Showcase Card
  const heroCard = document.getElementById("detail-hero-card");
  if (heroCard) {
    heroCard.style.backgroundImage = `url('${d.image}')`;
    heroCard.innerHTML = `
      <div class="detail-hero-inner">
        <div class="hero-meta-badges">
          <span class="hero-continent-badge">${d.continent} &bull; ${d.badge || 'Mashhur'}</span>
          <div class="hero-rating-badge">
            <span class="star">★</span>
            <span>${d.rating} (${d.reviewsCount || 1200}+ sharhlar)</span>
          </div>
        </div>
        <h1 class="detail-city-title">${d.city}</h1>
        <div class="detail-country-sub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${d.country}</span>
        </div>
        <p class="detail-short-desc">${d.description}</p>
      </div>
    `;
  }

  // 4. Quick Facts Bar
  const factsGrid = document.getElementById("facts-grid");
  if (factsGrid) {
    factsGrid.innerHTML = `
      <div class="fact-card">
        <div class="fact-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </div>
        <span class="fact-label">Eng Yaxshi Vaqt</span>
        <span class="fact-val">${d.bestTimeToVisit || 'May - Oktyabr'}</span>
      </div>

      <div class="fact-card">
        <div class="fact-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <span class="fact-label">O'rtacha Byudjet</span>
        <span class="fact-val">${d.avgBudget || '$150 / kun'}</span>
      </div>

      <div class="fact-card">
        <div class="fact-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <span class="fact-label">Asosiy Til</span>
        <span class="fact-val">${d.language || 'Mahalliy, Ingliz'}</span>
      </div>

      <div class="fact-card">
        <div class="fact-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
        </div>
        <span class="fact-label">Valyuta</span>
        <span class="fact-val">${d.currency || 'USD / Mahalliy'}</span>
      </div>

      <div class="fact-card">
        <div class="fact-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
        </div>
        <span class="fact-label">Viza Rejimi</span>
        <span class="fact-val">${d.visaRequired || 'Viza kerak'}</span>
      </div>
    `;
  }

  // 5. Overview Paragraph
  const overviewEl = document.getElementById("detail-overview-text");
  if (overviewEl) {
    overviewEl.textContent = d.overview || d.description;
  }

  // 6. Popular Places & Sights
  const sightsContainer = document.getElementById("popular-sights-container");
  if (sightsContainer && d.popularPlaces) {
    sightsContainer.innerHTML = d.popularPlaces.map(place => `
      <div class="sight-card">
        <img src="${place.image}" alt="${place.name}" class="sight-thumb" loading="lazy">
        <div class="sight-info">
          <h4 class="sight-title">${place.name}</h4>
          <p class="sight-desc">${place.desc}</p>
        </div>
      </div>
    `).join("");
  }

  // 7. Activities & Excursions
  const activitiesContainer = document.getElementById("activities-container");
  if (activitiesContainer && d.activities) {
    activitiesContainer.innerHTML = d.activities.map(act => `
      <div class="activity-item">
        <div class="activity-info">
          <h4>${act.title}</h4>
          <span class="activity-duration">⏱ Davomiyligi: ${act.duration}</span>
        </div>
        <div class="activity-price-box">
          <span class="activity-price">$${act.price}</span>
          <button class="btn btn-primary btn-sm book-activity-trigger" data-title="${act.title}">
            Tanlash
          </button>
        </div>
      </div>
    `).join("");

    activitiesContainer.querySelectorAll(".book-activity-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const actTitle = btn.getAttribute("data-title");
        const noteInput = document.getElementById("booking-note");
        if (noteInput) {
          noteInput.value = `Tanlangan mashg'ulot: ${actTitle}`;
        }
        openBookingModal();
      });
    });
  }

  // 8. Travel Tips
  const tipsContainer = document.getElementById("tips-container");
  if (tipsContainer && d.travelTips) {
    tipsContainer.innerHTML = d.travelTips.map(tip => `
      <div class="tip-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${tip}</span>
      </div>
    `).join("");
  }

  // 9. Recommended Hotels
  const hotelsContainer = document.getElementById("recommended-hotels-container");
  if (hotelsContainer) {
    const relatedHotels = window.TRAVEL_DATA.hotels.filter(h => h.destinationId === d.id || h.city.toLowerCase() === d.city.toLowerCase());
    const displayHotels = relatedHotels.length > 0 ? relatedHotels : window.TRAVEL_DATA.hotels.slice(0, 2);

    hotelsContainer.innerHTML = displayHotels.map(h => `
      <div class="hotel-card">
        <div class="card-image-wrap">
          <img src="${h.image}" alt="${h.name}" loading="lazy">
          <span class="card-badge">${h.badge || 'Tavsiya'}</span>
        </div>
        <div class="card-body">
          <div class="card-header-meta">
            <span class="card-location">★ 5 Yulduzli Mehmonxona</span>
            <div class="card-rating">
              <span class="star">★</span>
              <span>${h.reviewScore} (${h.reviewText})</span>
            </div>
          </div>
          <h4 class="card-title">${h.name}</h4>
          <p class="card-desc">${h.address}</p>
          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-label">1 kecha uchun</span>
              <span class="price-amount">$${h.pricePerNight}</span>
            </div>
            <a href="../05-hotels/hotels.html?hotelId=${h.id}" class="btn btn-outline btn-sm">
              Ko'rish
            </a>
          </div>
        </div>
      </div>
    `).join("");
  }

  // 10. Recommended Tour Packages
  const toursContainer = document.getElementById("recommended-tours-container");
  if (toursContainer) {
    const relatedTours = window.TRAVEL_DATA.tourPackages.filter(p => p.destinationId === d.id || p.destination.toLowerCase().includes(d.city.toLowerCase()));
    const displayTours = relatedTours.length > 0 ? relatedTours : window.TRAVEL_DATA.tourPackages.slice(0, 2);

    toursContainer.innerHTML = displayTours.map(pkg => `
      <div class="package-card">
        <div class="card-image-wrap">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
          <span class="discount-badge">${pkg.discount}</span>
          <span class="package-duration">⏱ ${pkg.duration}</span>
        </div>
        <div class="card-body">
          <h4 class="card-title">${pkg.title}</h4>
          <div class="package-includes-tags">
            ${pkg.includes.slice(0, 2).map(inc => `<span class="include-tag">✓ ${inc}</span>`).join("")}
          </div>
          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-strike">$${pkg.oldPrice}</span>
              <span class="price-amount">$${pkg.price}</span>
            </div>
            <a href="../04-tour-packages/tour-packages.html?packageId=${pkg.id}" class="btn btn-primary btn-sm">
              Tanlash
            </a>
          </div>
        </div>
      </div>
    `).join("");
  }

  // 11. Sidebar Price Value
  const sidebarPriceVal = document.getElementById("sidebar-price-val");
  if (sidebarPriceVal) {
    sidebarPriceVal.textContent = `$${d.price}`;
  }

  // Modal input prefill
  const modalDestName = document.getElementById("modal-dest-name");
  if (modalDestName) {
    modalDestName.value = `${d.city}, ${d.country} (Boshlang'ich: $${d.price})`;
  }
}

// ==========================================
// 3. BOOKING MODAL HANDLER
// ==========================================
function initBookingModal() {
  const modal = document.getElementById("booking-modal");
  const openBtn = document.getElementById("open-booking-modal-btn");
  const headerCta = document.getElementById("book-destination-cta-header");
  const closeBtn = document.getElementById("close-booking-modal");
  const form = document.getElementById("destination-booking-form");

  window.openBookingModal = () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Set today as minimum booking date
    const dateInput = document.getElementById("booking-date");
    if (dateInput) {
      dateInput.min = new Date().toISOString().split("T")[0];
    }
  };

  const closeModalWindow = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openBookingModal);
  if (headerCta) headerCta.addEventListener("click", openBookingModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModalWindow);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModalWindow();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("booking-name").value.trim();
      const phone = document.getElementById("booking-phone").value.trim();
      const date = document.getElementById("booking-date").value;
      const guests = document.getElementById("booking-guests").value;

      if (!name || !phone || !date) {
        showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
        return;
      }

      closeModalWindow();
      showToast(
        `Rahmat, ${name}! ${currentDestination ? currentDestination.city : "Sayohat"} uchun buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz!`,
        "success",
        5000
      );

      form.reset();
      // Restore prefill
      if (currentDestination) {
        document.getElementById("modal-dest-name").value = `${currentDestination.city}, ${currentDestination.country}`;
      }
    });
  }
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
