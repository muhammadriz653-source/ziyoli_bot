"""
Ziyoli Bot - Foydalanuvchi profili, natijalar, yutuqlar va sevimlilar handleri.
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from utils.helpers import (
    escape_html,
    generate_progress_bar,
    get_subject_title,
    SUBJECTS_MAP,
)
from keyboards.menus import profile_menu_keyboard
from database.db import get_session
from database.repository import (
    get_user_by_id,
    get_user_test_stats,
    get_user_recent_tests,
    get_user_words_count,
    get_favorite_questions,
    remove_favorite_question,
    get_leaderboard,
)
from services.statistics_service import statistics_service

router = Router()


@router.message(F.text == "📊 Mening natijalarim")
async def show_user_profile(message: Message):
    """Foydalanuvchi profili va to'liq statistikasini ko'rsatish."""
    user_id = message.from_user.id

    async with get_session() as session:
        user = await get_user_by_id(session, user_id)
        stats = await get_user_test_stats(session, user_id)
        words_cnt = await get_user_words_count(session, user_id)

    if not user:
        await message.answer("Foydalanuvchi ma'lumotlari topilmadi. /start buyrug'ini yuboring.")
        return

    # Fanlar bo'yicha qisqa satrlar
    subjects_summary = ""
    for subj_code, meta in SUBJECTS_MAP.items():
        if subj_code == "logic":
            continue
        subj_stat = stats["by_subject"].get(subj_code)
        if subj_stat:
            subjects_summary += (
                f"• {meta['emoji']} <b>{meta['title']}:</b> {subj_stat['percentage']}% "
                f"({subj_stat['correct']}/{subj_stat['total']})\n"
            )
        else:
            subjects_summary += f"• {meta['emoji']} <b>{meta['title']}:</b> Hali test ishlanmagan\n"

    avg_bar = generate_progress_bar(stats["avg_score"])
    created_date = user.created_at.strftime("%d.%m.%Y") if user.created_at else "Bugun"

    profile_text = (
        f"📊 <b>FOYDALANUVCHI PROFILI VA STATISTIKASI</b>\n\n"
        f"👤 <b>Ism:</b> {escape_html(user.full_name)}\n"
        f"🆔 <b>ID:</b> <code>{user.user_id}</code>\n"
        f"📅 <b>A'zo bo'lgan sana:</b> {created_date}\n"
        f"💎 <b>To'plangan XP:</b> <b>{user.xp_points} XP</b>\n"
        f"🔥 <b>Ketma-ket faollik:</b> {user.streak_days} kun\n"
        f"📖 <b>Lug'atdagi so'zlar:</b> {words_cnt} ta\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"📝 <b>TESTLAR STATISTIKASI:</b>\n"
        f"• Ishlangan testlar: <b>{stats['total_tests']} ta</b>\n"
        f"• Jami savollar: <b>{stats['total_questions']} ta</b>\n"
        f"• To'g'ri javoblar: <b>{stats['total_correct']} ta</b>\n"
        f"• Noto'g'ri javoblar: <b>{stats['total_wrong']} ta</b>\n"
        f"• O'rtacha o'zlashtirish: {avg_bar}\n\n"
        f"📚 <b>FANLAR KESIMIDA:</b>\n"
        f"{subjects_summary}\n"
        f"<i>Batafsil ma'lumot olish uchun tugmalardan foydalaning:</i>"
    )

    await message.answer(text=profile_text, reply_markup=profile_menu_keyboard(), parse_mode="HTML")


@router.callback_query(F.data == "leaderboard")
async def show_leaderboard(call: CallbackQuery):
    """Top reyting jadvali."""
    async with get_session() as session:
        top_users = await get_leaderboard(session, limit=10)

    medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
    text = "🏆 <b>ZIYOLI BOT — TOP 10 REYTING JADVALI</b>\n\n"
    text += "<i>Eng ko'p XP to'plagan eng tirishqoq talabalar:</i>\n\n"

    for idx, u in enumerate(top_users):
        medal = medals[idx] if idx < len(medals) else f"{idx+1}."
        name = escape_html(u.full_name or u.username or "Foydalanuvchi")
        text += f"{medal} <b>{name}</b> — <b>{u.xp_points} XP</b> (🔥 {u.streak_days} kun)\n"

    text += "\n💡 <i>Har bir to'g'ri ishlangan test sizni reytingda yuqoriga ko'taradi!</i>"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔙 Profilga qaytish", callback_data="back_to_profile")],
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")],
        ]
    )

    await call.message.edit_text(text=text, reply_markup=kb, parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data == "my_badges")
async def show_badges(call: CallbackQuery):
    """Foydalanuvchining ko'krak nishonlari (yutuqlari)."""
    user_id = call.from_user.id
    async with get_session() as session:
        user = await get_user_by_id(session, user_id)
        stats = await get_user_test_stats(session, user_id)
        words_cnt = await get_user_words_count(session, user_id)

    if not user:
        await call.answer("Foydalanuvchi topilmadi.", show_alert=True)
        return

    badges = statistics_service.get_user_badges(
        total_tests=stats["total_tests"],
        xp_points=user.xp_points,
        words_count=words_cnt,
        streak_days=user.streak_days,
        best_score=stats["avg_score"],
    )

    text = "🎖 <b>SIZNING YUTUQLARINGIZ VA KO'KRAK NISHONLARI:</b>\n\n"
    unlocked_count = 0

    for b in badges:
        if b["unlocked"]:
            unlocked_count += 1
            text += f"✅ {b['emoji']} <b>{b['title']}</b>\n   <i>{b['desc']}</i>\n\n"
        else:
            text += f"🔒 ⚪ <b>{b['title']}</b>\n   <i>Talab: {b['desc']}</i>\n\n"

    text += f"📊 <b>Ochilgan nishonlar:</b> {unlocked_count}/{len(badges)} ta\n"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔙 Profilga qaytish", callback_data="back_to_profile")],
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")],
        ]
    )

    await call.message.edit_text(text=text, reply_markup=kb, parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data == "test_history")
async def show_test_history(call: CallbackQuery):
    """Oxirgi testlar tarixi."""
    user_id = call.from_user.id
    async with get_session() as session:
        results = await get_user_recent_tests(session, user_id, limit=6)

    if not results:
        text = "📜 <b>Hali hech qanday test ishlanmagan.</b>"
    else:
        text = "📜 <b>OXIRGI ISHLANGAN TESTLAR TARIXI:</b>\n\n"
        for idx, r in enumerate(results, 1):
            date_str = r.created_at.strftime("%d.%m.%Y %H:%M") if r.created_at else ""
            subj_title = get_subject_title(r.subject)
            text += (
                f"<b>{idx}. {subj_title}</b> — <b>{r.score_percentage}%</b>\n"
                f"   Mavzu: {escape_html(r.topic)} ({escape_html(r.difficulty)})\n"
                f"   Natija: {r.correct_answers}/{r.total_questions} to'g'ri | ⏱ {r.duration_seconds} soniya\n"
                f"   Sana: {date_str}\n\n"
            )

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔙 Profilga qaytish", callback_data="back_to_profile")],
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")],
        ]
    )

    await call.message.edit_text(text=text, reply_markup=kb, parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data == "back_to_profile")
async def callback_back_to_profile(call: CallbackQuery):
    """Profilga qaytish."""
    # show_user_profile ga o'xshash qilib tahrirlaymiz
    user_id = call.from_user.id
    async with get_session() as session:
        user = await get_user_by_id(session, user_id)
        stats = await get_user_test_stats(session, user_id)
        words_cnt = await get_user_words_count(session, user_id)

    if not user:
        await call.answer()
        return

    avg_bar = generate_progress_bar(stats["avg_score"])
    created_date = user.created_at.strftime("%d.%m.%Y") if user.created_at else "Bugun"

    profile_text = (
        f"📊 <b>FOYDALANUVCHI PROFILI VA STATISTIKASI</b>\n\n"
        f"👤 <b>Ism:</b> {escape_html(user.full_name)}\n"
        f"💎 <b>XP:</b> <b>{user.xp_points} XP</b> | 🔥 <b>Faollik:</b> {user.streak_days} kun\n"
        f"📖 <b>Lug'at:</b> {words_cnt} ta so'z\n"
        f"📝 <b>Testlar soni:</b> {stats['total_tests']} ta\n"
        f"📈 <b>O'rtacha natija:</b> {avg_bar}\n"
    )

    await call.message.edit_text(text=profile_text, reply_markup=profile_menu_keyboard(), parse_mode="HTML")
    await call.answer()


# ============================================================
# SEVIMLI SAVOLLAR BO'LIMI
# ============================================================

@router.message(F.text == "⭐ Sevimlilar")
async def show_favorites_list(message: Message):
    """Saqlangan sevimli savollar ro'yxatini ko'rish."""
    user_id = message.from_user.id
    async with get_session() as session:
        favs = await get_favorite_questions(session, user_id, limit=10)

    if not favs:
        text = (
            "⭐ <b>SEVIMLILAR BO'LIMI BO'SH!</b>\n\n"
            "Test ishlayotgan vaqtingizda o'zingizga yoqqan yoki muhim deb hisoblagan "
            "savollarni <b>'☆ Sevimlilarga'</b> tugmasi orqali bu yerga saqlab qo'yishingiz mumkin."
        )
        await message.answer(text=text, parse_mode="HTML")
        return

    text = f"⭐ <b>SIZNING SEVIMLI SAVOLLARINGIZ ({len(favs)} ta):</b>\n\n"
    kb_rows = []

    for idx, fv in enumerate(favs, 1):
        subj_title = get_subject_title(fv.subject)
        text += (
            f"<b>{idx}. [{subj_title}]</b>\n"
            f"❓ {escape_html(fv.question_text)}\n"
        )
        if fv.explanation:
            text += f"💡 <i>{escape_html(fv.explanation)}</i>\n"
        text += "───────────────────\n"

        kb_rows.append([
            InlineKeyboardButton(
                text=f"🗑 {idx}-savolni o'chirish",
                callback_data=f"del_fav:{fv.question_id}",
            )
        ])

    kb_rows.append([InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="main_menu")])

    await message.answer(
        text=text,
        reply_markup=InlineKeyboardMarkup(inline_keyboard=kb_rows),
        parse_mode="HTML",
    )


@router.callback_query(F.data.startswith("del_fav:"))
async def handle_delete_favorite(call: CallbackQuery):
    """Sevimli savolni o'chirish."""
    q_id = call.data.split(":")[1]
    user_id = call.from_user.id

    async with get_session() as session:
        await remove_favorite_question(session, user_id, str(q_id))

    await call.answer("🗑 Savol sevimlilardan o'chirildi.", show_alert=True)
    # Yangilangan ro'yxatni chiqarish
    await show_favorites_list(call.message)
