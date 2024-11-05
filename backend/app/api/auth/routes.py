from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...api.auth.helper import login, signup

from ...core.database import get_db
from ...model.db_model import User
from ...model.user_model import LoginUserModel, SignUserModel

router = APIRouter(prefix="/auth")


@router.post("/login")
def login_user(userModel: LoginUserModel, db: Session = Depends(get_db)):
    return login(userModel, db)


@router.post("/signup")
def signup_user(userModel: SignUserModel, db: Session = Depends(get_db)):
    return signup(userModel, db)
