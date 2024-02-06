import random
import string


def generate_unique_code(length=8):
    """
    영어 대문자, 소문자, 한글을 포함하여 길이가 length인 문자열을 생성합니다.
    한글 범위: AC00-D7A3 (가-힣)
    """
    characters = string.ascii_letters + string.digits  # 영어 대소문자와 숫자를 포함
    return "".join(random.choice(characters) for _ in range(length))
