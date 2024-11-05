from datetime import timedelta
from os import name
import bcrypt
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...utils.api_response import APIResponse
from ...utils.env_reader import get_jwt_token_expiry

from ...core.authentication import authenticate_user, create_access_token

from ...model.db_model import User
from ...model.user_model import LoginUserModel, SignUserModel


def generateTokenResponse(id: int, email: str, name: str, msg: str):
    token_expiry = get_jwt_token_expiry()
    access_token_expires = timedelta(minutes=token_expiry)
    access_token = create_access_token(
        data={"sub": email, "user_id": id, "name": name},
        expires_delta=access_token_expires,
    )

    res_data = {"token": access_token, "name": name}

    response = APIResponse(200, msg, res_data).send()
    response.set_cookie(
        key="auth-token", value=access_token, httponly=True, max_age=token_expiry * 60
    )
    return response


def login(userModel: LoginUserModel, db: Session):
    user = authenticate_user(db, userModel.email, userModel.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )
    return generateTokenResponse(user.id, user.email, user.name, "Login Successful")


def signup(userModel: SignUserModel, db: Session):
    name = userModel.name
    email = userModel.email
    password = userModel.password

    existingUser = db.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()
    if existingUser:
        raise HTTPException(
            status_code=400, detail="User with same email already exists."
        )

    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    user = User(name=name, email=email, password=password_hash)
    db.add(user)
    db.commit()
    db.flush(user)

    return generateTokenResponse(user.id, user.email, user.name, "Signup Successful")
