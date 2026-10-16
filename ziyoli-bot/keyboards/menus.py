"""
Ziyoli Bot - Klaviaturasi va menyulari (aiogram 3).
"""

from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
)
from utils.helpers import SUBJECTS_MAP, DIFFICULTIES_MAP
from services.translation_service import TRANSLATION_PAIRS


# ============================================================
# ASOSIY MENYU (REPLY KEYBOARD)
# ============================================================

def main_menu_keyboard() -> ReplyKeyboardMarkup:
    """Asosiy menyu klaviaturasi."""
    kb = [
        [KeyboardButton(text="📚 Fanlar"), KeyboardButton(text="📝 Test ishlash")],
        [KeyboardButton(text="🌐 Tarjimon"), KeyboardButton(text="📖 Lug‘at")],
        [KeyboardButton(text="🧠 Mantiqiy fikrlash"), KeyboardButton(text="📊 Mening natijalarim")],
        [KeyboardButton(text="⭐ Sevimlilar"), KeyboardButton(text="⚙️ Sozlamalar")],
        [KeyboardButton(text="ℹ️ Bot haqida")],
    ]
    return ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True)


def back_to_main_keyboard() -> ReplyKeyboardMarkup:
    """Faqat asosiy menyuga qaytish tugmasi."""
    kb = [[KeyboardButton(text="🏠 Bosh menyu")]]
    return ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True)


# ============================================================
# FANLAR MENYUSI (INLINE)
# ============================================================

def subjects_keyboard(action_prefix: str = "subj") -> InlineKeyboardMarkup:
    """Oltita fan ro'yxati inline ko'rinishda."""
    inline_kb = []
    keys = list(SUBJECTS_MAP.keys())
    # 2 qatordan chiqarish (oxirgi logic fani alohida menyuda bo'lgani uchun 6 ta asosiy fan)
    core_keys = [k for k in keys if k != "logic"]

    for i in range(0, len(core_keys), 2):
        row = []
        for k in core_keys[i : i + 2]:
            info = SUBJECTS_MAP[k]
            row.append(
                InlineKeyboardButton(
                    text=f"{info['emoji']} {info['title']}",
                    callback_data=f"{action_prefix}:{k}",
                )
            )
        inline_kb.append(row)

    inline_kb.append([InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")])
    return InlineKeyboardMarkup(inline_keyboard=inline_kb)


def subject_actions_keyboard(subject_code: str) -> InlineKeyboardMarkup:
    """Muayyan fan ichidagi harakatlar."""
    buttons = [
        [
            InlineKeyboardButton(
                text="⚡ Tezkor test (10 ta savol)",
                callback_data=f"start_quiz:{subject_code}:all:all:10",
            )
        ],
        [
            InlineKeyboardButton(
                text="📑 Mavzuni tanlash",
                callback_data=f"select_topic:{subject_code}",
            ),
            InlineKeyboardButton(
                text="🎯 Darajani tanlash",
                callback_data=f"select_diff:{subject_code}",
            ),
        ],
    ]

    # Ingliz tili uchun qo'shimcha "Kun so'zi"
    if subject_code == "english":
        buttons.append(
            [
                InlineKeyboardButton(
                    text="🌟 Kun so'zi (Word of the Day)",
                    callback_data="word_of_the_day",
                )
            ]
        )

    buttons.append(
        [
            InlineKeyboardButton(text="🔙 Fanlar ro'yxati", callback_data="back_to_subjects"),
            InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu"),
        ]
    )
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def subject_topics_keyboard(subject_code: str, topics: list[str]) -> InlineKeyboardMarkup:
    """Fan mavzularini tanlash klaviaturasi."""
    kb = []
    # Barchasi tugmasi
    kb.append([
        InlineKeyboardButton(
            text="🌐 Barcha mavzular",
            callback_data=f"topic_chosen:{subject_code}:all",
        )
    ])

    for topic in topics:
        kb.append([
            InlineKeyboardButton(
                text=f"📌 {topic}",
                callback_data=f"topic_chosen:{subject_code}:{topic[:30]}",
            )
        ])

    kb.append([
        InlineKeyboardButton(
            text="🔙 Orqaga",
            callback_data=f"subj:{subject_code}",
        )
    ])
    return InlineKeyboardMarkup(inline_keyboard=kb)


# ============================================================
# TEST PARAMETRLARI MENYUSI
# ============================================================

def test_difficulty_keyboard(subject_code: str, topic: str = "all") -> InlineKeyboardMarkup:
    """Qiyinlik darajasini tanlash."""
    kb = [
        [
            InlineKeyboardButton(
                text="🟢 Oson",
                callback_data=f"diff_chosen:{subject_code}:{topic}:easy",
            ),
            InlineKeyboardButton(
                text="🟡 O'rta",
                callback_data=f"diff_chosen:{subject_code}:{topic}:medium",
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔴 Qiyin",
                callback_data=f"diff_chosen:{subject_code}:{topic}:hard",
            ),
            InlineKeyboardButton(
                text="🎲 Barchasi (Aralash)",
                callback_data=f"diff_chosen:{subject_code}:{topic}:all",
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔙 Orqaga",
                callback_data=f"subj:{subject_code}",
            )
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


def test_count_keyboard(
    subject_code: str, topic: str = "all", difficulty: str = "all"
) -> InlineKeyboardMarkup:
    """Savollar sonini tanlash (10, 20 yoki 30 ta)."""
    kb = [
        [
            InlineKeyboardButton(
                text="10 ta savol",
                callback_data=f"start_quiz:{subject_code}:{topic}:{difficulty}:10",
            ),
            InlineKeyboardButton(
                text="20 ta savol",
                callback_data=f"start_quiz:{subject_code}:{topic}:{difficulty}:20",
            ),
        ],
        [
            InlineKeyboardButton(
                text="30 ta savol",
                callback_data=f"start_quiz:{subject_code}:{topic}:{difficulty}:30",
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔙 Orqaga",
                callback_data=f"subj:{subject_code}",
            )
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


# ============================================================
# TEST JARAYONI VA NATIJA MENYUSI
# ============================================================

def quiz_options_keyboard(
    options: list[str],
    current_index: int,
    total_count: int,
    question_id: str,
    subject: str,
    is_favorited: bool = False,
) -> InlineKeyboardMarkup:
    """Savol variantlari tugmalari."""
    kb = []
    letters = ["A", "B", "C", "D", "E"]
    for idx, opt in enumerate(options):
        letter = letters[idx] if idx < len(letters) else f"{idx+1}"
        text = f"{letter}) {opt}"
        if len(text) > 40:
            text = f"{letter}) {opt[:37]}..."
        kb.append([
            InlineKeyboardButton(
                text=text,
                callback_data=f"ans:{idx}",
            )
        ])

    # Pastki boshqaruv tugmalari
    fav_text = "⭐ Sevimlilarda" if is_favorited else "☆ Sevimlilarga"
    fav_data = f"unfav:{question_id}" if is_favorited else f"fav:{subject}:{question_id}"

    kb.append([
        InlineKeyboardButton(text=fav_text, callback_data=fav_data),
        InlineKeyboardButton(text="❌ Testni tugatish", callback_data="stop_quiz"),
    ])
    return InlineKeyboardMarkup(inline_keyboard=kb)


def quiz_result_keyboard(
    result_id: int, subject: str, has_wrong: bool = False
) -> InlineKeyboardMarkup:
    """Test yakunida chiquvchi harakatlar klaviaturasi."""
    kb = []
    row1 = [
        InlineKeyboardButton(
            text="🔄 Qayta ishlash",
            callback_data=f"retry_quiz:{subject}",
        )
    ]
    if has_wrong:
        row1.append(
            InlineKeyboardButton(
                text="❌ Xatolarni ko'rish",
                callback_data=f"review_wrongs:{result_id}",
            )
        )
    kb.append(row1)

    kb.append([
        InlineKeyboardButton(
            text="📚 Boshqa fanni tanlash",
            callback_data="back_to_subjects",
        ),
        InlineKeyboardButton(
            text="🏠 Bosh menyu",
            callback_data="main_menu",
        ),
    ])
    return InlineKeyboardMarkup(inline_keyboard=kb)


# ============================================================
# TARJIMON MENYUSI
# ============================================================

def translator_pairs_keyboard() -> InlineKeyboardMarkup:
    """Tarjima yo'nalishlarini tanlash inline klaviaturasi."""
    kb = []
    for pair_key, info in TRANSLATION_PAIRS.items():
        kb.append([
            InlineKeyboardButton(
                text=info["name"],
                callback_data=f"set_trans:{pair_key}",
            )
        ])
    kb.append([InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")])
    return InlineKeyboardMarkup(inline_keyboard=kb)


def translator_actions_keyboard(current_pair: str) -> InlineKeyboardMarkup:
    """Tarjimadan keyin boshqa yo'nalish yoki tozalash."""
    kb = [
        [
            InlineKeyboardButton(
                text="🔄 Yo'nalishni o'zgartirish",
                callback_data="change_trans_pair",
            )
        ],
        [
            InlineKeyboardButton(
                text="🏠 Bosh menyu",
                callback_data="main_menu",
            )
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


# ============================================================
# LUG'AT MENYUSI
# ============================================================

def dictionary_menu_keyboard() -> InlineKeyboardMarkup:
    """Lug'at bo'limi boshqaruv paneli."""
    kb = [
        [
            InlineKeyboardButton(
                text="➕ Yangi so'z qo'shish",
                callback_data="dict_add_word",
            ),
            InlineKeyboardButton(
                text="📋 Lug'atimni ko'rish",
                callback_data="dict_list:0",
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔍 So'z qidirish",
                callback_data="dict_search",
            ),
            InlineKeyboardButton(
                text="🎯 So'z yodlash testi",
                callback_data="dict_quiz",
            ),
        ],
        [
            InlineKeyboardButton(
                text="⭐ Sevimli so'zlar",
                callback_data="dict_favorites:0",
            ),
            InlineKeyboardButton(
                text="🏠 Bosh menyu",
                callback_data="main_menu",
            ),
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


def dictionary_word_keyboard(
    word_id: int, is_favorite: bool = False
) -> InlineKeyboardMarkup:
    """Lug'atdagi aniq bir so'z amallari."""
    fav_icon = "⭐ Sevimlilardan chiqarish" if is_favorite else "☆ Sevimlilarga qo'shish"
    kb = [
        [
            InlineKeyboardButton(
                text=fav_icon,
                callback_data=f"dict_fav:{word_id}",
            ),
            InlineKeyboardButton(
                text="🗑 O'chirish",
                callback_data=f"dict_del:{word_id}",
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔙 Lug'atga qaytish",
                callback_data="dict_list:0",
            )
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


# ============================================================
# MANTIQIY FIKRLASH MENYUSI
# ============================================================

def logic_menu_keyboard() -> InlineKeyboardMarkup:
    """Mantiqiy fikrlash bo'limi menyusi."""
    kb = [
        [
            InlineKeyboardButton(
                text="🎲 Tasodifiy mantiqiy savol",
                callback_data="logic_random",
            )
        ],
        [
            InlineKeyboardButton(
                text="🔢 Sonlar ketma-ketligi",
                callback_data="logic_topic:Sonlar ketma-ketligi",
            ),
            InlineKeyboardButton(
                text="🧩 Mantiqiy jumboqlar",
                callback_data="logic_topic:Mantiqiy jumboqlar",
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔎 Ortiqcha element",
                callback_data="logic_topic:Ortiqcha elementni topish",
            ),
            InlineKeyboardButton(
                text="🧮 Matematik topishmoq",
                callback_data="logic_topic:Matematik topishmoqlar",
            ),
        ],
        [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


def logic_question_keyboard(
    question_id: str, has_revealed: bool = False
) -> InlineKeyboardMarkup:
    """Mantiqiy savol uchun tugmalar."""
    kb = []
    if not has_revealed:
        kb.append([
            InlineKeyboardButton(
                text="💡 Javob va izohni ko'rish",
                callback_data=f"logic_reveal:{question_id}",
            )
        ])
    kb.append([
        InlineKeyboardButton(
            text="➡️ Yangi savol olish",
            callback_data="logic_random",
        ),
        InlineKeyboardButton(
            text="🔙 Mantiq menyusi",
            callback_data="logic_menu",
        ),
    ])
    return InlineKeyboardMarkup(inline_keyboard=kb)


# ============================================================
# PROFIL VA ADMIN MENYUSI
# ============================================================

def profile_menu_keyboard() -> InlineKeyboardMarkup:
    """Foydalanuvchi profili va statistika inline menyusi."""
    kb = [
        [
            InlineKeyboardButton(
                text="🏆 Top 10 Reyting",
                callback_data="leaderboard",
            ),
            InlineKeyboardButton(
                text="🎖 Yutuqlarim (Badges)",
                callback_data="my_badges",
            ),
        ],
        [
            InlineKeyboardButton(
                text="📜 Oxirgi testlar tarixi",
                callback_data="test_history",
            ),
            InlineKeyboardButton(
                text="🏠 Bosh menyu",
                callback_data="main_menu",
            ),
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


def admin_menu_keyboard() -> InlineKeyboardMarkup:
    """Admin panel inline klaviaturasi."""
    kb = [
        [
            InlineKeyboardButton(
                text="📊 Tizim statistikasi",
                callback_data="admin_stats",
            ),
            InlineKeyboardButton(
                text="📢 E'lon yuborish",
                callback_data="admin_broadcast",
            ),
        ],
        [
            InlineKeyboardButton(
                text="📜 Xatolar logini ko'rish",
                callback_data="admin_logs",
            ),
            InlineKeyboardButton(
                text="🏠 Bosh menyu",
                callback_data="main_menu",
            ),
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)
