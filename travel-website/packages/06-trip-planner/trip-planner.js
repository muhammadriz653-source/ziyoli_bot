/**
 * ====================================================================
 * TRIP PLANNER & BUDGET CALCULATOR SCRIPT (trip-planner.js)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  initPlannerEngine();
  initChecklist();
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
  { id: 5, title: "Sayohat rejalashtirish", href: "trip-planner.html", active: true },
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
// 2. INTERACTIVE PLANNER & BUDGET ENGINE
// ==========================================
let plannerState = {
  destinationId: "1",
  cityName: "Paris",
  travelers: 2,
  days: 7,
  style: "comfort",
  styleMult: 1.0,
  flightMult: 1.0
};

function initPlannerEngine() {
  const destSelect = document.getElementById("planner-destination");
  const travelersSlider = document.getElementById("planner-travelers");
  const daysSlider = document.getElementById("planner-days");
  const travelersBadge = document.getElementById("travelers-badge");
  const daysBadge = document.getElementById("days-badge");
  const styleCards = document.querySelectorAll(".style-card");
  const flightRadioInputs = document.querySelectorAll('input[name="flight-class"]');
  const saveBtn = document.getElementById("save-plan-btn");
  const printBtn = document.getElementById("print-plan-btn");

  // Destination Change
  if (destSelect) {
    destSelect.addEventListener("change", () => {
      plannerState.destinationId = destSelect.value;
      const opt = destSelect.selectedOptions[0];
      plannerState.cityName = opt.getAttribute("data-city") || "Paris";
      calculateBudget();
      generateItinerary();
    });
  }

  // Travelers Slider
  if (travelersSlider) {
    travelersSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      plannerState.travelers = val;
      if (travelersBadge) travelersBadge.textContent = `${val} kishi`;
      calculateBudget();
    });
  }

  // Days Slider
  if (daysSlider) {
    daysSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      plannerState.days = val;
      if (daysBadge) daysBadge.textContent = `${val} kun`;
      calculateBudget();
      generateItinerary();
    });
  }

  // Travel Style Cards Click
  styleCards.forEach(card => {
    card.addEventListener("click", () => {
      styleCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      plannerState.style = card.getAttribute("data-style");
      plannerState.styleMult = parseFloat(card.getAttribute("data-mult")) || 1.0;
      calculateBudget();
    });
  });

  // Flight Class Radios
  flightRadioInputs.forEach(radio => {
    radio.addEventListener("change", (e) => {
      document.querySelectorAll(".flight-opt").forEach(opt => opt.classList.remove("active"));
      e.target.closest(".flight-opt").classList.add("active");
      plannerState.flightMult = parseFloat(e.target.value) || 1.0;
      calculateBudget();
    });
  });

  // Save Plan Button
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      try {
        localStorage.setItem("travelux_saved_trip", JSON.stringify(plannerState));
        showToast("Sayohat rejangiz muvaffaqiyatli saqlandi!", "success");
      } catch (err) {
        showToast("Rejani saqlashda xatolik yuz berdi", "error");
      }
    });
  }

  // Print / PDF Button
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Initial Run
  calculateBudget();
  generateItinerary();
}

function calculateBudget() {
  const destSelect = document.getElementById("planner-destination");
  if (!destSelect) return;

  const opt = destSelect.selectedOptions[0];
  const baseFlight = parseFloat(opt.getAttribute("data-flight")) || 500;
  const baseHotel = parseFloat(opt.getAttribute("data-hotel")) || 150;
  const baseFood = parseFloat(opt.getAttribute("data-food")) || 50;
  const baseAct = parseFloat(opt.getAttribute("data-act")) || 35;
  const baseTrans = parseFloat(opt.getAttribute("data-trans")) || 15;

  const travelers = plannerState.travelers;
  const days = plannerState.days;
  const styleMult = plannerState.styleMult;
  const flightMult = plannerState.flightMult;
  const roomsCount = Math.ceil(travelers / 2);

  // Calculations
  const flightTotal = Math.round(baseFlight * travelers * flightMult);
  const hotelTotal = Math.round(baseHotel * days * roomsCount * styleMult);
  const foodTotal = Math.round(baseFood * days * travelers * styleMult);
  const actTotal = Math.round(baseAct * days * travelers * styleMult);
  const transTotal = Math.round(baseTrans * days * travelers);

  const grandTotal = flightTotal + hotelTotal + foodTotal + actTotal + transTotal;
  const perPerson = Math.round(grandTotal / travelers);

  // DOM Updates
  const metaSubEl = document.getElementById("trip-meta-subtitle");
  const totalAmountEl = document.getElementById("calc-total-amount");
  const perPersonEl = document.getElementById("calc-per-person");

  if (metaSubEl) {
    metaSubEl.textContent = `${plannerState.cityName} • ${travelers} sayohatchi • ${days} kun • ${plannerState.style.toUpperCase()}`;
  }

  if (totalAmountEl) totalAmountEl.textContent = `$${grandTotal.toLocaleString()}`;
  if (perPersonEl) perPersonEl.textContent = `$${perPerson.toLocaleString()}`;

  // Breakdown values
  const flightVal = document.getElementById("calc-flights-val");
  const flightSub = document.getElementById("calc-flights-sub");
  const hotelVal = document.getElementById("calc-hotel-val");
  const hotelSub = document.getElementById("calc-hotel-sub");
  const foodVal = document.getElementById("calc-food-val");
  const foodSub = document.getElementById("calc-food-sub");
  const actVal = document.getElementById("calc-activities-val");
  const transVal = document.getElementById("calc-trans-val");

  if (flightVal) flightVal.textContent = `$${flightTotal.toLocaleString()}`;
  if (flightSub) flightSub.textContent = `${travelers} kishi • ${flightMult > 1.5 ? 'Business Class' : 'Economy'}`;

  if (hotelVal) hotelVal.textContent = `$${hotelTotal.toLocaleString()}`;
  if (hotelSub) hotelSub.textContent = `${days} kecha • ${roomsCount} xona`;

  if (foodVal) foodVal.textContent = `$${foodTotal.toLocaleString()}`;
  if (foodSub) foodSub.textContent = `${days} kun • 3 mahal ovqatlanish`;

  if (actVal) actVal.textContent = `$${actTotal.toLocaleString()}`;
  if (transVal) transVal.textContent = `$${transTotal.toLocaleString()}`;
}

// ==========================================
// 3. DAY-BY-DAY ITINERARY GENERATOR
// ==========================================
const ITINERARY_TEMPLATES = {
  Paris: [
    { title: "Yetib Kelish & Monmartr Ko'chalari", morning: "Parijga kelish, 4* mehmonxonaga joylashish va hordiq", afternoon: "Monmartr tepaligiga ko'tarilish va Sakre-Kyor soborini ziyorat qilish", evening: "Mahalliy fransuz bistro restoranida an'anaviy kechki ovqat" },
    { title: "Buyuk Eyfel & Luvr Durdonalari", morning: "Eyfel minorasi kuzatuv maydonchasiga chiqish", afternoon: "Luvr muzeyida Mona Liza va antik san'at durdonalari", evening: "Sena daryosida chiroqlar nuri ostidagi romantik kruiz" },
    { title: "Versal Qirollik Saroyi", morning: "Versal saroyiga tezyurar poyezdda sayohat", afternoon: "Qirollik ko'zgular zali va mashhur favvoralar bog'i bo'ylab sayr", evening: "Yelisey dalalari bo'ylab kechki xaridlar va qahva" },
    { title: "Notr-Dam & Lotin Mahallasi", morning: "Notr-Dam sobori va Il-de-la-Site oroli", afternoon: "Panteon va Lotin mahallasining tarixiy kitob do'konlari", evening: "Monparnas minorasidan Parijning tungi panoramasi" },
    { title: "Madaniyat & Zamonaviy San'at", morning: "Orse muzeyida impressionistlar durdonalari", afternoon: "Tyuilri bog'ida dam olish va fransuz desertlari degustatsiyasi", evening: "Moulin Rouge yoki milliy teatrda oqshom shousi" },
    { title: "Gastronomiya & Sharob Safari", morning: "Parijning eng qadimiy oziq-ovqat bozori Rue Mouffetard", afternoon: "Professional somelye bilan sharob va pishloq tatib ko'rish", evening: "Eyfel minorasi etagida piknik va xotira fotosessiyasi" },
    { title: "Xayrlashuv & Xaridlar", morning: "Galeriya Lafayetda esdalik sovg'alar xaridi", afternoon: "Shahar bog'larida sokin xayrlashuv qahvasi", evening: "Sharl de Goll aeroportiga transfer va uyga parvoz" }
  ],
  Dubai: [
    { title: "Marhabo Dubay & Dubai Mall", morning: "Dubay aeroportiga kelish va transfer", afternoon: "Dubai Mall, Akvarium va Dunyodagi eng katta savdo markazi", evening: "Burj Xalifa favvoralarining musiqa ostidagi hayratlanarli shousi" },
    { title: "Burj Xalifa & Dubai Marina", morning: "Burj Xalifaning 124-125 qavatlaridan shahar panoramasi", afternoon: "Dubai Marina bo'ylab sayr va xaridlar", evening: "Hashamatli yaxtada dengiz bo'ylab kechki ovqat kruizi" },
    { title: "Qizil Sahro Safarisi & Olov Shousi", morning: "Mehmonxona basseynida va plyajda hordiq", afternoon: "Qum barxanlarida 4x4 jip safari va qum chang'isi", evening: "Badaviy qishlog'ida kechki shou, tuya minish va olov raqslari" },
    { title: "Kelajak Shahri & Madaniyat", morning: "Kelajak Muzeyiga (Museum of the Future) tashrif", afternoon: "Al-Faxidiy tarixiy mavzesi va qadimiy bozorlar", evening: "Dubai Frame (Dubay ramkasi) shisha ko'prigidan quyosh botishi" },
    { title: "Palm Jumeirah & Akvapark", morning: "Monorels orqali Palm Jumeirah sun'iy oroliga sayohat", afternoon: "Aquaventure akvaparki yoki Lost Chambers akvariumi", evening: "The Pointe sohilida Atlantis mehmonxonasi manzarasi" },
    { title: "Abu-Dabi Bir Kunlik Safari", morning: "Shayx Zayd Oq Masjidiga ekskursiya", afternoon: "Luvr Abu-Dabi muzeyi va Ferrari World", evening: "Dubayga qaytish va sokin dam olish" },
    { title: "Xaridlar & Uyga Qaytish", morning: "Oltin va ziravorlar bozoridan (Gold Souk) sovg'alar", afternoon: "Mehmonxonadan chiqish va erkin vaqt", evening: "Aeroportga kuzatish va samolyotga chiqish" }
  ],
  Default: [
    { title: "Yetib Kelish & Moslashish", morning: "Shahar aeroportiga kelish, qulay transfer va mehmonxonaga joylashish", afternoon: "Tarixiy markaz bo'ylab dastlabki tanishuv piyoda sayri", evening: "An'anaviy milliy taomlar restoranida lazzatli kechki ovqat" },
    { title: "Shahar Ramzlari & Muzeylar", morning: "Shaharning eng mashhur me'moriy yodgorligiga tashrif", afternoon: "Markaziy muzey yoki san'at galereyasi bo'ylab ekskursiya", evening: "Panoramik kuzatuv maydonchasidan quyosh botishini tomosha qilish" },
    { title: "Madaniy & Gastronomik Tajriba", morning: "Mahalliy bozor va o'ziga xos mahallalar", afternoon: "Oshpazlik master-klassi yoki mahalliy lazzatlar degustatsiyasi", evening: "Daryo yoki sohil bo'yida musiqali oqshom sayri" },
    { title: "Tabiat & Yashirin Maskonlar", morning: "Shahar atrofidagi go'zal tabiat bog'i yoki tog'li hudud", afternoon: "Sharsharalar, ko'l yoki panoramik vodiylar bo'ylab sayr", evening: "Sokin qahvaxonada hordiq va suhbat" },
    { title: "Sarguzasht & Faol Hordiq", morning: "Suv sporti, velosipedda sayr yoki qiziqarli attraksionlar", afternoon: "Tarixiy qal'a yoki qadimiy ibodatxona ziyorati", evening: "Tungi chiroqlar ostidagi jonli shahar atmosferasi" },
    { title: "Xaridlar & Eksklyuziv Hordiq", morning: "Suvenir va brend xaridlar markazlariga tashrif", afternoon: "SPA va relaksatsiya muolajalari", evening: "Eng nufuzli restoranda xayrlashuv kechki ovqati" },
    { title: "Xayrlashuv & Yangi Rejalar", morning: "Erkin vaqt, suratlar tahriri va so'nggi xaridlar", afternoon: "Aeroportga qulay transfer", evening: "O'zbekistonga yo'l olish va esdalik taassurotlari" }
  ]
};

function generateItinerary() {
  const container = document.getElementById("itinerary-timeline-container");
  if (!container) return;

  const cityName = plannerState.cityName;
  const days = Math.min(plannerState.days, 7); // Show up to 7 detailed days
  const source = ITINERARY_TEMPLATES[cityName] || ITINERARY_TEMPLATES.Default;

  let html = "";
  for (let i = 0; i < days; i++) {
    const item = source[i] || source[source.length - 1];
    html += `
      <div class="itinerary-day-card">
        <div class="itinerary-day-badge">
          KUN ${i + 1}
        </div>
        <div class="itinerary-day-content">
          <h4>${item.title}</h4>
          <div class="itinerary-slots">
            <span>🌅 <strong>Tong:</strong> ${item.morning}</span>
            <span>☀️ <strong>Tushdan so'ng:</strong> ${item.afternoon}</span>
            <span>🌙 <strong>Oqshom:</strong> ${item.evening}</span>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// ==========================================
// 4. CHECKLIST
// ==========================================
function initChecklist() {
  const items = document.querySelectorAll(".check-box-item input[type='checkbox']");
  items.forEach(input => {
    input.addEventListener("change", (e) => {
      const parent = e.target.closest(".check-box-item");
      if (e.target.checked) {
        parent.classList.add("checked");
      } else {
        parent.classList.remove("checked");
      }
    });
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
