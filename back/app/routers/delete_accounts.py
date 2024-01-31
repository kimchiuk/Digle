import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.services.auth_service import hash_password, verify_password
from app.schemas.user_schema import UserLogin
from ..routers import oauth_login, room_handler
from app.schemas.user_schema import UserCreate
from app.schemas.user_schema import UserCreate, UserLogin
from ..database import get_db
from app.models.user import BusinessUser, EmailVerification, User
from app.services.auth_service import (
    create_access_token,
    generate_internal_id,
    hash_password,
    verify_password,
)
from jose import jwt

router = APIRouter(tags=["delete_accounts"])

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"


@router.post("/delete_account")
async def delete_accounts(
    request: Request,
    response: Response,
    email: str = Form(None),
    password: str = Form(None),
    db: Session = Depends(get_db),
):
    token = request.get.cookie("__Host-access_token")
    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    internal_id = payload.get("sub")

    user = db.query(User).filter(User.internal_id == internal_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    if email != user.email:
        if user.auth_provider == "None" and not verify_password(password, user.hashed_password):
            raise HTTPException()
    if user:
        # 회원 탈퇴 로직 추가
        db.delete(user)
        db.commit()

        # 쿠키 삭제
        response.delete_cookie(
            key="__Host-access_token",
            httponly=True,
            secure=True,
            samesite=None,
            path="/",
        )
        return {"message": "회원 탈퇴가 성공적으로 완료되었습니다."}  # 들여쓰기 확인
    else:
        raise HTTPException(status_code=404, detail="해당 ID 등록된 사용자가 없습니다.")
