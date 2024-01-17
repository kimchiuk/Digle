from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json, jwt
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
##혹시나 삭제해야 하는 부분
origins = [
    "http://localhost",
    "http://localhost:3000",  # React 개발 서버의 기본 포트
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


####
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# @app.post("/users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = models.User(username=user.username, email=user.email)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, client_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: int):
        del self.active_connections[client_id]

    async def send_personal_message(self, message: str, client_id: int):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

    async def broadcast(self, message: str, sender: int):
        for client_id, connection in self.active_connections.items():
            if client_id != sender:
                await connection.send_text(message)


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data, sender=client_id)
    except WebSocketDisconnect:
        manager.disconnect(client_id)


# 기타 API 엔드포인트
# @app.websocket("/ws/janus")
# async def websocket_janus(websocket: WebSocket, token: str = Depends(get_current_user)):
#     await websocket.accept()

#     # Janus 서버와의 웹소켓 연결 및 통신 로직
#     try:
#         while True:
#             data = await websocket.receive_text()
#             # Janus 서버로부터 메시지 처리 및 응답
#             # 예: Janus JSON-RPC 메시지를 보내고 응답을 처리
#             await websocket.send_text(f"Echo: {data}")
#     except WebSocketDisconnect:
#         # 연결 종료 처리
#         pass

# def get_current_user(token: str = None):
#     # JWT 토큰을 검증하여 사용자 인증
#     if token:
#         try:
#             payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#             return payload["user_id"]
#         except jwt.PyJWTError:
#             raise WebSocketDisconnect()
#     raise WebSocketDisconnect()
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()

naver = oauth.register(
    name="naver",
    client_id=NAVER_CLIENT_ID,
    client_secret=NAVER_CLIENT_SECRET,
    authorize_url="https://nid.naver.com/oauth2.0/authorize",
    authorize_params=None,
    authorize_kwargs=None,
    authorize_url_params=None,
    token_url="https://nid.naver.com/oauth2.0/token",
    token_params=None,
    token_kwargs=None,
    redirect_uri="http://localhost:8000/login/naver/callback",
    client_kwargs={"scope": "profile"},
)


@app.get("/login/naver")
async def login(request: Request):
    redirect_uri = url_for("login_naver_callback", _external=True)
    return await naver.authorize_redirect(request, redirect_uri)


@app.route("/login/naver/callback")
async def login_naver_callback(request: Request):
    token = await naver.authorize_access_token(request)
    user = await naver.parse_id_token(request, token)
    return {"token": token, "user": user}


# 추가적인 인증 및 사용자 관리 로직
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
