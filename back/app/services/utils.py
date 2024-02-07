from fastapi import UploadFile
from google.cloud import storage
import os

# 환경 변수에서 서비스 계정 키 파일 경로 가져오기
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\google_service_key.json"

# GCP Storage 클라이언트 초기화
storage_client = storage.Client()


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
