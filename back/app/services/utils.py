import json
from dotenv import load_dotenv
from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from google.cloud import storage
import os
from google.oauth2 import service_account

# .env 파일에서 환경 변수 로드
load_dotenv()

# .env 파일에서 서비스 계정 JSON을 가져옴
service_account_info = json.loads(os.getenv("GCP_SERVICE_ACCOUNT_JSON"))

# 서비스 계정 정보를 사용하여 인증 정보 생성
credentials = service_account.Credentials.from_service_account_info(service_account_info)

# 인증 정보를 사용하여 Storage 클라이언트 생성
storage_client = storage.Client(credentials=credentials)

# 환경 변수에서 서비스 계정 키 파일 경로 가져오기
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\google_service_key.json"

# GCP Storage 클라이언트 초기화
# storage_client = storage.Client()


def upload_to_gcs(file: UploadFile, file_path: str):
    bucket_name = "ssafy-bucket"
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # 임시 파일 생성
    temp_file = f"C:/files/{file.filename}"
    with open(temp_file, "wb") as f:
        f.write(file.file.read())

    # GCS에 업로드
    blob = bucket.blob(file_path)
    blob.upload_from_filename(temp_file)

    # 임시 파일 삭제
    os.remove(temp_file)


def get_image_stream(file_path: str):
    # Google Cloud Storage에서 이미지 스트리밍
    storage_client = storage.Client()
    bucket = storage_client.bucket("ssafy-bucket")
    blob = bucket.blob(file_path)
    stream = blob.download_as_stream()

    return StreamingResponse(stream, media_type="image/jpeg")
