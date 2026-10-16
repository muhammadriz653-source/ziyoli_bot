"""
Ziyoli Bot - Tarjima xizmatini tekshirish uchun testlar.
"""

import pytest
from services.translation_service import translation_service


@pytest.mark.asyncio
async def test_translation_service_pairs():
    """Tarjima xizmatining parametrlar va bo'sh matn tekshiruvlarini sinash."""
    # Bo'sh matn tekshiruvi
    success, res, pair = await translation_service.translate(text="", pair_key="uz_en")
    assert success is False
    assert "matn kiriting" in res

    # Noma'lum yo'nalish
    success, res, pair = await translation_service.translate(text="Salom", pair_key="invalid_pair")
    assert success is False
    assert "Noma'lum" in res

    # Haqiqiy tarjima sinovi (Internet mavjud bo'lsa)
    success, res, pair = await translation_service.translate(text="Kitob", pair_key="uz_en")
    if success:
        assert isinstance(res, str)
        assert len(res) > 0
    else:
        # Tarmoq cheklovi bo'lsa ham xato xushmuomala matn qaytarishi kerak
        assert isinstance(res, str)
