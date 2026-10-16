"""
Ziyoli Bot - Start, Help, Sozlamalar va Asosiy navigatsiya handleri.
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext

from database.db import get_session
from database.repository import get_or_create_user
from keyboards.menus import main_menu_keyboard
from utils.helpers import escape_html

router = Router()


@router.message(CommandStart())
async def handle_start(message: Message, state: FSMContext):
    """Start buyrug'i: foydalanuvchini ro'yxatga olish va asosiy menyuni chiqarish."""
    await state.clear()
    user_id = message.from_user.id
    username = message.from_user.username
    full_name = message.from_user.full_name

    async with get_session() as session:
        user, created = await get_or_create_user(
            session=session,
            user_id=user_id,
            username=username,
            full_name=full_name,
        )

    greeting = f"Assalomu alaykum, <b>{escape_html(full_name)}</b>! 🎓\n\n"
    if created:
        greeting += (
            "<b>Ziyoli Bot</b>ga xush kelibsiz! Sizga boshlang'ich <b>+10 XP</b> sovg'a qilindi! 🎁\n\n"
        )
    else:
        greeting += f"Sizni qayta ko'rganimizdan xursandmiz! (Faollik: {user.streak_days} kun 🔥)\n\n"

    welcome_text = (
        f"{greeting}"
        "<b>Ziyoli Bot</b> — bu sizning intellektual va professional ta'lim yordamchingiz.\n\n"
        "Quyidagi imkoniyatlardan foydalanishingiz mumkin:\n"
        "• 📚 <b>Fanlar</b> — 6 ta asosiy fan bo'yicha nazariya va testlar\n"
        "• 📝 <b>Test ishlash</b> — Bilimingizni sinash va reyting to'plash\n"
        "• 🌐 <b>Tarjimon</b> — 6 xil yo'nalishdagi matnli tarjima\n"
        "• 📖 <b>Lug‘at</b> — Shaxsiy so'z boyligini shakllantirish va yodlash\n"
        "• 🧠 <b>Mantiqiy fikrlash</b> — Jumboqlar, qonuniyatlar va topishmoqlar\n"
        "• 📊 <b>Mening natijalarim</b> — To'liq statistika, yutuqlar va reyting\n"
        "• ⭐ <b>Sevimlilar</b> — Saqlab qo'yilgan qiziqarli savollar\n\n"
        "<i>Boshlash uchun quyidagi menyudan kerakli bo'limni tanlang:</i>"
    )

    await message.answer(
        text=welcome_text,
        reply_markup=main_menu_keyboard(),
        parse_mode="HTML",
    )


@router.message(Command("help"))
async def handle_help(message: Message):
    """Yordam va qo'llanma bo'limi."""
    help_text = (
        "<b>📖 Ziyoli Bot — Foydalanish qo'llanmasi</b>\n\n"
        "<b>1. Test ishlash tartibi:</b>\n"
        "• Fanni tanlang, so'ngra mavzu va qiyinlik darajasini belgilang.\n"
        "• Variantni tanlaganingizdan so'ng to'g'ri javob va ilmiy izoh beriladi.\n"
        "• Test yakunida foiz, sarflangan vaqt va xatolaringiz ko'rsatiladi.\n\n"
        "<b>2. Tarjimon:</b>\n"
        "• O'zbek, ingliz va rus tillari o'rtasida istalgan matnni tarjima qilishingiz mumkin.\n\n"
        "<b>3. Shaxsiy lug'at:</b>\n"
        "• Yangi o'rgangan so'zlaringizni saqlang va 'So'z yodlash testi' orqali mustahkamlang.\n\n"
        "<b>4. Mantiqiy fikrlash:</b>\n"
        "• Mantiqiy zehnni charxlovchi nostandart savollar va ularning batafsil yechimlari.\n\n"
        "<b>5. Reyting va yutuqlar:</b>\n"
        "• Har bir to'g'ri javob uchun XP ball to'plang va ko'krak nishonlarini oching!"
    )
    await message.answer(help_text, reply_markup=main_menu_keyboard(), parse_mode="HTML")


@router.message(F.text == "ℹ️ Bot haqida")
async def handle_about(message: Message):
    """Bot haqida ma'lumot."""
    about_text = (
        "<b>ℹ️ ZIYOLI BOT HAQIDA</b>\n\n"
        "<b>Versiya:</b> 1.0.0 (Professional Edition)\n"
        "<b>Platforma:</b> Python 3.12+ & aiogram 3\n"
        "<b>Maqsad:</b> O'quvchilar, abituriyentlar va mustaqil bilim oluvchilar uchun "
        "qulay, zamonaviy va tizimli elektron ta'lim platformasini taqdim etish.\n\n"
        "<b>Asosiy xususiyatlar:</b>\n"
        "✅ 6 ta muhim fan bo'yicha 140+ sifatli va tushuntirishli testlar\n"
        "✅ Shaxsiy flesh-kartali lug'at tizimi\n"
        "✅ O'zbekistonning 2023-yilgi yangilangan qonunchiligi asosidagi huquqiy testlar\n"
        "✅ Ko'p tilli tarjimon moduli\n"
        "✅ Intellektual mantiqiy mashqlar\n"
        "✅ Halol reyting va yutuqlar (badges) tizimi\n\n"
        "<i>Ilm olishda sizga ulkan zafarlar tilaymiz! 🌟</i>"
    )
    await message.answer(about_text, reply_markup=main_menu_keyboard(), parse_mode="HTML")


@router.message(F.text == "⚙️ Sozlamalar")
async def handle_settings(message: Message):
    """Sozlamalar bo'limi."""
    user = message.from_user
    settings_text = (
        f"<b>⚙️ SOZLAMALAR VA PROFIL MA'LUMOTLARI</b>\n\n"
        f"👤 <b>Foydalanuvchi:</b> {escape_html(user.full_name)}\n"
        f"🆔 <b>Telegram ID:</b> <code>{user.id}</code>\n"
        f"🌐 <b>Tizim tili:</b> O'zbek tili (Lotin)\n"
        f"🔔 <b>Bildirishnomalar:</b> Faol\n\n"
        f"<i>Agar sizda bot ishlashi bo'yicha taklif yoki savollar bo'lsa, "
        f"adminga murojaat qilishingiz mumkin.</i>"
    )
    await message.answer(settings_text, reply_markup=main_menu_keyboard(), parse_mode="HTML")


@router.message(F.text == "🏠 Bosh menyu")
async def handle_back_home(message: Message, state: FSMContext):
    """Har qanday joydan bosh menyuga qaytish."""
    await state.clear()
    await message.answer(
        "🏠 <b>Asosiy menyudasiz.</b> Kerakli bo'limni tanlang:",
        reply_markup=main_menu_keyboard(),
        parse_mode="HTML",
    )


@router.callback_query(F.data == "main_menu")
async def handle_callback_main_menu(call: CallbackQuery, state: FSMContext):
    """Inline tugma orqali asosiy menyuga qaytish."""
    await state.clear()
    await call.message.answer(
        "🏠 <b>Asosiy menyudasiz.</b> Kerakli bo'limni tanlang:",
        reply_markup=main_menu_keyboard(),
        parse_mode="HTML",
    )
    await call.answer()
