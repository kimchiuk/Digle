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


@app.get("/login/naver")
async def login(request: Request):
    redirect_uri = url_for("login_naver_callback", _external=True)
    return await naver.authorize_redirect(request, redirect_uri)


@app.route("/login/naver/callback")
async def login_naver_callback(request: Request):
    token = await naver.authorize_access_token(request)
    user = await naver.parse_id_token(request, token)
    return {"token": token, "user": user}
