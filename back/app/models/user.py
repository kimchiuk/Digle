# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base  # database.py에서 Base 클래스를 임포


class UserType(str, Enum):
    individual = "individual"
    business = "business"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    user_type = Column(Enum(UserType))
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    oauth_accounts = relationship("UserOAuth", back_populates="user")
    business_info = relationship("BusinessUser", back_populates="user", uselist=False)

class UserOAuth(Base):
    __tablename__ = "user_oauth"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider_name = Column(String)
    provider_user_id = Column(String)
    access_token = Column(String)
    refresh_token = Column(String)

    user = relationship("User", back_populates="oauth_accounts")

class BusinessUser(Base):
    __tablename__ = "business_users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company_name = Column(String)
    company_address = Column(String)
    contact_number = Column(String)
    approval_status = Column(String, default="pending")

    user = relationship("User", back_populates="business_info")