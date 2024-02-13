import os
from dotenv import load_dotenv
from fastapi import APIRouter, Form, HTTPException, Response, Request, Depends
from sqlalchemy.orm import Session
from database import get_db

from services.auth_service import get_user_by_token, verify_password

router = APIRouter(tags=["auth_ext"])

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"


@router.post("/logout")
async def logout(response: Response):
    # 쿠키를 만료시키거나 빈 값으로 설정
    response.headers.append(
        "Set-Cookie",
        "__Host-access_token=deleted; Path=/; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    )
    return {"message": "Logged out"}


@router.post("/verifyToken")
async def verifyToken(request: Request, db: Session = Depends(get_db)):
    user = get_user_by_token(request, db, "service_access")
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not user.is_additional_info_provided:
        return {"message": "Token is valid", "action": "Additional_info_needed"}
    return {"message": "Token is valid"}


@router.post("/delete_account")
async def delete_accounts(
    request: Request,
    response: Response,
    email: str = Form(None),
    password: str = Form(None),
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")
    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    if email != user.email and user.auth_provider == "None" and not verify_password(password, user.hashed_password):
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
            samesite="None",
            path="/",
        )

        return {"message": "회원 탈퇴가 성공적으로 완료되었습니다."}  # 들여쓰기 확인
    else:
        raise HTTPException(status_code=404, detail="해당 ID 등록된 사용자가 없습니다.")