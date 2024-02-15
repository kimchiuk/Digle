import shutil
from fastapi import BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response, UploadFile
from sqlalchemy.orm import Session
from services.utils import request_embedding, upload_to_gcs, save_to_local_directory
from database import get_db
from models.user import User, BusinessUser, UserType
from services.auth_service import get_user_by_token, hash_password, verify_password
from schemas.user_schema import UserLogin
from routers import oauth_login, room_handler
from schemas.user_schema import UserCreate
from schemas.user_schema import UserCreate, UserLogin
from database import get_db
from models.user import BusinessUser, EmailVerification, User

from jose import jwt
import base64

router = APIRouter(tags=["user_profile"])


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

http_bearer = HTTPBearer()


@router.get("/profile")
async def read_users_me(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")
    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    # 사용자 정보를 직접 반환하거나  객체를 사용해서 반환
    if user.user_type == UserType.Standard:
        encoded_image = None
        file_location = user.profile_picture_url
        if file_location is not None:
            with open(file_location, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode("utf-8")
        user_data = {
            "email": user.email,
            "name": user.name,
            "profile_picture_url": encoded_image,
            "user_type": user.user_type,
            "auth_provider": user.auth_provider,
        }
        return user_data

    elif user.user_type == UserType.Business:
        business_user = db.query(BusinessUser).filter(BusinessUser.id == user.id).first()
        print(business_user)
        user_data = {
            "email": user.email,
            "name": user.name,
            "user_type": user.user_type,
            "auth_provider": user.auth_provider,
            "company_info": business_user.company_info,
            "company_email": business_user.company_email,
            "company_address": business_user.company_address,
        }
        return user_data


@router.put("/profile")
async def update_user_profile(
    request: Request,
    response: Response,
    background_tasks: BackgroundTasks,
    email: str = Form(None),
    name: str = Form(None),
    profile_img: UploadFile = Form(None),
    user_type: str = Form(None),
    company_info: str = Form(None),
    company_email: str = Form(None),
    company_address: str = Form(None),
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")
    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    if user.user_type == UserType.Standard:
        file_location = None
        print(profile_img)
        if profile_img and profile_img.filename:
            """파일 저장 또는 처리
            file_location = f"C:/files/{profile_img.filename}"
            with open(file_location, "wb+") as file_object:
                file_object.write(profile_img.file.read())
            """
            file_path = f"profiles/{user.internal_id}"
            # background_tasks.add_task(upload_to_gcs, profile_img, file_path)
            # upload_to_gcs(profile_img, file_path, user.internal_id)
            file_name = profile_img.filename.split(".")[-1]
            save_to_local_directory(profile_img, file_name, user.internal_id)
            data = await request_embedding(profile_img, user.internal_id)
            encoded_data = data.get("encoded_data")
            binary_data = base64.b64decode(encoded_data)
            user.embedded_profile = binary_data
            user.profile_picture_url = f"/app/storage/{user.internal_id}.{profile_img.filename.split('.')[-1]}"

        user.name = name
        # user.profile_picture_url = f"C:/files/{user.internal_id}.{profile_img.filename.split('.')[-1]}"
        db.commit()
        file_base64 = base64.b64encode(profile_img.file.read()).decode("utf-8")
        user_data = {
            "email": email,
            "name": name,
            "profile_picture_url": file_base64,
            "user_type": user.user_type,
            "auth_provider": user.auth_provider,
        }
        return user_data

    elif user.user_type == UserType.Business:
        user.name = name

        business_user = db.query(BusinessUser).filter(BusinessUser.id == user.id).first()
        business_user.company_info = company_info
        business_user.company_address = company_address
        business_user.company_email = company_email

        db.commit()
        user_data = {
            "email": email,
            "name": name,
            "user_type": user.user_type,
            "auth_provider": user.auth_provider,
            "company_info": company_info,
            "company_email": company_email,
            "company_address": company_address,
        }
        return user_data
