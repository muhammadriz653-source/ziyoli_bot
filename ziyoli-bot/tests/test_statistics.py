"""
Ziyoli Bot - Statistika, anti-cheat va yutuqlar xizmatini tekshirish uchun unit testlar.
"""

from services.statistics_service import statistics_service
from utils.helpers import format_duration, generate_progress_bar


def test_calculate_xp_reward_perfect_score():
    """100% to'g'ri ishlangan test uchun XP va bonusni tekshirish."""
    xp, msg = statistics_service.calculate_xp_reward(
        total_questions=10,
        correct_answers=10,
        duration_seconds=60,  # 1 daqiqa
    )
    # base_xp = 10 * 3 = 30, bonus_xp = 25 -> jami 55 XP
    assert xp == 55
    assert "Mukammal natija" in msg


def test_calculate_xp_anti_cheat_triggered():
    """Anti-cheat tizimi: juda tez topshirilgan test uchun jarima XP si berilishi."""
    xp, msg = statistics_service.calculate_xp_reward(
        total_questions=10,
        correct_answers=10,
        duration_seconds=2,  # 10 ta savolga 2 soniya juda kam
    )
    assert xp == 2
    assert "shoshilib" in msg


def test_calculate_xp_partial_score():
    """Qisman to'g'ri ishlangan test XP si."""
    xp, msg = statistics_service.calculate_xp_reward(
        total_questions=10,
        correct_answers=8,  # 80%
        duration_seconds=45,
    )
    # base = 24, bonus = 15 -> 39 XP
    assert xp == 39
    assert "A'lo natija" in msg


def test_user_badges_unlock():
    """Ko'krak nishonlarining ochilish shartlarini tekshirish."""
    # Yangi boshlagan foydalanuvchi
    badges_new = statistics_service.get_user_badges(
        total_tests=0,
        xp_points=10,
        words_count=0,
        streak_days=1,
        best_score=0.0,
    )
    first_step = next(b for b in badges_new if b["id"] == "first_step")
    assert first_step["unlocked"] is False

    # 15 ta test ishlagan, 120 XP li, 10 ta so'z qo'shgan faol foydalanuvchi
    badges_active = statistics_service.get_user_badges(
        total_tests=15,
        xp_points=120,
        words_count=10,
        streak_days=3,
        best_score=100.0,
    )
    unlocked_ids = {b["id"] for b in badges_active if b["unlocked"]}
    assert "first_step" in unlocked_ids
    assert "quiz_fan" in unlocked_ids  # >= 10 ta test
    assert "perfectionist" in unlocked_ids  # 100% natija
    assert "streak_3" in unlocked_ids  # >= 3 kun
    assert "vocab_builder" in unlocked_ids  # >= 10 so'z
    assert "xp_100" in unlocked_ids  # >= 100 XP


def test_helpers_format_duration():
    """Vaqt formatlash funksiyasini tekshirish."""
    assert format_duration(30) == "30 soniya"
    assert format_duration(65) == "1 daq. 5 soniya"
    assert format_duration(120) == "2 daq. 0 soniya"


def test_helpers_progress_bar():
    """Progress bar formatlash funksiyasini tekshirish."""
    bar_50 = generate_progress_bar(50.0)
    assert "50.0%" in bar_50
    assert "🟩" in bar_50
    assert "⬜" in bar_50

    bar_100 = generate_progress_bar(100.0)
    assert "100.0%" in bar_100
    assert "⬜" not in bar_100
