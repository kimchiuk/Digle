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
        },
    }

    response = requests.post(f"{janus_url}/{session_id}/{plugin_id}", json=janus_message)
    
    print(response.json())
    
    if response.status_code == 200:
        return {
            "janus": "success",
            "message": f"Joined room {room_id} as {user_id}",
            "janus_server_response": response.json(),
        }
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
        },
    }

    response = requests.post(f"{janus_url}/{room_id}/{plugin_id}", json=janus_message)

    if response.status_code == 200:
        participants = response.json().get("plugindata", {}).get("data", {}).get("participants", [])
        print(response.json())
        return {"janus": "success", "participants": participants}
    else:
        return {"janus": "error", "message": f"Failed to get participants from Janus server: {response.status_code}"}
    

# 방 생성 및 Janus 서버에 참여
def create_janus_room(room_id: int):
    session_id = create_janus_session()
    if session_id is None:
        return None

    plugin_id = attach_plugin_to_session(session_id)
    if plugin_id is None:
        return None
    
    room_url = f"{janus_url}/{session_id}/{plugin_id}"
    
    create_data = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "create",
            "room": room_id,
        },
    }
    
    response = requests.post(room_url, json=create_data, headers=headers)
    if response.status_code == 200:
        return response.json()
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
    if "request" in janus_response.get("janus_server_response", {}).get("plugindata", {}).get("data", {}):
        # "request"가 존재하면 방이 이미 존재하는 것이므로 새로운 방 생성하지 않고 응답 반환
        return {"janus": "success", "message": "Room already exists", "janus_server_response": janus_response}

    # "request"가 존재하지 않으면 방이 존재하지 않으므로 새로운 방을 생성하고 응답 반환
    janus_response_create = create_janus_room()
    if janus_response_create:
        return janus_response_create
    else:
        if "request" in janus_response.get("janus_server_response", {}).get("plugindata", {}).get("data", {}):
            # "request"가 존재하면 방이 이미 존재하는 것이므로 새로운 방 생성하지 않고 응답 반환
            return {"janus": "success", "message": "Room already exists", "janus_server_response": janus_response}

        # "request"가 존재하지 않으면 방이 존재하지 않으므로 새로운 방을 생성하고 응답 반환
        janus_response_create = create_janus_room(room_id)
        if janus_response_create:
            return janus_response_create
        else:
            raise HTTPException(status_code=500, detail="Janus room creation failed")


# 방 생성 요청 핸들러
@router.post("/rooms")
async def create_room(room_id: int):
    janus_response = create_janus_room(room_id)
    if janus_response:
        return janus_response
    else:
        raise HTTPException(status_code=500, detail="Janus room creation failed")



@router.get("/rooms/list")
async def get_available_rooms():
    # 세션 생성
    session_data = {"janus": "create", "transaction": str(uuid.uuid4()), "admin_secret": admin_secret}
    response = requests.post(janus_url, json=session_data, headers=headers)

    if response.status_code == 200 and response.json().get("janus") == "success":
        session_id = response.json()["data"]["id"]

        # Videoroom 플러그인을 세션에 attach
        attach_data = {
            "janus": "attach",
            "transaction": str(uuid.uuid4()),
            "admin_secret": admin_secret,
            "plugin": "janus.plugin.videoroom",
        }
        response = requests.post(f"{janus_url}/{session_id}", json=attach_data, headers=headers)

        if response.status_code == 200 and response.json().get("janus") == "success":
            plugin_id = response.json()["data"]["id"]

            # Videoroom 플러그인을 사용하여 방 목록 요청
            janus_request = {
                "janus": "message",
                "transaction": str(uuid.uuid4()),
                "body": {
                    "request": "list"
                }
            }

            response = requests.post(f"{janus_url}/{session_id}/{plugin_id}", json=janus_request, headers=headers)

            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="Failed to get room list from media server")
        else:
            raise HTTPException(status_code=500, detail="Failed to attach plugin to session")
    else:
        raise HTTPException(status_code=500, detail="Failed to create Janus session")

#참가자목록 
@router.get("/rooms/{room_id}/participants")
async def get_room_participants(room_id: int):
    session_id = create_janus_session()
    if session_id is None:
        raise HTTPException(status_code=500, detail="Failed to create Janus session")


 
@router.get("/rooms/{room_id}/participants")
def get_room_participants(session_id: int, room_id: int):
    try:
        # 세션에 Videoroom 플러그인을 attach
        attach_data = {
            "janus": "attach",
            "transaction": str(uuid.uuid4()),
            "admin_secret": admin_secret,
            "plugin": "janus.plugin.videoroom",
        }
        response = requests.post(f"{janus_url}/{session_id}", json=attach_data, headers=headers)

        print(response)
        
        if response.status_code == 200 and response.json().get("janus") == "success":
            plugin_id = response.json()["data"]["id"]
            
            print(plugin_id)

            # 방 참가자 목록을 가져오는 Janus 요청
            janus_request = {
                "janus": "message",
                "transaction": str(uuid.uuid4()),
                "body": {
                    "request": "listparticipants",
                    "room": room_id,
                }
            }
            response = requests.post(f"{janus_url}/{session_id}/{plugin_id}", json=janus_request, headers=headers)
            response_data = response.json()
            print(response_data)
            # 핸들이 없는 경우 오류 처리
            if "error" in response_data:
                error_code = response_data["error"]["code"]
                if error_code == 459:  # No such handle error code
                    print(f"Error: {response_data['error']['reason']}")
                    return []
                else:
                    raise Exception(f"Janus server error: {response_data}")

            participants = response_data.get("plugindata", {}).get("data", {}).get("participants", [])
            return participants

        else:
            raise HTTPException(status_code=500, detail="Failed to attach plugin to session")

    except Exception as e:
        print(f"An error occurred: {e}")
        return []


# 방없애보리기 
def destroy_janus_room(session_id: str, room_id: int):
    plugin_id = attach_plugin_to_session(session_id)
    if plugin_id is None:
        return {"janus": "error", "message": "Failed to attach plugin to session"}

    janus_message = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "destroy",
            "room": room_id,
        },
    }

    response = requests.post(f"{janus_url}/{session_id}/{plugin_id}", json=janus_message)

    if response.status_code == 200:
        return response.json()
    else:
        return {"janus": "error", "message": f"Failed to destroy Janus room: {response.status_code}"}

#방없애보리기 라우터버젼 
@router.post("/rooms/{room_id}/destroy")
async def destroy_room(room_id: int):
    session_id = create_janus_session()
    if session_id is None:
        raise HTTPException(status_code=500, detail="Failed to create Janus session for room destroy")

    janus_response = destroy_janus_room(session_id, room_id)

    if janus_response["janus"] == "success":
        return {"janus": "success", "message": f"Room {room_id} has been destroyed"}
    else:
        raise HTTPException(status_code=500, detail="Failed to destroy Janus room")