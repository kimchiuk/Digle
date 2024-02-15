import base64
from datetime import datetime
from email.message import EmailMessage
from email.mime.text import MIMEText
import json
import os
import smtplib
import uuid
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response, UploadFile
from sqlalchemy.orm import Session

from database import get_db

from models.user import EmailVerification, User


# email verify
from dotenv import load_dotenv


router = APIRouter(tags=["Email Services"])


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
        body = f"인증 코드입니다. 3분 이내에 인증을 완료해주세요. \n\n {verification_code}"  # 실제 시나리오에서는 동적으로 생성해야 합니다.
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
    print("여기냐?")
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
        print("여긴가?")
        server.starttls()
        print("이거 안나오면 여기겠지")
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


@router.post("/send_faq")
async def send_faq_email(
    email: str = Form(...),
    questionTitle: str = Form(...),
    questionContent: str = Form(...),
    db: Session = Depends(get_db),
):
    target_email = "kipperhr@naver.com"  # 이메일을 받을 주소
    subject = f"FAQ Question: {questionTitle}"
    body = f"Question Title: {questionTitle}\nQuestion Content: {questionContent}\nFrom: {email}"

    try:
        send_email(target_email, subject, body)
        return {"message": "FAQ email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
