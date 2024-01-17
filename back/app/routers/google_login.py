from fastapi import APIRouter, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session
from app.main import get_db

from app.models.user import User, UserOAuth
from app.services.auth_service import (
    create_access_token,
    integer_to_8_digit_string_with_hash,
)

router = APIRouter()


@router.post("/google_token")
async def login_for_access_token(response: Response, request: Request, token: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        google_response = await client.get(f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}")

        if google_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid token")

        user_info = google_response.json()
        user = db.query(User).filter(User.email == user_info["email"]).first()
        access_token = create_access_token(user_info["email"])
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

        if user is None:
            user = User(
                email=user_info["email"],
                name=user_info["name"],
                additional_info_submitted=False,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            ten_digit_str = integer_to_8_digit_string_with_hash(user.id)
            user.nickname = ten_digit_str
            db.commit()
            db.refresh(user)

            return_value = JSONResponse(
                status_code=200,
                content={"message": "New User", "action": "request_additional_info"},
                headers=dict(response.headers),
            )
        elif not user.additional_info_submitted:
            # 추가 정보가 아직 제출되지 않은 경우
            return_value = JSONResponse(
                status_code=200,
                content={
                    "message": "Additional Info Required",
                    "action": "request_additional_info",
                },
                headers=dict(response.headers),
            )
        else:
            return_value = JSONResponse(
                status_code=200,
                content={"message": "login complete", "user": user.email},
                headers=dict(response.headers),
            )
    return return_value
