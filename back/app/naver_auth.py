from authlib.integrations.starlette_client import OAuth

oauth = OAuth()

naver = oauth.register(
    name='naver',
    client_id=NAVER_CLIENT_ID,
    client_secret=NAVER_CLIENT_SECRET,
    authorize_url='https://nid.naver.com/oauth2.0/authorize',
    authorize_params=None,
    authorize_kwargs=None,
    authorize_url_params=None,
    token_url='https://nid.naver.com/oauth2.0/token',
    token_params=None,
    token_kwargs=None,
    redirect_uri='http://localhost:8000/login/naver/callback',
    client_kwargs={'scope': 'profile'},
)

@app.get("/login/naver")
async def login(request: Request):
    redirect_uri = url_for('login_naver_callback', _external=True)
    return await naver.authorize_redirect(request, redirect_uri)

@app.route("/login/naver/callback")
async def login_naver_callback(request: Request):
    token = await naver.authorize_access_token(request)
    user = await naver.parse_id_token(request, token)
    return {"token": token, "user": user}