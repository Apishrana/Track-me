from fastapi import APIRouter, Depends, HTTPException, status

from Dependencies.user import updateUserData
from Dependencies.groups import createGroup, getGroup
from Models.groups import CreateGroupModel, Group, GroupInviteModel
from Dependencies.auth import getCurrentUser, getUser, getUserFromEmail
from Models.user import User

router = APIRouter(
    prefix="/groups", tags=["groups"], responses={404: {"description": "Not found"}}
)


@router.get("/get", response_model=Group)
async def get_group(group_id: int, currUser: User = Depends(getCurrentUser)):
    if group_id not in currUser.Groups_joined:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not a group member"
        )
    group = await getGroup(group_id)
    u = []
    for i in group.Users:
        usr = getUser(i)
        u.append(usr)
    group.Users = u
    return group


@router.post("/cerate")
async def cerate_group(
    formData: CreateGroupModel, currUser: User = Depends(getCurrentUser)
):
    groupID = await createGroup(groupName=formData.GroupName, user=currUser)
    return {"message": "Group Created", "id": groupID}


@router.post("/invite")
async def cerate_group(
    formData: GroupInviteModel, currUser: User = Depends(getCurrentUser)
):
    group: Group = await getGroup(formData.groupID)
    if group.Created_by != currUser.User_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not the group owner"
        )
    for i in formData.UserEmail:
        inviteTarget = getUserFromEmail(i)
        inviteTarget.Groups_invited.append(formData.groupID)
        print(inviteTarget)
        await updateUserData(inviteTarget)
    return {"message": "Invite sent", "ids": formData.UserEmail}
