from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Application settings.
    These are loaded from the .env file in the `backend` directory.
    """
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra='ignore')

    # Base URLs
    BASE_URL: str = "http://localhost:8000" # Base URL of the backend service (used for verification links)
    FRONTEND_URL: str = "http://localhost:3000" # Base URL of the frontend Docusaurus app

    # Database
    DATABASE_URL: str

    # Session
    SESSION_SECRET: str

    # Email Service
    SMTP_SERVER: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SENDER_EMAIL: str

    # OIDC Providers
    # Google
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    GOOGLE_METADATA_URL: str = "https://accounts.google.com/.well-known/openid-configuration"

    # GitHub
    GITHUB_CLIENT_ID: str | None = None
    GITHUB_CLIENT_SECRET: str | None = None
    GITHUB_METADATA_URL: str = "https://api.github.com/.well-known/openid-configuration" # Placeholder, actual may vary or be direct

    # Facebook
    FACEBOOK_CLIENT_ID: str | None = None
    FACEBOOK_CLIENT_SECRET: str | None = None
    FACEBOOK_METADATA_URL: str = "https://www.facebook.com/.well-known/openid-configuration" # Placeholder, actual may vary or be direct


settings = Settings()
