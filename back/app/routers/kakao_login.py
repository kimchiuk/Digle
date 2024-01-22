from fastapi import APIRouter, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session
from app.main import get_db

from app.models.user import User
from app.services.auth_service import create_access_token, integer_to_8_digit_string_with_hash

router = APIRouter()

#인가코드로 엑세서크도
@router.post("/kakao_token")
async def login_with_kakao(response: Response, request: Request, code: str, db: Session = Depends(get_db)):
    
    # 카카오에서 제공하는 REST API Key와 Redirect URI 
    KAKAO_REST_API_KEY = "8d3911fd405c36bc63a98885dc47ef92"
    REDIRECT_URI = "http://localhost:8000/kakao-login"

    async with httpx.AsyncClient() as client:
        # 인가 코드로 액세스 토큰 받기
        token_response = await client.post(
            "https://kauth.kakao.com/oauth/token",
            headers={"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
            data={
                "grant_type": "authorization_code",
                "client_id": KAKAO_REST_API_KEY,
                "redirect_uri": REDIRECT_URI,
                "code": code,
            },
        )

        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")

        access_token = token_response.json().get("access_token", "")


        # 액세스 토큰을 사용하여 카카오 사용자 정보 가져오기
        kakao_response = await client.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )


        if kakao_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid token")


        #혹시 카카오 예외처리 존재할경우
        email = kakao_response.json().get("kakao_account", {}).get("email", "")
        user = db.query(User).filter(User.email == email).first()

        access_token = create_access_token(email)

        response.set_cookie(
            key="__Host-access_token",
            value=access_token,
            httponly=False,
            secure=True,
            samesite=None,
            path="/",
            max_age=3600,
        )


        if user is None:
            user = User(
                email=kakao_response.json().get("email", ""),
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
