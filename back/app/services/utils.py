import asyncio
import json
import shutil
from dotenv import load_dotenv
from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from google.cloud import storage
import os
from google.oauth2 import service_account
import httpx

# .env 파일에서 환경 변수 로드
load_dotenv()

"""
# .env 파일에서 서비스 계정 JSON을 가져옴
service_account_info = json.loads(os.getenv("GCP_SERVICE_ACCOUNT_JSON"))

# 서비스 계정 정보를 사용하여 인증 정보 생성
credentials = service_account.Credentials.from_service_account_info(service_account_info)

# 인증 정보를 사용하여 Storage 클라이언트 생성
storage_client = storage.Client(credentials=credentials)
"""
# 환경 변수에서 서비스 계정 키 파일 경로 가져오기
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../google_service_key.json"

# GCP Storage 클라이언트 초기화
storage_client = storage.Client()


async def delete_file_after_delay(filepath, delay=6):
    await asyncio.sleep(delay)  # 지정된 시간(초) 동안 대기
    if os.path.exists(filepath):
        os.remove(filepath)


def upload_to_gcs(file: UploadFile, file_path: str, id: str):
    bucket_name = "ssafy-bucket"
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # 임시 파일 생성
    os.makedirs(f"/home/ubuntu/digle_storage", exist_ok=True)
    temp_file = f"/home/ubuntu/digle_storage/{id}.{file.filename.split('.')[-1]}"
    with open(temp_file, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # GCS에 업로드
    blob = bucket.blob(file_path)
    blob.upload_from_filename(temp_file)

    # 임시 파일 삭제
    # os.remove(temp_file)


def save_to_local_directory(file: UploadFile, file_name: str, id: str):
    # 도커 컨테이너 내 저장할 경로 지정 (볼륨 마운트 경로)
    base_path = "/app/storage"

    # 파일 저장 경로 생성
    save_path = os.path.join(base_path, f"{id}.{file_name}")

    # 디렉토리가 존재하지 않는 경우 생성
    os.makedirs(base_path, exist_ok=True)

    # 파일 저장
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    print(f"File saved to {save_path}")


def download_from_gcs(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    os.makedirs(os.path.dirname(destination_file_name), exist_ok=True)
    blob.download_to_filename(destination_file_name)


def get_image_stream(file_path: str):
    # Google Cloud Storage에서 이미지 스트리밍
    storage_client = storage.Client()
    bucket = storage_client.bucket("ssafy-bucket")
    blob = bucket.blob(file_path)
    stream = blob.download_as_stream()

    return StreamingResponse(stream, media_type="image/jpeg")


async def request_embedding(profile_img, internal_id: str):
    AI_SERVER_URL = os.getenv("AI_SERVER_URL")

    # 파일을 multipart/form-data 형태로 준비
    files = {
        "internal_id": (None, internal_id),
    }

    # 'profile_img'가 파일 객체인 경우
    files["image"] = (profile_img.filename, profile_img.file)

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AI_SERVER_URL}/profile_embedding", files=files)
        # return response.json()

        if response.status_code == 200:
            try:
                return response.json()
            except json.JSONDecodeError:
                raise Exception("AI 서버로부터 올바른 JSON 응답을 받지 못했습니다.")
        else:
            # AI 서버로부터의 응답이 성공적이지 않은 경우
            raise Exception(f"AI 서버 요청 실패: 상태 코드 {response.status_code}")
