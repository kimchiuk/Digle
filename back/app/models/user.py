# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base  # database.py에서 Base 클래스를 임포


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    internal_id = Column(String, unique=True, index=True)  # 모든 유저에 대한 고유 식별자
    email = Column(String, index=True)
    name = Column(String)

    hashed_password = Column(String)  # 실제 저장되는 비밀번호는 해시됨

    user_type = Column(Enum("Standard", "Business"))

    is_additional_info_provided = Column(Boolean, default=False)

    auth_provider = Column(Enum("Google", "Naver", "Kakao", "None"))
    auth_provider_id = Column(String, nullable=True)  # OAuth 공급자의 고유 식별자

    profile_picture_url = Column(String, nullable=True)  # 프로필 사진 URL

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    business_user = relationship("BusinessUser", back_populates="user", uselist=False)


class BusinessUser(Base):
    __tablename__ = "business_users"

    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    company_info = Column(Text)
    company_email = Column(String)
    company_address = Column(String)

    user = relationship("User", back_populates="business_user")
