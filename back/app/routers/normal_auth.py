from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response, UploadFile
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate
from ..database import get_db

from app.models.user import BusinessUser, User
from app.services.auth_service import (
    create_access_token,
    integer_to_8_digit_string_with_hash,
)


router = APIRouter(tags=["normal_auth"])


@router.post("/regist")
async def login_for_access_token(
    response: Response,
    request: Request,
    email: str = Form(None),
    name: str = Form(None),
    password: str = Form(None),
    profile_img: UploadFile = Form(None),
    user_type: str = Form(None),
    company_info: str = Form(None),
    company_email: str = Form(None),
    company_address: str = Form(None),
    db: Session = Depends(get_db),
):
    file_location = None
    base_data = UserCreate(
        email=email,
        password=password,
        name=name,
        user_type=user_type,
    )

    if profile_img and profile_img.filename:
        # 파일 저장 또는 처리
        file_location = f"files/{profile_img.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(profile_img.file.read())
    user = User(
        email=base_data.email,
        password=base_data.password,
        name=base_data.name,
        profile_picture_url=file_location,
        user_type=user_type,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user_type == "Business":
        business_data = BusinessUser(
            company_info=company_info,
            company_email=company_email,
            company_address=company_address,
        )
    return


@router.post("/login")
async def login_for_access_token(
    response: Response, request: Request, token: str = Form(None), db: Session = Depends(get_db)
):
    # 유저정보 추출
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
    # setset
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
