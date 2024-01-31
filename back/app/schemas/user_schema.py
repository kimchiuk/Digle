from pydantic import BaseModel, EmailStr, validator

from models.user import UserType


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

        # 대문자, 소문자, 특수문자 중 적어도 하나 이상 포함
        has_upper = any(char.isupper() for char in value)
        has_lower = any(char.islower() for char in value)
        has_special = any(char in "!@#$%^&*()-_=+[]{}|;:'\",.<>?/~`" for char in value)

        if not (has_upper and has_lower and has_special):
            raise ValueError(
                "Password must include at least one uppercase letter, one lowercase letter, and one special character"
            )

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
