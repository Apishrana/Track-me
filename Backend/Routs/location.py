from fastapi import APIRouter, Depends, HTTPException, status

from Dependencies.groups import getGroup
from Models.groups import Group
from Models.user import User, UserDB
from Dependencies.auth import getCurrentUser, getUser
from Dependencies.location import getLocation, sendLocationRequest, uploadLocation
from Models.location import RequestLocationModel, UploadLocationModel

router = APIRouter(
    prefix="/location", tags=["location"], responses={404: {"description": "Not found"}}
)


@router.get("/get/")
async def get_location(
    group_id: int, user_id: int, currUser: User = Depends(getCurrentUser)
):
    group: Group = getGroup(group_id)
    if not (user_id in group.Users and currUser.User_id in group.Users):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Users not in the same group",
        )
    data = getLocation(user_id=user_id)
    return data


@router.post("/request")
async def request_location(
    formData: RequestLocationModel, currUser: User = Depends(getCurrentUser)
):
    group: Group = getGroup(formData.Group_id)
    if not (formData.Target_id in group.Users and currUser.User_id in group.Users):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Users not in the same group",
        )
    target: UserDB = getUser(formData.Target_id)
    res = sendLocationRequest(token=target.Fcm_token)
    return {"massage": "Request sent", "message ID": res}


@router.post("/upload")
async def upload_location(
    formData: UploadLocationModel, currUser: User = Depends(getCurrentUser)
):
    cnf = await uploadLocation(
        longitude=formData.Longitude,
        latitude=formData.Latitude,
        accuracy=formData.Accuracy,
        userID=currUser.User_id,
    )
    return cnf
