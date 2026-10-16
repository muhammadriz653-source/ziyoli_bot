"""
Ziyoli Bot - Test ishlash va natijalarni hisoblash tizimi.
"""

import time
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from utils.helpers import (
    SUBJECTS_MAP,
    escape_html,
    format_duration,
    generate_progress_bar,
    get_subject_title,
)
from keyboards.menus import (
    subjects_keyboard,
    test_difficulty_keyboard,
    test_count_keyboard,
    quiz_options_keyboard,
    quiz_result_keyboard,
)
from services.quiz_service import quiz_service
from services.statistics_service import statistics_service
from database.db import get_session
from database.repository import (
    save_test_result,
    add_user_xp,
    add_favorite_question,
    remove_favorite_question,
    is_question_favorited,
    get_test_result_by_id,
)

router = Router()


class QuizState(StatesGroup):
    """Test jarayoni uchun FSM holatlari."""
    answering = State()
    viewing_explanation = State()


# ============================================================
# TESTNI BOSHLASH VA SOZLASH
# ============================================================

@router.message(F.text == "📝 Test ishlash")
async def start_test_flow(message: Message, state: FSMContext):
    """Test ishlash uchun fanni tanlash."""
    await state.clear()
    text = (
        "📝 <b>TEST ISHLASH BO'LIMI</b>\n\n"
        "Bilimingizni sinash uchun fanni tanlang.\n"
        "Har bir to'g'ri javob uchun <b>XP ballari</b> beriladi va "
        "natijalaringiz umumiy reytingda aks etadi!\n\n"
        "<i>Kerakli fanni tanlang:</i>"
    )
    await message.answer(text=text, reply_markup=subjects_keyboard(action_prefix="test_subj"), parse_mode="HTML")


@router.callback_query(F.data.startswith("test_subj:"))
async def callback_test_subject_chosen(call: CallbackQuery):
    """Fan tanlanganda qiyinlik darajasiga o'tish."""
    subject_code = call.data.split(":")[1]
    text = f"🎯 <b>Qiyinlik darajasini tanlang ({get_subject_title(subject_code)}):</b>"
    await call.message.edit_text(
        text=text,
        reply_markup=test_difficulty_keyboard(subject_code=subject_code, topic="all"),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("topic_chosen:"))
async def callback_topic_chosen(call: CallbackQuery):
    """Mavzu tanlangandan keyin darajani tanlash."""
    parts = call.data.split(":")
    subject_code = parts[1]
    topic = parts[2]
    text = f"🎯 <b>Qiyinlik darajasini tanlang:</b>\n📌 Mavzu: <i>{escape_html(topic)}</i>"
    await call.message.edit_text(
        text=text,
        reply_markup=test_difficulty_keyboard(subject_code=subject_code, topic=topic),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("diff_chosen:"))
async def callback_diff_chosen(call: CallbackQuery):
    """Qiyinlik darajasi tanlangandan keyin savollar sonini tanlash."""
    parts = call.data.split(":")
    subject_code = parts[1]
    topic = parts[2]
    difficulty = parts[3]

    text = (
        f"📊 <b>Savollar sonini tanlang ({get_subject_title(subject_code)}):</b>\n\n"
        f"Quyidagi variantlardan birini belgilang:"
    )
    await call.message.edit_text(
        text=text,
        reply_markup=test_count_keyboard(
            subject_code=subject_code, topic=topic, difficulty=difficulty
        ),
        parse_mode="HTML",
    )
    await call.answer()


# ============================================================
# TEST SESSIYASI VA SAVOLLARNI BERISH
# ============================================================

@router.callback_query(F.data.startswith("start_quiz:"))
async def callback_start_quiz(call: CallbackQuery, state: FSMContext):
    """Testni shakllantirish va birinchi savolni yuborish."""
    await state.clear()
    parts = call.data.split(":")
    subject_code = parts[1]
    topic = parts[2]
    difficulty = parts[3]
    count = int(parts[4])

    questions = quiz_service.get_questions(
        subject=subject_code,
        topic=topic if topic != "all" else None,
        difficulty=difficulty if difficulty != "all" else None,
        count=count,
    )

    if not questions:
        await call.answer("Ushbu parametrlar bo'yicha savollar topilmadi.", show_alert=True)
        return

    # Holat ma'lumotlarini saqlash
    session_data = {
        "subject": subject_code,
        "topic": topic if topic != "all" else "Barcha mavzular",
        "difficulty": difficulty if difficulty != "all" else "Aralash",
        "questions": questions,
        "total_count": len(questions),
        "current_index": 0,
        "correct_count": 0,
        "wrong_count": 0,
        "wrong_questions": [],
        "start_time": time.time(),
        "answered_current": False,
    }
    await state.set_state(QuizState.answering)
    await state.set_data(session_data)

    await call.answer("Test boshlandi! Omad!", show_alert=False)
    await send_quiz_question(call, state)


async def send_quiz_question(call_or_msg, state: FSMContext):
    """Navbatdagi savolni ekranga chiqarish."""
    data = await state.get_data()
    idx = data["current_index"]
    questions = data["questions"]
    total = data["total_count"]
    subject = data["subject"]

    if idx >= total:
        await finish_quiz(call_or_msg, state)
        return

    q = questions[idx]
    # Javob berilganlik holatini yangilash
    data["answered_current"] = False
    await state.set_data(data)

    user_id = call_or_msg.from_user.id
    async with get_session() as session:
        is_fav = await is_question_favorited(session, user_id, str(q.get("id")))

    difficulty_badge = {
        "easy": "🟢 Oson",
        "medium": "🟡 O'rta",
        "hard": "🔴 Qiyin",
    }.get(q.get("difficulty", ""), "⚪ Standart")

    letters = ["A", "B", "C", "D", "E"]
    options_text = ""
    for opt_idx, opt in enumerate(q.get("options", [])):
        letter = letters[opt_idx] if opt_idx < len(letters) else f"{opt_idx+1}"
        options_text += f"<b>{letter})</b> {escape_html(opt)}\n"

    text = (
        f"📝 <b>{get_subject_title(subject)}</b>\n"
        f"📌 Mavzu: <i>{escape_html(q.get('topic', 'Umumiy'))}</i> | {difficulty_badge}\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"<b>Savol {idx + 1}/{total}:</b>\n\n"
        f"<b>{escape_html(q.get('question', ''))}</b>\n\n"
        f"{options_text}\n"
        f"<i>To'g'ri variantni tanlang:</i>"
    )

    kb = quiz_options_keyboard(
        options=q.get("options", []),
        current_index=idx,
        total_count=total,
        question_id=str(q.get("id")),
        subject=subject,
        is_favorited=is_fav,
    )

    if isinstance(call_or_msg, CallbackQuery):
        try:
            await call_or_msg.message.edit_text(text=text, reply_markup=kb, parse_mode="HTML")
        except Exception:
            await call_or_msg.message.answer(text=text, reply_markup=kb, parse_mode="HTML")
    else:
        await call_or_msg.answer(text=text, reply_markup=kb, parse_mode="HTML")


# ============================================================
# JAVOBNI TEKSHIRISH VA TUSHUNTIRISH BERISH
# ============================================================

@router.callback_query(QuizState.answering, F.data.startswith("ans:"))
async def handle_answer(call: CallbackQuery, state: FSMContext):
    """Foydalanuvchi variant tanlaganda ishlaydi."""
    data = await state.get_data()
    if data.get("answered_current", False):
        await call.answer("Siz bu savolga javob berib bo'ldingiz!", show_alert=False)
        return

    data["answered_current"] = True
    await state.set_data(data)

    chosen_idx = int(call.data.split(":")[1])
    idx = data["current_index"]
    questions = data["questions"]
    q = questions[idx]
    correct_idx = q.get("correct_answer", 0)

    is_correct = chosen_idx == correct_idx
    letters = ["A", "B", "C", "D", "E"]
    chosen_letter = letters[chosen_idx] if chosen_idx < len(letters) else str(chosen_idx)
    correct_letter = letters[correct_idx] if correct_idx < len(letters) else str(correct_idx)

    options = q.get("options", [])
    chosen_opt = options[chosen_idx] if chosen_idx < len(options) else ""
    correct_opt = options[correct_idx] if correct_idx < len(options) else ""

    if is_correct:
        data["correct_count"] += 1
        result_header = "✅ <b>TO'G'RI JAVOB!</b> 🎉"
    else:
        data["wrong_count"] += 1
        data["wrong_questions"].append({
            "question": q.get("question"),
            "chosen": f"{chosen_letter}) {chosen_opt}",
            "correct": f"{correct_letter}) {correct_opt}",
            "explanation": q.get("explanation", ""),
        })
        result_header = "❌ <b>NOTO'G'RI JAVOB!</b>"

    explanation = q.get("explanation", "Izoh mavjud emas.")

    text = (
        f"{result_header}\n\n"
        f"<b>Savol {idx + 1}:</b> {escape_html(q.get('question'))}\n\n"
        f"👤 <b>Sizning javobingiz:</b> {chosen_letter}) {escape_html(chosen_opt)}\n"
        f"🎯 <b>To'g'ri javob:</b> {correct_letter}) {escape_html(correct_opt)}\n\n"
        f"💡 <b>Tushuntirish:</b>\n<i>{escape_html(explanation)}</i>"
    )

    # Keyingi savolga o'tish tugmasi
    next_kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="➡️ Keyingi savol",
                    callback_data="next_question",
                )
            ],
            [
                InlineKeyboardButton(
                    text="❌ Testni to'xtatish",
                    callback_data="stop_quiz",
                )
            ],
        ]
    )

    await state.set_state(QuizState.viewing_explanation)
    await state.set_data(data)
    await call.message.edit_text(text=text, reply_markup=next_kb, parse_mode="HTML")
    await call.answer()


@router.callback_query(QuizState.viewing_explanation, F.data == "next_question")
async def handle_next_question(call: CallbackQuery, state: FSMContext):
    """Keyingi savolga o'tish."""
    data = await state.get_data()
    data["current_index"] += 1
    await state.set_state(QuizState.answering)
    await state.set_data(data)
    await send_quiz_question(call, state)
    await call.answer()


@router.callback_query(F.data == "stop_quiz")
async def handle_stop_quiz(call: CallbackQuery, state: FSMContext):
    """Testni muddatidan oldin yakunlash."""
    data = await state.get_data()
    if not data or "current_index" not in data:
        await state.clear()
        await call.message.answer("Test to'xtatildi.", reply_markup=subjects_keyboard())
        await call.answer()
        return

    await call.answer("Test to'xtatildi.", show_alert=False)
    await finish_quiz(call, state, stopped_early=True)


# ============================================================
# TESTNI YAKUNLASH VA NATIJA CHIQARISH
# ============================================================

async def finish_quiz(call_or_msg, state: FSMContext, stopped_early: bool = False):
    """Test yakunida hisob-kitob qilish, saqlash va natijani ko'rsatish."""
    data = await state.get_data()
    await state.clear()

    total = data.get("total_count", 1)
    correct = data.get("correct_count", 0)
    wrong = data.get("wrong_count", 0)
    answered_total = correct + wrong
    if answered_total == 0:
        answered_total = 1

    subject = data.get("subject", "english")
    topic = data.get("topic", "Umumiy")
    difficulty = data.get("difficulty", "Aralash")
    wrong_questions = data.get("wrong_questions", [])

    duration = int(time.time() - data.get("start_time", time.time()))

    score_pct = (correct / total) * 100.0 if not stopped_early else (correct / answered_total) * 100.0

    # XP va anti-cheat tahlili
    xp_earned, xp_message = statistics_service.calculate_xp_reward(
        total_questions=total if not stopped_early else answered_total,
        correct_answers=correct,
        duration_seconds=duration,
    )

    user_id = call_or_msg.from_user.id

    # Ma'lumotlar bazasiga saqlash
    async with get_session() as session:
        test_result = await save_test_result(
            session=session,
            user_id=user_id,
            subject=subject,
            topic=topic,
            difficulty=difficulty,
            total_questions=total if not stopped_early else answered_total,
            correct_answers=correct,
            wrong_answers=wrong,
            score_percentage=score_pct,
            duration_seconds=duration,
            wrong_questions=wrong_questions,
        )
        if xp_earned > 0:
            await add_user_xp(session=session, user_id=user_id, points=xp_earned)

    progress_bar = generate_progress_bar(score_pct)
    duration_str = format_duration(duration)

    summary_text = (
        f"🏁 <b>TEST YAKUNLANDI!</b>\n\n"
        f"📚 <b>Fan:</b> {get_subject_title(subject)}\n"
        f"📌 <b>Mavzu:</b> {escape_html(topic)}\n"
        f"🎯 <b>Daraja:</b> {escape_html(difficulty)}\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"📊 <b>Jami savollar:</b> {total if not stopped_early else answered_total} ta\n"
        f"✅ <b>To'g'ri javoblar:</b> {correct} ta\n"
        f"❌ <b>Noto'g'ri javoblar:</b> {wrong} ta\n"
        f"📈 <b>Natija foizi:</b> {progress_bar}\n"
        f"⏱ <b>Sarflangan vaqt:</b> {duration_str}\n\n"
        f"{xp_message}\n"
    )

    kb = quiz_result_keyboard(
        result_id=test_result.id,
        subject=subject,
        has_wrong=len(wrong_questions) > 0,
    )

    if isinstance(call_or_msg, CallbackQuery):
        try:
            await call_or_msg.message.edit_text(text=summary_text, reply_markup=kb, parse_mode="HTML")
        except Exception:
            await call_or_msg.message.answer(text=summary_text, reply_markup=kb, parse_mode="HTML")
    else:
        await call_or_msg.answer(text=summary_text, reply_markup=kb, parse_mode="HTML")


# ============================================================
# XATOLARNI KO'RISH VA QAYTA ISHLASH
# ============================================================

@router.callback_query(F.data.startswith("review_wrongs:"))
async def callback_review_wrongs(call: CallbackQuery):
    """Xato ishlangan savollarning to'liq tahlili."""
    result_id = int(call.data.split(":")[1])
    async with get_session() as session:
        test_result = await get_test_result_by_id(session, result_id)

    if not test_result or not test_result.wrong_questions_json:
        await call.answer("Xatolar topilmadi.", show_alert=True)
        return

    import json
    wrongs = json.loads(test_result.wrong_questions_json)

    text = f"❌ <b>XATO JAVOBLAR TAHLILI ({len(wrongs)} ta):</b>\n\n"
    for i, item in enumerate(wrongs, 1):
        text += (
            f"<b>{i}-savol:</b> {escape_html(item.get('question'))}\n"
            f"🔴 <i>Siz tanlagan:</i> {escape_html(item.get('chosen'))}\n"
            f"🟢 <i>To'g'ri javob:</i> {escape_html(item.get('correct'))}\n"
            f"💡 <i>Izoh:</i> {escape_html(item.get('explanation'))}\n"
            f"───────────────────\n"
        )
        if len(text) > 3500:  # Telegram cheklovidan himoya
            text += "<i>...va boshqa savollar.</i>\n"
            break

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🔄 Testni qayta ishlash",
                    callback_data=f"retry_quiz:{test_result.subject}",
                )
            ],
            [
                InlineKeyboardButton(
                    text="🏠 Bosh menyu",
                    callback_data="main_menu",
                )
            ],
        ]
    )

    await call.message.answer(text=text, reply_markup=kb, parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data.startswith("retry_quiz:"))
async def callback_retry_quiz(call: CallbackQuery, state: FSMContext):
    """O'sha fanni qayta ishlash."""
    subject_code = call.data.split(":")[1]
    # Tezkor test sifatida boshlaymiz
    call.data = f"start_quiz:{subject_code}:all:all:10"
    await callback_start_quiz(call, state)


# ============================================================
# SEVIMLILAR AMALLARI (FAV / UNFAV)
# ============================================================

@router.callback_query(F.data.startswith("fav:"))
async def callback_add_favorite(call: CallbackQuery):
    """Savolni sevimlilarga qo'shish."""
    parts = call.data.split(":")
    subject_code = parts[1]
    q_id = parts[2]
    user_id = call.from_user.id

    q = quiz_service.get_question_by_id(subject_code, q_id)
    if not q:
        await call.answer("Savol topilmadi.", show_alert=True)
        return

    async with get_session() as session:
        await add_favorite_question(
            session=session,
            user_id=user_id,
            question_id=str(q_id),
            subject=subject_code,
            question_text=q.get("question", ""),
            explanation=q.get("explanation", ""),
        )

    await call.answer("⭐ Savol sevimlilarga qo'shildi!", show_alert=False)


@router.callback_query(F.data.startswith("unfav:"))
async def callback_remove_favorite(call: CallbackQuery):
    """Savolni sevimlilardan chiqarish."""
    q_id = call.data.split(":")[1]
    user_id = call.from_user.id

    async with get_session() as session:
        await remove_favorite_question(session, user_id, str(q_id))

    await call.answer("☆ Savol sevimlilardan o'chirildi.", show_alert=False)
