# # 기본 이미지로 Python 3.8을 사용
# FROM python:3.8

# # 작업 디렉토리를 /app으로 설정
# WORKDIR /app

# # 현재 디렉토리의 requirements.txt 파일을 컨테이너의 /app 디렉토리로 복사
# COPY requirements.txt ./

# # 필요한 Python 패키지 설치
# RUN pip install --no-cache-dir -r requirements.txt

# # 현재 디렉토리의 나머지 파일들을 컨테이너의 /app 디렉토리로 복사
# COPY . .

# # 애플리케이션 실행 커맨드 지정
# CMD ["uvicorn", "app.main:app", "--reload"]

# 기본 이미지로 Python 3.8을 사용
FROM python:3.8

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 현재 디렉토리의 requirements.txt 파일을 컨테이너의 /app 디렉토리로 복사
COPY requirements.txt ./

# 필요한 Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 현재 디렉토리의 .idea, alembic, app 디렉토리를 컨테이너의 /app 디렉토리로 복사
COPY .idea /app/.idea
COPY alembic /app/alembic
COPY app /app/app

# 애플리케이션 실행 커맨드 지정
CMD ["uvicorn", "app.main:app", "--reload"]