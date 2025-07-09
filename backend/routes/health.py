from fastapi import APIRouter, HTTPException, Depends
from db import db
from auth_utils import JWTHandler

router = APIRouter()


@router.get("/check_db")
def check_db(_: str = Depends(JWTHandler.verify_token)):
    try:
        db.command("ping")
        return {"status": "ok"}
    except:
        raise HTTPException(status_code=503, detail="DB down")
