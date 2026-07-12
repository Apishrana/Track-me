from datetime import datetime

from pydantic import BaseModel


class Location(BaseModel):
    Location_id: int
    Longitude: float
    Latitude: float
    User_id: int
    Created_at: datetime


class UploadLocationModel(BaseModel):
    Longitude: float
    Latitude: float


class RequestLocationModel(BaseModel):
    Requester_id: int
    Target_id: int
    Group_id: int
