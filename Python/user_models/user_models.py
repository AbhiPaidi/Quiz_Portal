from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

class login(BaseModel):
    username:str
    password: str

class verification(login):
    _id:ObjectId
    code:str


class UserInDB(login):
    _id: ObjectId
    role: str
    firstName: str
    lastName: str
    id:str
    section:str
    createdTime: datetime = Field(default_factory=datetime.utcnow)
    updatedTime: datetime = Field(default_factory=datetime.utcnow)



