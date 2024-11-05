import email
from pydantic import BaseModel


class SignUserModel(BaseModel):
    name: str
    email: str
    password: str


class LoginUserModel(BaseModel):
    email: str
    password: str


class UserDetailModel(BaseModel):
    id: int
    name: str
    email: str


class UserTokenModel(BaseModel):
    user_id: int
    email: str
    name: str
