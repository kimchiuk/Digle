from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
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


# @router.post("/create_room_request")
# async def create_room_request(
#     request: Request,
#     response: Response,
#     room_id: int = Form(None),
#     room_type: str = Form(None),
#     db: Session = Depends(get_db),
# ):
#     user = get_user_by_token(request, db, "service_access")

#     if not user:
#         raise HTTPException(status_code=404, detail="Not found User")
    
#     room = RoomInfo(
#         host_id = user.id,
#         room_id = room_id,
#         host_name = user.name,
#         # room_type = "TestRoom", "Room"
#         room_type = room_type
#     )
#     db.add(room)
#     db.commit()
#     db.refresh(room)
#     return JSONResponse(
#         status_code=200, 
#         content={ "message" : "room create OK" },
#         headers=dict(response.headers)
#     )



# @router.post("/create_test_room_request")
# async def create_testroom_request(
#     request: Request,
#     response: Response,
#     room_title: str = Form(None),
#     room_type: str = Form(None),
#     db: Session = Depends(get_db),
# ):
#     user = get_user_by_token(request, db, "service_access")

#     if not user:
#         raise HTTPException(status_code=404, detail="Not found User")
    
#     # 유저 타입 비즈니스 일 경우만
#     if user.user_type == UserType.Business and room_type == "TestRoom":
#         room = RoomInfo(
#             host_id = user.id,
#             room_title = room_title,
#             host_name = user.name,
#             # room_type = "TestRoom", "Room"
#             room_type = room_type
#         )
#         db.add(room)
#         db.commit()
#         db.refresh(room)

#         return JSONResponse(
#             status_code=200, 
#             content={"message" : "TestRoom Created"}, 
#             headers=dict(response.headers)
#         )
#     elif user.user_type == UserType.Standard:
#         raise HTTPException(status_code=401, detail="UserType no match")