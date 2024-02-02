# 기본 이미지로 Python 3.8을 사용
FROM python:3.8

# 작업 디렉토리를 /app으로 설정
WORKDIR .

# 현재 디렉토리의 requirements.txt 파일을 컨테이너의 /app 디렉토리로 복사
COPY requirements.txt ./
COPY .idea ./.idea
COPY app ./app


# 필요한 Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 실행 커맨드 지정
CMD ["python", "app/main.py", "deploy"]