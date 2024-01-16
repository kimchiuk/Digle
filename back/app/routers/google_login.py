from fastapi import APIRouter, HTTPException, Request, Depends
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session
from app.main import get_db

from app.models.user import User, UserOAuth
from app.services.auth_service import create_access_token

router = APIRouter()
oauth = OAuth()

conf = oauth.register(
    name='google',
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)

@router.post('/google_token')
async def login_for_access_token(request: Request, token: str, db: Session = Depends(get_db)):
    user_info = await oauth.google.parse_id_token(request, token)
    if not user_info:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    # 데이터베이스에서 사용자 검색
    oauth_account = db.query(UserOAuth).filter_by(provider_name='google', provider_user_id=user_info['sub']).first()
    if not oauth_account:
        # 새 사용자 등록
        user = User(email=user_info['email'], username=user_info['name'])
        db.add(user)
        db.commit()
        db.refresh(user)

        oauth_account = UserOAuth(user_id=user.id, provider_name='google', provider_user_id=user_info['sub'])
        db.add(oauth_account)
        db.commit()
        db.refresh(oauth_account)
    else:
        user = db.query(User).filter_by(id=oauth_account.user_id).first()
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.route('/google_auth')
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    return {"user": user}