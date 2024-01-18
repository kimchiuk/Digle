from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
import uuid

router = APIRouter()


class Room(BaseModel):
    name: str
    host_id: str


rooms = {}


@router.post("/rooms/")
async def create_room(room: Room):
    room_id = str(uuid.uuid4())
    rooms[room_id] = room
    # Janus 서버에 방을 생성하는 로직
    return {"room_id": room_id, "janus_room_info": "Janus 관련 정보"}


@router.get("/rooms/{room_id}")
async def get_room(room_id: str):
    if room_id in rooms:
        return rooms[room_id]
    raise HTTPException(status_code=404, detail="Room not found")
