import datetime
import hashlib
import secrets
from jose import jwt

ACCESS_TOKEN_EXPIRE_MINUTES = 60
ALGORITHM = "HS256"
# 임시로 설정. .env로 옮겨야됨
SECRET_KEY = "Qb7VoxZ6UFQ8caVHLUVAccWcipUBLmuH"


def generate_random_state(length=32):
    # 안전한 랜덤 문자열 생성
    # 'length'는 생성할 문자열의 길이를 지정합니다.
    # secrets.token_urlsafe() 함수는 안전한 랜덤 문자열을 생성합니다.
    # Base64 인코딩을 사용하기 때문에, 실제 문자열 길이는 인자로 지정한 값보다 조금 더 길 수 있습니다.
    return secrets.token_urlsafe(length)


# 엑세스 토큰 생성
def create_access_token(internal_id: str):
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
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


import bcrypt


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password, hashed):
    hashed_bytes = hashed.encode("utf-8")
    return bcrypt.checkpw(password.encode("utf-8"), hashed_bytes)


import uuid


def generate_internal_id():
    return str(uuid.uuid4())
