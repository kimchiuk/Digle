from email.message import EmailMessage
import smtplib
import uuid
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response, UploadFile
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserLogin
from ..database import get_db

from app.models.user import BusinessUser, EmailVerification, User
from app.services.auth_service import (
    create_access_token,
    generate_internal_id,
    hash_password,
    integer_to_8_digit_string_with_hash,
    verify_password,
)


router = APIRouter(tags=["normal_auth"])


@router.post("/regist")
async def login_for_access_token(
    response: Response,
    request: Request,
    email: str = Form(None),
    name: str = Form(None),
    password: str = Form(None),
    profile_img: UploadFile = Form(None),
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
    if email_duplicate:
        raise HTTPException(status_code=409, detail="Invalid or expired token")
    if profile_img and profile_img.filename:
        # 파일 저장 또는 처리
        file_location = f"files/{profile_img.filename}"
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
    access_token = create_access_token(internal_id)

    response.set_cookie(
        key="__Host-access_token",
        value=access_token,
        httponly=False,
        secure=True,
        samesite=None,
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
            access_token = create_access_token(user.internal_id)
            # access token을 보안때문에 header에다 cookie를 담아서 줄것.
            response.set_cookie(
                key="access_token",
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


@router.post("/request_verify_email")
async def login_for_access_token(
    response: Response,
    request: Request,
    email: str = Form(None),
    db: Session = Depends(get_db),
):
    email_duplicate = db.query(User).filter(User.auth_provider == "None").filter(User.email == email).first()
    if email_duplicate:
        raise HTTPException(status_code=409, detail="Invalid or expired token")

    verification_code = str(uuid.uuid4())
    send_verification_email(email, verification_code)

    email_verification = EmailVerification(email=email, verification_code=verification_code)
    db.add(email_verification)
    db.commit()
    db.refresh(email_verification)
    return {"message": "Verification email sent"}


def send_verification_email(user_email, verification_code):
    msg = EmailMessage()
    msg["Subject"] = "Verify your email"
    msg["From"] = "gumid107@gmail.com"
    msg["To"] = user_email
    msg.set_content(f"Please verify your email using this code: {verification_code}")

    # SMTP 서버 설정 및 이메일 전송
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("gumid107@gmail.com", "Gumi1!water")
        server.send_message(msg)


@router.post("/verify_email")
async def verify_email(email: str, code: str, db: Session = Depends(get_db)):
    verification = db.query(EmailVerification).filter_by(email=email, verification_code=code).first()
    if verification and not verification.is_expired():
        verification.is_verified = True
        db.commit()
        return {"message": "Email verified successfully"}
    else:
        return {"error": "Invalid or expired verification code"}
