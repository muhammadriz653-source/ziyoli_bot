# 🎓 ZIYOLI BOT — PROFESSIONAL TA’LIM TELEGRAM BOTI

Ziyoli Bot — o‘quvchilar, talabalar, abituriyentlar va mustaqil bilim oluvchilar uchun mo‘ljallangan, zamonaviy arxitektura va ilg‘or funksiyalarga ega professional Telegram ta’lim boti.

Loyiha **Python 3.12+**, **aiogram 3**, **SQLAlchemy 2.0 (asinxron)** va **SQLite** asosida modulli arxitekturada yaratilgan.

---

## 📌 BOTNING ASOSIY IMKONIYATLARI

1. **📚 Fanlar bo‘limi (6 ta asosiy fan):**
   - 🇬🇧 **Ingliz tili:** Grammatika, Vocabulary, Reading, zamonlar, artikllar va **Kun so‘zi (Word of the Day)**.
   - 🇷🇺 **Rus tili:** Rus tili grammatikasi, kelishiklar (падежи), harakat fe’llari, leksika va imlo.
   - 📘 **Ona tili:** Fonetika, imlo, morfologiya, so‘z turkumlari, sintaksis, tinish belgilari va uslubiyat.
   - ➗ **Matematika:** Arifmetika, foizlar, algebra, kvadrat tenglamalar, ildizlar, geometriya va mantiqiy masalalar. Har bir masala uchun **bosqichma-bosqich yechim** keltirilgan!
   - 🧬 **Biologiya:** Hujayra, botanika, zoologiya, odam anatomiyasi, genetika va ekologiya.
   - ⚖️ **Huquq:** **2023-yilgi yangi tahrirdagi O‘zbekiston Konstitutsiyasi**, yangi Mehnat kodeksi, Fuqarolik va Oila kodeksi asosidagi amaldagi qonuniy testlar.

2. **📝 Mukammal test tizimi:**
   - Mavzu va daraja tanlash (🟢 Oson, 🟡 O‘rta, 🔴 Qiyin).
   - 10, 20 yoki 30 ta savoldan iborat testlar.
   - Inline tugmalar va takroriy bosishdan himoya.
   - Har bir javobdan so‘ng to‘g‘ri variant va **ilmiy izoh**.
   - Yakuniy hisobot: To‘g‘ri/noto‘g‘ri, grafik progress bar, sarflangan vaqt, **XP ballari**.
   - **Xatolarni ko‘rish va qayta ishlash** tugmalari.

3. **🌐 Ko‘p tilli tarjimon:**
   - 6 xil yo‘nalish: `UZ ⇄ EN`, `UZ ⇄ RU`, `EN ⇄ RU`.
   - Google Translator asosida asinxron ishlash.
   - Nusxalash uchun qulay format va xatolarni xavfsiz boshqarish.

4. **📖 Shaxsiy lug‘at tizimi:**
   - Har bir foydalanuvchining o‘ziga tegishli shaxsiy so‘z boyligi.
   - Yangi so‘z, tarjima va misol gap qo‘shish.
   - So‘zlarni qidirish, o‘chirish va sevimlilarga ajratish.
   - **🎯 So‘z yodlash testi (Flashcard Quiz):** O‘z lug‘atingizdagi so‘zlarni test shaklida takrorlash!

5. **🧠 Mantiqiy fikrlash bo‘limi:**
   - Sonlar ketma-ketligi, ortiqcha elementni topish, mantiqiy jumboqlar, topishmoqlar.
   - Javobni yashirish va foydalanuvchi xohlaganda yechimni ochish imkoniyati.

6. **📊 Profil, Reyting va Yutuqlar (Badges):**
   - Foydalanuvchining to‘liq statistikasi, foizlari va har bir fan kesimidagi natijalari.
   - **🏆 Top 10 Reyting jadvali.**
   - **🎖 Ko‘krak nishonlari (Badges):** "Boshlang'ich qadam", "Ziyoli talaba", "Chaqmoq daho", "O'chmas iroda" va boshqalar.
   - **🛡 Anti-cheat himoyasi:** Testni tasodifiy tez bosib ball to‘plashni cheklovchi aqlli mexanizm.

7. **👑 Administrator paneli (`/admin`):**
   - Jami foydalanuvchilar va testlar statistikasi.
   - Barcha foydalanuvchilarga e’lon (broadcast) tarqatish.
   - Tizim xatolari jurnalini (`bot.log`) bevosita Telegram orqali ko‘rish.

---

## 📂 LOYIHA PAPKALARI TUZILISHI

```text
ziyoli-bot/
├── bot.py                     # Asosiy ishga tushirish moduli (Polling, Lifecycle)
├── config.py                  # Sozlamalar va .env fayli bilan ishlash
├── requirements.txt           # Kerakli Python kutubxonalari
├── .env.example               # Muhit o'zgaruvchilari namunasi
├── .gitignore                 # Git tizimidan chiqariladigan fayllar
├── README.md                  # Loyiha qo'llanmasi
├── database/                  # Ma'lumotlar bazasi qatlami
│   ├── __init__.py
│   ├── db.py                  # Async SQLAlchemy dvigateli va sessiyalar
│   ├── models.py              # User, UserWord, TestResult, FavoriteQuestion modellari
│   └── repository.py          # CRUD va ma'lumotlar bazasi so'rovlari
├── handlers/                  # Telegram xabarlarini qayta ishlovchi modullar
│   ├── __init__.py            # Barcha routerlarni birlashtiruvchi markaz
│   ├── start.py               # /start, /help, bot haqida, sozlamalar
│   ├── subjects.py            # Fanlar bo'limi va mavzular
│   ├── tests.py               # Test mexanizmi, natijalar va xatolar tahlili
│   ├── translator.py          # 6 yo'nalishli tarjimon
│   ├── dictionary.py          # Shaxsiy lug'at va so'z yodlash testi
│   ├── logic.py               # Mantiqiy savollar va jumboqlar
│   ├── profile.py             # Profil, reyting, badges va sevimlilar
│   └── admin.py               # /admin paneli va e'lon yuborish
├── keyboards/                 # Inline va Reply tugmalar
│   ├── __init__.py
│   └── menus.py               # Barcha interfeys klaviaturalari
├── services/                  # Biznes mantiq qatlami
│   ├── __init__.py
│   ├── quiz_service.py        # Savollarni filtrlash va boshqarish
│   ├── translation_service.py # Matnli tarjima xizmati
│   └── statistics_service.py  # XP hisoblash, yutuqlar va anti-cheat
├── data/                      # 140+ haqiqiy savollar bazasi (JSON)
│   ├── english.json
│   ├── russian.json
│   ├── native_language.json
│   ├── mathematics.json
│   ├── biology.json
│   ├── law.json
│   └── logic.json
├── utils/                     # Yordamchi vositalar
│   ├── __init__.py
│   └── helpers.py             # Formatlash, progress bar, escape_html
└── tests/                     # Unit testlar
    ├── __init__.py
    ├── test_quiz.py           # Savollar butunligi va test xizmati tekshiruvi
    └── test_statistics.py     # XP, anti-cheat va yutuqlar tekshiruvi
```

---

## 🚀 WINDOWS UCHUN ISHGA TUSHIRISH YO‘RIQNOMASI

Quyidagi bosqichlarni Windows **PowerShell** yoki **Buyruqlar satri (cmd)** orqali ketma-ket bajaring:

### 1-bosqich: Python versiyasini tekshirish
Kompyuteringizda Python 3.12 yoki undan yuqori versiya o‘rnatilgan bo‘lishi lozim:
```powershell
python --version
```
Agar o‘rnatilmagan bo‘lsa, rasmiy saytdan yuklab oling: https://www.python.org/downloads/ (O‘rnatishda *"Add Python to PATH"* katagiga belgi qo‘yishni unutmang).

### 2-bosqich: Loyiha papkasiga o‘tish va virtual muhit yaratish
```powershell
cd c:\Users\User\Desktop\Antigravitiy\ziyoli-bot
python -m venv venv
```

Virtual muhitni faollashtiring:
- **PowerShell uchun:**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
  *(Agar xavfsizlik cheklovi chiqsa: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` buyrug‘ini kiriting).*
- **CMD (Buyruqlar satri) uchun:**
  ```cmd
  venv\Scripts\activate.bat
  ```

### 3-bosqich: Kutubxonalarni o‘rnatish
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

### 4-bosqich: Telegram bot yaratish va Token olish
1. Telegram’da [@BotFather](https://t.me/BotFather) botiga kiring.
2. `/newbot` buyrug‘ini yuboring.
3. Botingiz nomini va username’sini kiriting (masalan, `ZiyoliTalimBot`).
4. BotFather sizga bergan **HTTP API Token**ni nusxalab oling.

### 5-bosqich: `.env` konfiguratsiya faylini sozlash
Namunaviy fayldan `.env` faylini nusxalang:
- **PowerShell uchun:**
  ```powershell
  Copy-Item .env.example .env
  ```
- **CMD uchun:**
  ```cmd
  copy .env.example .env
  ```

Endi `.env` faylini Notepad yoki o‘zingiz yoqtirgan muharrirda oching va tokenni kiriting:
```ini
BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRstuVWXyz
ADMIN_IDS=123456789
DATABASE_URL=sqlite+aiosqlite:///ziyoli.db
LOG_LEVEL=INFO
```
*(O‘z Telegram ID raqamingizni bilish uchun [@userinfobot](https://t.me/userinfobot) ga kiring).*

### 6-bosqich: Unit testlarni ishga tushirish
Dastur kodlarining va barcha 140+ savollarning to‘g‘ri ishlashini tekshirish uchun testlarni bajaring:
```powershell
pytest
```
Barcha testlar yashil rangda (`PASSED`) muvaffaqiyatli o‘tishi kerak.

### 7-bosqich: Botni ishga tushirish!
```powershell
python bot.py
```

Konsolda quyidagi xabarni ko‘rasiz:
```text
INFO | Ma'lumotlar bazasi initsializatsiya qilinmoqda...
INFO | Ma'lumotlar bazasi muvaffaqiyatli tayyorlandi.
INFO | Bot muvaffaqiyatli ishga tushdi: @ZiyoliBot [...]
INFO | Long polling boshlandi...
```

Endi Telegram orqali botingizga `/start` buyrug‘ini yuborib, ta’lim olishni boshlashingiz mumkin! 🎓

---

## 🛠 TEZ-TEZ UCHRAYDIGAN SAVOLLAR VA XATOLARNI TUZATISH

1. **`BOT_TOKEN sozlanmagan!` xatosi:**
   - `.env` fayli yaratilganini va unda haqiqiy bot token kiritilganini tekshiring.
2. **`Script execution is disabled on this system` (PowerShell):**
   - `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` buyrug‘ini bajaring.
3. **Tarjimon xatosi:**
   - `pip install deep-translator` to‘liq o‘rnatilganini va internet aloqasi mavjudligini tekshiring.
4. **Admin paneliga kirish (`/admin`):**
   - Telegram ID raqamingiz `.env` faylidagi `ADMIN_IDS` ro‘yxatida borligini tekshiring.

---

## 📄 LITSENZIYA VA HUQUQLAR
Loyiha erkin ta'limiy maqsadlarda foydalanish uchun ishlab chiqilgan.
Muallif: **Senior AI & Python Developer (Google Deepmind Assistant)**
