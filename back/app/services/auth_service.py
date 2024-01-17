import datetime
import hashlib
from jose import jwt

ACCESS_TOKEN_EXPIRE_MINUTES = 60
ALGORITHM = "HS256"
# 임시로 설정. .env로 옮겨야됨
SECRET_KEY = "Qb7VoxZ6UFQ8caVHLUVAccWcipUBLmuH"


# 엑세스 토큰 생성
def create_access_token(email: str, auth: str):
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire, "typ": auth}
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
