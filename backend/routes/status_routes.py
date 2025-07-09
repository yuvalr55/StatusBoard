from fastapi import APIRouter, Depends, HTTPException, Request, Query
from enums import StatusError
from db import db
from models import Status
from auth_utils import (JWTHandler, get_all_users_from_cache, user_cache,
                        user_status_cache, update_user_cache)
from typing import List

router = APIRouter()


@router.get("/")
def get_statuses(
        _: Request,
        filters: List[str] = Query(default=[]),
        username: str = Depends(JWTHandler.verify_token)
):
    users = get_all_users_from_cache()
    if not filters:
        return [user for user_key, user in user_cache.items() if user_key != username]
    filtered_usernames = set()
    for status in filters:
        filtered_usernames.update(user_status_cache.get(status, set()))
    users_for_send = []
    for user in filtered_usernames:
        if user != username:
            users_for_send.append(users[user])
    return users_for_send


@router.get("/me")
def get_current_user_status(
        _: Request,
        username: str = Depends(JWTHandler.verify_token)
):
    users = get_all_users_from_cache()
    user = users.get(username)
    if not user:
        raise HTTPException(status_code=404, detail=StatusError.USER_NOT_FOUND)
    return {"username": user["username"], "status": user["status"]}


@router.post("/")
def update_status(data: Status, username: str = Depends(JWTHandler.verify_token)):
    result = db.users.update_one({"username": username}, {"$set": {"status": data.status}})

    if result.matched_count == 1 and result.modified_count == 0:
        raise HTTPException(status_code=400, detail=f"The status '{data.status}' is already set.")
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail=StatusError.NOT_FOUND_OR_UNCHANGED)
    if result.matched_count == 1 and result.modified_count == 1:
        update_user_cache(username, data.status)
    return {"message": "Status updated"}
