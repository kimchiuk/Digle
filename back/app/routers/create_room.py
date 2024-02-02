from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, BusinessUser ,UserType
from services.auth_service import get_user_by_token, hash_password, verify_password
from schemas.user_schema import UserLogin
from routers import oauth_login, room_handler
from schemas.user_schema import UserCreate
from schemas.user_schema import UserCreate, UserLogin
from database import get_db
from models.user import BusinessUser, EmailVerification, User
from models.room import RoomInfo
from services.auth_service import (
    create_access_token,
    generate_internal_id,
    hash_password,
    verify_password,
)
from jose import jwt


router = APIRouter(tags=["create_room_request"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

http_bearer = HTTPBearer()


@router.post("/create_room_request")
async def create_room_request(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")

    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    

@router.post("/create_test_room_request")
async def create_room_request(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")

    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    
    # 유저 타입 비즈니스 일 경우만
    if user.user_type == UserType.Business:
        # room = RoomInfo(
        #     id = Column(Integer, primary_key=True, index=True)
        #     room_id = Column(Integer, unique=True, index=True)
        #     host_id = Column(Integer, unique=True, index=True)
        #     host_session = Column(String, unique=True, index=True)
        #     access_token = Column(String, unique=True, index=True)
        #     create_time = Column(DateTime, default=datetime.utcnow)
        #     room_type = Column(String, unique=True, index=True)
        # )
        # db.add(room)
        # db.commit()
        # db.refresh(room)
        pass