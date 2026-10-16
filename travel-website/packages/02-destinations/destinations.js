/**
 * ====================================================================
 * DESTINATIONS PAGE SCRIPT (destinations.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  initDestinationsFiltering();
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
  { id: 2, title: "Sayohat yo‘nalishlari", href: "destinations.html", active: true },
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
// 2. FILTERING, SEARCH & SORTING
// ==========================================
let currentCategory = "All";
let currentSearch = "";
let currentSort = "popular";

function initDestinationsFiltering() {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search-btn");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const sortSelect = document.getElementById("sort-select");
  const resetBtn = document.getElementById("reset-filters-btn");

  // URL query parametrlarini o'qish (masalan: ?q=Paris)
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get("q");
  if (queryParam) {
    currentSearch = queryParam.trim();
    if (searchInput) {
      searchInput.value = currentSearch;
      if (clearBtn) clearBtn.style.display = "block";
    }
  }

  // Live Search hodisasi
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = currentSearch.length > 0 ? "block" : "none";
      }
      applyFilters();
    });
  }

  // Qidiruvni tozalash
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      currentSearch = "";
      clearBtn.style.display = "none";
      searchInput.focus();
      applyFilters();
    });
  }

  // Kategoriya tablarini bosish
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      applyFilters();
    });
  });

  // Saralash o'zgarishi
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }

  // Filtrlarni qayta tiklash
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentCategory = "All";
      currentSearch = "";
      currentSort = "popular";

      if (searchInput) searchInput.value = "";
      if (clearBtn) clearBtn.style.display = "none";
      if (sortSelect) sortSelect.value = "popular";

      tabBtns.forEach(b => {
        if (b.getAttribute("data-category") === "All") {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });

      applyFilters();
    });
  }

  // Dastlabki render
  applyFilters();
}

function applyFilters() {
  if (!window.TRAVEL_DATA) return;

  let results = [...window.TRAVEL_DATA.destinations];

  // 1. Kategoriya filtri
  if (currentCategory !== "All") {
    results = results.filter(d => d.continent.toLowerCase() === currentCategory.toLowerCase());
  }

  // 2. Qidiruv so'zi bo'yicha
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    results = results.filter(d => 
      d.city.toLowerCase().includes(q) || 
      d.country.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  }

  // 3. Saralash
  if (currentSort === "price-asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    results.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    results.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === "name") {
    results.sort((a, b) => a.city.localeCompare(b.city));
  } else {
    // default: id bo'yicha yoki reviewsCount
    results.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  renderResults(results);
}

function renderResults(list) {
  const grid = document.getElementById("destinations-grid");
  const countEl = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");

  if (!grid) return;

  if (countEl) {
    countEl.textContent = `${list.length} ta yo'nalish topildi`;
  }

  if (list.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  grid.innerHTML = list.map(d => {
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
              ${d.country} &bull; ${d.continent}
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
  grid.onclick = (e) => {
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
      showToast(`${item.city} sevimlilarga qo'shildi!`, "success");
    } else {
      showToast(`${item.city} sevimlilardan olib tashlandi`, "info");
    }
  };
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
