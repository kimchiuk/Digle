from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json, jwt

app = FastAPI()

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



SECRET_KEY = "your-secret-key"  # JWT 토큰 생성을 위한 시크릿 키
app = FastAPI()

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

# 추가적인 인증 및 사용자 관리 로직
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)