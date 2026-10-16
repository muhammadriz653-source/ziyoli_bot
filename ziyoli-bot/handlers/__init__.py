"""
Handlers package initialization.
Barcha routerlarni ro'yxatdan o'tkazish uchun yagona asosiy router.
"""

from aiogram import Router
from .start import router as start_router
from .subjects import router as subjects_router
from .tests import router as tests_router
from .translator import router as translator_router
from .dictionary import router as dictionary_router
from .logic import router as logic_router
from .profile import router as profile_router
from .admin import router as admin_router

main_router = Router()

# Routerlarni to'g'ri tartibda ulash
main_router.include_router(start_router)
main_router.include_router(subjects_router)
main_router.include_router(tests_router)
main_router.include_router(translator_router)
main_router.include_router(dictionary_router)
main_router.include_router(logic_router)
main_router.include_router(profile_router)
main_router.include_router(admin_router)

__all__ = ["main_router"]
