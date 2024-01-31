from fastapi import APIRouter, HTTPException, Response, Request, Depends
from sqlalchemy.orm import Session
from database import get_db

from services.auth_service import get_user_by_token

router = APIRouter(tags=["auth_ext"])


@router.post("/logout")
async def logout(response: Response):
    # 쿠키를 만료시키거나 빈 값으로 설정
    response.delete_cookie(
        key="__Host-access_token",
        httponly=True,
        secure=True,
        samesite="None",
        # domain = 'aimipp.vercel.app',
        path="/",  # 전체 경로에서 사용
    )
    return {"message": "User logged out"}


@router.post("/verifyToken")
async def verifyToken(request: Request, db: Session = Depends(get_db)):
    user = get_user_by_token(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not user.additional_info_submitted:
        return {"message": "Token is valid", "action": "Additional_info_needed"}
    return {"message": "Token is valid"}
