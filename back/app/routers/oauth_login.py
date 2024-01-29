import os
from dotenv import load_dotenv
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session
from ..database import get_db

from app.models.user import User
from app.services.auth_service import (
    create_access_token,
    generate_internal_id,
)


router = APIRouter(prefix="/oauth_login", tags=["oauth_login"])
load_dotenv()

REDIRECT_BASE_URI = "https://localhost:3000"


def user_db_login(auth_provider, auth_provider_id, user_info, db, response):
    # db에 해당 유저가 있는지 확인
    user = db.query(User).filter_by(auth_provider_id=auth_provider_id, auth_provider=auth_provider).first()

    action = ""
    # email 변경됐을 경우
    if user and user.email != user_info["email"]:
        user.email = user_info["email"]
        db.commit()
        message = "Login Success. Detected Email Change"
    # 만약 해당 유저가 없음. -> 회원가입
    elif user is None:
        # 객체로 생성
        user = User(
            email=user_info["email"],
            name=user_info["name"],
            internal_id=generate_internal_id(),
            auth_provider=auth_provider,
            is_additional_info_provided=False,
            auth_provider_id=auth_provider_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        # response 생성 status 200
        message = "New User"
        action = "request_additional_info"

    elif not user.is_additional_info_provided:
        # 추가 정보가 아직 제출되지 않은 경우
        message = "Additional Info Required"
    else:
        message = "Login Complete"

    # 그걸로 access token을 생성
    access_token = create_access_token(user.internal_id)
    # access token을 보안때문에 header에다 cookie를 담아서 줄것.
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=False,
        secure=True,
        samesite="None",
        # domain = '어쩌고 저쩌고',
        path="/",  # 전체 경로에서 사용
        max_age=3600,  # 예: 1시간 유효기간
    )
    return message, action, response


@router.post("/google_login")
async def login_for_access_token(
    response: Response, request: Request, code: str = Form(None), db: Session = Depends(get_db)
):
    async with httpx.AsyncClient() as client:
        data = {
            "code": code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": f"{REDIRECT_BASE_URI}/google_login/callback",  # 'http'를 사용해야 할 수도 있습니다.
            "grant_type": "authorization_code",
        }
        token_response = await client.post("https://oauth2.googleapis.com/token", data=data)  # 'await' 사용

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=token_response.status_code, detail="OAuth2 token request failed"
            )  # 'token_response.status_code' 사용

        token_data = token_response.json()
        id_token = token_data.get("id_token")

        google_response = await client.get(f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}")
        if google_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid token")

        # 유저정보 추출
        user_info = google_response.json()
        # db에 해당 유저가 있는지 확인

        message, action, response = user_db_login("Google", user_info["sub"], user_info, db, response)

    return JSONResponse(
        status_code=200,
        content={"message": message, "action": action},
        headers=dict(response.headers),
    )


@router.post("/naver_login")
async def login_for_access_token(
    response: Response, request: Request, code: str = Form(None), db: Session = Depends(get_db)
):
    async with httpx.AsyncClient() as client:
        data = {
            "code": code,
            "client_id": os.getenv("NAVER_CLIENT_ID"),
            "client_secret": os.getenv("NAVER_CLIENT_SECRET"),
            "redirect_uri": f"{REDIRECT_BASE_URI}/naver_login/callback",
            "grant_type": "authorization_code",
        }
        token_response = await client.post("https://oauth2.googleapis.com/token", data=data)

        if token_response.resultcode != 200:
            raise HTTPException(
                status_code=token_response.status_code, detail="OAuth2 token request failed"
            )  # 'token_response.status_code' 사용

        token_data = token_response.json()
        access_token = token_data.get("access_token")
        headers = {"Authorization": f"Bearer {access_token}"}

        # 받은 token이 유효한지 확인
        got_response = await client.get(f"https://openapi.naver.com/v1/nid/me", headers=headers)
        naver_response = got_response.json()

        # 유효할 때 200. 그게 아니라면 raise -> client한테 에러 출력
        if naver_response["resultcode"] != "00":
            raise HTTPException(status_code=400, detail="Invalid token")

        # 유저정보 추출
        user_info = naver_response["response"]
        message, action, response = user_db_login("Google", user_info["sub"], user_info, db, response)

    return JSONResponse(
        status_code=200,
        content={"message": message, "action": action},
        headers=dict(response.headers),
    )


@router.post("/kakao_login")
async def login_for_access_token(
    response: Response, request: Request, code: str = Form(None), db: Session = Depends(get_db)
):
    async with httpx.AsyncClient() as client:
        TOKEN_URL = "https://kauth.kakao.com/oauth/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": os.getenv("KAKAKO_CLIENT_ID"),
            "redirect_uri": f"{REDIRECT_BASE_URI}/kakao_login/callback",
            "code": code,
        }
        token_response = await client.post(
            TOKEN_URL, headers={"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}, data=data
        )
        token_response_data = token_response.json()
        print(token_response_data)
        if "access_token" not in token_response_data:
            raise HTTPException(status_code=400, detail="카카오 로그인 실패")

        access_token = token_response_data["access_token"]
        USER_INFO_URL = "https://kapi.kakao.com/v2/user/me"
        headers = {"Authorization": f"Bearer {access_token}"}

        user_info_response = await client.post(USER_INFO_URL, headers=headers)
        user_info_data = user_info_response.json()
        # 유저정보 추출
        user_info = user_info_data["kakao_account"]
        print(user_info)
        # db에 해당 유저가 있는지 확인
        user = db.query(User).filter(User.email == user_info["email"]).first()
        # 그걸로 access token을 생성
        access_token = create_access_token(user_info["email"], "naver")
        # access token을 보안때문에 header에다 cookie를 담아서 줄것.
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=False,
            secure=True,
            samesite="None",
            # domain = '어쩌고 저쩌고',
            path="/",  # 전체 경로에서 사용
            max_age=3600,  # 예: 1시간 유효기간
        )
        # 만약 해당 유저가 없음. -> 회원가입
        if user is None:
            # 객체로 생성
            user = User(
                email=user_info["email"],
                name=user_info["profile"]["nickname"],
                additional_info_submitted=False,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # response 생성 status 200
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
