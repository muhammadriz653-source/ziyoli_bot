/**
 * ====================================================================
 * TRAVEL WEBSITE - GLOBAL DATA STORE & UTILITIES
 * ====================================================================
 * Bu fayl barcha sahifalar uchun umumiy bo'lgan ma'lumotlar ombori
 * va shared utilitalarni o'z ichiga oladi:
 * - Yo'nalishlar (Destinations)
 * - Tur paketlari (Tour Packages)
 * - Mehmonxonalar (Hotels)
 * - Sayohat tajribalari & Bosqichlar
 * - Blog & Ilhom maqolalari
 * - Sevimlilar tizimi (LocalStorage)
 * - Toast xabarnomalar
 * - Modal oynalar boshqaruvi
 */

// ==========================================
// 1. ASOSIY MA'LUMOTLAR OMBORI (DATA STORE)
// ==========================================

const TRAVEL_DATA = {
  // Mashhur yo'nalishlar (Destinations)
  destinations: [
    {
      id: 1,
      city: "Paris",
      country: "France",
      continent: "Europe",
      badge: "Eng mashhur",
      rating: 4.9,
      reviewsCount: 1420,
      price: 899,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
      description: "Sevgi va san'at shahri. Eyfel minorasi, Luvr muzeyi, romantik Sena daryosi bo'yidagi qahvaxonalar va jahon modasi markazi.",
      overview: "Parij – Fransiya poytaxti, dunyodagi eng go'zal va madaniy jihatdan boy megapolislardan biri. Bu yerda siz tarixiy arxitektura, betakror galereyalar, Michelin yulduzli restoranlar va sokin xiyobonlarni kashf etasiz.",
      bestTimeToVisit: "Aprel - Oktyabr",
      avgBudget: "$150 / kun",
      language: "Fransuz tili",
      currency: "EUR (€)",
      visaRequired: "Shengen vizasi",
      popularPlaces: [
        { name: "Eyfel minorasi", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80", desc: "Parijning 330 metr balandlikdagi ramzi." },
        { name: "Luvr muzeyi", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80", desc: "Mona Liza va 35 000 dan ortiq durdona asarlar uyi." },
        { name: "Notr-Dam sobori", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80", desc: "Gotika san'atining eng buyuk yodgorligi." },
        { name: "Monmartr va Sakre-Kyor", image: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=600&q=80", desc: "Rassomlar mahallasi va shaharga ochiladigan ajoyib panorama." }
      ],
      activities: [
        { title: "Sena daryosida kechki kruiz", duration: "2 soat", price: 45 },
        { title: "Luvr muzeyiga VIP kirish chiptasi", duration: "3 soat", price: 65 },
        { title: "Fransuz pishiriqlari master-klassi", duration: "2.5 soat", price: 90 },
        { title: "Versal saroyiga bir kunlik sayohat", duration: "6 soat", price: 110 }
      ],
      travelTips: [
        "Metropoliten chiptalarini ko'p martalik (Navigo Easy) olish ancha tejamkor.",
        "Muzeylarga chiptalarni kamida 2 hafta oldin onlayn bron qiling.",
        "Qahvaxonalarda 'Bonjour' deb salomlashish samimiy munosabat kalitidir.",
        "Suv ichish uchun shahar bo'ylab o'rnatilgan Wallace favvoralaridan bepul foydalanishingiz mumkin."
      ]
    },
    {
      id: 2,
      city: "Dubai",
      country: "UAE",
      continent: "Middle East",
      badge: "Hashamatli",
      rating: 4.95,
      reviewsCount: 1850,
      price: 1150,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
      description: "Zamonaviy mo'jizalar maskani. Burj Xalifa, ulkan xarid markazlari, sahro safarisi va dunyodagi eng hashamatli kurortlar.",
      overview: "Dubay – kelajak shahri. Bir paytlar baliqchilar qishlog'i bo'lgan ushbu shahar bugun dunyoning eng baland osmono'par binolari, sun'iy orollari va innovatsion ko'ngilochar maskanlari bilan butun dunyo sayohatchilarini lol qoldiradi.",
      bestTimeToVisit: "Noyabr - Mart",
      avgBudget: "$200 / kun",
      language: "Arab, Ingliz tili",
      currency: "AED (Birlashgan Arab Amirliklari dirhami)",
      visaRequired: "Onlayn elektron viza (30 kun)",
      popularPlaces: [
        { name: "Burj Xalifa", image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80", desc: "828 metr – dunyodagi eng baland bino." },
        { name: "Palm Jumeirah", image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80", desc: "Xurmo daraxti shaklidagi aqlbovar qilmas sun'iy orol." },
        { name: "Dubai Mall & Favvoralar", image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80", desc: "Dunyodagi eng yirik savdo va musiqa favvoralari majmuasi." },
        { name: "Kelajak Muzeyi (Museum of the Future)", image: "https://images.unsplash.com/photo-1634148521017-9c9860b7e289?auto=format&fit=crop&w=600&q=80", desc: "Noyob arxitekturaga ega 2071-yil texnologiyalari ko'rgazmasi." }
      ],
      activities: [
        { title: "Sahroda jip safari & kechki shou", duration: "6 soat", price: 85 },
        { title: "Burj Xalifa 124-125 qavatlarga chiqish", duration: "1.5 soat", price: 60 },
        { title: "Dubai Marina hashamatli yaxta sayohati", duration: "3 soat", price: 120 },
        { title: "Aquaventure akvaparkida kun bo'yi hordiq", duration: "To'liq kun", price: 95 }
      ],
      travelTips: [
        "Yoz faslida (iyun-avgust) havo juda issiq bo'ladi, eng qulay vaqt qish oylaridir.",
        "Dubay metrosi juda toza, arzon va tezkor, oltin (Gold) vagonda sayohat qilish unutilmas manzara taqdim etadi.",
        "Kiyinish madaniyatiga jamoat joylarida ehtirom ko'rsating.",
        "Taksilarda karta orqali to'lov qulay ishlaydi."
      ]
    },
    {
      id: 3,
      city: "Istanbul",
      country: "Turkey",
      continent: "Europe",
      badge: "Tarixiy",
      rating: 4.88,
      reviewsCount: 2100,
      price: 650,
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80",
      description: "Ikki qit'a tutashgan afsonaviy shahar. Moviy masjid, Ayasofiya, Bosfor bo'g'ozi va lazzatli turk taomlari.",
      overview: "Istanbul – Osiyo va Yevropani birlashtirgan, Rim, Vizantiya va Usmonli imperiyalarining poytaxti bo'lgan afsonaviy shahar. Har bir ko'chasida asrlar nafasi, bozorlarida esa sharqona lazzat hukm suradi.",
      bestTimeToVisit: "Mart - May, Sentyabr - Noyabr",
      avgBudget: "$90 / kun",
      language: "Turk tili",
      currency: "TRY (Turk lirasi)",
      visaRequired: "O'zbekiston fuqarolari uchun vizasiz (90 kun)",
      popularPlaces: [
        { name: "Ayasofiya (Hagia Sophia)", image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80", desc: "1500 yillik tarixga ega buyuk me'moriy mo'jiza." },
        { name: "Sultonahmet (Moviy masjid)", image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80", desc: "Moviy koshinlari va 6 ta minorasi bilan mashhur masjid." },
        { name: "Topqopi saroyi", image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=600&q=80", desc: "Usmonli sultonlarining asrlar davomidagi hashamatli qarorgohi." },
        { name: "Katta Bozor (Kapalıçarşı)", image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=600&q=80", desc: "4000 dan ortiq do'konli dunyoning eng qadimiy yopiq bozori." }
      ],
      activities: [
        { title: "Bosfor bo'ylab quyosh botishi kruizi", duration: "2 soat", price: 35 },
        { title: "Tarixiy hammom va SPA massaji", duration: "1.5 soat", price: 65 },
        { title: "Katta Bozor va ziravorlar bozorida gastro-tur", duration: "3 soat", price: 50 },
        { title: "Shahzodalar orollariga (Adalar) parom safari", duration: "5 soat", price: 40 }
      ],
      travelTips: [
        "Istanbulkart xarid qiling – bu barcha jamoat transporti va paromlarda amal qiladi.",
        "Qadimiy ko'chalarda piyoda yurish uchun qulay poyabzal kiying.",
        "Bozorlarda doimo savdolashish odat tusiga kirgan.",
        "Galata ko'prigi ostida yangi 'Balık ekmek' (baliqli non) tatib ko'rishni unutmang."
      ]
    },
    {
      id: 4,
      city: "Tokyo",
      country: "Japan",
      continent: "Asia",
      badge: "Futuristik",
      rating: 4.96,
      reviewsCount: 1650,
      price: 1350,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80",
      description: "Qadimiy an'analar va futuristik texnologiyalar uyg'unligi. Neonaviy ko'chalar, tinch ibodatxonalar va ajoyib taomlar.",
      overview: "Tokio – hayratlanarli darajada toza, xavfsiz va texnologik jihatdan yetakchi dunyo poytaxti. Bu yerda qadimiy Shinto ibodatxonalari kiberpank osmono'par binolar bilan yonma-yon yashaydi.",
      bestTimeToVisit: "Mart - May (Sakura), Sentyabr - Noyabr",
      avgBudget: "$170 / kun",
      language: "Yapon tili",
      currency: "JPY (Yapon iyenasi)",
      visaRequired: "Elchixona orqali sayyohlik vizasi",
      popularPlaces: [
        { name: "Shibuya Chorrahasi", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80", desc: "Dunyodagi eng gavjum piyodalar o'tish yo'li." },
        { name: "Senso-ji ibodatxonasi", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80", desc: "Tokiodagi eng qadimiy va muqaddas buddistlar maskani." },
        { name: "Fuji tog'i ko'rinishi", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", desc: "Yaponiyaning muqaddas qorli cho'qqisi." },
        { name: "Akihabara elektronika mavzesi", image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80", desc: "Anime, manga va zamonaviy gadjetlar markazi." }
      ],
      activities: [
        { title: "Haqiqiy yapon choy marosimi", duration: "1.5 soat", price: 55 },
        { title: "Tsukiji baliq bozorida yangi sushi tayyorlash", duration: "2 soat", price: 80 },
        { title: "TeamLab Planets interaktiv raqamli muzeyi", duration: "2 soat", price: 42 },
        { title: "Hakone va Fuji tog'iga tezyurar Shinkansen safari", duration: "8 soat", price: 160 }
      ],
      travelTips: [
        "JR Pass yoki Suica/Pasmo transport kartasi harakatlanishni osonlashtiradi.",
        "Yaponiyada choychaqa (tip) qoldirish qabul qilinmaydi va noqulaylik tug'dirishi mumkin.",
        "Mobil internet uchun aeroportdan e-SIM yoki cho'ntak Wi-Fi ijaraga oling.",
        "Ko'chalarda chiqindi qutilari kam, chiqindini o'zingiz bilan olib yurish odat hisoblanadi."
      ]
    },
    {
      id: 5,
      city: "Bali",
      country: "Indonesia",
      continent: "Asia",
      badge: "Tropik Jannat",
      rating: 4.92,
      reviewsCount: 2300,
      price: 780,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
      description: "Ertakmonand tropik orol. Zumrad guruch terassalari, muqaddas ibodatxonalar, bepoyon okean to'lqinlari va yoga maskanlari.",
      overview: "Bali – xudolar oroli sifatida tanilgan Indoneziya durdonasi. Bu yerda siz vulqonlar manzarasi, palmazor sohillar, sharsharalar va samimiy mehmondo'st mahalliy madaniyatdan ruhiy tetiklik olasiz.",
      bestTimeToVisit: "May - Sentyabr (Quruq mavsum)",
      avgBudget: "$70 / kun",
      language: "Indonez, Bali tili",
      currency: "IDR (Indoneziya rupiyasi)",
      visaRequired: "Kelganda viza (Visa on Arrival - 30 kun)",
      popularPlaces: [
        { name: "Tegallalang guruch terrasalari", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80", desc: "Ubud yaqinidagi mashhur yashil vodiylar." },
        { name: "Uluwatu qoyali ibodatxonasi", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80", desc: "Hind okeani ustidagi tik qoyada quyosh botishi." },
        { name: "Nusa Penida oroli (Kelingking Beach)", image: "https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=600&q=80", desc: "Dinozavr shaklidagi hayratlanarli sohil." },
        { name: "Maymunlar o'rmoni (Monkey Forest Ubud)", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80", desc: "Yuzlab erkin yashovchi maymunlar va qadimiy daraxtlar." }
      ],
      activities: [
        { title: "Batur vulqonida quyosh chiqishini kutib olish", duration: "5 soat", price: 55 },
        { title: "Kuta sohilida professional serfing darsi", duration: "2 soat", price: 35 },
        { title: "Ubud bo'ylab an'anaviy Balinez SPA marosimi", duration: "2 soat", price: 40 },
        { title: "Nusa Penidaga tezkor katerda bir kunlik sayohat", duration: "8 soat", price: 85 }
      ],
      travelTips: [
        "Orol bo'ylab sayohat qilish uchun haydovchili shaxsiy avtomobil ijarasi juda arzon.",
        "Ibodatxonalarga kirishda sarong kiyish shart (odatda kirishda beriladi).",
        "Kran suvidan ichmang, faqat butilkalardagi toza suvdan foydalaning.",
        "Ubudda bo'lganingizda mahalliy organik qahva va mevalarni tatib ko'ring."
      ]
    },
    {
      id: 6,
      city: "Rome",
      country: "Italy",
      continent: "Europe",
      badge: "Abadiy Shahar",
      rating: 4.89,
      reviewsCount: 1720,
      price: 840,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
      description: "Qadimiy imperiyaning yuragi. Kolizey, Vatikan, Trevi favvorasi va haqiqiy italyancha pitsa hamda muzqaymoq (gelato).",
      overview: "Rim – ochiq osmon ostidagi ulkan muzey. Har bir toshida 2500 yillik tarix yotgan bu shahar o'zining me'moriy qudrati, boy oshxonasi va nafis turmush tarzi bilan barchani maftun etadi.",
      bestTimeToVisit: "Aprel - Iyun, Sentyabr - Oktyabr",
      avgBudget: "$140 / kun",
      language: "Italyan tili",
      currency: "EUR (€)",
      visaRequired: "Shengen vizasi",
      popularPlaces: [
        { name: "Kolizey (Colosseum)", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80", desc: "Gladiatorlar jang qilgan dunyoning 7 yangi mo'jizasidan biri." },
        { name: "Trevi favvorasi", image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=600&q=80", desc: "Tanga tashlab qayta kelish tilanadigan maftunkor favvora." },
        { name: "Vatikan va Avliyo Pyotr sobori", image: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80", desc: "Katolik dunyosi markazi va Sikstin kapellasi." },
        { name: "Panteon", image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80", desc: "2000 yil saqlanib qolgan betakror gumbazli ibodatxona." }
      ],
      activities: [
        { title: "Kolizey va Rim Forumi ekskursiyasi", duration: "3 soat", price: 65 },
        { title: "Vatikan muzeylariga navbatsiz kirish", duration: "3.5 soat", price: 75 },
        { title: "Italiya pitsasi va pastasini pishirish darsi", duration: "3 soat", price: 85 },
        { title: "Kechki Trastevere gastronomiya safari", duration: "2.5 soat", price: 60 }
      ],
      travelTips: [
        "Kolizey va Vatikan chiptalarini kamida bir oy oldin rasmiy saytdan xarid qiling.",
        "Ko'chalardagi 'Nasoni' deb ataluvchi favvorachalardan toza sovuq suv ichish bepul.",
        "Trastevere mahallasida mahalliy aholi tashrif buyuradigan ajoyib restoranlar bor.",
        "Trevi favvorasiga tanga tashlashda o'ng qo'lingiz bilan chap yelkangiz osha tashlang."
      ]
    },
    {
      id: 7,
      city: "London",
      country: "United Kingdom",
      continent: "Europe",
      badge: "Qirollik Shahri",
      rating: 4.87,
      reviewsCount: 1540,
      price: 1050,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
      description: "Buyuk Britaniyaning yuragi. Big Ben, Bukingem saroyi, Tower Bridge, dunyo darajasidagi teatrlar va qizil avtobuslar.",
      overview: "London – zamonaviylik va qadimiy qirollik an'analari uyg'unlashgan dunyoning moliya va madaniyat poytaxti. Muzeylari aksariyati bepul bo'lgan bu megapolisda doimo kashf qilish uchun yangi narsa topiladi.",
      bestTimeToVisit: "May - Sentyabr",
      avgBudget: "$180 / kun",
      language: "Ingliz tili",
      currency: "GBP (£)",
      visaRequired: "Buyuk Britaniya vizasi",
      popularPlaces: [
        { name: "Big Ben va Parlament saroyi", image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80", desc: "Temza daryosi bo'yidagi mashhur soat minorasi." },
        { name: "Tower Bridge", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80", desc: "Viktoriya davrining ramziy ko'prigi." },
        { name: "Bukingem saroyi", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80", desc: "Britaniya monarxining rasmiy qarorgohi." },
        { name: "British Museum", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=600&q=80", desc: "Insoniyat tarixining bepul ulkan xazinasi." }
      ],
      activities: [
        { title: "London Eye charxpalagida shahar panoramasi", duration: "1 soat", price: 45 },
        { title: "Temza bo'ylab tezyurar qayiq sayohati", duration: "1.5 soat", price: 50 },
        { title: "West End teatrlarida jahon myuzikli", duration: "2.5 soat", price: 95 },
        { title: "Vindzor qasri va Stounxenj bir kunlik safari", duration: "8 soat", price: 130 }
      ],
      travelTips: [
        "Metropoliten va avtobuslarda bank kartangizni shunchaki tekkizib (Contactless) to'lashingiz mumkin.",
        "Britaniya muzeyi, Milliy galereya va Tabiat tarixi muzeyiga kirish mutlaqo bepul!",
        "Har doim o'zingiz bilan kichik soyabon yoki yengil kurtka olib yuring.",
        "Klassik qora taksilardan kamida bir marta foydalanib ko'ring."
      ]
    },
    {
      id: 8,
      city: "Maldives",
      country: "Maldives",
      continent: "Asia",
      badge: "Romantik",
      rating: 4.98,
      reviewsCount: 1980,
      price: 1690,
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
      description: "Moviy lagunalar va oq qumli orollar. Suv ustidagi villalar, rang-barang marjon riflari va tinchlik olami.",
      overview: "Maldiv orollari – Hind okeanidagi orom maskani. Toza zumrad suvlari, suv ustida joylashgan hashamatli villalari va xilvat plyajlari bilan bu orollar sevishganlar, asal oylari va sokinlik izlaganlar uchun yer yuzidagi eng ideal maskandir.",
      bestTimeToVisit: "Dekabr - Aprel",
      avgBudget: "$250 / kun",
      language: "Divexi, Ingliz tili",
      currency: "MVR (Maldiv rufiyasi), USD qabul qilinadi",
      visaRequired: "Kelganda bepul 30 kunlik viza",
      popularPlaces: [
        { name: "Suv ustidagi villalar (Overwater Bungalows)", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80", desc: "Okeanning qoq o'rtasidagi shaxsiy basseynli villalar." },
        { name: "Ari Atolli marjon riflari", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80", desc: "Kit akulalari va skatlar bilan suv osti suzishi." },
        { name: "Male poytaxti va qadimiy masjid", image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80", desc: "Marjon toshlaridan qurilgan qadimiy masjidlar." },
        { name: "Vaadhoo oroli (Yorug'lik plyaji)", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", desc: "Kechasi ko'm-ko'k bo'lib yonuvchi bioluminessensiya hodisasi." }
      ],
      activities: [
        { title: "Delfinlar hamrohligida quyosh botishi kruizi", duration: "2 soat", price: 80 },
        { title: "Marjon riflarida dayving va snokeling", duration: "3 soat", price: 110 },
        { title: "Kimsasiz orolchada shaxsiy romantik kechki ovqat", duration: "3 soat", price: 220 },
        { title: "Suv osti restoranida tushlik tajribasi", duration: "2 soat", price: 250 }
      ],
      travelTips: [
        "Kurortlarga yetib borish uchun tezyurar kater yoki gidrosamolyot (seaplane) xizmatidan foydalaniladi.",
        "Orollarda deyarli hamma joyda AQSh dollari va xalqaro bank kartalari qabul qilinadi.",
        "Kuchli quyoshdan himoyalovchi krem va quyosh ko'zoynagini unutmang.",
        "Ekologiyani asrang: tirik marjonlar va chig'anoqlarni olib ketish qat'iyan taqiqlanadi."
      ]
    },
    {
      id: 9,
      city: "New York",
      country: "USA",
      continent: "America",
      badge: "Megapolis",
      rating: 4.86,
      reviewsCount: 1620,
      price: 1450,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80",
      description: "Hech qachon uxlamaydigan shahar. Times Square, Central Park, Ozodlik haykali va Brodvey teatrlari.",
      overview: "Nyu-York – energiya, imkoniyatlar va madaniyatlar qozoni. Manxetten osmono'par binolari, ko'cha san'ati va beqiyos ritmi bilan har qanday sayohatchini o'ziga rom etadi.",
      bestTimeToVisit: "Sentyabr - Noyabr, Aprel - Iyun",
      avgBudget: "$220 / kun",
      language: "Ingliz tili",
      currency: "USD ($)",
      visaRequired: "AQSh vizasi (B1/B2)",
      popularPlaces: [
        { name: "Times Square", image: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80", desc: "Neonaviy ekranlar va dunyo chorrahasi." },
        { name: "Central Park", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80", desc: "Manxetten markazidagi ulkan yashil voha." },
        { name: "Ozodlik haykali", image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=600&q=80", desc: "Amerika erkinligining butunjahon ramzi." }
      ],
      activities: [
        { title: "Empire State Building kuzatuv maydonchasi", duration: "1.5 soat", price: 48 },
        { title: "Brodvey myuziklini tomosha qilish", duration: "2.5 soat", price: 120 }
      ],
      travelTips: ["Metro kartasi orqali harakatlanish tirbandliklardan xalos etadi.", "Ko'cha kafelari va food trucklarida arzon hamda mazali taomlar mavjud."]
    },
    {
      id: 10,
      city: "Cairo",
      country: "Egypt",
      continent: "Africa",
      badge: "Qadimiy Sivilizatsiya",
      rating: 4.82,
      reviewsCount: 1390,
      price: 580,
      image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80",
      description: "Fir'avnlar yurti. Buyuk Gizadagi piramidalar, Sfinks, Nil daryosi kruizlari va sirli qadimiy sirlar.",
      overview: "Qohira – qadimgi dunyo sirlari va sharqona shovqin-suron uyg'unlashgan shahar. 4500 yillik piramidalar va Nil daryosi bo'yidagi unutilmas oqshomlar sizni kutmoqda.",
      bestTimeToVisit: "Oktyabr - Aprel",
      avgBudget: "$65 / kun",
      language: "Arab tili",
      currency: "EGP (Misr funti)",
      visaRequired: "Elektron viza yoki kelganda viza",
      popularPlaces: [
        { name: "Giza Piramidalari va Sfinks", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80", desc: "Dunyodagi saqlanib qolgan yagona qadimiy mo'jiza." },
        { name: "Misr sivilizatsiyasi milliy muzeyi", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80", desc: "Fir'avnlar mumiyalari zali." }
      ],
      activities: [
        { title: "Piramidalar bo'ylab tuya yoki otda sayr", duration: "2 soat", price: 40 },
        { title: "Nil daryosida an'anaviy felukka yelkanlisida suzish", duration: "1.5 soat", price: 30 }
      ],
      travelTips: ["Quyoshdan saqlanish uchun bosh kiyim va suv oling.", "Bozorlarda doimo tabassum bilan savdolashing."]
    }
  ],

  // Maxsus Tur Paketlari (Tour Packages)
  tourPackages: [
    {
      id: 1,
      title: "Romantic Paris Escape",
      destination: "Paris, France",
      destinationId: 1,
      duration: "6 kun / 5 kecha",
      durationDays: 6,
      category: "Romantic",
      rating: 4.95,
      reviewsCount: 310,
      price: 899,
      oldPrice: 1199,
      discount: "25% Chegirma",
      badge: "Top Tanlov",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
      includes: ["Aviachipta", "4* Mehmonxona", "Ertalabki nonushta", "Sena daryosi kruizi", "Luvr muzeyiga chipta", "Gid xizmati"],
      highlights: [
        "Eyfel minorasida quyosh botishini tomosha qilish",
        "Romantik Sena daryosida shaxsiy kechki ovqat",
        "Monmartr ko'chalarida professional fotosessiya",
        "Versal saroyi va bog'lariga ekskursiya"
      ]
    },
    {
      id: 2,
      title: "Dubai Luxury Experience",
      destination: "Dubai, UAE",
      destinationId: 2,
      duration: "7 kun / 6 kecha",
      durationDays: 7,
      category: "Luxury",
      rating: 4.98,
      reviewsCount: 450,
      price: 1290,
      oldPrice: 1590,
      discount: "19% Chegirma",
      badge: "VIP Xizmat",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
      includes: ["To'g'ridan-to'g'ri reys", "5* Hashamatli Hotel", "VIP Sahro Safarisi", "Burj Xalifa chiptasi", "Shaxsiy transfer", "Yaxta sayohati"],
      highlights: [
        "Burj Xalifa 148-qavat Lounge maydonchasiga kirish",
        "Dubay Marina bo'ylab xususiy yaxtada kruiz",
        "Sahroda hashamatli kechki ovqat va olov shousi",
        "Kelajak Muzeyiga ekspress navbatsiz kirish"
      ]
    },
    {
      id: 3,
      title: "Discover Istanbul",
      destination: "Istanbul, Turkey",
      destinationId: 3,
      duration: "5 kun / 4 kecha",
      durationDays: 5,
      category: "Cultural",
      rating: 4.89,
      reviewsCount: 620,
      price: 549,
      oldPrice: 699,
      discount: "21% Chegirma",
      badge: "Eng Ommabop",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80",
      includes: ["Aviachipta", "Tarixiy markazdagi 4* Hotel", "Nonushta", "Bosfor bo'ylab kruiz", "O'zbekzabon gid", "Barcha muzey chiptalari"],
      highlights: [
        "Ayasofiya va Moviy masjid bo'ylab to'liq ekskursiya",
        "Bosfor bo'g'ozida kechki turk milliy shousi",
        "Kapalicharshida sharqona xaridlar va lazzatli taomlar",
        "Shahzodalar orolida tabiat qo'ynida dam olish"
      ]
    },
    {
      id: 4,
      title: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      destinationId: 4,
      duration: "8 kun / 7 kecha",
      durationDays: 8,
      category: "Adventure",
      rating: 4.97,
      reviewsCount: 280,
      price: 1550,
      oldPrice: 1850,
      discount: "16% Chegirma",
      badge: "Yangi Yo'nalish",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80",
      includes: ["Aviachipta", "Markaziy 4* Hotel", "JR Pass tezyurar poyezd", "Viza yordami", "TeamLab muzeyi chiptasi", "Mahalliy gid"],
      highlights: [
        "Shibuya va Shinjuku futuristik tungi nurlari",
        "Fuji tog'i etagida an'anaviy Onsen issiq buloqlari",
        "Haqiqiy yapon oshpazi bilan sushi tayyorlash",
        "Senso-ji qadimiy ibodatxonasida ma'naviy hordiq"
      ]
    },
    {
      id: 5,
      title: "Bali Tropical Escape",
      destination: "Bali, Indonesia",
      destinationId: 5,
      duration: "9 kun / 8 kecha",
      durationDays: 9,
      category: "Relax",
      rating: 4.93,
      reviewsCount: 390,
      price: 890,
      oldPrice: 1100,
      discount: "20% Chegirma",
      badge: "Eksklyuziv",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
      includes: ["Parvoz", "Ubud & Seminyak Shaxsiy Villa", "Nonushtalar", "Batur vulqoni safari", "Nusa Penida orol safari", "Balinez massaji"],
      highlights: [
        "Tropik o'rmonlar ichidagi shaxsiy basseynli villa",
        "Batur vulqonida bulutlar ustida quyosh chiqishi",
        "Kelingking sohilining betakror manzaralari",
        "Mashhur Bali mayatniklarida (Bali Swing) uchish"
      ]
    },
    {
      id: 6,
      title: "Classic Rome & Florence",
      destination: "Rome, Italy",
      destinationId: 6,
      duration: "7 kun / 6 kecha",
      durationDays: 7,
      category: "Cultural",
      rating: 4.91,
      reviewsCount: 340,
      price: 990,
      oldPrice: 1250,
      discount: "20% Chegirma",
      badge: "San'at & Tarix",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
      includes: ["Parvoz", "Rim va Florensiya 4* hotellari", "Tezyurar poyezd chiptasi", "Kolizey & Vatikan navbatsiz kirish", "Pitsa master-klassi"],
      highlights: [
        "Kolizey va Rim Forumiga ekspert arxeolog bilan kirish",
        "Vatikanda Mikelanjeloning durdonalarini ko'rish",
        "Florensiyaning Duomo maydonida italyan kofesi",
        "Toskana vodiysidagi uzumzorlar bo'ylab sayr"
      ]
    },
    {
      id: 7,
      title: "London Explorer & Royal Heritage",
      destination: "London, UK",
      destinationId: 7,
      duration: "6 kun / 5 kecha",
      durationDays: 6,
      category: "City Tour",
      rating: 4.88,
      reviewsCount: 220,
      price: 1120,
      oldPrice: 1390,
      discount: "19% Chegirma",
      badge: "Klassik",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
      includes: ["Aviaparvoz", "Markaziy London 4* Hotel", "Oyster transport kartasi", "London Eye chiptasi", "Vindzor qasri safari"],
      highlights: [
        "Bukingem saroyida soqchilar almashish marosimi",
        "London Eye charxpalagida quyosh botishi",
        "West End teatrida jahonga mashhur myuzikl",
        "Tarixiy Vindzor qasri va qirollik xazinalari"
      ]
    },
    {
      id: 8,
      title: "Maldives Overwater Paradise",
      destination: "Maldives",
      destinationId: 8,
      duration: "7 kun / 6 kecha",
      durationDays: 7,
      category: "Romantic",
      rating: 4.99,
      reviewsCount: 510,
      price: 1850,
      oldPrice: 2350,
      discount: "21% Chegirma",
      badge: "Asal Oyi",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
      includes: ["Parvoz", "Suv ustidagi 5* Villa", "All-Inclusive taomlar", "Gidrosamolyot transferi", "Delfinlar kruizi", "SPA muolajalari"],
      highlights: [
        "To'g'ridan-to'g'ri okeanga tushiladigan shaxsiy villa",
        "All-Inclusive xalqaro oshxona va ichimliklar",
        "Oqshomgi delfinlar kuzatuvi va shampan vinosi",
        "Rang-barang marjon riflarida shaxsiy instruktor bilan dayving"
      ]
    }
  ],

  // Mehmonxonalar (Hotels)
  hotels: [
    {
      id: 1,
      name: "Le Grand Hôtel de Paris",
      destinationId: 1,
      city: "Paris",
      country: "France",
      address: "2 Rue Scribe, 9th arr., 75009 Paris",
      starRating: 5,
      reviewScore: 9.6,
      reviewText: "Favqulodda",
      reviewsCount: 840,
      pricePerNight: 280,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      amenities: ["Bepul Wi-Fi", "SPA & Wellness", "Eyfel manzarasi", "Restoran & Bar", "Fitnes zali", "Aeroport transferi"],
      badge: "Mashhur Tanlov"
    },
    {
      id: 2,
      name: "Burj Al Arab Jumeirah",
      destinationId: 2,
      city: "Dubai",
      country: "UAE",
      address: "Jumeirah Beach Road, Dubai",
      starRating: 5,
      reviewScore: 9.9,
      reviewText: "Mukammal",
      reviewsCount: 1250,
      pricePerNight: 650,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      amenities: ["Shaxsiy plyaj", "Vertolyot maydonchasi", "Cheksiz basseyn", "Rolls-Royce transferi", "Suv osti restorani", "24/7 Butler"],
      badge: "Ultra Hashamat"
    },
    {
      id: 3,
      name: "Four Seasons Bosphorus",
      destinationId: 3,
      city: "Istanbul",
      country: "Turkey",
      address: "Ciragan Cad. No:28, Besiktas, Istanbul",
      starRating: 5,
      reviewScore: 9.5,
      reviewText: "A'lo darajada",
      reviewsCount: 920,
      pricePerNight: 220,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      amenities: ["Bosfor bo'yida basseyn", "Tarixiy turk hammomi", "Bepul Wi-Fi", "Lazzatli nonushta", "Ochiq terassa"],
      badge: "Sohil Bo'yi"
    },
    {
      id: 4,
      name: "Park Hyatt Tokyo",
      destinationId: 4,
      city: "Tokyo",
      country: "Japan",
      address: "3-7-1-2 Nishi-Shinjuku, Shinjuku, Tokyo",
      starRating: 5,
      reviewScore: 9.7,
      reviewText: "Mukammal",
      reviewsCount: 710,
      pricePerNight: 340,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      amenities: ["Fuji tog'i panoramasi", "Baland qavatdagi basseyn", "New York Grill", "SPA markazi", "Shinjuku markazida"],
      badge: "Panoramik Manzara"
    },
    {
      id: 5,
      name: "The Kayon Jungle Resort",
      destinationId: 5,
      city: "Bali",
      country: "Indonesia",
      address: "Banjar Bresela, Payangan, Ubud, Bali",
      starRating: 5,
      reviewScore: 9.8,
      reviewText: "Sehrli",
      reviewsCount: 1100,
      pricePerNight: 190,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      amenities: ["3 bosqichli sharshara basseyn", "Tropik o'rmon manzarasi", "Yoga paviloni", "Shaxsiy villa", "Bepul nonushta"],
      badge: "Tabiat Qo'ynida"
    },
    {
      id: 6,
      name: "Hotel de Russie, Rocco Forte",
      destinationId: 6,
      city: "Rome",
      country: "Italy",
      address: "Via del Babuino 9, Spagna, 00187 Rome",
      starRating: 5,
      reviewScore: 9.4,
      reviewText: "Ajoyib",
      reviewsCount: 650,
      pricePerNight: 290,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
      amenities: ["Maxfiy ichki bog'", "Piazza del Popolo yaqinida", "Hasamador italyan restorani", "SPA & Massaj", "Lounge bar"],
      badge: "Tarixiy Markaz"
    },
    {
      id: 7,
      name: "The Savoy London",
      destinationId: 7,
      city: "London",
      country: "UK",
      address: "Strand, London WC2R 0EZ",
      starRating: 5,
      reviewScore: 9.6,
      reviewText: "Qirollik darajasi",
      reviewsCount: 890,
      pricePerNight: 380,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      amenities: ["Temza daryosi manzarasi", "Gordon Ramsay restorani", "Qirollik an'anaviy choyxonasi", "Tarixiy arxitektura"],
      badge: "Klassik Qirollik"
    },
    {
      id: 8,
      name: "Soneva Jani Resort & Water Retreats",
      destinationId: 8,
      city: "Maldives",
      country: "Maldives",
      address: "Medhufaru Island, Noonu Atoll, Maldives",
      starRating: 5,
      reviewScore: 9.9,
      reviewText: "Orzudagi Maskon",
      reviewsCount: 580,
      pricePerNight: 850,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      amenities: ["Ochilib yopiluvchi yulduzli tom", "Shaxsiy suv slaydi", "Xususiy basseyn", "All-Inclusive ovqatlanish", "Suv usti kinoteatri"],
      badge: "Jannatmonand"
    }
  ],

  // Sayohat tajribalari xususiyatlari (Features)
  travelExperiences: [
    {
      id: 1,
      icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      title: "Easy Planning",
      titleUz: "Oson Rejalashtirish",
      desc: "Bir necha daqiqa ichida sayohat yo'nalishingiz, parvoz, mehmonxona va byudjetingizni interaktiv kalkulyatorda hisoblang."
    },
    {
      id: 2,
      icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/></svg>`,
      title: "Best Destinations",
      titleUz: "Eng Sara Yo'nalishlar",
      desc: "Dunyodagi 120+ dan ortiq eng go'zal mamlakat va shaharlar, ularning yashirin durdonalari va professional gid tavsiyalari."
    },
    {
      id: 3,
      icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      title: "Trusted Partners",
      titleUz: "Ishonchli Hamkorlar",
      desc: "Xalqaro litsenziyaga ega aviakompaniyalar, 5 yulduzli hotellar tarmog'i va sug'urta kafolati bilan to'liq xavfsiz sayohat."
    },
    {
      id: 4,
      icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
      title: "24/7 Support",
      titleUz: "24/7 Doimiy Qo'llab-quvvatlash",
      desc: "Sayohat davomida har qanday kutilmagan vaziyatda sizga yordam beradigan professional shaxsiy konsyerj xizmati."
    }
  ],

  // Qanday ishlaydi (How it works - 4 steps)
  howItWorks: [
    {
      step: "01",
      title: "Choose Destination",
      titleUz: "Yo'nalishni Tanlang",
      desc: "O'zingiz orzu qilgan mamlakat, shahar va sayohat uslubini (dam olish, romantika, madaniyat yoki sarguzasht) tanlang."
    },
    {
      step: "02",
      title: "Select Your Trip",
      titleUz: "Paketni Belgilang",
      desc: "Tayyor tur paketlarimiz yoki moslashuvchan mehmonxona va parvoz variantlaridan eng ma'qulini o'zingizga moslang."
    },
    {
      step: "03",
      title: "Plan Your Journey",
      titleUz: "Rejani Shakllantiring",
      desc: "Byudjet kalkulyatori orqali xarajatlaringizni oldindan aniqlang, viza va qulay sanalarni birgalikda rasmiylashtiring."
    },
    {
      step: "04",
      title: "Enjoy Your Travel",
      titleUz: "Sayohatdan Rohatlaning",
      desc: "Barcha tashkiliy ishlarni bizga topshiring va unutilmas taassurotlar, yangi madaniyatlar hamda xotiralar qadamingizdan zavqlaning!"
    }
  ],

  // Sayohat Ilhomlari (Travel Inspiration Blog)
  travelInspirations: [
    {
      id: 1,
      category: "Yevropa Qo'llanmasi",
      title: "Best Places to Visit in Europe",
      titleUz: "Yevropada Albatta Ko'rishingiz Kerak Bo'lgan Eng Go'zal Joylar",
      description: "Parijning sokin xiyobonlaridan tortib, Shveytsariya Alp tog'lari va Italiyaning moviy Amalfi sohillarigacha sayyohlik marshruti.",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=700&q=80",
      date: "15 May, 2026",
      readTime: "5 daqiqa mutolaa"
    },
    {
      id: 2,
      category: "Shahar Sirlari",
      title: "Top 10 Things to Do in Dubai",
      titleUz: "Dubayda Bajarishingiz Kerak Bo'lgan Top 10 Ta Unutilmas Mashg'ulot",
      description: "Eng baland osmono'par bino tepasidagi hayajon, sahro safarisida quyosh botishi va Palm Jumeirah orolida yaxta sayohati sirlari.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80",
      date: "28 Aprel, 2026",
      readTime: "6 daqiqa mutolaa"
    },
    {
      id: 3,
      category: "Madaniyat & San'at",
      title: "Japan Travel Guide",
      titleUz: "Yaponiya Sayohat Qo'llanmasi: Tokio, Kioto va Sakura Mavsumi",
      description: "Qadimiy Shinto ziyoratgohlari, zamonaviy shinkansen poyezdlari, o'ziga xos etiket qoidalari va yapon gastronomiyasiga sayohat.",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80",
      date: "10 Aprel, 2026",
      readTime: "7 daqiqa mutolaa"
    },
    {
      id: 4,
      category: "Tropik Hordiq",
      title: "Bali Travel Guide",
      titleUz: "Bali Sayohat Qo'llanmasi: Qayerda Qolish, Nima Yeyish va Nimalarni Ko'rish?",
      description: "Ubudning sokin yashil o'rmonlaridagi shaxsiy villalar, Kelingking sohilidagi hayrat va mahalliy marosimlar ruhiyati haqida to'liq hisobot.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80",
      date: "22 Mart, 2026",
      readTime: "4 daqiqa mutolaa"
    },
    {
      id: 5,
      category: "Aqlli Sayohat",
      title: "How to Travel on a Budget",
      titleUz: "Kam Byudjet Bilan Dunyo Bo'ylab Sayohat Qilishning 12 Ta Siniq Sirasi",
      description: "Arzon aviachiptalarni topish usullari, mahalliy transport kartalari va sifatli turar joylarni hamyonbop narxlarda tanlash strategiyalari.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80",
      date: "05 Mart, 2026",
      readTime: "8 daqiqa mutolaa"
    }
  ],

  // Jamoa a'zolari (Team)
  teamMembers: [
    {
      name: "Javohir Alimov",
      role: "Founder & CEO / Chief Travel Architect",
      bio: "12 yillik xalqaro sayyohlik tajribasiga ega ekspert. 45 dan ortiq mamlakatlarni shaxsan kashf etgan.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Madina Karimova",
      role: "Head of VIP Tours & Partnerships",
      bio: "Dunyoning yetakchi 5* mehmonxonalar tarmog'i bilan bevosita eksklyuziv hamkorlik shartnomalari mutaxassisi.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Sardor Yusupov",
      role: "Lead Travel Guide & Logistics Director",
      bio: "Yevropa va Osiyo bo'ylab minglab sayohatchilarga hamrohlik qilgan tajribali ekspeditsiya rahbari.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Dilnoza Rahimova",
      role: "Customer Experience & 24/7 Concierge Manager",
      bio: "Mijozlarning har qanday talab va rejasini 100% qulaylik bilan amalga oshiruvchi jamoa yetakchisi.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80"
    }
  ],

  // Fikrlar va sharhlar (Testimonials)
  testimonials: [
    {
      id: 1,
      name: "Akmal & Shahlo Zokirovlar",
      city: "Toshkent",
      trip: "Romantic Paris Escape",
      rating: 5,
      comment: "Parijga qilgan safarimiz shunchaki ertakdek o'tdi! Eyfel minorasi manzarasi, Luvrga navbatsiz chiptalar va xushmuomala gid biz uchun unutilmas xotiralarni yaratdi. Rahmat sizga!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Bobur Mirzayev",
      city: "Samarqand",
      trip: "Dubai Luxury Experience",
      rating: 5,
      comment: "Dubaydagi VIP sahro safari va Burj Xalifaga chiqish tashkiliy jihatdan a'lo darajada amalga oshirildi. Har bir daqiqada transfer tayyor kutib turdi. 100% tavsiya qilaman!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Nargiza Usmonova",
      city: "Farg'ona",
      trip: "Bali Tropical Escape",
      rating: 5,
      comment: "Balidagi shaxsiy villa va Ubud o'rmonlaridagi hordiq ruhiy jihatdan juda katta quvvat berdi. Byudjet kalkulyatorida hisoblagan xarajatlarim deyarli 98% aniqlik bilan to'g'ri chiqdi!",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  ],

  // Ko'p beriladigan savollar (FAQ)
  faqs: [
    {
      q: "Sayohat paketlariga viza to'lovlari va hujjat tayyorlash kiradimi?",
      a: "Ha, biz barcha yo'nalishlar (Shengen, Yaponiya, BAA, Buyuk Britaniya va boshqalar) bo'yicha to'liq viza maslahati, anketalarni to'ldirish, elchixonaga yozilish va barcha bron hujjatlarini professional tarzda taqdim etamiz."
    },
    {
      q: "Parvoz sanalarini yoki mehmonxonani o'zgartirish mumkinmi?",
      a: "Albatta! Bizning sayohat platformamiz to'liq moslashuvchan (customizable). Siz kunlar sonini ko'paytirishingiz, o'zingiz yoqtirgan aviakompaniya yoki muayyan mehmonxonani tanlashingiz mumkin."
    },
    {
      q: "To'lovlar qanday shaklda amalga oshiriladi?",
      a: "To'lovlarni xalqaro bank kartalari (Visa, MasterCard), Uzcard, Humo hamda bank o'tkazmalari orqali xavfsiz amalga oshirish mumkin. Shuningdek, 30% boshlang'ich to'lov qilib, qolgan qismini sayohatgacha bo'lib to'lash imkoniyati ham mavjud."
    },
    {
      q: "Sayohat sug'urtasi beriladimi?",
      a: "Barcha xalqaro sayohat paketlarimiz 24/7 xalqaro tibbiy va favqulodda yordamni o'z ichiga olgan rasmiy sug'urta polisi bilan to'liq ta'minlanadi."
    },
    {
      q: "Sayohat davomida muammo yuzaga kelsa kimga murojaat qilamiz?",
      a: "Har bir sayohatchimizga shaxsiy konsyerj-menedjer biriktiriladi. U 24 soat davomida Telegram, WhatsApp va telefon orqali aloqada bo'ladi."
    }
  ]
};

// Global doirada saqlash
window.TRAVEL_DATA = TRAVEL_DATA;


// ==========================================
// 2. SEVIMLILAR TIZIMI (FAVORITES SYSTEM)
// ==========================================

const FAVORITES_STORAGE_KEY = "travel_favorites_v1";

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Favorites o'qishda xato:", e);
    return [];
  }
}

function isFavorite(id, type) {
  const list = getFavorites();
  return list.some(item => item.id == id && item.type == type);
}

function toggleFavorite(item) {
  let list = getFavorites();
  const index = list.findIndex(fav => fav.id == item.id && fav.type == item.type);
  let added = false;

  if (index >= 0) {
    list.splice(index, 1);
    added = false;
  } else {
    list.push({
      id: item.id,
      type: item.type, // 'destination', 'package', 'hotel'
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      price: item.price,
      rating: item.rating,
      addedAt: new Date().toISOString()
    });
    added = true;
  }

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Favorites saqlashda xato:", e);
  }

  updateFavoriteBadges();
  return added;
}

function updateFavoriteBadges() {
  const count = getFavorites().length;
  const badges = document.querySelectorAll(".favorites-badge-count");
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });

  // Agar barcha yurakcha tugmalari mavjud bo'lsa yangilash
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    const id = btn.getAttribute("data-id");
    const type = btn.getAttribute("data-type");
    if (id && type) {
      if (isFavorite(id, type)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Sevimlilardan o'chirish");
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Sevimlilarga qo'shish");
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      }
    }
  });
}


// ==========================================
// 3. TOAST BILDIRISHNOMALAR (TOAST NOTIFICATIONS)
// ==========================================

function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">${message}</div>
    <button class="toast-close" aria-label="Yopish">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  const removeToast = () => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  };

  toast.querySelector(".toast-close").addEventListener("click", removeToast);
  setTimeout(removeToast, duration);
}


// ==========================================
// 4. MODAL OYNALAR (MODALS)
// ==========================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}


// ==========================================
// 5. SEVIMLILAR DRAWER (DRAWER MODAL)
// ==========================================

function openFavoritesDrawer() {
  let drawer = document.getElementById("favorites-drawer");
  if (!drawer) {
    drawer = document.createElement("div");
    drawer.id = "favorites-drawer";
    drawer.className = "favorites-drawer-overlay";
    drawer.innerHTML = `
      <div class="favorites-drawer-panel">
        <div class="favorites-drawer-header">
          <div class="favorites-drawer-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <h3>Saqlangan Sevimlilar (<span class="fav-modal-count">0</span>)</h3>
          </div>
          <button class="drawer-close-btn" id="close-fav-drawer" aria-label="Yopish">&times;</button>
        </div>
        <div class="favorites-drawer-body" id="favorites-list-container">
          <!-- Dinamik kontent -->
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    drawer.addEventListener("click", (e) => {
      if (e.target === drawer || e.target.id === "close-fav-drawer") {
        drawer.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  renderFavoritesDrawerContent();
  drawer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderFavoritesDrawerContent() {
  const list = getFavorites();
  const countEl = document.querySelector(".fav-modal-count");
  if (countEl) countEl.textContent = list.length;

  const container = document.getElementById("favorites-list-container");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="favorites-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <p>Hozircha hech qanday sevimli manzil yoki tur saqlanmagan.</p>
        <span class="subtext">Yoqqan kartalardagi yurakcha tugmasini bosing!</span>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="fav-item-card">
      <img src="${item.image}" alt="${item.title}" class="fav-item-thumb">
      <div class="fav-item-info">
        <span class="fav-item-type">${item.type.toUpperCase()}</span>
        <h4 class="fav-item-title">${item.title}</h4>
        <p class="fav-item-sub">${item.subtitle || ''}</p>
        <div class="fav-item-meta">
          <span class="fav-item-price">$${item.price}</span>
          <span class="fav-item-rating">★ ${item.rating}</span>
        </div>
      </div>
      <button class="fav-item-remove" data-id="${item.id}" data-type="${item.type}" title="O'chirish">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  `).join("");

  // O'chirish hodisasi
  container.querySelectorAll(".fav-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const type = btn.getAttribute("data-type");
      toggleFavorite({ id, type });
      renderFavoritesDrawerContent();
      showToast("Sevimli element o'chirildi", "info");
    });
  });
}

// Global eksport
window.getFavorites = getFavorites;
window.isFavorite = isFavorite;
window.toggleFavorite = toggleFavorite;
window.updateFavoriteBadges = updateFavoriteBadges;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.openFavoritesDrawer = openFavoritesDrawer;
