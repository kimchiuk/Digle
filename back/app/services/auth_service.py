import datetime

import jwt

ACCESS_TOKEN_EXPIRE_MINUTES = 60
ALGORITHM = "HS256"
# 임시로 설정. .env로 옮겨야됨
SECRET_KEY = "Qb7VoxZ6UFQ8caVHLUVAccWcipUBLmuH"

def create_access_token(email: str, auth: str):
    expire = datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire, "typ": auth}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt