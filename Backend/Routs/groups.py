from fastapi import APIRouter, Depends

from Dependencies.groups import createGroup
from models.groups import CreateGroupModel
from Dependencies.auth import getCurrentUser
from models.user import User

router = APIRouter(
    prefix="/groups", tags=["groups"], responses={404: {"description": "Not found"}}
)


@router.post("/cerate")
async def cerate_group(
    formData: CreateGroupModel, currUser: User = Depends(getCurrentUser)
):
    groupID = await createGroup(groupName=formData.groupName, user=currUser)
    return {"message": "Group Created", "id": groupID}
