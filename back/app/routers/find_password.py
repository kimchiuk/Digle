import os
import uuid
from fastapi import APIRouter, Form, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from models.user import User
from database import get_db
from datetime import datetime
from models.user import PasswordResetVerification

from dotenv import load_dotenv

from services.auth_service import hash_password, check_password

load_dotenv()
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

router = APIRouter(tags=["find_password"])

@router.post("/find_password")
async def find_password(
    name: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    # DB에서 사용자 이름과 이메일로 검색
    user = db.query(User).filter(User.name == name, User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 인증 코드 생성
    verification_code = str(uuid.uuid4())
    
    # 인증 코드와 유효 시간을 DB에 저장
    password_reset_verification = db.query(PasswordResetVerification).filter_by(user_id=user.id).first()
    if password_reset_verification:
        password_reset_verification.verification_code = verification_code
        password_reset_verification.created_at = datetime.utcnow()
    else:
        password_reset_verification = PasswordResetVerification(user_id=user.id, verification_code=verification_code)
    db.add(password_reset_verification)
    db.commit()

    # 이메일 전송
    message = MIMEMultipart()
    message['From'] = SMTP_SERVER
    message['To'] = email
    message['Subject'] = 'Password reset code'
    message.attach(MIMEText(f'인증 코드입니다. 3분 이내에 인증을 완료해주세요.\n\n {verification_code}'))

    try:
        mail_server = smtplib.SMTP(SMTP_SERVER, 587)
        mail_server.starttls()
        mail_server.login(SMTP_USERNAME, SMTP_PASSWORD)
        mail_server.send_message(message)
        mail_server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "The authentication code has been sent to your email."}


@router.post("/verify_password_reset")
async def verify_password_reset(
    email: str = Form(...),
    auth_code: str = Form(...),
    db: Session = Depends(get_db)
):
    # DB에서 사용자 이메일로 검색
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # DB에서 인증 코드 검색
    password_reset_verification = db.query(PasswordResetVerification).filter_by(user_id=user.id).first()
    if not password_reset_verification:
        raise HTTPException(status_code=404, detail="Verification code not found")

    # 인증 코드와 시간 확인
    if password_reset_verification.verification_code != auth_code or password_reset_verification.is_expired():
        raise HTTPException(status_code=401, detail="Invalid or expired verification code")

    # 인증 완료
    password_reset_verification.is_verified = True
    db.commit()

    return {"message": "Authentication successful. Please reset your password."}


@router.post("/reset_password")
async def reset_password(
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    db: Session = Depends(get_db),
):
    # DB에서 사용자 이메일로 검색
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # DB에서 인증 상태 확인
    password_reset_verification = db.query(PasswordResetVerification).filter_by(user_id=user.id).first()
    if not password_reset_verification or not password_reset_verification.is_verified:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # 비밀번호 확인
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # 비밀번호 재설정
    user.hashed_password = hash_password(password)
    db.add(user)    # 변경된 내용을 세션에 추가
    db.commit()     # 세션의 변경 내용을 데이터베이스에 반영
    db.refresh(user)    # 변경된 내용을 데이터베이스에서 다시 읽어옴

    return {"message": "Password reset successful."}


# 입력받은 비밀번호와 DB에 저장된 비밀번호와 비교
@router.post("/change_password")
async def change_password(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # DB에서 사용자 이메일로 검색
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if check_password(password, user.hashed_password) == False:
        raise HTTPException(status_code=404, detail="No match password")

    return {"message": "Authentication successful. Please reset your password."}
