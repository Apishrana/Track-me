from datetime import datetime

from pydantic import BaseModel


class Location(BaseModel):
    Location_id: int
    Longitude: float
    Latitude: float
    User_id: int
    Created_at: datetime
    Accuracy: float


class UploadLocationModel(BaseModel):
    Longitude: float
    Latitude: float
    Accuracy: float


class RequestLocationModel(BaseModel):
    Target_id: int
    Group_id: int
