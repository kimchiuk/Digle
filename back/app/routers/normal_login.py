import base64
from datetime import datetime
from email.message import EmailMessage
from email.mime.text import MIMEText
import json
import os
import smtplib
import uuid
from fastapi import APIRouter, BackgroundTasks, Form, HTTPException, Request, Depends, Response, UploadFile
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session
from services.utils import request_embedding, upload_to_gcs, save_to_local_directory

from schemas.user_schema import UserCreate, UserLogin
from database import get_db

from models.user import BusinessUser, EmailVerification, User
from services.auth_service import (
    create_access_token,
    generate_internal_id,
    hash_password,
    verify_password,
)

# email verify
from dotenv import load_dotenv

router = APIRouter(tags=["normal_auth"])


@router.post("/regist")
async def login_for_access_token(
    response: Response,
    request: Request,
    background_tasks: BackgroundTasks,
    email: str = Form(None),
    name: str = Form(None),
    password: str = Form(None),
    profile_img: UploadFile = Form(None),
    # profile_img: str = Form(None),
    user_type: str = Form(None),
    company_info: str = Form(None),
    company_email: str = Form(None),
    company_address: str = Form(None),
    db: Session = Depends(get_db),
):
    email_verification = db.query(EmailVerification).filter_by(email=email, is_verified=True).first()
    if not email_verification:
        raise HTTPException(status_code=400, detail="Email verification required")

    file_location = None
    base_data = UserCreate(
        email=email,
        password=password,
        name=name,
        user_type=user_type,
    )
    email_duplicate = db.query(User).filter(User.auth_provider == "None").filter(User.email == email).first()

    # Base64로 인코딩된 문자열을 디코딩하여 바이트 데이터로 변환
    # file_data = base64.b64decode(encoded_file)

    if email_duplicate:
        raise HTTPException(status_code=409, detail="Invalid or expired token")

    internal_id = generate_internal_id()
    file_path = None
    profile_picture_url = None

    while db.query(User).filter(User.internal_id == internal_id).first():
        internal_id = generate_internal_id()

    if profile_img and profile_img.filename:
        """파일 저장 또는 처리
        file_location = f"C:/files/{profile_img.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(profile_img.file.read())
        """
        file_path = f"profiles/{internal_id}"
        file_name = profile_img.filename.split(".")[-1]
        # background_tasks.add_task(upload_to_gcs, profile_img, file_path)
        # upload_to_gcs(profile_img, file_path, internal_id)
        # print("너가 문제니?")
        save_to_local_directory(profile_img, file_name, internal_id)

        # profile_picture_url = f"C:/files/{internal_id}.{profile_img.filename.split('.')[-1]}"
        profile_picture_url = f"/app/storage/{internal_id}.{profile_img.filename.split('.')[-1]}"

    user = User(
        email=base_data.email,
        hashed_password=hash_password(base_data.password),
        name=base_data.name,
        profile_picture_url=profile_picture_url,
        user_type=user_type,
        internal_id=internal_id,
        auth_provider="None",
        is_additional_info_provided=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if profile_img and profile_img.filename:
        try:
            data = await request_embedding(profile_img, internal_id)
            encoded_data = data.get("encoded_data")
            binary_data = base64.b64decode(encoded_data)
            user.embedded_profile = binary_data
            db.commit()
        except:
            pass

    if user_type == "Business":
        business_data = BusinessUser(
            id=user.id,
            company_info=company_info,
            company_email=company_email,
            company_address=company_address,
        )
        db.add(business_data)
        db.commit()
        db.refresh(business_data)
    access_token = create_access_token(internal_id, "service_access")

    response.set_cookie(
        key="__Host-access_token",
        value=access_token,
        httponly=False,
        secure=True,
        samesite="None",
        path="/",
        max_age=3600,
    )

    # 이메일 인증 row 삭제
    db.delete(email_verification)
    db.commit()
    return JSONResponse(
        status_code=200,
        content={"message": "Additional Info Required", "action": "request_additional_info"},
        headers=dict(response.headers),
    )


@router.post("/login")
async def login_for_access_token(
    response: Response,
    request: Request,
    email: str = Form(None),
    password: str = Form(None),
    db: Session = Depends(get_db),
):
    login_data = UserLogin(email=email, password=password)
    # 유저정보 추출
    user = db.query(User).filter(User.auth_provider == "None").filter(User.email == login_data.email).first()
    if user:
        if verify_password(login_data.password, user.hashed_password):
            # 그걸로 access token을 생성
            access_token = create_access_token(user.internal_id, "service_access")
            # access token을 보안때문에 header에다 cookie를 담아서 줄것.
            response.set_cookie(
                key="__Host-access_token",
                value=access_token,
                httponly=False,
                secure=True,
                samesite="None",
                # domain = '어쩌고 저쩌고',
                path="/",  # 전체 경로에서 사용
                max_age=3600,  # 예: 1시간 유효기간
            )
            return JSONResponse(
                status_code=200,
                content={"message": "Login OK"},
                headers=dict(response.headers),
            )
        else:
            return JSONResponse(
                status_code=400,
                content={"message": "Invalid Password"},
                headers=dict(response.headers),
            )
    else:
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid Email"},
            headers=dict(response.headers),
        )


@router.post("/check_duplicate_email")
async def request_verify_email(
    response: Response,
    request: Request,
    email: str = Form(None),
    db: Session = Depends(get_db),
):
    # 이메일 중복 확인
    email_duplicate = db.query(User).filter(User.auth_provider == "None").filter(User.email == email).first()
    if email_duplicate:
        raise HTTPException(status_code=409, detail="Email already registered")
    return JSONResponse(
        status_code=200,
        content={"message": "Can use email"},
        headers=dict(response.headers),
    )
