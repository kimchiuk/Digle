import requests
from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel
import uuid

router = APIRouter()

class Room(BaseModel):
    name: str
    host_id: str

janus_url = "http://34.125.238.83/janus"
admin_secret = "janusoverlord"
headers = {"Content-Type": "application/json"}

# session id 발급
def create_janus_session():
    session_data = {"janus": "create", "transaction": str(uuid.uuid4()), "admin_secret": admin_secret}
    response = requests.post(janus_url, json=session_data, headers=headers)
    if response.status_code == 200 and response.json().get("janus") == "success":
        return response.json()["data"]["id"]  # 세션 ID 반환
    return None

# 플러그인을 세션에 attach
def attach_plugin_to_session(session_id):
    attach_data = {
        "janus": "attach",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "plugin": "janus.plugin.videoroom",
    }
    response = requests.post(f"{janus_url}/{session_id}", json=attach_data, headers=headers)
    if response.status_code == 200 and response.json().get("janus") == "success":
        return response.json()["data"]["id"]  # 플러그인 ID 반환
    return None

# Janus 서버에 방 참여를 요청
def communicate_with_janus_join(session_id: str, room_id: int, user_id: str, role: str):
    plugin_id = attach_plugin_to_session(session_id)
    if plugin_id is None:
        return {"janus": "error", "message": "Failed to attach plugin to session"}

    janus_message = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "join",
            "room": room_id,
            "ptype": role,
            "display": user_id,
        }
    }
    response = requests.post(f"{janus_url}/{session_id}/{plugin_id}", json=janus_message)

    if response.status_code == 200:
        return {"janus": "success", "message": f"Joined room {room_id} as {user_id}", "janus_server_response": response.json()}
    else:
        return {"janus": "error", "message": f"Failed to communicate with Janus server: {response.status_code}"}

# 방 생성 및 Janus 서버에 참여
def create_janus_room():
    session_id = create_janus_session()
    if session_id is None:
        return None

    # 임시로 방 번호를 랜덤하게 생성
    room_id = uuid.uuid4().int & (1<<31)-1

    janus_response = communicate_with_janus_join(session_id, room_id, "host_user", "publisher")

    if janus_response["janus"] == "success":
        rooms[room_id] = {"room_id": room_id, "host_user": "host_user", "janus_room_info": janus_response}
        return rooms[room_id]
    else:
        return None

# WebSocket 핸들러
class WebSocketHandler:
    def __init__(self, websocket: WebSocket, room_id: str):
        self.websocket = websocket
        self.room_id = room_id

    async def connect(self):
        if self.room_id not in rooms:
            raise HTTPException(status_code=404, detail="Room not found")

        await self.websocket.accept()

        # 웹 소켓 연결이 수락되면 Janus 서버에 방 참여를 요청
        user_id = str(uuid.uuid4())
        role = "subscriber"

        janus_response = communicate_with_janus_join(self.room_id, self.room_id, user_id, role)

        # Janus 서버로부터 받은 응답을 클라이언트에게 전송
        await self.websocket.send_text(json.dumps(janus_response))

        try:
            while True:
                data = await self.websocket.receive_text()
                # Handle WebSocket data here if needed
        except WebSocketDisconnect:
            # Handle disconnection if needed
            pass

# FastAPI 라우트 및 로직 생략

# 웹 소켓 연결 요청 핸들러
@router.websocket("/rooms/{room_id}/connect")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    handler = WebSocketHandler(websocket, room_id)
    await handler.connect()







# 방 생성 요청 핸들러
@router.post("/rooms")
async def create_room(room: Room):
    janus_response = create_janus_room()
    if janus_response:
        return janus_response
    else:
        raise HTTPException(status_code=500, detail="Janus room creation failed")

# 기타 FastAPI 라우트 및 로직 생략

# 임시로 방 리스트 저장
rooms = {}



@router.get("/rooms")
async def get_all_rooms():
    return rooms