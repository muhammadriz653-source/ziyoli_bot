"""
Ziyoli Bot - Test savollari va quiz xizmatini tekshirish uchun unit testlar.
"""

import pytest
from services.quiz_service import QuizService
from utils.helpers import SUBJECTS_MAP
from config import DATA_DIR


@pytest.fixture
def quiz_svc():
    """QuizService nusxasini tayyorlash."""
    return QuizService(data_dir=DATA_DIR)


def test_all_subject_files_loaded(quiz_svc):
    """Barcha fanlar fayllari to'liq yuklanganini tekshirish."""
    for code in SUBJECTS_MAP.keys():
        data = quiz_svc.get_subject_data(code)
        assert data is not None, f"Fan ma'lumoti topilmadi: {code}"
        questions = data.get("questions", [])
        assert len(questions) >= 20, (
            f"Fan {code} uchun kamida 20 ta savol bo'lishi kerak, lekin {len(questions)} ta topildi."
        )


def test_question_schema_integrity(quiz_svc):
    """Har bir savolning maydonlari va to'g'ri javob indeksi butunligini tekshirish."""
    required_keys = {"id", "subject", "topic", "difficulty", "question", "options", "correct_answer", "explanation"}

    for code in SUBJECTS_MAP.keys():
        data = quiz_svc.get_subject_data(code)
        questions = data.get("questions", [])
        seen_ids = set()

        for q in questions:
            # Barcha majburiy kalitlar mavjudligi
            for key in required_keys:
                assert key in q, f"Savolda '{key}' maydoni yetishmaydi: {q}"

            # Takrorlanmas ID
            qid = q["id"]
            assert qid not in seen_ids, f"Takrorlangan savol ID si topildi: {qid}"
            seen_ids.add(qid)

            # Variantlar ro'yxati kamida 2 ta bo'lishi
            opts = q["options"]
            assert isinstance(opts, list) and len(opts) >= 2, f"Variantlar ro'yxati noto'g'ri: {q}"

            # To'g'ri javob indeksi variantlar chegarasida ekanligi
            corr = q["correct_answer"]
            assert isinstance(corr, int), f"To'g'ri javob indeksi butun son bo'lishi kerak: {corr} in {q}"
            assert 0 <= corr < len(opts), (
                f"To'g'ri javob indeksi ({corr}) variantlar chegarasidan ({len(opts)}) tashqarida: {q}"
            )

            # Izoh bo'sh emasligi
            assert len(q["explanation"].strip()) > 0, f"Savol izohi bo'sh: {qid}"


def test_quiz_service_filtering(quiz_svc):
    """Mavzu va qiyinlik bo'yicha filtrlashni tekshirish."""
    # Matematika oson darajadagi savollarni olish
    math_easy = quiz_svc.get_questions(subject="mathematics", difficulty="easy", count=5)
    assert len(math_easy) > 0
    assert len(math_easy) <= 5
    for q in math_easy:
        assert q["difficulty"] == "easy"

    # Ingliz tili Articles mavzusi
    en_articles = quiz_svc.get_questions(subject="english", topic="Articles", count=10)
    assert len(en_articles) > 0
    for q in en_articles:
        assert q["topic"] == "Articles"


def test_word_of_the_day(quiz_svc):
    """Kun so'zi to'g'ri qaytishini tekshirish."""
    wotd = quiz_svc.get_word_of_the_day()
    assert "word" in wotd
    assert "translation" in wotd
    assert "pronunciation" in wotd
    assert "example" in wotd
    assert len(wotd["word"]) > 0
