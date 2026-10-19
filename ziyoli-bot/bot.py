"""
Ziyoli Bot - Professional Ta'lim Telegram Boti.
Asosiy ishga tushirish moduli (bot.py).
"""

import os
import sys
import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import BotCommand, BotCommandScopeDefault

from config import (
    BOT_TOKEN,
    ADMIN_IDS,
    setup_logging,
    validate_config,
)
from database.db import init_db
from handlers import main_router

logger = logging.getLogger(__name__)


async def start_health_check_server(port: int) -> None:
    """Render/Cloud platformalari uchun mini health-check server."""
    try:
        from aiohttp import web

        async def handle_ping(request):
            return web.Response(text="Ziyoli Bot is alive and running!", status=200)

        app = web.Application()
        app.router.add_get("/", handle_ping)
        app.router.add_get("/health", handle_ping)
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, "0.0.0.0", port)
        await site.start()
        logger.info(f"Health-check server 0.0.0.0:{port} manzilida ishga tushdi.")
    except Exception as exc:
        logger.warning(f"Health-check serverni ishga tushirishda xatolik: {exc}")



async def set_bot_commands(bot: Bot) -> None:
    """Telegram ilovasida menyu buyruqlarini sozlash."""
    commands = [
        BotCommand(command="start", description="Botni ishga tushirish / Bosh menyu"),
        BotCommand(command="help", description="Yordam va foydalanish qo'llanmasi"),
        BotCommand(command="admin", description="Administrator paneli (faqat adminlar)"),
    ]
    await bot.set_my_commands(commands, scope=BotCommandScopeDefault())


async def on_startup(bot: Bot) -> None:
    """Bot ishga tushganda bajariladigan amallar."""
    logger.info("Ma'lumotlar bazasi initsializatsiya qilinmoqda...")
    await init_db()
    logger.info("Ma'lumotlar bazasi muvaffaqiyatli tayyorlandi.")

    # Buyruqlarni sozlash
    await set_bot_commands(bot)

    # Bot haqidagi ma'lumot
    bot_info = await bot.get_me()
    logger.info(f"Bot muvaffaqiyatli ishga tushdi: @{bot_info.username} [{bot_info.id}]")

    # Adminlarga xabar berish (ixtiyoriy)
    for admin_id in ADMIN_IDS:
        try:
            await bot.send_message(
                chat_id=admin_id,
                text="🟢 <b>Ziyoli Bot ishga tushdi va faol holatda!</b>",
                parse_mode=ParseMode.HTML,
            )
        except Exception:
            pass


async def on_shutdown(bot: Bot) -> None:
    """Bot to'xtatilganda bajariladigan amallar."""
    logger.info("Bot to'xtatilmoqda...")
    await bot.session.close()
    logger.info("Bot to'xtatildi.")


async def main() -> None:
    """Asosiy asinxron ishga tushirish funksiyasi."""
    # Log tizimini sozlash
    setup_logging()

    # Konfiguratsiyani tekshirish
    is_valid, validation_msg = validate_config()
    if not is_valid:
        logger.error(f"Konfiguratsiya xatosi: {validation_msg}")
        print("\n" + "=" * 60)
        print("DIQQAT: BOT TOKEN SOZLANMAGAN!")
        print("Iltimos, '.env' faylini oching va BotFather'dan olingan tokenni kiriting:")
        print("BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRstuVWXyz")
        print("=" * 60 + "\n")
        sys.exit(1)

    # Bot va Dispatcherni yaratish
    bot = Bot(token=BOT_TOKEN)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    # Routerlarni ulash
    dp.include_router(main_router)

    # Startup va Shutdown hodisalari
    dp.startup.register(on_startup)
    dp.shutdown.register(on_shutdown)

    # Cloud/Render Web Service uchun mini health-check server
    web_port = os.getenv("PORT")
    if web_port:
        try:
            await start_health_check_server(int(web_port))
        except ValueError:
            pass

    # Eski xabarlarni tozalash va pollingni boshlash
    try:
        await bot.delete_webhook(drop_pending_updates=True)
        logger.info("Long polling boshlandi...")
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await bot.session.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot qo'lda to'xtatildi.")
