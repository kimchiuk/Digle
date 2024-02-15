

# Digle : 안면인식 기술을 활용한 온라인 미팅서비스

개발 환경
---
+ Front-end
    - React : ^18.2.0
    - react-router-dom : ^6.21.2
    - tailwindcss : ^3.4.1
+ Back-end
    - fastapi : 0.109.1
+ WebRTC Media Server
    - janus : 1.2.1
+ Ai-server 
    - Driver Version: 515.65.01
    - CUDA Version: 11.7


환경 설정
--
### miniconda 가상환경 설정

#### miniconda 다운로드

-   https://docs.conda.io/projects/miniconda/en/latest/ 에 접속해서 miniconda 설치

#### 가상환경 생성 및 접속

-   본 프로젝트는 python version 3.8로 진행

-   myenv는 본인이 설정할 환경 이름

```
conda create --name {myenv} python=3.8
```

-   생성한 환경 접속

```
conda activate {myenv}
```

#### 필요한 라이브러리 설치

```
pip install -r requirement.txt
```

### postgreSQL 다운로드

-   https://www.postgresql.org/download/ 에 접속해서 postgreSQL latest 버전 설치


### FastAPI 실행

-   '/back/app' 디렉토리에서 다음 코드 실행

```
python main.py local
```

### Front-end .env 설정
```
HTTPS=true
SSL_CRT_FILE=../localhost.pem
SSL_KEY_FILE=../localhost-key.pem
REACT_APP_API_BASE_URL=https://localhost:8000/
```

### Back-end .env 설정
```
DATABASE_URL={postgreSQL 도메인}

SECRET_KEY={JWT secret key}
SESSION_SECRET_KEY={세션 관리용 secret key}

GCP_SERVICE_ACCOUNT_JSON={GCP 서비스 계정 권한 JSON TEXT}
GOOGLE_CLIENT_ID={Google OAuth ID}
GOOGLE_CLIENT_SECRET={Google OAuth Password}
KAKAO_CLIENT_ID={Kakao OAuth ID}
KAKAO_CLIENT_SECRET={Kakao OAuth Password}
NAVER_CLIENT_ID={Naver OAuth ID}
NAVER_CLIENT_SECRET={Naver OAuth Password}

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME={SMTP 이메일 인증용 계정 ID}
SMTP_PASSWORD={SMTP 이메일 인증용 계정 App Password}
```


### Front-end .gitignore
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
.env
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### Back-end .gitignore
```
.env
google_service_key.json
alembic.ini
```

