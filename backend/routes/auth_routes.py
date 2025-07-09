from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from db import db
from auth_utils import JWTHandler
from passlib.hash import bcrypt
from enums import AuthError

router = APIRouter()



class LoginInput(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginInput):
    user = db.users.find_one({"username": data.username})
    if not user or not bcrypt.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = JWTHandler.create_token(user["username"])
    return {"access_token": token, "token_type": "Bearer"}


@router.get("/verify")
def verify_token(request: Request):
    try:
        payload = JWTHandler.verify_token(request)
        return {"valid": True, "username": payload}
    except Exception:
        raise HTTPException(status_code=401, detail=AuthError.INVALID_OR_EXPIRED_TOKEN)
