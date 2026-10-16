"""
Ziyoli Bot - Mantiqiy fikrlash va jumboqlar handleri.
"""

import random
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from utils.helpers import escape_html
from keyboards.menus import logic_menu_keyboard, logic_question_keyboard
from services.quiz_service import quiz_service

router = Router()


@router.message(F.text == "🧠 Mantiqiy fikrlash")
async def show_logic_main(message: Message):
    """Mantiqiy fikrlash bo'limi bosh menyusi."""
    text = (
        "🧠 <b>MANTIQIY FIKRLASH BO'LIMI</b>\n\n"
        "Mantiqiy fikrlashni, zehnni va diqqatni rivojlantirish uchun "
        "turli yo'nalishdagi nostandart masalalar va jumboqlar:\n\n"
        "• 🔢 <b>Sonlar ketma-ketligi</b> — Qonuniyatlarni topish\n"
        "• 🧩 <b>Mantiqiy jumboqlar</b> — Chuqur fikrlash topshiriqlari\n"
        "• 🔎 <b>Ortiqcha element</b> — Analitik solishtirish\n"
        "• 🧮 <b>Matematik topishmoqlar</b> — Qiziqarli hisob-kitoblar\n\n"
        "<i>Quyidagi bo'limlardan birini tanlang:</i>"
    )
    await message.answer(text=text, reply_markup=logic_menu_keyboard(), parse_mode="HTML")


@router.callback_query(F.data == "logic_menu")
async def callback_logic_menu(call: CallbackQuery):
    """Mantiq menyusiga qaytish."""
    text = "🧠 <b>Mantiqiy topshiriq yo'nalishini tanlang:</b>"
    await call.message.edit_text(text=text, reply_markup=logic_menu_keyboard(), parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data.in_(["logic_random", "logic_topic"]))
@router.callback_query(F.data.startswith("logic_topic:"))
async def send_logic_question(call: CallbackQuery):
    """Mantiqiy savol yuborish."""
    topic = None
    if call.data.startswith("logic_topic:"):
        topic = call.data.split(":")[1]

    questions = quiz_service.get_questions(
        subject="logic",
        topic=topic,
        difficulty=None,
        count=1,
    )

    if not questions:
        await call.answer("Savol topilmadi.", show_alert=True)
        return

    q = questions[0]
    options_text = ""
    letters = ["A", "B", "C", "D"]
    for idx, opt in enumerate(q.get("options", [])):
        letter = letters[idx] if idx < len(letters) else str(idx + 1)
        options_text += f"• <b>{letter})</b> {escape_html(opt)}\n"

    diff_badge = {
        "easy": "🟢 Oson",
        "medium": "🟡 O'rta",
        "hard": "🔴 Qiyin",
    }.get(q.get("difficulty", ""), "⚪ O'rta")

    text = (
        f"🧠 <b>MANTIQIY SAVOL</b> | {diff_badge}\n"
        f"📌 Yo'nalish: <i>{escape_html(q.get('topic', 'Umumiy'))}</i>\n"
        f"━━━━━━━━━━━━━━━━━━━\n\n"
        f"<b>{escape_html(q.get('question'))}</b>\n\n"
        f"{options_text}\n"
        f"🤔 <i>Avval o'zingiz mustaqil o'ylab ko'ring, so'ngra javobni oching!</i>"
    )

    await call.message.edit_text(
        text=text,
        reply_markup=logic_question_keyboard(question_id=str(q.get("id")), has_revealed=False),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("logic_reveal:"))
async def reveal_logic_answer(call: CallbackQuery):
    """Mantiqiy savol javobi va izohini ko'rsatish."""
    q_id = call.data.split(":")[1]
    q = quiz_service.get_question_by_id("logic", q_id)

    if not q:
        await call.answer("Savol topilmadi.", show_alert=True)
        return

    correct_idx = q.get("correct_answer", 0)
    options = q.get("options", [])
    letters = ["A", "B", "C", "D"]
    correct_letter = letters[correct_idx] if correct_idx < len(letters) else str(correct_idx)
    correct_opt = options[correct_idx] if correct_idx < len(options) else ""

    text = (
        f"🧠 <b>MANTIQIY SAVOL YECHIMI</b>\n"
        f"━━━━━━━━━━━━━━━━━━━\n\n"
        f"<b>Savol:</b> {escape_html(q.get('question'))}\n\n"
        f"🎯 <b>To'g'ri javob:</b> <b>{correct_letter}) {escape_html(correct_opt)}</b>\n\n"
        f"💡 <b>Tushuntirish va mantiq:</b>\n"
        f"<i>{escape_html(q.get('explanation', 'Izoh mavjud emas.'))}</i>"
    )

    await call.message.edit_text(
        text=text,
        reply_markup=logic_question_keyboard(question_id=str(q.get("id")), has_revealed=True),
        parse_mode="HTML",
    )
    await call.answer()
