from fastapi import APIRouter, Depends, HTTPException, status

from Dependencies.groups import createGroup, getGroup
from Models.groups import CreateGroupModel, Group, GroupInviteModel
from Dependencies.auth import getCurrentUser, getUserFromEmail
from Models.user import User

router = APIRouter(
    prefix="/groups", tags=["groups"], responses={404: {"description": "Not found"}}
)


@router.post("/cerate")
async def cerate_group(
    formData: CreateGroupModel, currUser: User = Depends(getCurrentUser)
):
    groupID = await createGroup(groupName=formData.groupName, user=currUser)
    return {"message": "Group Created", "id": groupID}


@router.post("/invite")
async def cerate_group(
    formData: GroupInviteModel, currUser: User = Depends(getCurrentUser)
):
    group: Group = getGroup(formData.groupID)
    if group.Created_by != currUser.User_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not the group owner"
        )
    for i in formData.UserEmail:
        inviteTarget = getUserFromEmail(i)
        inviteTarget.Groups_invited.append(formData.groupID)
    return {"message": "Invite sent", "ids": formData.UserEmail}
