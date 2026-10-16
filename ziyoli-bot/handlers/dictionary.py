"""
Ziyoli Bot - Shaxsiy lug'at va so'z yodlash tizimi.
"""

import random
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from utils.helpers import escape_html
from database.db import get_session
from database.repository import (
    add_user_word,
    get_user_words,
    get_user_words_count,
    delete_user_word,
    toggle_word_favorite,
    get_random_words_for_quiz,
    add_user_xp,
)
from keyboards.menus import (
    dictionary_menu_keyboard,
    dictionary_word_keyboard,
    back_to_main_keyboard,
)
from services.quiz_service import quiz_service

router = Router()


class DictState(StatesGroup):
    """Lug'at FSM holatlari."""
    waiting_for_word = State()
    waiting_for_translation = State()
    waiting_for_example = State()
    waiting_for_search = State()
    in_dict_quiz = State()


@router.message(F.text == "📖 Lug‘at")
async def show_dictionary_main(message: Message, state: FSMContext):
    """Lug'at bo'limi bosh menyusi."""
    await state.clear()
    user_id = message.from_user.id
    async with get_session() as session:
        count = await get_user_words_count(session, user_id)
        fav_count = await get_user_words_count(session, user_id, favorite_only=True)

    text = (
        "📖 <b>SHAXSIY LUG'AT TIZIMI</b>\n\n"
        "Bu bo'limda siz o'zingiz o'rganayotgan yangi so'zlarni saqlashingiz, "
        "ularni takrorlashingiz va test shaklida yod olishingiz mumkin.\n\n"
        f"📊 <b>Sizning lug'atingizda:</b> {count} ta so'z\n"
        f"⭐ <b>Sevimli so'zlar:</b> {fav_count} ta\n\n"
        "<i>Quyidagi amallardan birini tanlang:</i>"
    )
    await message.answer(text=text, reply_markup=dictionary_menu_keyboard(), parse_mode="HTML")


# ============================================================
# YANGI SO'Z QO'SHISH OQIMI (FSM)
# ============================================================

@router.callback_query(F.data == "dict_add_word")
async def start_add_word(call: CallbackQuery, state: FSMContext):
    """So'z qo'shishni boshlash."""
    await state.set_state(DictState.waiting_for_word)
    text = (
        "➕ <b>YANGI SO'Z QO'SHISH</b>\n\n"
        "O'rganmoqchi bo'lgan so'zingizni kiriting (masalan, <i>Accomplish</i> yoki <i>Успех</i>):"
    )
    kb = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="🔙 Bekor qilish", callback_data="dict_cancel")]]
    )
    await call.message.edit_text(text=text, reply_markup=kb, parse_mode="HTML")
    await call.answer()


@router.message(DictState.waiting_for_word, F.text)
async def process_word_input(message: Message, state: FSMContext):
    """So'z kiritilgandan keyin tarjimasini so'rash."""
    word = message.text.strip()
    if len(word) > 100:
        await message.answer("So'z juda uzun. Iltimos, 100 belgidan kamroq so'z kiriting:")
        return

    await state.update_data(word=word)
    await state.set_state(DictState.waiting_for_translation)

    text = f"🔤 So'z: <b>{escape_html(word)}</b>\n\nEndi uning <b>o'zbekcha tarjimasini</b> kiriting:"
    await message.answer(text=text, parse_mode="HTML")


@router.message(DictState.waiting_for_translation, F.text)
async def process_translation_input(message: Message, state: FSMContext):
    """Tarjima kiritilgandan so'ng misol gapni so'rash."""
    translation = message.text.strip()
    await state.update_data(translation=translation)
    await state.set_state(DictState.waiting_for_example)

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="⏩ O'tkazib yuborish", callback_data="dict_skip_example")]
        ]
    )

    text = (
        f"🇺🇿 Tarjima: <b>{escape_html(translation)}</b>\n\n"
        "Ushbu so'z ishtirok etgan <b>misol gap</b> kiriting (yoki o'tkazib yuboring):"
    )
    await message.answer(text=text, reply_markup=kb, parse_mode="HTML")


@router.message(DictState.waiting_for_example, F.text)
async def process_example_input(message: Message, state: FSMContext):
    """Misol gap bilan birga so'zni DB ga saqlash."""
    example = message.text.strip()
    data = await state.get_data()
    word = data["word"]
    translation = data["translation"]
    user_id = message.from_user.id

    async with get_session() as session:
        await add_user_word(
            session=session,
            user_id=user_id,
            word=word,
            translation=translation,
            example=example,
        )
        await add_user_xp(session, user_id, 2)  # So'z qo'shish uchun +2 XP

    await state.clear()
    success_text = (
        "✅ <b>So'z lug'atingizga muvaffaqiyatli saqlandi! (+2 XP)</b>\n\n"
        f"🔤 <b>So'z:</b> {escape_html(word)}\n"
        f"🇺🇿 <b>Tarjimasi:</b> {escape_html(translation)}\n"
        f"📝 <b>Misol:</b> <i>\"{escape_html(example)}\"</i>"
    )
    await message.answer(text=success_text, reply_markup=dictionary_menu_keyboard(), parse_mode="HTML")


@router.callback_query(DictState.waiting_for_example, F.data == "dict_skip_example")
async def process_skip_example(call: CallbackQuery, state: FSMContext):
    """Misol gapsiz so'zni saqlash."""
    data = await state.get_data()
    word = data["word"]
    translation = data["translation"]
    user_id = call.from_user.id

    async with get_session() as session:
        await add_user_word(
            session=session,
            user_id=user_id,
            word=word,
            translation=translation,
            example=None,
        )
        await add_user_xp(session, user_id, 2)

    await state.clear()
    success_text = (
        "✅ <b>So'z lug'atingizga saqlandi! (+2 XP)</b>\n\n"
        f"🔤 <b>So'z:</b> {escape_html(word)}\n"
        f"🇺🇿 <b>Tarjimasi:</b> {escape_html(translation)}"
    )
    await call.message.edit_text(text=success_text, reply_markup=dictionary_menu_keyboard(), parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data == "dict_cancel")
async def cancel_dict_action(call: CallbackQuery, state: FSMContext):
    """Amalni bekor qilish."""
    await state.clear()
    await call.message.edit_text(
        "Amal bekor qilindi.", reply_markup=dictionary_menu_keyboard()
    )
    await call.answer()


# ============================================================
# LUG'ATNI KO'RISH VA SEVIMLILAR
# ============================================================

@router.callback_query(F.data.startswith("dict_list:"))
async def show_words_list(call: CallbackQuery):
    """Lug'atdagi so'zlar ro'yxatini ko'rsatish (Paginatsiya)."""
    offset = int(call.data.split(":")[1])
    limit = 6
    user_id = call.from_user.id

    async with get_session() as session:
        words = await get_user_words(
            session=session, user_id=user_id, limit=limit, offset=offset
        )
        total_count = await get_user_words_count(session, user_id)

    if not words and offset == 0:
        text = (
            "📭 <b>Lug'atingiz hozircha bo'sh!</b>\n\n"
            "Yangi so'z qo'shish uchun '➕ Yangi so'z qo'shish' tugmasidan foydalaning."
        )
        await call.message.edit_text(text=text, reply_markup=dictionary_menu_keyboard(), parse_mode="HTML")
        await call.answer()
        return

    text = f"📋 <b>SHAXSIY LUG'ATINGIZ (Jami: {total_count} ta):</b>\n\n"
    kb_rows = []

    for idx, w in enumerate(words, start=offset + 1):
        star = "⭐ " if w.is_favorite else ""
        text += (
            f"<b>{idx}. {star}{escape_html(w.word)}</b> — {escape_html(w.translation)}\n"
        )
        if w.example:
            text += f"   <i>Misol: \"{escape_html(w.example)}\"</i>\n"
        text += "\n"

        # Har bir so'z uchun tezkor boshqaruv tugmasi
        kb_rows.append([
            InlineKeyboardButton(
                text=f"{'⭐' if w.is_favorite else '☆'} {w.word[:15]} (Boshqarish)",
                callback_data=f"dict_word_view:{w.id}",
            )
        ])

    # Paginatsiya tugmalari
    nav_buttons = []
    if offset > 0:
        nav_buttons.append(
            InlineKeyboardButton(text="⬅️ Oldingi", callback_data=f"dict_list:{offset - limit}")
        )
    if offset + limit < total_count:
        nav_buttons.append(
            InlineKeyboardButton(text="Keyingi ➡️", callback_data=f"dict_list:{offset + limit}")
        )
    if nav_buttons:
        kb_rows.append(nav_buttons)

    kb_rows.append([InlineKeyboardButton(text="🔙 Lug'at menyusi", callback_data="dict_menu")])

    await call.message.edit_text(
        text=text,
        reply_markup=InlineKeyboardMarkup(inline_keyboard=kb_rows),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("dict_favorites:"))
async def show_favorite_words(call: CallbackQuery):
    """Faqat sevimli so'zlarni ko'rish."""
    offset = int(call.data.split(":")[1])
    limit = 6
    user_id = call.from_user.id

    async with get_session() as session:
        words = await get_user_words(
            session=session, user_id=user_id, limit=limit, offset=offset, favorite_only=True
        )
        total_count = await get_user_words_count(session, user_id, favorite_only=True)

    if not words and offset == 0:
        await call.answer("Sevimli so'zlar mavjud emas.", show_alert=True)
        return

    text = f"⭐ <b>SEVIMLI SO'ZLAR (Jami: {total_count} ta):</b>\n\n"
    kb_rows = []

    for idx, w in enumerate(words, start=offset + 1):
        text += f"<b>{idx}. {escape_html(w.word)}</b> — {escape_html(w.translation)}\n\n"
        kb_rows.append([
            InlineKeyboardButton(
                text=f"⚙️ {w.word[:15]}",
                callback_data=f"dict_word_view:{w.id}",
            )
        ])

    kb_rows.append([InlineKeyboardButton(text="🔙 Lug'at menyusi", callback_data="dict_menu")])

    await call.message.edit_text(
        text=text,
        reply_markup=InlineKeyboardMarkup(inline_keyboard=kb_rows),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("dict_word_view:"))
async def show_single_word_actions(call: CallbackQuery):
    """Bitta so'zni ko'rish va boshqarish."""
    word_id = int(call.data.split(":")[1])
    user_id = call.from_user.id

    async with get_session() as session:
        words = await get_user_words(session, user_id, limit=100)
        word = next((w for w in words if w.id == word_id), None)

    if not word:
        await call.answer("So'z topilmadi.", show_alert=True)
        return

    text = (
        f"📖 <b>SO'Z KARTASI:</b>\n\n"
        f"🔤 <b>So'z:</b> {escape_html(word.word)}\n"
        f"🇺🇿 <b>Tarjimasi:</b> {escape_html(word.translation)}\n"
    )
    if word.example:
        text += f"📝 <b>Misol:</b> <i>\"{escape_html(word.example)}\"</i>\n"
    text += f"⭐ <b>Holati:</b> {'Sevimlilarda' if word.is_favorite else 'Oddiy'}\n"

    await call.message.edit_text(
        text=text,
        reply_markup=dictionary_word_keyboard(word.id, word.is_favorite),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(F.data.startswith("dict_fav:"))
async def handle_toggle_word_favorite(call: CallbackQuery):
    """So'zni sevimlilarga qo'shish/chiqarish."""
    word_id = int(call.data.split(":")[1])
    user_id = call.from_user.id

    async with get_session() as session:
        new_status = await toggle_word_favorite(session, user_id, word_id)

    msg = "⭐ Sevimlilarga qo'shildi!" if new_status else "☆ Sevimlilardan chiqarildi."
    await call.answer(msg, show_alert=False)
    # So'z kartasini yangilash
    call.data = f"dict_word_view:{word_id}"
    await show_single_word_actions(call)


@router.callback_query(F.data.startswith("dict_del:"))
async def handle_delete_word(call: CallbackQuery):
    """So'zni o'chirish."""
    word_id = int(call.data.split(":")[1])
    user_id = call.from_user.id

    async with get_session() as session:
        await delete_user_word(session, user_id, word_id)

    await call.answer("🗑 So'z o'chirildi.", show_alert=False)
    call.data = "dict_list:0"
    await show_words_list(call)


@router.callback_query(F.data == "dict_menu")
async def callback_dict_menu(call: CallbackQuery, state: FSMContext):
    """Lug'at menyusiga qaytish."""
    await state.clear()
    user_id = call.from_user.id
    async with get_session() as session:
        count = await get_user_words_count(session, user_id)
        fav_count = await get_user_words_count(session, user_id, favorite_only=True)

    text = (
        "📖 <b>SHAXSIY LUG'AT TIZIMI</b>\n\n"
        f"📊 <b>Sizning lug'atingizda:</b> {count} ta so'z\n"
        f"⭐ <b>Sevimli so'zlar:</b> {fav_count} ta\n\n"
        "<i>Quyidagi amallardan birini tanlang:</i>"
    )
    await call.message.edit_text(text=text, reply_markup=dictionary_menu_keyboard(), parse_mode="HTML")
    await call.answer()


# ============================================================
# LUG'AT BO'YICHA QUIZ (SO'Z YODLASH TESTI)
# ============================================================

@router.callback_query(F.data == "dict_quiz")
async def start_dict_quiz(call: CallbackQuery, state: FSMContext):
    """Lug'at so'zlari bo'yicha mini viktorina."""
    user_id = call.from_user.id
    async with get_session() as session:
        words = await get_user_words(session, user_id, limit=50)

    if len(words) < 4:
        await call.answer(
            "So'z yodlash testini boshlash uchun lug'atingizda kamida 4 ta so'z bo'lishi kerak!",
            show_alert=True,
        )
        return

    # To'g'ri so'zni tanlash va 3 ta noto'g'ri variant qo'shish
    target_word = random.choice(words)
    other_words = [w for w in words if w.id != target_word.id]
    distractors = random.sample(other_words, min(3, len(other_words)))
    all_options = [target_word] + distractors
    random.shuffle(all_options)

    correct_index = all_options.index(target_word)

    await state.set_state(DictState.in_dict_quiz)
    await state.set_data({
        "target_word": target_word.word,
        "correct_translation": target_word.translation,
        "correct_index": correct_index,
    })

    text = (
        "🎯 <b>SO'Z YODLASH TESTI</b>\n\n"
        f"Quyidagi so'zning to'g'ri tarjimasini toping:\n\n"
        f"🔤 <b>\"{escape_html(target_word.word)}\"</b>\n\n"
        "<i>To'g'ri variantni tanlang:</i>"
    )

    kb = []
    letters = ["A", "B", "C", "D"]
    for idx, opt in enumerate(all_options):
        kb.append([
            InlineKeyboardButton(
                text=f"{letters[idx]}) {opt.translation}",
                callback_data=f"dict_ans:{idx}",
            )
        ])
    kb.append([InlineKeyboardButton(text="🔙 Lug'atga qaytish", callback_data="dict_menu")])

    await call.message.edit_text(
        text=text,
        reply_markup=InlineKeyboardMarkup(inline_keyboard=kb),
        parse_mode="HTML",
    )
    await call.answer()


@router.callback_query(DictState.in_dict_quiz, F.data.startswith("dict_ans:"))
async def handle_dict_quiz_answer(call: CallbackQuery, state: FSMContext):
    """So'z yodlash test javobini tekshirish."""
    chosen_idx = int(call.data.split(":")[1])
    data = await state.get_data()
    correct_idx = data["correct_index"]
    target_word = data["target_word"]
    correct_trans = data["correct_translation"]

    if chosen_idx == correct_idx:
        user_id = call.from_user.id
        async with get_session() as session:
            await add_user_xp(session, user_id, 3)

        result_text = (
            "🎉 <b>BARAKALLA, TO'G'RI JAVOB! (+3 XP)</b>\n\n"
            f"🔤 <b>{escape_html(target_word)}</b> = <b>{escape_html(correct_trans)}</b>"
        )
    else:
        result_text = (
            "❌ <b>Afsus, noto'g'ri javob.</b>\n\n"
            f"🔤 To'g'ri tarjima:\n<b>{escape_html(target_word)}</b> = <b>{escape_html(correct_trans)}</b>"
        )

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="➡️ Keyingi so'z",
                    callback_data="dict_quiz",
                )
            ],
            [
                InlineKeyboardButton(
                    text="🔙 Lug'at menyusi",
                    callback_data="dict_menu",
                )
            ],
        ]
    )

    await call.message.edit_text(text=result_text, reply_markup=kb, parse_mode="HTML")
    await call.answer()


# ============================================================
# KUN SO'ZINI LUG'ATGA SAQLASH (Word of the Day callback)
# ============================================================

@router.callback_query(F.data.startswith("save_wotd:"))
async def save_word_of_the_day_to_dict(call: CallbackQuery):
    """Ingliz tili kun so'zini to'g'ridan-to'g'ri lug'atga saqlash."""
    wotd = quiz_service.get_word_of_the_day()
    user_id = call.from_user.id

    async with get_session() as session:
        await add_user_word(
            session=session,
            user_id=user_id,
            word=wotd["word"],
            translation=wotd["translation"],
            example=wotd.get("example"),
        )
        await add_user_xp(session, user_id, 3)

    await call.answer("✅ Kun so'zi lug'atingizga saqlandi! (+3 XP)", show_alert=True)
