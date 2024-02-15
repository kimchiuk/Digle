import base64
from io import BytesIO
import json
import os
import pickle
import shutil
from typing import List
import aiofiles
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

AI_SERVER_URL = os.getenv("AI_SERVER_URL")


@router.post("/faces")
async def face_capture(
    request: Request,
    response: Response,
    faces: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
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
    new_files = []
    embeddeds = []
    for file in faces:
        # 유저의 이름에서 내부 이름으로 파일 이름 변경
        user_name = file.filename.split(".")[0]  # 파일 이름에서 확장자를 제외한 부분 추출
        internal_id = db.query(User).filter(User.name == user_name).first().internal_id
        file_name = f"{internal_id}.jpeg"  # 내부적으로 사용할 파일 이름 생성
        embedded = db.query(User).filter(User.internal_id == internal_id).first().embedded_profile
        embeddeds.append(embedded)
        contents = await file.read()  # 파일 내용 읽기
        new_files.append(("files", (file_name, contents, file.content_type)))  # MIME 타입 추가

    encoded_embeddeds = base64.b64encode(pickle.dumps(embeddeds)).decode("utf-8")
    # httpx를 사용하여 파일 전송
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AI_SERVER_URL}/get_users_with_image",
            files=new_files,
            data={"embeddeds": encoded_embeddeds},
        )

    # 응답 처리
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error sending files to AI server")
    response = response.json()
    # 혼자가 아니거나 아무도 없어요
    errors = response.get("errors")
    for result in response.get("results"):
        now = result.get("uploaded_user_id")
        if now != result.get("matched_user_id"):
            errors.append(now)
        elif result.get("score") <= 0.2:
            errors.append(now)
    error_users = []
    for error in errors:
        error_user_name = db.query(User).filter(User.internal_id == error).first().name
        error_users.append(error_user_name)
    return {"detail": "Files uploaded and sent successfully", "response": error_users}
