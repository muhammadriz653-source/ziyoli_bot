"""
Ziyoli Bot - Fanlar bo'limi handleri.
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from utils.helpers import SUBJECTS_MAP, escape_html
from keyboards.menus import (
    subjects_keyboard,
    subject_actions_keyboard,
    subject_topics_keyboard,
    test_difficulty_keyboard,
)
from services.quiz_service import quiz_service

router = Router()


@router.message(F.text == "📚 Fanlar")
async def show_subjects_menu(message: Message):
    """Barcha fanlar ro'yxatini ko'rsatish."""
    text = (
        "📚 <b>TA'LIM FANLARI BO'LIMI</b>\n\n"
        "Quyidagi oltita asosiy fan bo'yicha sifatli nazariy mavzular "
        "va darajali testlar tayyorlangan:\n\n"
        "1. 🇬🇧 <b>Ingliz tili</b> — Grammatika, Vocabulary va Word of the Day\n"
        "2. 🇷🇺 <b>Rus tili</b> — Kelishiklar, fe'l harakatlari va leksika\n"
        "3. 📘 <b>Ona tili</b> — Fonetika, morfologiya, sintaksis va imlo\n"
        "4. ➗ <b>Matematika</b> — Algebra, geometriya, masalalar va bosqichli yechimlar\n"
        "5. 🧬 <b>Biologiya</b> — Hujayra, anatomiya, genetika va ekologiya\n"
        "6. ⚖️ <b>Huquq</b> — 2023-yilgi yangi Konstitutsiya, Mehnat va Fuqarolik huquqi\n\n"
        "<i>Kerakli fanni tanlang:</i>"
    )
    await message.answer(text=text, reply_markup=subjects_keyboard(), parse_mode="HTML")


@router.callback_query(F.data == "back_to_subjects")
async def callback_back_to_subjects(call: CallbackQuery):
    """Fanlar ro'yxatiga qaytish."""
    text = (
        "📚 <b>O'rganmoqchi bo'lgan fanni tanlang:</b>"
    )
    await call.message.edit_text(text=text, reply_markup=subjects_keyboard(), parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data.startswith("subj:"))
async def show_subject_details(call: CallbackQuery):
    """Tanlangan fan sahifasini ko'rsatish."""
    subject_code = call.data.split(":")[1]
    subject_info = SUBJECTS_MAP.get(subject_code)

    if not subject_info:
        await call.answer("Bunday fan topilmadi.", show_alert=True)
        return

    data = quiz_service.get_subject_data(subject_code)
    questions_count = len(data.get("questions", []))
    topics = quiz_service.get_topics_for_subject(subject_code)

    text = (
        f"{subject_info['emoji']} <b>{subject_info['title'].upper()}</b>\n\n"
        f"📊 <b>Mavjud savollar bazasi:</b> {questions_count} ta\n"
        f"📑 <b>Mavzular soni:</b> {len(topics)} ta\n"
        f"🎯 <b>Darajalar:</b> Oson 🟢 | O'rta 🟡 | Qiyin 🔴\n\n"
        f"<b>Asosiy mavzular:</b>\n"
    )
    for t in topics[:6]:
        text += f" • {t}\n"
    if len(topics) > 6:
        text += f" • <i>va yana {len(topics)-6} ta mavzu...</i>\n"

    text += "\n<i>O'zingizga qulay formatda testni boshlang:</i>"

    await call.message.edit_text(
        text=text,
        reply_markup=subject_actions_keyboard(subject_code),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("select_topic:"))
async def callback_select_topic(call: CallbackQuery):
    """Mavzular ro'yxatini chiqarish."""
    subject_code = call.data.split(":")[1]
    topics = quiz_service.get_topics_for_subject(subject_code)

    text = f"📑 <b>Mavzuni tanlang ({SUBJECTS_MAP[subject_code]['title']}):</b>"
    await call.message.edit_text(
        text=text,
        reply_markup=subject_topics_keyboard(subject_code, topics),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("select_diff:"))
async def callback_select_diff(call: CallbackQuery):
    """Qiyinlik darajasini tanlash."""
    subject_code = call.data.split(":")[1]
    text = f"🎯 <b>Qiyinlik darajasini tanlang ({SUBJECTS_MAP[subject_code]['title']}):</b>"
    await call.message.edit_text(
        text=text,
        reply_markup=test_difficulty_keyboard(subject_code, topic="all"),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data == "word_of_the_day")
async def callback_word_of_the_day(call: CallbackQuery):
    """Ingliz tili kun so'zini chiqarish."""
    word_info = quiz_service.get_word_of_the_day()

    text = (
        "🌟 <b>KUN SO'ZI — WORD OF THE DAY</b> 🇬🇧\n\n"
        f"🔤 <b>So'z:</b> <code>{escape_html(word_info['word'])}</code>\n"
        f"🗣 <b>Talaffuzi:</b> <i>{escape_html(word_info['pronunciation'])}</i>\n"
        f"🇺🇿 <b>Tarjimasi:</b> <b>{escape_html(word_info['translation'])}</b>\n\n"
        f"📝 <b>Misol gap:</b>\n"
        f"<i>\"{escape_html(word_info['example'])}\"</i>\n\n"
        "💡 <i>Ushbu so'zni shaxsiy lug'atingizga saqlab qo'yishingiz mumkin!</i>"
    )

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="💾 Shaxsiy lug'atga saqlash",
                    callback_data=f"save_wotd:{word_info['word']}",
                )
            ],
            [
                InlineKeyboardButton(
                    text="🔙 Ingliz tili menyusi",
                    callback_data="subj:english",
                )
            ],
        ]
    )

    await call.message.edit_text(text=text, reply_markup=kb, parse_mode="HTML")
    await call.answer()
