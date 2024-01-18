from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session
from ..database import get_db

from app.models.user import User, UserOAuth
from app.services.auth_service import (
    create_access_token,
    integer_to_8_digit_string_with_hash,
)

router = APIRouter(prefix="/login", tags=["login"])


@router.post("/google_login")
async def login_for_access_token(
    response: Response, request: Request, token: str = Form(None), db: Session = Depends(get_db)
):
    async with httpx.AsyncClient() as client:
        # 받은 google token이 유효한지 확인
        google_response = await client.get(f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}")
        # 유효할 때 200. 그게 아니라면 raise -> client한테 에러 출력
        if google_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid token")

        # 유저정보 추출
        user_info = google_response.json()
        # db에 해당 유저가 있는지 확인
        user = db.query(User).filter(User.email == user_info["email"]).first()
        # 그걸로 access token을 생성
        access_token = create_access_token(user_info["email"], "google")
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


@router.post("/naver_login")
async def login_for_access_token(
    response: Response, request: Request, token: str = Form(None), db: Session = Depends(get_db)
):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        # 받은 google token이 유효한지 확인
        got_response = await client.get(f"https://openapi.naver.com/v1/nid/me", headers=headers)
        naver_response = got_response.json()
        print(naver_response)

        # 유효할 때 200. 그게 아니라면 raise -> client한테 에러 출력
        if naver_response["resultcode"] != "00":
            raise HTTPException(status_code=400, detail="Invalid token")

        # 유저정보 추출
        user_info = naver_response["response"]
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


@router.post("/kakao_login")
async def login_for_access_token(
    response: Response, request: Request, code: str = Form(None), db: Session = Depends(get_db)
):
    async with httpx.AsyncClient() as client:
        CLIENT_ID = "8d3911fd405c36bc63a98885dc47ef92"
        REDIRECT_URI = "http://localhost:3000/kakao_login/callback"
        TOKEN_URL = "https://kauth.kakao.com/oauth/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT_URI,
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
            ten_digit_str = integer_to_8_digit_string_with_hash(user.id)
            user.nickname = ten_digit_str
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
