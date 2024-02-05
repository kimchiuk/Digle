from multiprocessing import Process
import os
import sys
from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json, jwt
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
import uvicorn
from routers import auth_ext, normal_auth, delete_accounts, find_password, create_room
import models, schemas
from database import SessionLocal, engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware

from routers import oauth_login, room_handler, user_profile, face_handler, invite_code_url

# from routers import send_faq

Base.metadata.create_all(bind=engine)

app = FastAPI()
##혹시나 삭제해야 하는 부분
origins = [
    "https://localhost",
    "https://localhost:3000",  # React 개발 서버의 기본 포트
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY"),
    https_only=True,
    same_site="None",
)

app.include_router(oauth_login.router)
app.include_router(normal_auth.router)
app.include_router(room_handler.router)
app.include_router(auth_ext.router)
app.include_router(delete_accounts.router)
app.include_router(find_password.router)
app.include_router(user_profile.router)
# app.include_router(send_faq.router)
app.include_router(create_room.router)
app.include_router(face_handler.router)
app.include_router(invite_code_url.router)


def local_run():
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=True,
        ssl_keyfile="../localhost-key.pem",
        ssl_certfile="../localhost.pem",
        forwarded_allow_ips="*",  # 모든 프록시된 IP 주소 허용
        proxy_headers=True,  # X-Forwarded-Proto 헤더를 신뢰
    )


def deploy_run():
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        ssl_keyfile="../key.pem",
        ssl_certfile="../cert.pem",
        forwarded_allow_ips="*",  # 모든 프록시된 IP 주소 허용
        proxy_headers=True,  # X-Forwarded-Proto 헤더를 신뢰
    )


# 추가적인 인증 및 사용자 관리 로직
if __name__ == "__main__":
    if sys.argv[1] == "local":
        api_process = Process(target=local_run)
        api_process.start()
        api_process.join()
    elif sys.argv[1] == "deploy":
        api_process = Process(target=deploy_run)
        api_process.start()
        api_process.join()
