import os
from fastapi import APIRouter, Depends, Form, HTTPException, Response
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


router = APIRouter(tags=["delete_accounts"])

@router.post("/delete_account")
async def delete_accounts(
    response: Response,
    email: str = Form(None),
    password: str = Form(None),
    db: Session = Depends(get_db),
):
    login_data = UserLogin(email=email, password=password)

    # 유저정보 추출
    user = db.query(User).filter(User.auth_provider == "None").filter(User.email == login_data.email).first()

    if user:
        if verify_password(login_data.password, user.hashed_password):
            # 회원 탈퇴 로직 추가
            db.delete(user)
            db.commit()

            # 쿠키 삭제
            response.delete_cookie(
                key="__Host-access_token",
                hyyponly=False,
                secure=True,
                samesite=None,
                path="/",
            )

            return {"message": "회원 탈퇴가 성공적으로 완료되었습니다."}  # 들여쓰기 확인
        else:
            raise HTTPException(
                status_code=401,
                detail="비밀번호가 일치하지 않습니다.",
            )
    else:
        raise HTTPException(
            status_code=404,
            detail="해당 이메일로 등록된 사용자가 없습니다."
        )
