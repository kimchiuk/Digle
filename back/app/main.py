from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json, jwt
from sqlalchemy.orm import Session

from app.routers import auth_ext, normal_auth
from . import models, schemas
from .database import SessionLocal, engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware

from .routers import oauth_login, room_handler

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

app.include_router(oauth_login.router)
app.include_router(normal_auth.router)
app.include_router(room_handler.router)
app.include_router(auth_ext.router)

# 추가적인 인증 및 사용자 관리 로직
if __name__ == "__main__"; # 세미콜론 이슈
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
