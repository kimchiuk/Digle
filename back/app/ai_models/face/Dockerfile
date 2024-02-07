# Python 이미지를 베이스 이미지로 사용
FROM python:3.8

# 작업 디렉토리 설정
WORKDIR .

# 의존성 파일 복사
# requirements.txt 파일에는 필요한 Python 패키지를 나열합니다.
COPY requirements.txt ./

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 현재 디렉토리의 모든 내용을 컨테이너의 작업 디렉토리로 복사
COPY . .

# 모델을 실행하는 명령어
# 예시: Python 스크립트를 실행합니다. 실제 실행 파일명으로 변경해야 합니다.
CMD ["python", "./main.py", "face_comparison"]

