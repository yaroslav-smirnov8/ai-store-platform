from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Database - Use PostgreSQL by default
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ai_store"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Security
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # YooKassa
    yookassa_shop_id: Optional[str] = None
    yookassa_secret_key: Optional[str] = None
    yookassa_webhook_url: Optional[str] = ""

    # Telegram
    telegram_bot_token: Optional[str] = None
    telegram_admin_chat_id: Optional[str] = None

    # App Settings
    app_name: str = "AI Store"
    app_version: str = "1.0.0"
    debug: bool = True
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:8080",  # Adding common dev port
        "*"  # Allow all during development
    ]

    # Tuna.am
    tuna_subdomain: Optional[str] = None

    # Admin credentials (for fallback)
    react_app_admin_email: Optional[str] = "admin@aistore.com"
    react_app_admin_password: Optional[str] = "admin123"

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "allow"  # Allow extra fields in .env
    }

settings = Settings()
