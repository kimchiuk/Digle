import requests
from fastapi import APIRouter, HTTPException, Request, Response, Depends, Form
from pydantic import BaseModel
import uuid
import json
import random
from sqlalchemy.orm import Session
from services.room_service import generate_unique_code
from models.room import RoomInfo, RoomType
from models.user import UserType
from database import get_db
from services.auth_service import get_user_by_token

router = APIRouter()


class Room(BaseModel):
    name: str
    host_id: str


janus_url = "https://custom-janus.duckdns.org/janus"  # 또는 원하는 로컬 호스트 및 포트를 사용합니다.
admin_secret = "janusoverlord"
headers = {"Content-Type": "application/json"}


# session id 발급
def create_janus_session():
    session_data = {"janus": "create", "transaction": str(uuid.uuid4()), "admin_secret": admin_secret}
    response = requests.post(janus_url, json=session_data, headers=headers)
    if response.status_code == 200 and response.json().get("janus") == "success":
        return response.json()["data"]["id"]  # 세션 ID 반환
    return None


# client세션을 특정플러그인 사용할려고 (우리는 비디오룸에 client를 연결할려고 )
def attach_plugin_to_session(session_client):
    attach_data = {
        "janus": "attach",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "plugin": "janus.plugin.videoroom",
    }
    response = requests.post(f"{janus_url}/{session_client}", json=attach_data, headers=headers)
    if response.status_code == 200 and response.json().get("janus") == "success":
        return response.json()["data"]["id"]  # 플러그인 ID 반환
    return None


# Janus 서버에 방 참여를 요청
def communicate_with_janus_join(session_client: str, room_id: int, user_id: str, role: str):
    plugin_id = attach_plugin_to_session(session_client)
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

    response = requests.post(f"{janus_url}/{session_client}/{plugin_id}", json=janus_message)

    if response.status_code == 200:
        return {
            "janus": "success",
            "message": f"Joined room {room_id} as {user_id}",
            "janus_server_response": response.json(),
        }
    else:
        return {"janus": "error", "message": f"Failed to communicate with Janus server: {response.status_code}"}


def get_janus_participants(session_client: str, room_id: int):
    # attach 플러그인은 한 번만 수행하면 됨
    plugin_id = attach_plugin_to_session(session_client)
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
    print(response.json())

    if response.status_code == 200:
        participants = response.json().get("plugindata", {}).get("data", {}).get("participants", [])
        return {"janus": "success", "participants": participants}
    else:
        return {"janus": "error", "message": f"Failed to get participants from Janus server: {response.status_code}"}


# 방 생성 및 Janus 서버에 참여
def create_janus_room(room_id: int):
    session_client = create_janus_session()
    if session_client is None:
        return None

    plugin_id = attach_plugin_to_session(session_client)
    if plugin_id is None:
        return None

    room_url = f"{janus_url}/{session_client}/{plugin_id}"

    create_data = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "create",
            "room": room_id,
            "publishers": 100,
        },
    }

    response = requests.post(room_url, json=create_data, headers=headers)
    print(response.json())
    if response.status_code == 200:
        return response.json()
    else:
        return None


# 방 참여 요청 핸들러
@router.post("/rooms/{room_id}/join")
async def join_room(room_id: int, user_id: str):
    session_client = create_janus_session()
    if session_client is None:
        raise HTTPException(status_code=500, detail="Failed to create Janus session for room join")
    janus_response = communicate_with_janus_join(session_client, room_id, user_id, "publisher")
    print(janus_response)
    return {"janus": "success", "message": "Room exists", "janus_server_response": janus_response}


# db에 저장된 room_id 중복 검사
def check_room_id_exists(db: Session, room_num: int) -> bool:
    # 데이터베이스에서 room_id가 존재하는지 확인
    return db.query(RoomInfo).filter(RoomInfo.room_num == room_num).first() is not None


def check_invite_code_exists(db: Session, invite_code: str) -> bool:
    # 데이터베이스에서 invite_code가 존재하는지 확인
    return db.query(RoomInfo).filter(RoomInfo.invite_code == invite_code).first() is not None


@router.get("/get_user_name_and_type")
async def get_user_name_and_type(request: Request, db: Session = Depends(get_db)):
    user = get_user_by_token(request, db, "service_access")

    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    data = {"user_name": user.name, "user_type": user.user_type}
    return data


# 방 생성 요청 핸들러
@router.post("/rooms/create")
async def create_room(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")
    print(user)
    if not user:
        raise HTTPException(status_code=404, detail="Not found User")

    while True:
        room_num = random.randint(100000, 999999)
        if not check_room_id_exists(db, room_num):
            break  # 유효한 room_id를 찾았으므로 루프 탈출

    while True:
        unique_code = generate_unique_code()
        if not check_invite_code_exists(db, unique_code):
            break  # 유효한 invite_code를 찾았으므로 루프 탈출

    room = RoomInfo(
        room_num=room_num,
        host_id=user.id,
        host_name=user.name,
        # room_type = "TestRoom", "Room"
        room_type="Room",
        invite_code=unique_code,
    )

    # db 저장
    db.add(room)
    db.commit()
    db.refresh(room)

    janus_response = create_janus_room(room_id=room_num)
    if janus_response:
        return janus_response
    else:
        raise HTTPException(status_code=500, detail="Janus room creation failed")


@router.post("/rooms/create_test_room")
async def create_test_room(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    user = get_user_by_token(request, db, "service_access")

    if not user:
        raise HTTPException(status_code=404, detail="Not found User")

    while True:
        room_num = random.randint(100000, 999999)
        if not check_room_id_exists(db, room_num):
            break  # 유효한 room_id를 찾았으므로 루프 탈출

    while True:
        unique_code = generate_unique_code()
        if not check_invite_code_exists(db, unique_code):
            break  # 유효한 invite_code를 찾았으므로 루프 탈출

    # 유저 타입 비즈니스 일 경우만
    if user.user_type == UserType.Business:
        room = RoomInfo(
            host_id=user.id,
            room_num=room_num,
            host_name=user.name,
            # room_type = "TestRoom", "Room"
            room_type="TestRoom",
            invite_code=unique_code,
        )
        db.add(room)
        db.commit()
        db.refresh(room)

    janus_response = create_janus_room(room_id=room_num)
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
        client_session = response.json()["data"]["id"]

        # Videoroom 플러그인을 세션에 attach
        attach_data = {
            "janus": "attach",
            "transaction": str(uuid.uuid4()),
            "admin_secret": admin_secret,
            "plugin": "janus.plugin.videoroom",
        }
        response = requests.post(f"{janus_url}/{client_session}", json=attach_data, headers=headers)

        if response.status_code == 200 and response.json().get("janus") == "success":
            plugin_id = response.json()["data"]["id"]

            # Videoroom 플러그인을 사용하여 방 목록 요청
            janus_request = {"janus": "message", "transaction": str(uuid.uuid4()), "body": {"request": "list"}}

            response = requests.post(f"{janus_url}/{client_session}/{plugin_id}", json=janus_request, headers=headers)

            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="Failed to get room list from media server")
        else:
            raise HTTPException(status_code=500, detail="Failed to attach plugin to session")
    else:
        raise HTTPException(status_code=500, detail="Failed to create Janus session")


@router.get("/rooms/{room_id}/participants")
def get_room_participants(room_id: int):
    session_client = create_janus_session()
    try:
        # 세션에 Videoroom 플러그인을 attach
        attach_data = {
            "janus": "attach",
            "transaction": str(uuid.uuid4()),
            "admin_secret": admin_secret,
            "plugin": "janus.plugin.videoroom",
        }
        response = requests.post(f"{janus_url}/{session_client}", json=attach_data, headers=headers)

        if response.status_code == 200 and response.json().get("janus") == "success":
            plugin_id = response.json()["data"]["id"]

            # 방 참가자 목록을 가져오는 Janus 요청
            janus_request = {
                "janus": "message",
                "transaction": str(uuid.uuid4()),
                "body": {
                    "request": "listparticipants",
                    "room": room_id,
                },
            }
            response = requests.post(f"{janus_url}/{session_client}/{plugin_id}", json=janus_request, headers=headers)
            print(response.json())
            response_data = response.json()
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


# 방 삭제 요청 처리 함수 (Janus와 데이터베이스에서 모두 삭제)
@router.post("/rooms/{room_num}/destroy")
async def destroy_room(room_num: int, db: Session = Depends(get_db)):
    session_id = create_janus_session()
    if not session_id:
        raise HTTPException(status_code=500, detail="Failed to create Janus session")

    plugin_id = attach_plugin_to_session(session_id)
    if not plugin_id:
        raise HTTPException(status_code=500, detail="Failed to attach plugin to session")

    # Janus에서 방 삭제 요청
    janus_message = {
        "janus": "message",
        "transaction": str(uuid.uuid4()),
        "admin_secret": admin_secret,
        "body": {
            "request": "destroy",
            "room": room_num,
        },
    }
    response = requests.post(f"{janus_url}/{session_id}/{plugin_id}", json=janus_message, headers=headers)
    if response.status_code == 200 and response.json().get("janus") == "success":
        # 데이터베이스에서 방 정보 삭제
        if delete_room_by_room_num(db, room_num):
            return {"message": f"Room {room_num} has been successfully deleted."}
        else:
            raise HTTPException(status_code=404, detail="Room not found in the database.")
    else:
        raise HTTPException(status_code=500, detail=f"Failed to destroy Janus room: {response.status_code}")


# 방없애기 db버젼
def delete_room_by_room_num(db: Session, room_num: int):
    room_info = db.query(RoomInfo).filter(RoomInfo.room_num == room_num).first()
    if room_info:
        db.delete(room_info)
        db.commit()
        return True
    return False


# 초대코드
# router = APIRouter(tags=["invite_code"])
@router.get("/join/{invite_code}")
async def join_room_with_invite(invite_code: str, db: Session = Depends(get_db)):
    room = db.query(RoomInfo).filter(RoomInfo.invite_code == invite_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    session_id = create_janus_session()
    if not session_id:
        raise HTTPException(status_code=500, detail="Failed to create Janus session")

    plugin_id = attach_plugin_to_session(session_id)
    if not plugin_id:
        raise HTTPException(status_code=500, detail="Failed to attach plugin to session")
    janus_response = communicate_with_janus_join(session_id, room.room_num, room.host_name, "role")
    print(janus_response)
    if janus_response.get("janus") != "success":
        raise HTTPException(status_code=500, detail="Failed to join room in Janus server")

    return {"message": "Successfully joined the room", "janus_response": janus_response}


# db에 있는 초대코드 프론트엔드로 보내기
@router.get("/get_invite_code/{room_num}")
def get_invite_code(room_num: int, db: Session = Depends(get_db)):
    room_info = db.query(RoomInfo).filter(RoomInfo.room_num == room_num).first()
    print(room_info)
    if room_info is None:
        raise HTTPException(status_code=404, detail="Room not found")

    return {"invite_code": room_info.invite_code}


@router.get("/create-room-url/{room_id}")
def create_room_url(room_id: str):
    """
    주어진 room_id에 대한 고유 URL을 생성합니다.
    """
    unique_code = generate_unique_code()
    room_url = f"http://localhost:3000/{unique_code}"
    return {"room_url": room_url}


@router.get("/get_room")
def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(RoomInfo).filter(RoomInfo.room_type == "Room").all()
    return rooms
