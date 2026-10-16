"""
Ziyoli Bot - Testlar va viktorinalarni boshqarish xizmati.
"""

import json
import logging
import random
from pathlib import Path
from typing import Any
from config import DATA_DIR
from utils.helpers import SUBJECTS_MAP

logger = logging.getLogger(__name__)


class QuizService:
    """Savollar bazasini boshqarish va test sessiyalarini tuzish xizmati."""

    def __init__(self, data_dir: Path = DATA_DIR):
        self.data_dir = data_dir
        self._cache: dict[str, dict[str, Any]] = {}
        self.load_all_subjects()

    def load_all_subjects(self) -> None:
        """Barcha JSON savollar bazasini xotiraga yuklash."""
        for code, meta in SUBJECTS_MAP.items():
            file_path = self.data_dir / meta["file"]
            if file_path.exists():
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        self._cache[code] = data
                        logger.info(
                            f"Fan yuklandi: {code} ({len(data.get('questions', []))} ta savol)"
                        )
                except Exception as e:
                    logger.error(f"Fanni yuklashda xatolik ({code}): {e}")
                    self._cache[code] = {"questions": []}
            else:
                logger.warning(f"Fayl topilmadi: {file_path}")
                self._cache[code] = {"questions": []}

    def get_subject_data(self, subject: str) -> dict[str, Any]:
        """Fanga oid barcha ma'lumotlarni olish."""
        return self._cache.get(subject, {"questions": []})

    def get_topics_for_subject(self, subject: str) -> list[str]:
        """Fan bo'yicha mavjud mavzular ro'yxatini olish."""
        data = self.get_subject_data(subject)
        questions = data.get("questions", [])
        topics = []
        for q in questions:
            t = q.get("topic")
            if t and t not in topics:
                topics.append(t)
        return topics

    def get_questions(
        self,
        subject: str,
        topic: str | None = None,
        difficulty: str | None = None,
        count: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Belgilangan filtrlar bo'yicha savollarni tanlab olish.
        """
        data = self.get_subject_data(subject)
        questions = list(data.get("questions", []))

        # Mavzu bo'yicha filtrlash
        if topic and topic.lower() != "barchasi":
            questions = [
                q for q in questions if q.get("topic", "").lower() == topic.lower()
            ]

        # Qiyinlik darajasi bo'yicha filtrlash
        if difficulty and difficulty.lower() not in ("all", "barchasi"):
            questions = [
                q
                for q in questions
                if q.get("difficulty", "").lower() == difficulty.lower()
            ]

        if not questions:
            # Agar filtr bo'yicha topilmasa, o'sha fanning umumiy savollaridan olinadi
            questions = list(data.get("questions", []))

        # Savollarni aralashtirish
        random.shuffle(questions)

        # Kerakli miqdorda qirqish
        if count and count > 0:
            return questions[:count]
        return questions

    def get_question_by_id(self, subject: str, question_id: str) -> dict[str, Any] | None:
        """ID bo'yicha aniq savolni topish."""
        data = self.get_subject_data(subject)
        for q in data.get("questions", []):
            if str(q.get("id")) == str(question_id):
                return q
        return None

    def get_word_of_the_day(self) -> dict[str, str]:
        """Ingliz tili bo'limidan 'Kun so'zi'ni olish."""
        en_data = self.get_subject_data("english")
        words = en_data.get("words_of_the_day", [])
        if words:
            # Har kuni o'zgarmas yoki tasodifiy tanlash
            from datetime import date

            idx = date.today().toordinal() % len(words)
            return words[idx]
        return {
            "word": "Wisdom",
            "pronunciation": "[ˈwɪzdəm]",
            "translation": "Hikmat, donolik",
            "example": "Knowledge speaks, but wisdom listens.",
        }


# Global xizmat nusxasi
quiz_service = QuizService()
