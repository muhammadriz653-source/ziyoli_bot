"""
Ziyoli Bot - Tarjima xizmati.
Matnlarni 6 ta yo'nalishda professional va aniq tarjima qilish.
"""

import asyncio
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Til yo'nalishlari xaritasi
TRANSLATION_PAIRS = {
    "uz_en": {"name": "🇺🇿 O'zbekcha ➡️ 🇬🇧 Inglizcha", "source": "uz", "target": "en"},
    "en_uz": {"name": "🇬🇧 Inglizcha ➡️ 🇺🇿 O'zbekcha", "source": "en", "target": "uz"},
    "uz_ru": {"name": "🇺🇿 O'zbekcha ➡️ 🇷🇺 Ruscha", "source": "uz", "target": "ru"},
    "ru_uz": {"name": "🇷🇺 Ruscha ➡️ 🇺🇿 O'zbekcha", "source": "ru", "target": "uz"},
    "en_ru": {"name": "🇬🇧 Inglizcha ➡️ 🇷🇺 Ruscha", "source": "en", "target": "ru"},
    "ru_en": {"name": "🇷🇺 Ruscha ➡️ 🇬🇧 Inglizcha", "source": "ru", "target": "en"},
}


class TranslationService:
    """Tarjima xizmati."""

    @staticmethod
    def _sync_translate(text: str, source: str, target: str) -> str:
        """Sinxron tarjima qilish funksiyasi."""
        try:
            from deep_translator import GoogleTranslator

            translator = GoogleTranslator(source=source, target=target)
            return translator.translate(text)
        except ImportError:
            raise RuntimeError(
                "Tarjimon kutubxonasi o'rnatilmagan (deep-translator). "
                "Iltimos, `pip install deep-translator` buyrug'ini bajaring."
            )
        except Exception as e:
            logger.error(f"Tarjima bajarishda xatolik: {e}")
            raise e

    @classmethod
    async def translate(
        cls, text: str, pair_key: str
    ) -> tuple[bool, str, Optional[str]]:
        """
        Matnni async tarzda tarjima qilish.
        Qaytaradi: (muvaffaqiyatlimi, natija_yoki_xabar, yo'nalish_nomi)
        """
        pair_info = TRANSLATION_PAIRS.get(pair_key)
        if not pair_info:
            return False, "Noma'lum tarjima yo'nalishi tanlandi.", None

        text = text.strip()
        if not text:
            return False, "Iltimos, tarjima qilish uchun matn kiriting.", pair_info["name"]

        if len(text) > 4000:
            return (
                False,
                "Matn juda uzun! Telegram cheklovlari sababli 4000 belgidan kam matn yuboring.",
                pair_info["name"],
            )

        try:
            # I/O amalini bloklamaslik uchun to_thread orqali bajaramiz
            translated_text = await asyncio.to_thread(
                cls._sync_translate,
                text,
                pair_info["source"],
                pair_info["target"],
            )

            if not translated_text:
                return False, "Tarjima natijasi bo'sh qaytdi.", pair_info["name"]

            return True, translated_text, pair_info["name"]

        except RuntimeError as re:
            return False, str(re), pair_info["name"]
        except Exception as ex:
            logger.exception("Tarjima API xatosi")
            return (
                False,
                "Tarjima xizmatiga ulanishda vaqtinchalik uzilish yuz berdi. "
                "Iltimos, internet aloqasini tekshiring yoki birozdan so'ng qayta urinib ko'ring.",
                pair_info["name"],
            )


translation_service = TranslationService()
