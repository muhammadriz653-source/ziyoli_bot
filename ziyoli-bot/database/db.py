"""
Ziyoli Bot - Ma'lumotlar bazasi ulanishi va sessiyalarni boshqarish.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from config import DATABASE_URL
from database.models import Base

# Async dvigatelni yaratish
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

# Async sessiyalar fabrikasi
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def init_db() -> None:
    """Ma'lumotlar bazasini va barcha jadvallarni initsializatsiya qilish."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Async sessiya kontekst menejeri."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
