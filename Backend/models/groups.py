from datetime import datetime
from pydantic import BaseModel


class Group(BaseModel):
    Group_id: int
    Users: list[int]
    Created_by: int
    Group_name: str


class GroupDB(BaseModel):
    Created_at: datetime


class CreateGroupModel(BaseModel):
    groupName: str
