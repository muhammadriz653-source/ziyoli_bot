"""
Ziyoli Bot - Ma'lumotlar bazasi va repository operatsiyalarini tekshirish uchun testlar.
"""

import pytest
from database.db import init_db, get_session
from database.repository import (
    get_or_create_user,
    add_user_xp,
    save_test_result,
    get_user_test_stats,
    add_user_word,
    get_user_words,
    delete_user_word,
    toggle_word_favorite,
    add_favorite_question,
    get_favorite_questions,
    get_leaderboard,
)


@pytest.mark.asyncio
async def test_database_lifecycle():
    """DB yaratilishi, foydalanuvchi, test natijasi va lug'at amallarini tekshirish."""
    # 1. DB initsializatsiya
    await init_db()

    async with get_session() as session:
        # 2. Foydalanuvchi yaratish
        user_id = 999888777
        user, created = await get_or_create_user(
            session=session,
            user_id=user_id,
            username="test_learner",
            full_name="Test Foydalanuvchi",
        )
        assert user.user_id == user_id
        assert user.xp_points >= 10

        # 3. XP qo'shish
        new_xp = await add_user_xp(session, user_id, 25)
        assert new_xp >= 35

        # 4. Test natijasini saqlash
        test_res = await save_test_result(
            session=session,
            user_id=user_id,
            subject="english",
            topic="Tenses",
            difficulty="medium",
            total_questions=10,
            correct_answers=9,
            wrong_answers=1,
            score_percentage=90.0,
            duration_seconds=120,
            wrong_questions=[{"question": "Sample", "chosen": "A", "correct": "B"}],
        )
        assert test_res.id is not None
        assert test_res.score_percentage == 90.0

        # 5. Statistikani tekshirish
        stats = await get_user_test_stats(session, user_id)
        assert stats["total_tests"] >= 1
        assert "english" in stats["by_subject"]
        assert stats["by_subject"]["english"]["percentage"] == 90.0

        # 6. Lug'at amallari
        w = await add_user_word(
            session=session,
            user_id=user_id,
            word="Eloquent",
            translation="Fasohotli",
            example="An eloquent speech.",
        )
        assert w.id is not None
        assert w.word == "Eloquent"

        # So'zni sevimlilarga qo'shish
        fav_status = await toggle_word_favorite(session, user_id, w.id)
        assert fav_status is True

        words = await get_user_words(session, user_id, favorite_only=True)
        assert len(words) >= 1

        # So'zni o'chirish
        deleted = await delete_user_word(session, user_id, w.id)
        assert deleted is True

        # 7. Sevimli savol amallari
        fav_q = await add_favorite_question(
            session=session,
            user_id=user_id,
            question_id="en_01",
            subject="english",
            question_text="Sample question",
            explanation="Sample explanation",
        )
        assert fav_q.id is not None

        fav_list = await get_favorite_questions(session, user_id)
        assert any(fq.question_id == "en_01" for fq in fav_list)

        # 8. Leaderboard tekshiruvi
        leaders = await get_leaderboard(session, limit=5)
        assert len(leaders) >= 1
        assert any(u.user_id == user_id for u in leaders)
