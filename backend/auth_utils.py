from jose import jwt
from datetime import datetime, timedelta, timezone
from os import environ
from fastapi.security import HTTPBearer
from enums import AuthError
from fastapi import HTTPException, Request
from cachetools import TTLCache
from db import db
from dotenv import load_dotenv
load_dotenv()

security = HTTPBearer()

user_cache = TTLCache(maxsize=1024, ttl=300)
user_status_cache = TTLCache(maxsize=1024, ttl=300)
username_to_status = TTLCache(maxsize=1024, ttl=300)


def get_user(username: str):
    if username in user_cache:
        return user_cache[username]
    try:
        user = db.users.find_one({"username": username}, {"_id": 0, "username": 1, "status": 1})
        return user
    except:
        return None


def update_user_cache(username: str, status: str):
    existing_user = user_cache.get(username) or get_user(username)
    if not existing_user:
        return
    updated_user = {"username": username, "status": status}
    user_cache[username] = updated_user

    old_status = username_to_status.get(username)
    if old_status and old_status != status:
        if username in user_status_cache.get(old_status, set()):
            user_status_cache[old_status].remove(username)

    if status not in user_status_cache:
        user_status_cache[status] = set()
    user_status_cache[status].add(username)
    username_to_status[username] = status


def get_all_users_from_cache() -> dict[str, dict]:
    if user_cache:
        return dict(user_cache)

    try:
        users = db.users.find({}, {"_id": 0, "username": 1, "status": 1})
        for user in users:
            username = user["username"]
            status = user["status"]
            user_cache[username] = user
            username_to_status[username] = status
            if status not in user_status_cache:
                user_status_cache[status] = set()
            user_status_cache[status].add(username)
    except Exception as err:
        print("Error loading users into cache:", err)
        return {}

    return dict(user_cache)


class JWTHandler:
    SECRET_KEY = environ.get("SECRET_KEY")
    if not SECRET_KEY:
        raise RuntimeError(AuthError.MISSING_SECRET_KEY)
    ALGORITHM = environ.get("ALGORITHM", "HS256")

    @staticmethod
    def create_token(username: str, expires_delta: float = 12.0) -> str:
        try:
            to_encode = {"sub": username}
            expire = datetime.now(timezone.utc) + timedelta(hours=expires_delta)
            to_encode.update({"exp": expire})
            return jwt.encode(to_encode, JWTHandler.SECRET_KEY, algorithm=JWTHandler.ALGORITHM)
        except Exception:
            raise HTTPException(status_code=500, detail=AuthError.CREATE_TOKEN_FAILED)

    @staticmethod
    def verify_token(request: Request) -> str:
        try:
            access_token = request.cookies.get("access_token")
            token_type = request.cookies.get("token_type")
        except Exception:
            raise HTTPException(status_code=400, detail=AuthError.INVALID_COOKIE_STRUCTURE)

        if access_token and token_type:
            token = f"{token_type} {access_token}"
        else:
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail=AuthError.MISSING)
            token = auth_header

        try:
            pure_token = token.split(' ')[1]
            payload = jwt.decode(pure_token, JWTHandler.SECRET_KEY, algorithms=[JWTHandler.ALGORITHM])
            username = payload.get("sub")
            if username is None:
                raise HTTPException(status_code=401, detail=AuthError.INVALID)
            try:
                user = get_user(username)
            except Exception:
                raise HTTPException(status_code=500, detail=AuthError.FAILED_USER_CACHE)
            if user is None:
                raise HTTPException(status_code=401, detail=AuthError.USER_NOT_FOUND)
            return username
        except Exception:
            raise HTTPException(status_code=401, detail=AuthError.INVALID)
