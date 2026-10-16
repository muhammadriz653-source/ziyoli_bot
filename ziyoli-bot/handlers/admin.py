"""
Ziyoli Bot - Administrator boshqaruv paneli handleri.
"""

from pathlib import Path
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, FSInputFile
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from config import ADMIN_IDS, LOG_FILE
from utils.helpers import escape_html, SUBJECTS_MAP
from keyboards.menus import admin_menu_keyboard
from database.db import get_session
from database.repository import get_total_users_count, get_total_tests_count
from database.models import User
from sqlalchemy import select
from services.quiz_service import quiz_service

router = Router()


class AdminState(StatesGroup):
    """Admin FSM holatlari."""
    waiting_for_broadcast_text = State()


def is_admin(user_id: int) -> bool:
    """Foydalanuvchi admin ekanligini tekshirish."""
    return user_id in ADMIN_IDS


@router.message(Command("admin"))
async def handle_admin_command(message: Message, state: FSMContext):
    """Admin panelga kirish buyrug'i."""
    await state.clear()
    if not is_admin(message.from_user.id):
        await message.answer("⛔ <b>Kechirasiz, sizda administratorlik huquqi yo'q!</b>", parse_mode="HTML")
        return

    text = (
        "👑 <b>ZIYOLI BOT — ADMINISTRATOR PANELI</b>\n\n"
        "Xush kelibsiz, Administrator!\n"
        "Ushbu bo'lim orqali bot faoliyatini to'liq nazorat qilishingiz mumkin:\n\n"
        "• 📊 Tizim statistikasi (foydalanuvchilar, testlar)\n"
        "• 📢 Foydalanuvchilarga e'lon (broadcast) yuborish\n"
        "• 📜 Xatolar va tizim loglarini ko'rish\n\n"
        "<i>Kerakli amalni tanlang:</i>"
    )
    await message.answer(text=text, reply_markup=admin_menu_keyboard(), parse_mode="HTML")


@router.callback_query(F.data == "admin_stats")
async def show_admin_stats(call: CallbackQuery):
    """Tizim statistikasi."""
    if not is_admin(call.from_user.id):
        await call.answer("Ruxsat berilmagan.", show_alert=True)
        return

    async with get_session() as session:
        users_count = await get_total_users_count(session)
        tests_count = await get_total_tests_count(session)

    # Fanlar savollar soni
    subjects_info = ""
    total_questions = 0
    for code, meta in SUBJECTS_MAP.items():
        data = quiz_service.get_subject_data(code)
        q_count = len(data.get("questions", []))
        total_questions += q_count
        subjects_info += f"• {meta['emoji']} {meta['title']}: <b>{q_count} ta</b>\n"

    text = (
        "📊 <b>BOT TIZIM STATISTIKASI:</b>\n\n"
        f"👥 <b>Jami foydalanuvchilar:</b> {users_count} nafar\n"
        f"📝 <b>Jami ishlangan testlar:</b> {tests_count} marta\n"
        f"❓ <b>Jami savollar bazasi:</b> {total_questions} ta\n\n"
        f"<b>Fanlar bo'yicha savollar:</b>\n"
        f"{subjects_info}"
    )

    await call.message.edit_text(text=text, reply_markup=admin_menu_keyboard(), parse_mode="HTML")
    await call.answer()


@router.callback_query(F.data == "admin_broadcast")
async def start_broadcast(call: CallbackQuery, state: FSMContext):
    """Foydalanuvchilarga e'lon yuborishni boshlash."""
    if not is_admin(call.from_user.id):
        await call.answer("Ruxsat berilmagan.", show_alert=True)
        return

    await state.set_state(AdminState.waiting_for_broadcast_text)
    text = (
        "📢 <b>FOYDALANUVCHILARGA E'LON YUBORISH</b>\n\n"
        "Barcha faol foydalanuvchilarga yubormoqchi bo'lgan xabaringizni kiriting.\n"
        "<i>(Matn, emoji va HTML teglar qo'llab-quvvatlanadi).</i>\n\n"
        "Bekor qilish uchun /cancel deb yozing."
    )
    await call.message.edit_text(text=text, parse_mode="HTML")
    await call.answer()


@router.message(AdminState.waiting_for_broadcast_text, Command("cancel"))
async def cancel_broadcast(message: Message, state: FSMContext):
    """E'lonni bekor qilish."""
    await state.clear()
    await message.answer("E'lon yuborish bekor qilindi.", reply_markup=admin_menu_keyboard())


@router.message(AdminState.waiting_for_broadcast_text, F.text)
async def process_broadcast(message: Message, state: FSMContext):
    """Barcha foydalanuvchilarga e'lon xabarini tarqatish."""
    if not is_admin(message.from_user.id):
        return

    broadcast_text = message.text
    await state.clear()

    status_msg = await message.answer("⏳ <i>E'lon yuborish boshlanmoqda...</i>", parse_mode="HTML")

    async with get_session() as session:
        stmt = select(User.user_id)
        result = await session.execute(stmt)
        user_ids = result.scalars().all()

    success_count = 0
    fail_count = 0

    for uid in user_ids:
        try:
            await message.bot.send_message(
                chat_id=uid,
                text=f"📢 <b>MUHIM E'LON:</b>\n\n{broadcast_text}",
                parse_mode="HTML",
            )
            success_count += 1
        except Exception:
            fail_count += 1

    report = (
        "✅ <b>E'lon yuborish yakunlandi!</b>\n\n"
        f"📤 <b>Muvaffaqiyatli:</b> {success_count} ta\n"
        f"❌ <b>Yetib bormadi (bloklaganlar):</b> {fail_count} ta"
    )
    await status_msg.edit_text(report, reply_markup=admin_menu_keyboard(), parse_mode="HTML")


@router.callback_query(F.data == "admin_logs")
async def show_admin_logs(call: CallbackQuery):
    """Xatolar jurnali (bot.log) oxirgi qatorlarini ko'rsatish."""
    if not is_admin(call.from_user.id):
        await call.answer("Ruxsat berilmagan.", show_alert=True)
        return

    if not LOG_FILE.exists():
        await call.answer("Log fayli hozircha mavjud emas.", show_alert=True)
        return

    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
            last_lines = "".join(lines[-25:])

        if not last_lines.strip():
            last_lines = "Log jurnali bo'sh."

        log_text = (
            "📜 <b>OXIRGI XATOLAR VA TIZIM LOGLARI (Oxirgi 25 satr):</b>\n\n"
            f"<pre>{escape_html(last_lines[:3500])}</pre>"
        )
        await call.message.edit_text(text=log_text, reply_markup=admin_menu_keyboard(), parse_mode="HTML")
    except Exception as e:
        await call.answer(f"Log faylini o'qishda xatolik: {e}", show_alert=True)

    await call.answer()
