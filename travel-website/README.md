# TravelUX — Zamonaviy Xalqaro Sayohat Platformasi (Travel Startup Platform)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/Status-Production%20Ready-0F766E?style=for-the-badge)]()

**TravelUX** — chet elga sayohat qilish, mashhur shaharlar va diqqatga sazovor maskanlarni topish, hashamatli mehmonxona va tayyor tur paketlarini ko‘rish, shuningdek sayohat rejasini tuzib, byudjetni real vaqt rejimida hisoblash imkonini beruvchi professional darajadagi travel platforma.

Loyiha hech qanday tashqi frameworklarsiz (React, Vue, Tailwind, Bootstrap ishlatilmagan), faqat toza **HTML5**, **CSS3** va **Vanilla JavaScript** yordamida, modular package arxitekturasi asosida barpo etilgan.

---

## 1. Loyiha Strukturasi (Package Architecture)

Loyiha to'liq modulli package strukturasi bo'yicha tashkil qilingan:

```text
travel-website/
│
├── index.html                      # Asosiy kirish landing sahifasi (Root)
│
├── assets/
│   ├── css/
│   │   └── global.css              # Asosiy dizayn tizimi, o'zgaruvchilar, reset va umumiy komponentlar
│   ├── js/
│   │   └── travel-data.js          # Yagona ma'lumotlar ombori (Destinations, Packages, Hotels, Testimonials, FAQ)
│   ├── images/                     # Mahalliy suratlar
│   ├── icons/                      # SVG piktogrammalar
│   └── fonts/                      # Maxsus shriftlar
│
├── packages/
│   ├── 01-home/
│   │   ├── home.html               # Bosh sahifa
│   │   ├── home.css                # Bosh sahifa stillari
│   │   └── home.js                 # Bosh sahifa dinamik logikasi
│   │
│   ├── 02-destinations/
│   │   ├── destinations.html       # Sayohat yo'nalishlari katalogi
│   │   ├── destinations.css        # Filtr va grid stillari
│   │   └── destinations.js         # Qidiruv, saralash va qit'alar bo'yicha filtrlash
│   │
│   ├── 03-destination-detail/
│   │   ├── destination-detail.html # Manzil tafsilotlari sahifasi
│   │   ├── destination-detail.css  # Tafsilotlar, galereya va sidebar stillari
│   │   └── destination-detail.js   # Dinamik parametrlar (?id=), mashg'ulotlar va bron qilish
│   │
│   ├── 04-tour-packages/
│   │   ├── tour-packages.html      # Maxsus tayyor tur paketlari
│   │   ├── tour-packages.css       # Paketlar kartalari va filtrlar
│   │   └── tour-packages.js        # Muddat, byudjet, shahar bo'yicha filter va interaktiv modal
│   │
│   ├── 05-hotels/
│   │   ├── hotels.html             # Mehmonxonalar va kurortlar
│   │   ├── hotels.css              # Hotel kartalari va sidebar filtri
│   │   └── hotels.js               # Yulduzlar, qulayliklar va kechalar hisobi kalkulyatori
│   │
│   ├── 06-trip-planner/
│   │   ├── trip-planner.html       # Sayohat byudjeti va marshrut kalkulyatori
│   │   ├── trip-planner.css        # Interaktiv dashboard va timeline
│   │   └── trip-planner.js         # Real-time xarajatlar breakdown formulasi va checklist
│   │
│   └── 07-about/
│       ├── about.html              # Kompaniya tarixi, missiya, jamoa va FAQ
│       ├── about.css               # Jamoa, sharhlar va akkordeon stillari
│       └── about.js                # Dinamik jamoa, fikrlar, FAQ toggle va forma validatsiyasi
│
└── README.md                       # Loyiha hujjatlari
```

---

## 2. Ranglar Tizimi (Color System)

CSS o'zgaruvchilari orqali boshqariladigan ranglar palitrasi:

| Rang Turi | Hex Kodi | Namuna | Foydalanish Maqsadi |
| :--- | :--- | :--- | :--- |
| **Primary** | `#0F766E` | ![#0F766E](https://via.placeholder.com/15/0F766E/0F766E.png) | Asosiy brend rangi, faol tugmalar, linklar va sarlavhalar |
| **Secondary** | `#14B8A6` | ![#14B8A6](https://via.placeholder.com/15/14B8A6/14B8A6.png) | Yordamchi elementlar, hover holatlari va aktsent ramkalar |
| **Accent** | `#F59E0B` | ![#F59E0B](https://via.placeholder.com/15/F59E0B/F59E0B.png) | Diqqatni jalb qiluvchi CTA tugmalar, reyting yulduzlari |
| **Dark** | `#0F172A` | ![#0F172A](https://via.placeholder.com/15/0F172A/0F172A.png) | Footer, asosiy to'q sarlavhalar va chuqur fonlar |
| **Background** | `#F8FAFC` | ![#F8FAFC](https://via.placeholder.com/15/F8FAFC/F8FAFC.png) | Saytning asosiy toza neytral foni |
| **White** | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/FFFFFF.png) | Kartalar, modallar va toza bloklar |
| **Text** | `#334155` | ![#334155](https://via.placeholder.com/15/334155/334155.png) | Matn va tavsiflar uchun qulay o'qiluvchan rang |

```css
:root {
  --primary: #0F766E;
  --secondary: #14B8A6;
  --accent: #F59E0B;
  --dark: #0F172A;
  --background: #F8FAFC;
  --white: #FFFFFF;
  --text: #334155;
  --text-muted: #64748B;
  --border: #E2E8F0;
}
```

---

## 3. Sahifalar va Imkoniyatlar

### 🌟 01 - Bosh Sahifa (Home Page)
* **Hero Section**: Katta sifatli sayohat tasviri, brend shiori (*"Discover the World, One Journey at a Time"*), sarlavha va qidiruv paneli (Manzil, Check-in, Check-out, Sayohatchilar).
* **Statistika**: 10K+ Baxtli sayohatchilar, 120+ Yo'nalishlar, 350+ Tur paketlar, 4.9/5 Reyting.
* **Popular Destinations**: 8 ta dunyo durdonasi (Paris, Dubai, Istanbul, Tokyo, Bali, Rome, London, Maldives) JavaScript massivi orqali dinamik generatsiya qilinadi.
* **Featured Travel Packages**: Chegirmali maxsus turlar (Romantic Paris, Dubai Luxury, Tokyo Adventure va boshqalar).
* **Travel Experience**: 4 ta xizmat ustunligi (Easy Planning, Best Destinations, Trusted Partners, 24/7 Support).
* **How It Works**: 4 qadamli rejalashtirish jarayoni (01 Choose, 02 Select, 03 Plan, 04 Enjoy).
* **Travel Inspiration**: Sayohat qo'llanmalari va blog maqolalari.
* **Newsletter**: Regex orqali tekshiriladigan email obunasi va Toast xabarnomasi.

### 🗺️ 02 - Sayohat Yo'nalishlari (Destinations)
* Qit'alar bo'yicha filter: **Barchasi (All)**, **Yevropa (Europe)**, **Osiyo (Asia)**, **Yaqin Sharq (Middle East)**, **Amerika (America)**, **Afrika (Africa)**.
* Shahar va davlat nomi bo'yicha bir lahzali jonli qidiruv (Live Search).
* Saralash tizimi: Narx bo'yicha (arzondan qimmatga / qimmatdan arzonga), Reyting bo'yicha, Ommaboplik bo'yicha.
* URL orqali qidiruvni qabul qilish imkoniyati (masalan: `?q=Paris`).

### 🏛️ 03 - Yo'nalish Tafsilotlari (Destination Detail)
* URL parametri (`?id=1`) orqali dinamik yuklanadigan shahar ma'lumotlari.
* Breadcrumb navigatsiya.
* Shahar haqida qisqacha va batafsil annotatsiya.
* **Tezkor faktlar paneli**: Eng yaxshi tashrif vaqti, O'rtacha kunlik byudjet, Asosiy til, Valyuta, Viza rejimi.
* Mashhur diqqatga sazovor joylar fotogalereyasi va tavsifi.
* Ekskursiyalar va mashg'ulotlar ro'yxati (narxlar va vaqtlar bilan).
* Sayohatchilar uchun foydali maslahatlar.
* Tavsiya etilgan mehmonxonalar va tur paketlari.
* **Interaktiv Bron Qilish Modali**: Sana, kishilar soni va istaklarni qabul qiluvchi forma.

### 🎒 04 - Tur Paketlari (Tour Packages)
* Multi-kriteriyali filtrlash: Shahar, Davlat, Davomiylik (3-5 kun, 6-7 kun, 8+ kun), Byudjet diapazoni.
* Chegirma va muddat piktogrammalari bilan boyitilgan kartalar.
* Har bir paket tarkibidagi xizmatlar (Parvoz, Mehmonxona, Nonushta, Gid).
* **Interaktiv Bron Qilish Modali**: Sayohatchilar soni o'zgarganda umumiy summani real vaqtda avtomatik hisoblash!

### 🏨 05 - Mehmonxonalar (Hotels)
* Shahar va mehmonxona nomi bo'yicha qidiruv.
* Yulduzlar soni bo'yicha filter (5 yulduzli, 4 yulduzli).
* Qulayliklar bo'yicha filter (Basseyn, SPA, Bepul Wi-Fi, Nonushta, Sohil bo'yi).
* Narxlar bo'yicha saralash.
* **Xonani Bron Qilish Modali**: Check-in va Check-out sanalarini kiritganda kechalar sonini va xona toifasi (Deluxe, Suite, Presidential) koeffitsiyentini avtomatik hisoblab chiquvchi kalkulyator.

### 🧭 06 - Sayohat Rejalashtirish & Byudjet Kalkulyatori (Trip Planner)
* **Kalkulyator konfiguratori**:
  1. Yo'nalishni tanlash (Har bir shahar o'z narx indeksiga ega)
  2. Sayohatchilar soni (1 dan 8 kishigacha slider)
  3. Sayohat kunlari soni (3 dan 21 kungacha slider)
  4. Sayohat uslubi: **Budget**, **Comfort**, **Luxury**, **Adventure**, **Family**, **Romantic**
  5. Parvoz klassi: **Economy Class** yoki **Business Class**
* **Real vaqt rejimida xarajatlar taqsimoti (Breakdown)**:
  - ✈️ Parvozlar (Flights)
  - 🏨 Mehmonxona (Hotel)
  - 🍽️ Ovqatlanish (Food)
  - 🎟️ Ekskursiyalar (Activities)
  - 🚕 Mahalliy transport (Transport)
  - 💰 Jami kutilayotgan summa & Kishi boshiga to'g'ri keladigan qiymat!
* **Kunlik Reja Generatori (Day-by-Day Itinerary)**: Tanlangan shahar va kunlar soniga mos keluvchi tonggi, kunduzgi va oqshomgi marshrut dasturi.
* **Sayohat Checklisti**: Pasport, viza, sug'urta, adapter va dorilar ro'yxati (belgilash imkoniyati bilan).
* Rejani saqlash (LocalStorage) va chop etish (Print / PDF) funksiyalari.

### 🏢 07 - Biz Haqimizda (About Us)
* Kompaniya missiyasi, tarixi va 4 ta asosiy qadriyat.
* Rahbariyat va yetakchi sayohat ekspertlari fotogalereyasi.
* Haqiqiy mijozlar sharhlari va baholari.
* **Interaktiv FAQ Akkordeon**: Savollarni bosganda silliq animatsiya bilan javob ochilishi.
* **Bog'lanish formasi**: Validatsiya va Toast bildirishnomasi bilan xabarlarni yuborish.

---

## 4. Umumiy Interaktiv Tizimlar

1. **Sevimlilar Tizimi (Favorites / Wishlist)**:
   - Har bir manzil, paket va mehmonxona kartasida yurakcha tugmasi mavjud.
   - Holat: `♡` (bo'sh) $\leftrightarrow$ `♥` (qizil to'ldirilgan) + puls animatsiyasi.
   - Ma'lumotlar `localStorage`da saqlanadi va sahifa yangilanganda ham yo'qolmaydi.
   - Header'dagi tugma orqali yon tomondan ochiluvchi **Favorites Drawer** (ro'yxatdan o'chirish imkoniyati bilan).

2. **Toast Xabarnomalar (Toast Notifications)**:
   - Muvaffaqiyat (Success), xatolik (Error) va axborot (Info) turlaridagi chiroyli suzuvchi bildirishnomalar.
   - 3.5 soniyadan so'ng avtomatik yo'qoladi yoki `x` tugmasi bilan yopiladi.

3. **Mobil Menyusi (Responsive Drawer)**:
   - 992px dan kichik ekranlarda silliq ochiluvchi gamburger menyu va orqa fon loyqalanishi (Backdrop blur).

4. **Yuqoriga Qaytish (Back to Top)**:
   - 400px pastga aylantirilganda paydo bo'luvchi va silliq yuqoriga olib chiquvchi tugma.

---

## 5. Loyihani Ishga Tushirish

Hech qanday `npm install`, `build` yoki tashqi paketlar o'rnatish talab etilmaydi!

1. Loyiha papkasini oching:
   ```bash
   cd travel-website
   ```
2. `index.html` faylini istalgan brauzerda (Google Chrome, Edge, Safari, Firefox) ikki marta bosib oching.
3. Yoki VS Code / Antigravity muhitida **Live Server** kengaytmasi orqali ishga tushiring:
   ```bash
   # Masalan, Python orqali mahalliy server:
   python -m http.server 8080
   ```
   Brauzerda `http://localhost:8080` manziliga kiring.

---

## 6. Mualliflik va Standartlar

* **Standartlar**: Semantik HTML5, W3C mosligi, Toza BEM-uslubidagi CSS klasslar, ES6+ JavaScript.
* **Dizayn**: Premium Travel Startup darajasidagi toza va ishonchli UI/UX.
* **Muallif**: TravelUX Team &bull; 2026. Barcha huquqlar himoyalangan.
