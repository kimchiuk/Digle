# 사용할 베이스 이미지 지정
FROM python:3.8

# 작업 디렉토리 설정
# WORKDIR /app

# 호스트의 현재 디렉토리에 있는 모든 파일을 작업 디렉토리로 복사
# COPY . /app

# 파이썬 애플리케이션을 실행하기 위한 의존성 설치
RUN pip install /back -r requirements.txt

# 컨테이너가 시작될 때 실행할 명령어 설정
# CMD ["python", "app.py"]
