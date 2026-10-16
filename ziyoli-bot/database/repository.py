"""
Ziyoli Bot - Ma'lumotlar bazasi repository moduli.
Barcha DB so'rovlari va manipulyatsiyalari shu yerda to'plangan.
"""

import json
from datetime import date, timedelta
from typing import Sequence
from sqlalchemy import select, func, desc, delete
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import User, UserWord, TestResult, FavoriteQuestion, CustomQuestion


# ============================================================
# FOYDALANUVCHILAR REPOSITORYSI
# ============================================================

async def get_or_create_user(
    session: AsyncSession,
    user_id: int,
    username: str | None = None,
    full_name: str | None = None,
) -> tuple[User, bool]:
    """Foydalanuvchini olish yoki yangisini yaratish. Streakni ham yangilaydi."""
    stmt = select(User).where(User.user_id == user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()

    today = date.today()
    created = False

    if user is None:
        user = User(
            user_id=user_id,
            username=username,
            full_name=full_name,
            xp_points=10,  # Xush kelibsiz bonusi
            streak_days=1,
            last_active_date=today,
        )
        session.add(user)
        created = True
    else:
        # Foydalanuvchi ma'lumotlarini yangilash
        if username and user.username != username:
            user.username = username
        if full_name and user.full_name != full_name:
            user.full_name = full_name

        # Kunlik streak tekshiruvi
        if user.last_active_date:
            yesterday = today - timedelta(days=1)
            if user.last_active_date == yesterday:
                user.streak_days += 1
                user.xp_points += 5  # Streak bonusi
                user.last_active_date = today
            elif user.last_active_date < yesterday:
                user.streak_days = 1
                user.last_active_date = today
            # Bugun allaqachon kirgan bo'lsa streak o'zgarmaydi
        else:
            user.last_active_date = today

    await session.flush()
    return user, created


async def add_user_xp(session: AsyncSession, user_id: int, points: int) -> int:
    """Foydalanuvchiga XP ballarini qo'shish."""
    stmt = select(User).where(User.user_id == user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if user:
        user.xp_points += max(0, points)
        await session.flush()
        return user.xp_points
    return 0


async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    """ID bo'yicha foydalanuvchini topish."""
    stmt = select(User).where(User.user_id == user_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_leaderboard(session: AsyncSession, limit: int = 10) -> Sequence[User]:
    """Eng yuqori ball to'plagan foydalanuvchilar reytingi."""
    stmt = select(User).order_by(desc(User.xp_points)).limit(limit)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_total_users_count(session: AsyncSession) -> int:
    """Jami foydalanuvchilar soni."""
    stmt = select(func.count(User.user_id))
    result = await session.execute(stmt)
    return result.scalar_one() or 0


# ============================================================
# TEST NATIJALARI REPOSITORYSI
# ============================================================

async def save_test_result(
    session: AsyncSession,
    user_id: int,
    subject: str,
    topic: str,
    difficulty: str,
    total_questions: int,
    correct_answers: int,
    wrong_answers: int,
    score_percentage: float,
    duration_seconds: int,
    wrong_questions: list | None = None,
) -> TestResult:
    """Yangi test natijasini saqlash."""
    wrong_json = json.dumps(wrong_questions, ensure_ascii=False) if wrong_questions else None

    test_result = TestResult(
        user_id=user_id,
        subject=subject,
        topic=topic,
        difficulty=difficulty,
        total_questions=total_questions,
        correct_answers=correct_answers,
        wrong_answers=wrong_answers,
        score_percentage=round(score_percentage, 1),
        duration_seconds=duration_seconds,
        wrong_questions_json=wrong_json,
    )
    session.add(test_result)
    await session.flush()
    return test_result


async def get_user_test_stats(session: AsyncSession, user_id: int) -> dict:
    """Foydalanuvchining umumiy va fanlar bo'yicha test statistikasi."""
    # Jami testlar va umumiy to'g'ri/noto'g'ri javoblar
    stmt = select(
        func.count(TestResult.id).label("total_tests"),
        func.sum(TestResult.total_questions).label("total_questions"),
        func.sum(TestResult.correct_answers).label("total_correct"),
        func.sum(TestResult.wrong_answers).label("total_wrong"),
        func.avg(TestResult.score_percentage).label("avg_score"),
    ).where(TestResult.user_id == user_id)

    res = (await session.execute(stmt)).one()

    # Fanlar bo'yicha statistika
    subject_stmt = (
        select(
            TestResult.subject,
            func.count(TestResult.id).label("tests_count"),
            func.sum(TestResult.correct_answers).label("correct"),
            func.sum(TestResult.total_questions).label("total"),
        )
        .where(TestResult.user_id == user_id)
        .group_by(TestResult.subject)
    )
    subject_rows = (await session.execute(subject_stmt)).all()

    subject_stats = {}
    for row in subject_rows:
        subj = row.subject
        cnt = row.tests_count or 0
        corr = row.correct or 0
        tot = row.total or 1
        pct = round((corr / tot) * 100, 1) if tot > 0 else 0
        subject_stats[subj] = {
            "tests_count": cnt,
            "correct": corr,
            "total": tot,
            "percentage": pct,
        }

    return {
        "total_tests": res.total_tests or 0,
        "total_questions": res.total_questions or 0,
        "total_correct": res.total_correct or 0,
        "total_wrong": res.total_wrong or 0,
        "avg_score": round(res.avg_score or 0, 1),
        "by_subject": subject_stats,
    }


async def get_user_recent_tests(
    session: AsyncSession, user_id: int, limit: int = 5
) -> Sequence[TestResult]:
    """Foydalanuvchining oxirgi test natijalarini olish."""
    stmt = (
        select(TestResult)
        .where(TestResult.user_id == user_id)
        .order_by(desc(TestResult.created_at))
        .limit(limit)
    )
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_test_result_by_id(
    session: AsyncSession, result_id: int
) -> TestResult | None:
    """Natija ID bo'yicha test natijasini topish."""
    stmt = select(TestResult).where(TestResult.id == result_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_total_tests_count(session: AsyncSession) -> int:
    """Tizimdagi jami ishlangan testlar soni."""
    stmt = select(func.count(TestResult.id))
    result = await session.execute(stmt)
    return result.scalar_one() or 0


# ============================================================
# SHAXSIY LUG'AT REPOSITORYSI
# ============================================================

async def add_user_word(
    session: AsyncSession,
    user_id: int,
    word: str,
    translation: str,
    example: str | None = None,
) -> UserWord:
    """Foydalanuvchi lug'atiga yangi so'z qo'shish."""
    new_word = UserWord(
        user_id=user_id,
        word=word.strip(),
        translation=translation.strip(),
        example=example.strip() if example else None,
    )
    session.add(new_word)
    await session.flush()
    return new_word


async def get_user_words(
    session: AsyncSession,
    user_id: int,
    limit: int = 20,
    offset: int = 0,
    search_query: str | None = None,
    favorite_only: bool = False,
) -> Sequence[UserWord]:
    """Foydalanuvchining so'zlarini qidirish/ko'rish."""
    stmt = select(UserWord).where(UserWord.user_id == user_id)

    if favorite_only:
        stmt = stmt.where(UserWord.is_favorite.is_(True))

    if search_query:
        search_pattern = f"%{search_query.strip().lower()}%"
        stmt = stmt.where(
            func.lower(UserWord.word).like(search_pattern)
            | func.lower(UserWord.translation).like(search_pattern)
        )

    stmt = stmt.order_by(desc(UserWord.created_at)).limit(limit).offset(offset)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_user_words_count(
    session: AsyncSession, user_id: int, favorite_only: bool = False
) -> int:
    """Foydalanuvchi lug'atidagi so'zlar soni."""
    stmt = select(func.count(UserWord.id)).where(UserWord.user_id == user_id)
    if favorite_only:
        stmt = stmt.where(UserWord.is_favorite.is_(True))
    result = await session.execute(stmt)
    return result.scalar_one() or 0


async def delete_user_word(session: AsyncSession, user_id: int, word_id: int) -> bool:
    """So'zni o'chirish."""
    stmt = delete(UserWord).where(UserWord.id == word_id, UserWord.user_id == user_id)
    result = await session.execute(stmt)
    return result.rowcount > 0


async def toggle_word_favorite(
    session: AsyncSession, user_id: int, word_id: int
) -> bool | None:
    """So'zning sevimlilik holatini o'zgartirish."""
    stmt = select(UserWord).where(UserWord.id == word_id, UserWord.user_id == user_id)
    result = await session.execute(stmt)
    word = result.scalar_one_or_none()
    if word:
        word.is_favorite = not word.is_favorite
        await session.flush()
        return word.is_favorite
    return None


async def get_random_words_for_quiz(
    session: AsyncSession, user_id: int, count: int = 5
) -> Sequence[UserWord]:
    """Lug'at bo'yicha viktorina uchun tasodifiy so'zlarni tanlash."""
    stmt = (
        select(UserWord)
        .where(UserWord.user_id == user_id)
        .order_by(func.random())
        .limit(count)
    )
    result = await session.execute(stmt)
    return result.scalars().all()


# ============================================================
# SEVIMLI SAVOLLAR REPOSITORYSI
# ============================================================

async def add_favorite_question(
    session: AsyncSession,
    user_id: int,
    question_id: str,
    subject: str,
    question_text: str,
    explanation: str | None = None,
) -> FavoriteQuestion:
    """Savolni sevimlilarga qo'shish."""
    # Mavjudligini tekshirish
    stmt = select(FavoriteQuestion).where(
        FavoriteQuestion.user_id == user_id,
        FavoriteQuestion.question_id == question_id,
    )
    existing = (await session.execute(stmt)).scalar_one_or_none()
    if existing:
        return existing

    fav = FavoriteQuestion(
        user_id=user_id,
        question_id=question_id,
        subject=subject,
        question_text=question_text,
        explanation=explanation,
    )
    session.add(fav)
    await session.flush()
    return fav


async def remove_favorite_question(
    session: AsyncSession, user_id: int, question_id: str
) -> bool:
    """Savolni sevimlilardan o'chirish."""
    stmt = delete(FavoriteQuestion).where(
        FavoriteQuestion.user_id == user_id,
        FavoriteQuestion.question_id == question_id,
    )
    result = await session.execute(stmt)
    return result.rowcount > 0


async def is_question_favorited(
    session: AsyncSession, user_id: int, question_id: str
) -> bool:
    """Savol sevimlilarga qo'shilganligini tekshirish."""
    stmt = select(FavoriteQuestion.id).where(
        FavoriteQuestion.user_id == user_id,
        FavoriteQuestion.question_id == question_id,
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none() is not None


async def get_favorite_questions(
    session: AsyncSession, user_id: int, limit: int = 20
) -> Sequence[FavoriteQuestion]:
    """Foydalanuvchining barcha sevimli savollarini olish."""
    stmt = (
        select(FavoriteQuestion)
        .where(FavoriteQuestion.user_id == user_id)
        .order_by(desc(FavoriteQuestion.created_at))
        .limit(limit)
    )
    result = await session.execute(stmt)
    return result.scalars().all()


# ============================================================
# MAXSUS SAVOLLAR (ADMIN) REPOSITORYSI
# ============================================================

async def add_custom_question(
    session: AsyncSession,
    subject: str,
    topic: str,
    difficulty: str,
    question: str,
    options: list[str],
    correct_answer: int,
    explanation: str | None = None,
) -> CustomQuestion:
    """Admin tomonidan yangi savol kiritish."""
    cq = CustomQuestion(
        subject=subject,
        topic=topic,
        difficulty=difficulty,
        question=question,
        options_json=json.dumps(options, ensure_ascii=False),
        correct_answer=correct_answer,
        explanation=explanation,
    )
    session.add(cq)
    await session.flush()
    return cq


async def get_custom_questions(
    session: AsyncSession, subject: str | None = None
) -> Sequence[CustomQuestion]:
    """Maxsus savollarni olish."""
    stmt = select(CustomQuestion)
    if subject:
        stmt = stmt.where(CustomQuestion.subject == subject)
    stmt = stmt.order_by(desc(CustomQuestion.created_at))
    result = await session.execute(stmt)
    return result.scalars().all()
