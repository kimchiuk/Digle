from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel, constr

app = FastAPI()


class VideoRoomTitle(BaseModel):
    title: constr(max_length=30)


class VideoRoomId(BaseModel):
    room_id: int


class Pin(BaseModel):
    pin: Optional[constr(max_length=30)]


class VideoRoom(BaseModel):
    roomId: VideoRoomId
    title: VideoRoomTitle
    pin: Pin


@app.post("/videoroom/title")
async def create_videoroom_title(title: VideoRoomTitle):
    return {"title": title.title}


@app.post("/videoroom/id")
async def create_videoroom_id(room_id: VideoRoomId):
    return {"room_id": room_id.room_id}


@app.post("/videoroom/pin")
async def create_videoroom_pin(pin: Pin):
    return {"pin": pin.pin}
