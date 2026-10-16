/**
 * ====================================================================
 * TOUR PACKAGES PAGE SCRIPT (tour-packages.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  initPackagesFiltering();
  initPackageModal();
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
  { id: 3, title: "Tur paketlari", href: "tour-packages.html", active: true },
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
// 2. FILTERING & SEARCH ENGINE
// ==========================================
let filterState = {
  search: "",
  destination: "all",
  duration: "all",
  price: "all",
  sort: "popular"
};

function initPackagesFiltering() {
  const searchInput = document.getElementById("pkg-search");
  const destSelect = document.getElementById("filter-destination");
  const durSelect = document.getElementById("filter-duration");
  const priceSelect = document.getElementById("filter-price");
  const sortSelect = document.getElementById("pkg-sort");
  const resetBtn = document.getElementById("pkg-reset-btn");

  // URL query tekshirish
  const urlParams = new URLSearchParams(window.location.search);
  const pkgIdParam = urlParams.get("packageId");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterState.search = e.target.value.trim().toLowerCase();
      applyPackagesFilter();
    });
  }

  if (destSelect) {
    destSelect.addEventListener("change", (e) => {
      filterState.destination = e.target.value;
      applyPackagesFilter();
    });
  }

  if (durSelect) {
    durSelect.addEventListener("change", (e) => {
      filterState.duration = e.target.value;
      applyPackagesFilter();
    });
  }

  if (priceSelect) {
    priceSelect.addEventListener("change", (e) => {
      filterState.price = e.target.value;
      applyPackagesFilter();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      filterState.sort = e.target.value;
      applyPackagesFilter();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filterState = { search: "", destination: "all", duration: "all", price: "all", sort: "popular" };
      if (searchInput) searchInput.value = "";
      if (destSelect) destSelect.value = "all";
      if (durSelect) durSelect.value = "all";
      if (priceSelect) priceSelect.value = "all";
      if (sortSelect) sortSelect.value = "popular";
      applyPackagesFilter();
    });
  }

  applyPackagesFilter();

  // Agar URL'da packageId bo'lsa, uni avtomatik ochish
  if (pkgIdParam && window.TRAVEL_DATA) {
    const targetPkg = window.TRAVEL_DATA.tourPackages.find(p => p.id == pkgIdParam);
    if (targetPkg) {
      setTimeout(() => openPackageBooking(targetPkg), 300);
    }
  }
}

function applyPackagesFilter() {
  if (!window.TRAVEL_DATA) return;

  let results = [...window.TRAVEL_DATA.tourPackages];

  // 1. Search text
  if (filterState.search) {
    const q = filterState.search;
    results = results.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.destination.toLowerCase().includes(q) ||
      p.includes.some(inc => inc.toLowerCase().includes(q))
    );
  }

  // 2. Destination
  if (filterState.destination !== "all") {
    results = results.filter(p => p.destination.toLowerCase().includes(filterState.destination.toLowerCase()));
  }

  // 3. Duration
  if (filterState.duration === "short") {
    results = results.filter(p => p.durationDays <= 5);
  } else if (filterState.duration === "medium") {
    results = results.filter(p => p.durationDays >= 6 && p.durationDays <= 7);
  } else if (filterState.duration === "long") {
    results = results.filter(p => p.durationDays >= 8);
  }

  // 4. Price
  if (filterState.price === "under-800") {
    results = results.filter(p => p.price <= 800);
  } else if (filterState.price === "800-1200") {
    results = results.filter(p => p.price > 800 && p.price <= 1200);
  } else if (filterState.price === "above-1200") {
    results = results.filter(p => p.price > 1200);
  }

  // 5. Sort
  if (filterState.sort === "price-asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (filterState.sort === "price-desc") {
    results.sort((a, b) => b.price - a.price);
  } else if (filterState.sort === "rating") {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    // popular
    results.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  renderPackages(results);
}

function renderPackages(list) {
  const grid = document.getElementById("packages-catalog-grid");
  const countEl = document.getElementById("packages-count");
  const emptyState = document.getElementById("packages-empty-state");

  if (!grid) return;

  if (countEl) {
    countEl.textContent = `${list.length} ta maxsus tur paketi topildi`;
  }

  if (list.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  grid.innerHTML = list.map(pkg => {
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
            <button type="button" class="btn btn-primary btn-sm book-pkg-btn" data-id="${pkg.id}">
              <span>Bron Qilish</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Event delegation
  grid.onclick = (e) => {
    // 1. Favorite tugmasi
    const favBtn = e.target.closest(".favorite-btn");
    if (favBtn) {
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
        showToast(`${item.title} sevimlilarga qo'shildi!`, "success");
      } else {
        showToast(`${item.title} sevimlilardan o'chirildi`, "info");
      }
      return;
    }

    // 2. Bron Qilish tugmasi
    const bookBtn = e.target.closest(".book-pkg-btn");
    if (bookBtn) {
      e.preventDefault();
      const id = bookBtn.getAttribute("data-id");
      const item = window.TRAVEL_DATA.tourPackages.find(x => x.id == id);
      if (item) {
        openPackageBooking(item);
      }
    }
  };
}

// ==========================================
// 3. BOOKING MODAL & DYNAMIC CALC
// ==========================================
let activeSelectedPackage = null;

function initPackageModal() {
  const modal = document.getElementById("package-modal");
  const closeBtn = document.getElementById("close-pkg-modal");
  const travelersSelect = document.getElementById("pkg-book-travelers");
  const form = document.getElementById("pkg-booking-form");

  const closeModalWindow = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModalWindow);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModalWindow();
    });
  }

  if (travelersSelect) {
    travelersSelect.addEventListener("change", () => {
      updateModalPricing();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("pkg-book-name").value.trim();
      const phone = document.getElementById("pkg-book-phone").value.trim();
      const date = document.getElementById("pkg-book-date").value;
      const count = document.getElementById("pkg-book-travelers").value;

      if (!name || !phone || !date) {
        showToast("Iltimos, barcha maydonlarni to'ldiring!", "error");
        return;
      }

      closeModalWindow();
      showToast(
        `Rahmat, ${name}! "${activeSelectedPackage ? activeSelectedPackage.title : 'Tur paketi'}" uchun buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz!`,
        "success",
        5500
      );

      form.reset();
    });
  }
}

function openPackageBooking(pkg) {
  activeSelectedPackage = pkg;
  const modal = document.getElementById("package-modal");
  const titleEl = document.getElementById("modal-pkg-title");
  const summaryEl = document.getElementById("modal-pkg-summary");
  const dateInput = document.getElementById("pkg-book-date");

  if (!modal) return;

  if (titleEl) titleEl.textContent = `Bron Qilish: ${pkg.title}`;

  if (summaryEl) {
    summaryEl.innerHTML = `
      <h4>${pkg.title} (${pkg.destination})</h4>
      <p>Davomiyligi: <strong>${pkg.duration}</strong> | Kiritilgan: ${pkg.includes.slice(0, 4).join(", ")}</p>
    `;
  }

  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }

  updateModalPricing();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateModalPricing() {
  if (!activeSelectedPackage) return;

  const travelers = parseInt(document.getElementById("pkg-book-travelers").value, 10) || 1;
  const unitPrice = activeSelectedPackage.price;
  const total = unitPrice * travelers;

  const unitEl = document.getElementById("modal-calc-unit-price");
  const multEl = document.getElementById("modal-calc-multiplier");
  const totalEl = document.getElementById("modal-calc-total");

  if (unitEl) unitEl.textContent = `$${unitPrice}`;
  if (multEl) multEl.textContent = `x ${travelers} kishi`;
  if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
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
