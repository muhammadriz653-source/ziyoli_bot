/**
 * ====================================================================
 * HOTELS PAGE SCRIPT (hotels.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  initHotelsFilter();
  initHotelBookingModal();
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
  { id: 4, title: "Mehmonxonalar", href: "hotels.html", active: true },
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
// 2. HOTELS FILTERING & SEARCH
// ==========================================
let hotelFilterState = {
  search: "",
  city: "all",
  price: "all",
  stars: ["5"],
  amenities: [],
  sort: "rating"
};

function initHotelsFilter() {
  const searchForm = document.getElementById("hotel-search-form");
  const searchInput = document.getElementById("hotel-dest-input");
  const citySelect = document.getElementById("filter-hotel-city");
  const priceSelect = document.getElementById("filter-hotel-price");
  const sortSelect = document.getElementById("hotel-sort");
  const resetBtn = document.getElementById("hotel-reset-filters");

  // Check-in & Check-out default sanalar
  const checkinInput = document.getElementById("hotel-checkin");
  const checkoutInput = document.getElementById("hotel-checkout");

  const today = new Date();
  const nextThreeDays = new Date();
  nextThreeDays.setDate(today.getDate() + 3);

  if (checkinInput) {
    checkinInput.min = today.toISOString().split("T")[0];
    checkinInput.value = today.toISOString().split("T")[0];
  }
  if (checkoutInput) {
    checkoutInput.min = today.toISOString().split("T")[0];
    checkoutInput.value = nextThreeDays.toISOString().split("T")[0];
  }

  // URL query
  const urlParams = new URLSearchParams(window.location.search);
  const hotelIdParam = urlParams.get("hotelId");
  const cityParam = urlParams.get("city");

  if (cityParam) {
    hotelFilterState.city = cityParam;
    if (citySelect) citySelect.value = cityParam;
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      hotelFilterState.search = searchInput ? searchInput.value.trim().toLowerCase() : "";
      applyHotelsFilter();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      hotelFilterState.search = e.target.value.trim().toLowerCase();
      applyHotelsFilter();
    });
  }

  if (citySelect) {
    citySelect.addEventListener("change", (e) => {
      hotelFilterState.city = e.target.value;
      applyHotelsFilter();
    });
  }

  if (priceSelect) {
    priceSelect.addEventListener("change", (e) => {
      hotelFilterState.price = e.target.value;
      applyHotelsFilter();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      hotelFilterState.sort = e.target.value;
      applyHotelsFilter();
    });
  }

  // Checkbox: Stars
  document.querySelectorAll('input[name="hotel-stars"]').forEach(cb => {
    cb.addEventListener("change", () => {
      const checkedStars = Array.from(document.querySelectorAll('input[name="hotel-stars"]:checked')).map(x => x.value);
      hotelFilterState.stars = checkedStars;
      applyHotelsFilter();
    });
  });

  // Checkbox: Amenities
  document.querySelectorAll('input[name="amenity"]').forEach(cb => {
    cb.addEventListener("change", () => {
      const checkedAmenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked')).map(x => x.value);
      hotelFilterState.amenities = checkedAmenities;
      applyHotelsFilter();
    });
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      hotelFilterState = {
        search: "",
        city: "all",
        price: "all",
        stars: ["5"],
        amenities: [],
        sort: "rating"
      };

      if (searchInput) searchInput.value = "";
      if (citySelect) citySelect.value = "all";
      if (priceSelect) priceSelect.value = "all";
      if (sortSelect) sortSelect.value = "rating";

      document.querySelectorAll('input[name="hotel-stars"]').forEach(cb => {
        cb.checked = cb.value === "5";
      });

      document.querySelectorAll('input[name="amenity"]').forEach(cb => {
        cb.checked = false;
      });

      applyHotelsFilter();
    });
  }

  applyHotelsFilter();

  if (hotelIdParam && window.TRAVEL_DATA) {
    const targetHotel = window.TRAVEL_DATA.hotels.find(h => h.id == hotelIdParam);
    if (targetHotel) {
      setTimeout(() => openHotelBooking(targetHotel), 300);
    }
  }
}

function applyHotelsFilter() {
  if (!window.TRAVEL_DATA) return;

  let results = [...window.TRAVEL_DATA.hotels];

  // 1. Text Search
  if (hotelFilterState.search) {
    const q = hotelFilterState.search;
    results = results.filter(h => 
      h.name.toLowerCase().includes(q) || 
      h.city.toLowerCase().includes(q) || 
      h.country.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  }

  // 2. City Filter
  if (hotelFilterState.city !== "all") {
    results = results.filter(h => h.city.toLowerCase() === hotelFilterState.city.toLowerCase());
  }

  // 3. Price Filter
  if (hotelFilterState.price === "under-250") {
    results = results.filter(h => h.pricePerNight <= 250);
  } else if (hotelFilterState.price === "250-400") {
    results = results.filter(h => h.pricePerNight > 250 && h.pricePerNight <= 400);
  } else if (hotelFilterState.price === "above-400") {
    results = results.filter(h => h.pricePerNight > 400);
  }

  // 4. Stars
  if (hotelFilterState.stars.length > 0) {
    results = results.filter(h => hotelFilterState.stars.includes(h.starRating.toString()));
  }

  // 5. Amenities
  if (hotelFilterState.amenities.length > 0) {
    results = results.filter(h => {
      const amString = h.amenities.join(" ").toLowerCase();
      return hotelFilterState.amenities.every(am => amString.includes(am));
    });
  }

  // 6. Sort
  if (hotelFilterState.sort === "price-asc") {
    results.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (hotelFilterState.sort === "price-desc") {
    results.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (hotelFilterState.sort === "reviews") {
    results.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else {
    // rating
    results.sort((a, b) => b.reviewScore - a.reviewScore);
  }

  renderHotels(results);
}

function renderHotels(list) {
  const container = document.getElementById("hotels-container");
  const countEl = document.getElementById("hotels-count");
  const emptyState = document.getElementById("hotels-empty-state");

  if (!container) return;

  if (countEl) {
    countEl.textContent = `${list.length} ta saralangan mehmonxona topildi`;
  }

  if (list.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  container.innerHTML = list.map(hotel => {
    const favActive = typeof isFavorite === "function" && isFavorite(hotel.id, "hotel");
    return `
      <article class="hotel-card" data-id="${hotel.id}">
        <div class="card-image-wrap">
          <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
          <span class="card-badge">${hotel.badge || 'Hashamatli'}</span>
          <button 
            type="button" 
            class="favorite-btn ${favActive ? 'active' : ''}" 
            data-id="${hotel.id}" 
            data-type="hotel"
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
              ${hotel.city}, ${hotel.country}
            </span>
            <div class="hotel-score-badge">
              <span>★ ${hotel.reviewScore}</span>
              <span style="font-weight: 500; font-size: 0.75rem;">(${hotel.reviewText})</span>
            </div>
          </div>

          <h3 class="card-title">${hotel.name}</h3>
          <p class="card-desc" style="font-size: 0.85rem; margin-bottom: 10px;">${hotel.address}</p>

          <div class="hotel-amenities">
            ${hotel.amenities.slice(0, 3).map(am => `<span class="hotel-amenity-pill">✓ ${am}</span>`).join("")}
          </div>

          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-label">1 Kecha uchun</span>
              <span class="price-amount">$${hotel.pricePerNight}</span>
            </div>
            <button type="button" class="btn btn-primary btn-sm book-hotel-btn" data-id="${hotel.id}">
              <span>Xonani Tanlash</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Event Delegation
  container.onclick = (e) => {
    // 1. Favorite
    const favBtn = e.target.closest(".favorite-btn");
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = favBtn.getAttribute("data-id");
      const item = window.TRAVEL_DATA.hotels.find(x => x.id == id);
      if (!item) return;

      const added = toggleFavorite({
        id: item.id,
        type: "hotel",
        title: item.name,
        subtitle: `${item.city}, ${item.country}`,
        image: item.image,
        price: item.pricePerNight,
        rating: item.reviewScore
      });

      if (added) {
        showToast(`${item.name} sevimlilarga qo'shildi!`, "success");
      } else {
        showToast(`${item.name} sevimlilardan o'chirildi`, "info");
      }
      return;
    }

    // 2. Book Now
    const bookBtn = e.target.closest(".book-hotel-btn");
    if (bookBtn) {
      e.preventDefault();
      const id = bookBtn.getAttribute("data-id");
      const item = window.TRAVEL_DATA.hotels.find(x => x.id == id);
      if (item) {
        openHotelBooking(item);
      }
    }
  };
}

// ==========================================
// 3. HOTEL BOOKING MODAL
// ==========================================
let activeSelectedHotel = null;

function initHotelBookingModal() {
  const modal = document.getElementById("hotel-booking-modal");
  const closeBtn = document.getElementById("close-hotel-modal");
  const roomSelect = document.getElementById("hb-room-type");
  const checkinInput = document.getElementById("hb-checkin");
  const checkoutInput = document.getElementById("hb-checkout");
  const form = document.getElementById("hotel-booking-form");

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

  if (roomSelect) roomSelect.addEventListener("change", updateHotelPricing);
  if (checkinInput) checkinInput.addEventListener("change", updateHotelPricing);
  if (checkoutInput) checkoutInput.addEventListener("change", updateHotelPricing);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("hb-name").value.trim();
      const phone = document.getElementById("hb-phone").value.trim();
      const checkin = checkinInput.value;
      const checkout = checkoutInput.value;

      if (!name || !phone || !checkin || !checkout) {
        showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
        return;
      }

      closeModalWindow();
      showToast(
        `Rahmat, ${name}! "${activeSelectedHotel ? activeSelectedHotel.name : 'Mehmonxona'}" uchun bron arizangiz qabul qilindi. Siz bilan 15 daqiqada bog'lanamiz!`,
        "success",
        5500
      );

      form.reset();
    });
  }
}

function openHotelBooking(hotel) {
  activeSelectedHotel = hotel;
  const modal = document.getElementById("hotel-booking-modal");
  const titleEl = document.getElementById("hotel-modal-title");
  const summaryEl = document.getElementById("modal-hotel-summary");
  const checkinInput = document.getElementById("hb-checkin");
  const checkoutInput = document.getElementById("hb-checkout");

  if (!modal) return;

  if (titleEl) titleEl.textContent = `Bron Qilish: ${hotel.name}`;

  if (summaryEl) {
    summaryEl.innerHTML = `
      <h4>${hotel.name} (★ ${hotel.starRating} Yulduzli)</h4>
      <p>${hotel.city}, ${hotel.country} &bull; ${hotel.address}</p>
    `;
  }

  const today = new Date();
  const nextThreeDays = new Date();
  nextThreeDays.setDate(today.getDate() + 3);

  if (checkinInput) {
    checkinInput.min = today.toISOString().split("T")[0];
    checkinInput.value = today.toISOString().split("T")[0];
  }
  if (checkoutInput) {
    checkoutInput.min = today.toISOString().split("T")[0];
    checkoutInput.value = nextThreeDays.toISOString().split("T")[0];
  }

  updateHotelPricing();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateHotelPricing() {
  if (!activeSelectedHotel) return;

  const roomSelect = document.getElementById("hb-room-type");
  const checkinInput = document.getElementById("hb-checkin");
  const checkoutInput = document.getElementById("hb-checkout");

  const selectedOpt = roomSelect ? roomSelect.selectedOptions[0] : null;
  const mult = selectedOpt ? parseFloat(selectedOpt.getAttribute("data-mult")) || 1.0 : 1.0;

  let nights = 1;
  if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
    const d1 = new Date(checkinInput.value);
    const d2 = new Date(checkoutInput.value);
    const diffTime = d2 - d1;
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const basePrice = activeSelectedHotel.pricePerNight;
  const total = Math.round(basePrice * nights * mult);

  const priceEl = document.getElementById("hb-calc-night-price");
  const nightsEl = document.getElementById("hb-calc-nights-count");
  const multEl = document.getElementById("hb-calc-mult-val");
  const totalEl = document.getElementById("hb-calc-total");

  if (priceEl) priceEl.textContent = `$${basePrice}`;
  if (nightsEl) nightsEl.textContent = `${nights} kecha`;
  if (multEl) multEl.textContent = `${mult.toFixed(1)}x koeffitsiyent`;
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
