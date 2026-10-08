from pathlib import Path

from pydantic_settings import BaseSettings


ENV_FILE = Path(
    r"C:\Users\User\OneDrive\Desktop\All-Projects\FindCare-agentic-system\backend\.env"
)


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    GOOGLE_APPLICATION_CREDENTIALS: str

    class Config:
        env_file = ENV_FILE


settings = Settings()