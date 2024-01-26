## 환경설정

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

-   https://www.postgresql.org/download/ 에 접속해서 postgreSQL 설치
-   .env에 다음 코드 추가

```
DATABASE_URL=postgresql://postgres:ssafy@localhost/postgres
```

### FastAPI 실행

-   'back' 디렉토리에서 다음 코드 실행

```
uvicorn app.main:app --reload
```
