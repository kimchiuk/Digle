from pydantic import BaseModel, EmailStr, validator

from app.models.user import UserType


class UserBase(BaseModel):
    email: EmailStr
    name: str
    user_type: UserType


class UserCreate(UserBase):
    password: str

    @validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_additional_info_provided: bool
    auth_provider: str

    class Config:
        orm_mode = True


class BusinessUser(BaseModel):
    user_id: int
    company_info: str
    company_email: EmailStr
    company_address: str

    class Config:
        orm_mode = True
