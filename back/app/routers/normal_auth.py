import base64
from datetime import datetime
from email.message import EmailMessage
from email.mime.text import MIMEText
import json
import os
import smtplib
import uuid
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response, UploadFile
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session

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
    if profile_img and profile_img.filename:
        # 파일 저장 또는 처리
        file_location = f"C:/files/{profile_img.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(profile_img.file.read())

    internal_id = generate_internal_id()
    while db.query(User).filter(User.internal_id == internal_id).first():
        internal_id = generate_internal_id()

    user = User(
        email=base_data.email,
        hashed_password=hash_password(base_data.password),
        name=base_data.name,
        profile_picture_url=file_location,
        user_type=user_type,
        internal_id=internal_id,
        auth_provider="None",
        is_additional_info_provided=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user_type == "Business":
        business_data = BusinessUser(
            id=user.id,
            company_info=company_info,
            company_email=company_email,
            company_address=company_address,
        )
        db.add(business_data)
        db.commit()
        db.refresh()
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


@router.post("/request_verify_email")
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

    # 인증 코드 생성
    verification_code = str(uuid.uuid4())
    # 이메일 인증 정보 저장
    email_verification = EmailVerification(email=email, verification_code=verification_code)
    email_verification = db.query(EmailVerification).filter_by(email=email).first()

    if email_verification:
        email_verification.verification_code = verification_code
        email_verification.created_at = datetime.utcnow()
    else:
        email_verification = EmailVerification(email=email, verification_code=verification_code)
    db.add(email_verification)
    db.commit()

    try:
        subject = "Your Verification Code"
        body = f"Your verification code {verification_code}"  # 실제 시나리오에서는 동적으로 생성해야 합니다.
        send_email(email, subject, body)
        return {"message": "Verification email sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# .env 파일에서 환경 변수 로드
load_dotenv()
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))  # 포트는 정수여야 합니다.
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_email(receiver_email, subject, body):
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = SMTP_USERNAME
    message["To"] = receiver_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, receiver_email, message.as_string())


@router.post("/verify_email")
async def verify_email(
    response: Response,
    request: Request,
    email: str = Form(None),
    code: str = Form(None),
    db: Session = Depends(get_db),
):
    verification = db.query(EmailVerification).filter_by(email=email, verification_code=code).first()
    if verification and not verification.is_expired():
        verification.is_verified = True
        db.commit()
        return {"message": "Email verified successfully"}
    else:
        return {"error": "Invalid or expired verification code"}
