from fastapi import FastAPI, HTTPException
import random
import string
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response

router = APIRouter(tags=["invite_code"])

def generate_unique_code(length=8):
    """
    영어 대문자, 소문자, 한글을 포함하여 길이가 length인 문자열을 생성합니다.
    한글 범위: AC00-D7A3 (가-힣)
    """
    characters = string.ascii_letters + string.digits  # 영어 대소문자와 숫자를 포함
    return ''.join(random.choice(characters) for _ in range(length))

@router.get("/create-room-url/{room_id}")
def create_room_url(room_id: str):
    """
    주어진 room_id에 대한 고유 URL을 생성합니다.
    """
    unique_code = generate_unique_code()
    room_url = f"http://localhost:3000/{unique_code}"
    return {"room_url": room_url}