import os
import uuid
from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from models.user import User
from database import get_db

from dotenv import load_dotenv

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
    auth_code = str(uuid.uuid4())
    

    # 이메일 전송
    message = MIMEMultipart()
    message['From'] = SMTP_SERVER
    message['To'] = email
    message['Subject'] = 'Password reset code'
    message.attach(MIMEText(f'인증 코드입니다. 3분 이내에 인증을 완료해주세요. {auth_code}'))

    try:
        mail_server = smtplib.SMTP(SMTP_SERVER, 587)
        mail_server.starttls()
        mail_server.login(SMTP_USERNAME, SMTP_PASSWORD)
        mail_server.send_message(message)
        mail_server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "The authentication code has been sent to your email."}
