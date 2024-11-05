import os
from dotenv import load_dotenv

load_dotenv()


def get_db_url() -> str | None:
    return os.getenv("DATABASE_URL")


def get_jwt_secret() -> str | None:
    return os.getenv("SECRET_KEY")


def get_jwt_algo() -> str | None:
    return os.getenv("ALGORITHM")


def get_jwt_token_expiry() -> int | None:
    return int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def get_frontend_url() -> str | None:
    return os.getenv("FRONTEND_URL")
