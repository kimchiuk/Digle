import smtplib
from email.mime.text import MIMEText
from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session

from database import get_db
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# FAQ 관련 라우터 설정
router = APIRouter(tags=["faq"])

def send_email(receiver_email: str, subject: str, body: str):
    """이메일을 전송하는 함수"""
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = SMTP_USERNAME
    message["To"] = receiver_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()  # TLS 연결 시작
        server.login(SMTP_USERNAME, SMTP_PASSWORD)  # 로그인
        server.sendmail(SMTP_USERNAME, receiver_email, message.as_string())  # 이메일 전송

    
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

