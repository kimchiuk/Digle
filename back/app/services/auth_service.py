import datetime
import hashlib
import os
import secrets
import uuid
import bcrypt
from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import jwt, JWTError
from datetime import datetime, timedelta

from models.user import User


ACCESS_TOKEN_EXPIRE_MINUTES = 60
ALGORITHM = "HS256"
# 임시로 설정. .env로 옮겨야됨
SECRET_KEY = os.getenv("SECRET_KEY")


def generate_random_state(length=32):
    # 안전한 랜덤 문자열 생성
    # 'length'는 생성할 문자열의 길이를 지정합니다.
    # secrets.token_urlsafe() 함수는 안전한 랜덤 문자열을 생성합니다.
    # Base64 인코딩을 사용하기 때문에, 실제 문자열 길이는 인자로 지정한 값보다 조금 더 길 수 있습니다.
    return secrets.token_urlsafe(length)


# 엑세스 토큰 생성
def create_access_token(internal_id: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": internal_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# 임시 닉네임 부여
def integer_to_8_digit_string_with_hash(num):
    # 정수를 문자열로 변환
    num_str = str(num).zfill(6)

    # SHA-256 해시 함수 사용
    hash_obj = hashlib.sha256(num_str.encode())
    hash_hex = hash_obj.hexdigest()

    # 해시값의 앞 4자리 사용
    hash_prefix = hash_hex[:2]

    # 6자리 정수와 해시값의 앞 4자리를 결합하여 10자리 문자열 생성
    ten_digit_str = num_str + hash_prefix

    return ten_digit_str


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password, hashed):
    hashed_bytes = hashed.encode("utf-8")
    return bcrypt.checkpw(password.encode("utf-8"), hashed_bytes)


def generate_internal_id():
    return str(uuid.uuid4())


# token으로부터 internal_id 추출
def verify_token(token: str):
    if token is None:
        raise HTTPException(status_code=400, detail="이재민 바보")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        internal_id = payload.get("sub")
        if internal_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return internal_id


# token으로부터 user객체 획득
def get_user_by_token(request, db):
    token = request.cookies.get("__Host-access_token")
    if not token or not verify_token(token):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    internal_id = verify_token(token)
    user = db.query(User).filter(User.internal_id == internal_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found User")
    return user
