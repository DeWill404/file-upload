from datetime import datetime, timedelta, timezone
import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..model.user_model import UserTokenModel
from ..model.db_model import User
from ..utils.env_reader import get_jwt_algo, get_jwt_secret


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone(timedelta(0))) + expires_delta
    else:
        expire = datetime.now(timezone(timedelta(0))) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, get_jwt_secret(), algorithm=get_jwt_algo())


def verify_password(plain_password: str, hashed_password: str):
    _plain_password = plain_password.encode("utf-8")
    _hashed_password = hashed_password.encode("utf-8")
    return bcrypt.checkpw(_plain_password, _hashed_password)


def get_user(db: Session, email: str):
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user:
        return user


def authenticate_user(db: Session, username: str, password: str):
    user: User = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def decode_jwt_token(token: HTTPAuthorizationCredentials):
    try:
        payload = jwt.decode(
            token.credentials, get_jwt_secret(), algorithms=[get_jwt_algo()]
        )
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        name: int = payload.get("name")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return UserTokenModel(user_id=user_id, email=email, name=name)
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


bearer_scheme = HTTPBearer()


def get_current_user(token: str = Depends(bearer_scheme)):
    return decode_jwt_token(token)
