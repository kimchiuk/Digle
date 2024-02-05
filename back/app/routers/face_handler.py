import os
from dotenv import load_dotenv
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
import httpx
from sqlalchemy.orm import Session
from database import get_db

from models.user import User
from services.auth_service import (
    create_access_token,
    generate_internal_id,
    generate_random_state,
)


router = APIRouter(tags=["normal_auth"])


@router.post("/faces")
async def find_password(requeset: Request, response: Response, faces: list = Form(None)):
    print(faces)
    for face in faces:
        if face and face.filename:
            # 파일 저장 또는 처리
            file_location = f"C:/files/{face.filename}"
            with open(file_location, "wb+") as file_object:
                file_object.write(face.file.read())
