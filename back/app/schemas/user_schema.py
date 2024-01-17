# app/schemas/user_schema.py
from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class User(BaseModel):
    id: int
    username: str
    email: str
    additional_info_submitted: bool

    class Config:
        orm_mode = True
