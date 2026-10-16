/**
 * ====================================================================
 * HOME PAGE SCRIPT (home.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  initHeroSearch();
  renderPopularDestinations();
  renderFeaturedPackages();
  renderTravelExperiences();
  renderHowItWorks();
  renderInspirations();
  initNewsletter();
  initScrollFeatures();
  
  if (typeof updateFavoriteBadges === "function") {
    updateFavoriteBadges();
  }
});

// ==========================================
// 1. DYNAMIC NAVIGATION SETUP
// ==========================================
const navigationItems = [
  { id: 1, title: "Bosh sahifa", href: "../../index.html", active: true },
  { id: 2, title: "Sayohat yo‘nalishlari", href: "../02-destinations/destinations.html" },
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
      <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">
        ${item.title}
      </a>
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

// ==========================================
// 2. MOBILE MENU HANDLER
// ==========================================
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

  // Favorites button in header
  const favBtn = document.getElementById("open-favorites-btn");
  if (favBtn && typeof openFavoritesDrawer === "function") {
    favBtn.addEventListener("click", openFavoritesDrawer);
  }
}

// ==========================================
// 3. HERO SEARCH PANEL
// ==========================================
function initHeroSearch() {
  const form = document.getElementById("hero-search-form");
  if (!form) return;

  // Bugungi sanani check-in uchun minimum qilish
  const checkinInput = document.getElementById("search-checkin");
  const checkoutInput = document.getElementById("search-checkout");

  const today = new Date().toISOString().split("T")[0];
  if (checkinInput) {
    checkinInput.min = today;
    checkinInput.value = today;
  }
  if (checkoutInput) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    checkoutInput.min = today;
    checkoutInput.value = nextWeek.toISOString().split("T")[0];
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const destination = document.getElementById("search-destination").value.trim();
    const travelers = document.getElementById("search-travelers").value;

    if (destination) {
      // Yo'nalishlar sahifasiga parametr bilan yo'naltirish
      window.location.href = `../02-destinations/destinations.html?q=${encodeURIComponent(destination)}&travelers=${travelers}`;
    } else {
      window.location.href = `../02-destinations/destinations.html?travelers=${travelers}`;
    }
  });
}

// ==========================================
// 4. POPULAR DESTINATIONS RENDER (8 CARDS)
// ==========================================
function renderPopularDestinations() {
  const container = document.getElementById("popular-destinations-container");
  if (!container || !window.TRAVEL_DATA) return;

  // Eng mashhur 8 ta manzil (Paris, Dubai, Istanbul, Tokyo, Bali, Rome, London, Maldives)
  const list = window.TRAVEL_DATA.destinations.slice(0, 8);

  container.innerHTML = list.map(d => {
    const favActive = typeof isFavorite === "function" && isFavorite(d.id, "destination");
    return `
      <article class="destination-card" data-id="${d.id}">
        <div class="card-image-wrap">
          <img src="${d.image}" alt="${d.city}, ${d.country}" loading="lazy">
          <span class="card-badge">${d.badge || d.continent}</span>
          <button 
            type="button" 
            class="favorite-btn ${favActive ? 'active' : ''}" 
            data-id="${d.id}" 
            data-type="destination"
            aria-label="${favActive ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${favActive ? '#EF4444' : 'none'}" stroke="${favActive ? '#EF4444' : 'currentColor'}" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-header-meta">
            <span class="card-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${d.country}
            </span>
            <div class="card-rating">
              <span class="star">★</span>
              <span>${d.rating}</span>
            </div>
          </div>

          <h3 class="card-title">${d.city}</h3>
          <p class="card-desc">${d.description}</p>

          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-label">Boshlang'ich narx</span>
              <span class="price-amount">$${d.price}</span>
            </div>
            <a href="../03-destination-detail/destination-detail.html?id=${d.id}" class="btn btn-primary btn-sm">
              <span>Batafsil</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Sevimlilar hodisasi (Event Delegation)
  container.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".favorite-btn");
    if (!favBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const id = favBtn.getAttribute("data-id");
    const item = window.TRAVEL_DATA.destinations.find(x => x.id == id);
    if (!item) return;

    const added = toggleFavorite({
      id: item.id,
      type: "destination",
      title: `${item.city}, ${item.country}`,
      subtitle: item.description,
      image: item.image,
      price: item.price,
      rating: item.rating
    });

    if (added) {
      showToast(`${item.city} sevimlilar ro'yxatiga qo'shildi!`, "success");
    } else {
      showToast(`${item.city} sevimlilardan o'chirildi`, "info");
    }
  });
}

// ==========================================
// 5. FEATURED TOUR PACKAGES
// ==========================================
function renderFeaturedPackages() {
  const container = document.getElementById("featured-packages-container");
  if (!container || !window.TRAVEL_DATA) return;

  const packages = window.TRAVEL_DATA.tourPackages.slice(0, 6);

  container.innerHTML = packages.map(pkg => {
    const favActive = typeof isFavorite === "function" && isFavorite(pkg.id, "package");
    return `
      <article class="package-card" data-id="${pkg.id}">
        <div class="card-image-wrap">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
          <span class="card-badge">${pkg.badge || 'VIP'}</span>
          <span class="discount-badge">${pkg.discount}</span>
          <span class="package-duration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${pkg.duration}
          </span>
          <button 
            type="button" 
            class="favorite-btn ${favActive ? 'active' : ''}" 
            data-id="${pkg.id}" 
            data-type="package"
            aria-label="${favActive ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${favActive ? '#EF4444' : 'none'}" stroke="${favActive ? '#EF4444' : 'currentColor'}" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-header-meta">
            <span class="card-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${pkg.destination}
            </span>
            <div class="card-rating">
              <span class="star">★</span>
              <span>${pkg.rating} (${pkg.reviewsCount})</span>
            </div>
          </div>

          <h3 class="card-title">${pkg.title}</h3>
          
          <div class="package-includes-tags">
            ${pkg.includes.slice(0, 3).map(inc => `<span class="include-tag">✓ ${inc}</span>`).join("")}
          </div>

          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-strike">$${pkg.oldPrice}</span>
              <span class="price-amount">$${pkg.price}</span>
            </div>
            <a href="../04-tour-packages/tour-packages.html?packageId=${pkg.id}" class="btn btn-primary btn-sm">
              <span>Paketni Tanlash</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Sevimlilar hodisasi (Packages)
  container.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".favorite-btn");
    if (!favBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const id = favBtn.getAttribute("data-id");
    const item = window.TRAVEL_DATA.tourPackages.find(x => x.id == id);
    if (!item) return;

    const added = toggleFavorite({
      id: item.id,
      type: "package",
      title: item.title,
      subtitle: `${item.destination} • ${item.duration}`,
      image: item.image,
      price: item.price,
      rating: item.rating
    });

    if (added) {
      showToast(`${item.title} sevimli turlar ro'yxatiga qo'shildi!`, "success");
    } else {
      showToast(`${item.title} sevimlilardan olib tashlandi`, "info");
    }
  });
}

// ==========================================
// 6. TRAVEL EXPERIENCE (4 FEATURES)
// ==========================================
function renderTravelExperiences() {
  const container = document.getElementById("experience-grid-container");
  if (!container || !window.TRAVEL_DATA) return;

  container.innerHTML = window.TRAVEL_DATA.travelExperiences.map(exp => `
    <div class="experience-card">
      <div class="experience-icon-wrap">
        ${exp.icon}
      </div>
      <h3 class="experience-title">${exp.title}</h3>
      <p class="experience-desc">${exp.desc}</p>
    </div>
  `).join("");
}

// ==========================================
// 7. HOW IT WORKS (4 STEPS)
// ==========================================
function renderHowItWorks() {
  const container = document.getElementById("steps-container");
  if (!container || !window.TRAVEL_DATA) return;

  container.innerHTML = window.TRAVEL_DATA.howItWorks.map(step => `
    <div class="step-card">
      <div class="step-badge">${step.step}</div>
      <h3 class="step-title">${step.title}</h3>
      <p class="step-desc">${step.desc}</p>
    </div>
  `).join("");
}

// ==========================================
// 8. TRAVEL INSPIRATIONS (BLOG)
// ==========================================
function renderInspirations() {
  const container = document.getElementById("inspiration-container");
  if (!container || !window.TRAVEL_DATA) return;

  container.innerHTML = window.TRAVEL_DATA.travelInspirations.map(article => `
    <article class="blog-card">
      <div class="blog-thumb-wrap">
        <img src="${article.image}" alt="${article.title}" loading="lazy">
        <span class="blog-category-tag">${article.category}</span>
      </div>
      <div class="blog-body">
        <div class="blog-meta">
          <span>📅 ${article.date}</span>
          <span>⏱ ${article.readTime}</span>
        </div>
        <h3 class="blog-title">${article.title}</h3>
        <p class="blog-desc">${article.description}</p>
        <a href="../06-trip-planner/trip-planner.html" class="blog-read-more">
          <span>To'liq O'qish</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>
    </article>
  `).join("");
}

// ==========================================
// 9. NEWSLETTER SUBSCRIPTION
// ==========================================
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Iltimos, haqiqiy elektron pochta manzilini kiriting!", "error");
      return;
    }

    showToast("Rahmat! Siz sayohat ilhomlari va maxsus takliflarimizga muvaffaqiyatli obuna bo'ldingiz.", "success", 4500);
    emailInput.value = "";
  });
}

// ==========================================
// 10. SCROLL FEATURES (HEADER & BACK TO TOP)
// ==========================================
function initScrollFeatures() {
  const header = document.getElementById("header");
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;

    // Header shadow and compact size
    if (header) {
      if (scrollPos > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
}
