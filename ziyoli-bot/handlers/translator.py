"""
Ziyoli Bot - Ko'p tilli tarjimon handleri.
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from utils.helpers import escape_html
from keyboards.menus import (
    translator_pairs_keyboard,
    translator_actions_keyboard,
    back_to_main_keyboard,
)
from services.translation_service import translation_service, TRANSLATION_PAIRS

router = Router()


class TranslatorState(StatesGroup):
    """Tarjima jarayoni holatlari."""
    waiting_for_pair = State()
    waiting_for_text = State()


@router.message(F.text == "🌐 Tarjimon")
async def show_translator_menu(message: Message, state: FSMContext):
    """Tarjimon bo'limi boshlang'ich menyusi."""
    await state.clear()
    text = (
        "🌐 <b>PROFESSIONAL TARJIMON BO'LIMI</b>\n\n"
        "O'zingizga kerakli tarjima yo'nalishini tanlang:\n\n"
        "• 🇺🇿 O'zbekcha ⇄ 🇬🇧 Inglizcha\n"
        "• 🇺🇿 O'zbekcha ⇄ 🇷🇺 Ruscha\n"
        "• 🇬🇧 Inglizcha ⇄ 🇷🇺 Ruscha\n\n"
        "<i>Kerakli yo'nalishni tanlang:</i>"
    )
    await state.set_state(TranslatorState.waiting_for_pair)
    await message.answer(text=text, reply_markup=translator_pairs_keyboard(), parse_mode="HTML")


@router.callback_query(F.data.startswith("set_trans:"))
async def callback_set_translation_pair(call: CallbackQuery, state: FSMContext):
    """Tarjima yo'nalishi tanlanganda ishlaydi."""
    pair_key = call.data.split(":")[1]
    pair_info = TRANSLATION_PAIRS.get(pair_key)

    if not pair_info:
        await call.answer("Noma'lum yo'nalish.", show_alert=True)
        return

    await state.update_data(current_pair=pair_key)
    await state.set_state(TranslatorState.waiting_for_text)

    text = (
        f"🎯 <b>Tanlangan yo'nalish:</b> {pair_info['name']}\n\n"
        f"✍️ <i>Endi tarjima qilmoqchi bo'lgan matningizni yuboring:</i>"
    )

    await call.message.edit_text(text=text, parse_mode="HTML")
    await call.answer()


@router.message(TranslatorState.waiting_for_text, F.text)
async def handle_translation_input(message: Message, state: FSMContext):
    """Foydalanuvchi matn yuborganda tarjima qilish."""
    data = await state.get_data()
    pair_key = data.get("current_pair", "uz_en")
    source_text = message.text.strip()

    # Xabar yuborilayotganini bildirish (Typing status)
    await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")

    success, result_or_error, pair_name = await translation_service.translate(
        text=source_text,
        pair_key=pair_key,
    )

    if success:
        response_text = (
            f"🌐 <b>Tarjima yo'nalishi:</b> {pair_name}\n\n"
            f"📝 <b>Asl matn:</b>\n<i>{escape_html(source_text)}</i>\n\n"
            f"✨ <b>Tarjima natijasi (Nusxalash uchun qulay):</b>\n"
            f"<code>{escape_html(result_or_error)}</code>\n\n"
            f"<i>Yana boshqa matn yuborishingiz yoki yo'nalishni o'zgartirishingiz mumkin.</i>"
        )
    else:
        response_text = (
            f"⚠️ <b>Tarjima bajarilmadi:</b>\n\n"
            f"{escape_html(result_or_error)}\n\n"
            f"<i>Boshqa matn yuborib ko'ring yoki yo'nalishni o'zgartiring.</i>"
        )

    await message.answer(
        text=response_text,
        reply_markup=translator_actions_keyboard(pair_key),
        parse_mode="HTML",
    )


@router.callback_query(F.data == "change_trans_pair")
async def callback_change_pair(call: CallbackQuery, state: FSMContext):
    """Yo'nalishni o'zgartirish menyusiga qaytish."""
    await state.set_state(TranslatorState.waiting_for_pair)
    text = "🌐 <b>Yangi tarjima yo'nalishini tanlang:</b>"
    await call.message.edit_text(text=text, reply_markup=translator_pairs_keyboard(), parse_mode="HTML")
    await call.answer()
