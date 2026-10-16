"""
Ziyoli Bot - Konfiguratsiya moduli.
Ushbu modul barcha konfiguratsiya parametrlarini .env faylidan o'qiydi
va loyihaning barcha qismlari uchun taqdim etadi.
"""

import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv

# Loyihaning asosiy papkasi
BASE_DIR = Path(__file__).resolve().parent

# .env faylini yuklash
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
else:
    load_dotenv()

# Asosiy parametrlar
BOT_TOKEN: str = os.getenv("BOT_TOKEN", "").strip()

# Adminlar ID ro'yxati (vergul bilan ajratilgan int qiymatlar)
admin_ids_raw = os.getenv("ADMIN_IDS", "").strip()
ADMIN_IDS: list[int] = []
if admin_ids_raw:
    for item in admin_ids_raw.split(","):
        clean_item = item.strip()
        if clean_item.isdigit():
            ADMIN_IDS.append(int(clean_item))

# Ma'lumotlar bazasi URL manzili
DATABASE_URL: str = os.getenv(
    "DATABASE_URL", f"sqlite+aiosqlite:///{BASE_DIR / 'ziyoli.db'}"
)

# Tarjima xizmati kaliti (ixtiyoriy)
TRANSLATION_API_KEY: str = os.getenv("TRANSLATION_API_KEY", "").strip()

# Loglash darajasi
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()

# Ma'lumotlar papkasi
DATA_DIR = BASE_DIR / "data"

# Log fayli
LOG_FILE = BASE_DIR / "bot.log"


def setup_logging():
    """Tizim bo'yicha loggerni sozlash."""
    level = getattr(logging, LOG_LEVEL, logging.INFO)
    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(LOG_FILE, encoding="utf-8"),
        ],
    )
    # Ba'zi uchinchi tomon loglarini yumshatish
    logging.getLogger("aiogram").setLevel(level)
    logging.getLogger("aiohttp").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def validate_config() -> tuple[bool, str]:
    """Konfiguratsiya to'liqligini tekshirish."""
    if not BOT_TOKEN or BOT_TOKEN == "your_bot_token_here":
        return (
            False,
            "BOT_TOKEN sozlanmagan! Iltimos, .env faylini yaratib, BotFather'dan olingan tokenni kiriting.",
        )
    return True, "Konfiguratsiya to'g'ri."
