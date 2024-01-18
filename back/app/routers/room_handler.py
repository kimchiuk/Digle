# main.py
import requests
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
import uuid

router = APIRouter()


class Room(BaseModel):
    name: str
    host_id: str


# Janus 서버 설정
janus_url = "http://your_janus_server:8088/janus"
admin_secret = "your_admin_secret"


def create_janus_room():
    # Janus 서버에 새로운 방을 생성하는 함수
    session_url = janus_url + "/<session_id>"
    headers = {"Content-Type": "application/json"}
    # 방 생성 요청 데이터
    create_data = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "create",
            "room": 1234,  # 임의의 방 번호
            # 추가적인 방 설정을 여기에 포함할 수 있습니다.
        },
    }
    response = requests.post(session_url, json=create_data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None


rooms = {}


@router.post("/rooms/")
async def create_room(room: Room):
    # query = rooms.insert().values(id=room_id, name=room.name, host_id=room.host_id)

    # FastAPI 경로에서 방 생성 요청을 처리
    janus_response = create_janus_room()
    if janus_response and janus_response.get("janus") == "success":
        room_id = str(uuid.uuid4())
        # Janus 서버에 방 생성 후, 로컬 데이터베이스에 저장
        return {"room_id": room_id, "janus_room_info": janus_response}
    else:
        raise HTTPException(status_code=500, detail="Janus room creation failed")


@router.get("/rooms/{room_id}")
async def get_room(room_id: str):
    if room_id in rooms:
        return rooms[room_id]
    raise HTTPException(status_code=404, detail="Room not found")
