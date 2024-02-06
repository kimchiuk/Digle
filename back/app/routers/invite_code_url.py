from fastapi import FastAPI, HTTPException
import random
import string
from fastapi import APIRouter, Form, HTTPException, Request, Depends, Response

router = APIRouter(tags=["invite_code"])

def generate_unique_code(length=8):
    characters = string.ascii_letters + string.digits  # 영어 대소문자와 숫자를 포함
    return ''.join(random.choice(characters) for _ in range(length))

