import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
import json

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

def get_janus_participants(session_id: str,room_id: int):
    # attach 플러그인은 한 번만 수행하면 됨
    plugin_id = attach_plugin_to_session(session_id)
    if plugin_id is None:
        return {"janus": "error", "message": "Failed to attach plugin to session"}

    janus_message = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "listparticipants",
            "room": room_id,
        }
    }

    response = requests.post(f"{janus_url}/{room_id}/{plugin_id}", json=janus_message)

    if response.status_code == 200:
        participants = response.json().get("plugindata", {}).get("data", {}).get("participants", [])
        print(response.json())
        return {"janus": "success", "participants": participants}
    else:
        return {"janus": "error", "message": f"Failed to get participants from Janus server: {response.status_code}"}
    

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




# 방 참여 요청 핸들러
@router.post("/rooms/{room_id}/join")
async def join_room(room_id: int, user_id: str):
    session_id = create_janus_session()
    if session_id is None:
        raise HTTPException(status_code=500, detail="Failed to create Janus session for room join")
    
    janus_response = communicate_with_janus_join(session_id, room_id, user_id, "publisher")
    print(janus_response)

    if janus_response["janus"] == "success":
        participant = {"user_id": user_id, "role": "publisher", "janus_response": janus_response}
        return participant
    else:
        raise HTTPException(status_code=500, detail="Janus room join failed")

# 방 생성 요청 핸들러
@router.post("/rooms")
async def create_room(room: Room):
    janus_response = create_janus_room()
    if janus_response:
        return janus_response
    else:
        raise HTTPException(status_code=500, detail="Janus room creation failed")

# 임시로 방 리스트 저장
rooms = {}

@router.get("/rooms")
async def get_all_rooms():
    return rooms

@router.get("/rooms/list")
async def get_all_rooms():
    return {"rooms": list(rooms.values())}

#참가자목록 
@router.get("/rooms/{room_id}/participants")
async def get_room_participants(room_id: int):
    session_id = create_janus_session()
    if session_id is None:
        raise HTTPException(status_code=500, detail="Failed to create Janus session")

    participants_response = get_janus_participants(session_id,room_id)

    if participants_response.get("janus") == "success":
        return participants_response
    else:
        raise HTTPException(status_code=500, detail=f"Failed to get participants: {participants_response['message']}")
    
@router.get("/sessions/{session_id}/handles")
async def list_handles(session_id: int):
    handles_request = {
        "janus": "list_handles",
        "session_id": session_id,
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
    }

    response = requests.post(f"{janus_url}/{session_id}", json=handles_request, headers=headers)

    if response.status_code == 200 and response.json().get("janus") == "success":
        handles = response.json()["handles"]
        return {"session_id": session_id, "handles": handles}
    else:
        raise HTTPException(status_code=500, detail="Failed to list handles")




@router.get("/sessions")
async def list_sessions():
    list_sessions_request = {
        "janus": "info",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
    }
    response = requests.post(f"{janus_url}/admin", json=list_sessions_request, headers=headers)
    print(response.json())
    if response.status_code == 200 and response.json().get("janus") == "server_info":
        sessions = response.json()["sessions"]
        return {"sessions": sessions}
    else:
        raise HTTPException(status_code=500, detail="Failed to list sessions")
    