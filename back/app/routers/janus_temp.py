import requests
from fastapi import APIRouter, HTTPException
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


def create_janus_room():
    session_id = create_janus_session()
    if session_id is None:
        return None

    plugin_id = attach_plugin_to_session(session_id)
    if plugin_id is None:
        return None

    room_url = f"{janus_url}/{session_id}/{plugin_id}"
    # room number 추후에 db에 있는지 확인 후 랜덤 값으로 부여.
    create_data = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "create",
            "room": 1000,
        },
    }
    response = requests.post(room_url, json=create_data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None


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


@router.post("/rooms")
async def create_room(room: Room):
    janus_response = create_janus_room()
    print(janus_response)
    if janus_response and janus_response.get("janus") == "success":
        room_id = str(uuid.uuid4())
        return {"room_id": room_id, "janus_room_info": janus_response}
    else:
        raise HTTPException(status_code=500, detail="Janus room creation failed")


# 기타 FastAPI 라우트 및 로직
# 임시로 방 리스트 저장 여기에?
rooms = {}


@router.get("/rooms/{room_id}")
async def get_room(room_id: str):
    if room_id in rooms:
        return rooms[room_id]
    raise HTTPException(status_code=404, detail="Room not found")
