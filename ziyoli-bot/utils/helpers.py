"""
Ziyoli Bot - Yordamchi funksiyalar va konstantalar.
"""

import html

# Fanlar xaritasi
SUBJECTS_MAP = {
    "english": {
        "title": "Ingliz tili",
        "emoji": "🇬🇧",
        "file": "english.json",
        "topics": [
            "Articles",
            "Prepositions",
            "Tenses",
            "Modal Verbs",
            "Conditionals",
            "Vocabulary",
            "Grammar",
            "Reading",
        ],
    },
    "russian": {
        "title": "Rus tili",
        "emoji": "🇷🇺",
        "file": "russian.json",
        "topics": [
            "Падежи (Kelishiklar)",
            "Глаголы движения (Harakat fe'llari)",
            "Виды глагола (Fe'l turlari)",
            "Лексика и синонимы",
            "Орфография (Imlo)",
            "Синтаксис (Sintaksis)",
        ],
    },
    "native_language": {
        "title": "Ona tili",
        "emoji": "📘",
        "file": "native_language.json",
        "topics": [
            "Fonetika va orfoepiya",
            "Imlo qoidalari",
            "Leksikologiya",
            "So'z turkumlari",
            "Morfologiya",
            "Sintaksis",
            "Tinish belgilari",
            "Uslubiyat",
        ],
    },
    "mathematics": {
        "title": "Matematika",
        "emoji": "➗",
        "file": "mathematics.json",
        "topics": [
            "Arifmetika",
            "Kasrlar va foizlar",
            "Algebra",
            "Tenglamalar",
            "Darajalar va ildizlar",
            "Geometriya",
            "Funksiyalar",
            "Ehtimollar nazariyasi",
            "Mantiqiy matematika",
        ],
    },
    "biology": {
        "title": "Biologiya",
        "emoji": "🧬",
        "file": "biology.json",
        "topics": [
            "Hujayra va uning tuzilishi",
            "Botanika",
            "Zoologiya",
            "Odam anatomiyasi va fiziologiyasi",
            "Genetika",
            "Ekologiya",
            "Evolyutsiya",
            "Biologik atamalar",
        ],
    },
    "law": {
        "title": "Huquq",
        "emoji": "⚖️",
        "file": "law.json",
        "topics": [
            "Konstitutsiya",
            "Inson huquqlari",
            "Fuqarolik huquqi asoslari",
            "Mehnat huquqi asoslari",
            "Oila huquqi asoslari",
            "Davlat va huquq nazariyasi",
            "Huquqiy vaziyatlar",
        ],
    },
    "logic": {
        "title": "Mantiqiy fikrlash",
        "emoji": "🧠",
        "file": "logic.json",
        "topics": [
            "Sonlar ketma-ketligi",
            "Ortiqcha elementni topish",
            "Mantiqiy jumboqlar",
            "Matematik topishmoqlar",
            "Vaziyatli masalalar",
            "So'zlar bilan bog'liq mantiq",
        ],
    },
}

DIFFICULTIES_MAP = {
    "all": "Barchasi",
    "easy": "Oson 🟢",
    "medium": "O'rta 🟡",
    "hard": "Qiyin 🔴",
}


def escape_html(text: str | None) -> str:
    """HTML maxsus belgilarini xavfsiz qilish."""
    if not text:
        return ""
    return html.escape(str(text))


def format_duration(seconds: int) -> str:
    """Soniyani o'qilishi qulay daqiqa va soniya formatiga o'tkazish."""
    if seconds < 0:
        seconds = 0
    minutes = seconds // 60
    sec = seconds % 60
    if minutes > 0:
        return f"{minutes} daq. {sec} soniya"
    return f"{sec} soniya"


def generate_progress_bar(percentage: float, total_blocks: int = 10) -> str:
    """Foiz ko'rinishida grafik progress panelini yasash."""
    filled = int(round((percentage / 100.0) * total_blocks))
    filled = min(max(filled, 0), total_blocks)
    empty = total_blocks - filled
    return f"[{'🟩' * filled}{'⬜' * empty}] {percentage:.1f}%"


def get_subject_title(subject_code: str) -> str:
    """Fan kodi bo'yicha chiroyli nomini olish."""
    subj = SUBJECTS_MAP.get(subject_code)
    if subj:
        return f"{subj['emoji']} {subj['title']}"
    return subject_code.capitalize()


def get_subject_emoji(subject_code: str) -> str:
    """Fan kodi bo'yicha emojini olish."""
    subj = SUBJECTS_MAP.get(subject_code)
    if subj:
        return subj["emoji"]
    return "📘"
