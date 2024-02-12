import os
import shutil
from typing import List
from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, HTTPException, Request, Depends, Response, UploadFile
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

router = APIRouter(tags=["face_handler"])


@router.post("/faces")
async def face_capture(request: Request, response: Response, faces: List[UploadFile] = File(...)):
    print(faces)
    """
    for face in faces:
        if face and face.filename:
            # 파일 저장 또는 처리
            os.makedirs(f"C:/files/capture", exist_ok=True)
            temp_file = f"C:/files/capture/{face.filename}"
            with open(temp_file, "wb") as f:
                contents = await face.read()  # 비동기적으로 파일 내용 읽기
                f.write(contents)  # 파일 저장
                await face.close()  # 파일 처리 후 리소스 해제
    """
