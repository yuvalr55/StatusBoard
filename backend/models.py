
from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class Status(BaseModel):
    status: str
