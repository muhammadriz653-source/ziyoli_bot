"""
Ziyoli Bot - Statistika, yutuqlar (badges) va anti-cheat xizmati.
"""

from typing import Any


class StatisticsService:
    """Foydalanuvchi yutuqlari va reyting ballarini hisoblash."""

    @staticmethod
    def calculate_xp_reward(
        total_questions: int,
        correct_answers: int,
        duration_seconds: int,
    ) -> tuple[int, str]:
        """
        Test natijasi bo'yicha XP ballini hisoblash va anti-cheat tekshiruvi.
        Qaytaradi: (berilgan_xp, xabar)
        """
        if total_questions <= 0:
            return 0, "Savollar soni nolga teng."

        percentage = (correct_answers / total_questions) * 100.0

        # Anti-cheat tekshiruvi:
        # Har bir savolga o'rtacha 0.8 soniyadan kam vaqt sarflangan bo'lsa (bunday tez o'qib bo'lmaydi)
        min_allowed_duration = total_questions * 0.8
        if total_questions >= 5 and duration_seconds < min_allowed_duration:
            penalty_xp = 2
            return (
                penalty_xp,
                "⚠️ Test juda shoshilib (insoniy o'qish tezligidan tez) topshirildi. "
                "Halol reyting qoidasiga ko'ra minimal rag'bat berildi (+2 XP).",
            )

        # Standart XP taqsimoti
        base_xp = correct_answers * 3

        bonus_xp = 0
        if percentage == 100.0:
            bonus_xp = 25  # Mukammal natija bonusi
            msg = f"🏆 Mukammal natija (100%)! Sizga {base_xp + bonus_xp} XP berildi!"
        elif percentage >= 80.0:
            bonus_xp = 15
            msg = f"🌟 A'lo natija! Sizga {base_xp + bonus_xp} XP berildi!"
        elif percentage >= 60.0:
            bonus_xp = 5
            msg = f"👍 Yaxshi natija! Sizga {base_xp + bonus_xp} XP berildi!"
        else:
            msg = f"📚 Test yakunlandi. Harakat qilganingiz uchun {base_xp} XP berildi!"

        total_xp = base_xp + bonus_xp
        return total_xp, msg

    @staticmethod
    def get_user_badges(
        total_tests: int,
        xp_points: int,
        words_count: int,
        streak_days: int,
        best_score: float,
    ) -> list[dict[str, Any]]:
        """Foydalanuvchi qo'lga kiritgan va kelgusidagi yutuqlar ro'yxati."""
        all_badges = [
            {
                "id": "first_step",
                "title": "Boshlang'ich qadam",
                "emoji": "🌱",
                "desc": "Ilk testni muvaffaqiyatli topshirish",
                "unlocked": total_tests >= 1,
            },
            {
                "id": "quiz_fan",
                "title": "Bilim izlovchi",
                "emoji": "🥉",
                "desc": "10 ta test yakunlash",
                "unlocked": total_tests >= 10,
            },
            {
                "id": "quiz_master",
                "title": "Ziyoli talaba",
                "emoji": "🥈",
                "desc": "30 ta test yakunlash",
                "unlocked": total_tests >= 30,
            },
            {
                "id": "academic",
                "title": "Akademik ekspert",
                "emoji": "🥇",
                "desc": "50 ta test yakunlash",
                "unlocked": total_tests >= 50,
            },
            {
                "id": "perfectionist",
                "title": "Chaqmoq daho",
                "emoji": "⚡",
                "desc": "Kamida 1 marta testni 100% natija bilan tugatish",
                "unlocked": best_score >= 100.0,
            },
            {
                "id": "streak_3",
                "title": "Qat'iyatli o'quvchi",
                "emoji": "🔥",
                "desc": "Ketma-ket 3 kun botdan foydalanish",
                "unlocked": streak_days >= 3,
            },
            {
                "id": "streak_7",
                "title": "O'chmas iroda",
                "emoji": "🌟",
                "desc": "Ketma-ket 7 kun faollik ko'rsatish",
                "unlocked": streak_days >= 7,
            },
            {
                "id": "vocab_builder",
                "title": "Lug'at boyligi",
                "emoji": "📖",
                "desc": "Shaxsiy lug'atga 10 ta so'z qo'shish",
                "unlocked": words_count >= 10,
            },
            {
                "id": "xp_100",
                "title": "100 XP klubi",
                "emoji": "💎",
                "desc": "100 dan ortiq XP to'plash",
                "unlocked": xp_points >= 100,
            },
            {
                "id": "xp_500",
                "title": "Bilim xazinasi",
                "emoji": "👑",
                "desc": "500 dan ortiq XP to'plash",
                "unlocked": xp_points >= 500,
            },
        ]
        return all_badges


statistics_service = StatisticsService()
