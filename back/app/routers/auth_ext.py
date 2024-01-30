from fastapi import APIRouter
from fastapi import APIRouter, Response


router = APIRouter(tags=["auth_ext"])


@router.post("/logout")
async def logout(response: Response):
    # 쿠키를 만료시키거나 빈 값으로 설정
    response.delete_cookie(
        key="__Host-access_token",
        httponly=True,
        secure=True,
        samesite="None",
        # domain = 'aimipp.vercel.app',
        path="/",  # 전체 경로에서 사용
    )
    return {"message": "User logged out"}
