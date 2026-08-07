from fastapi import APIRouter, Depends, HTTPException, status

from Dependencies.user import updateUserData
from Dependencies.groups import createGroup, getGroup, updateGroup
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
async def invite_user(
    formData: GroupInviteModel, currUser: User = Depends(getCurrentUser)
):
    group: Group = await getGroup(formData.groupID)
    if group.Created_by != currUser.User_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not the group owner"
        )
    inviteTarget = getUserFromEmail(formData.UserEmail)
    if (
        formData.groupID not in inviteTarget.Groups_invited
        and formData.groupID not in inviteTarget.Groups_joined
    ):
        inviteTarget.Groups_invited.append(formData.groupID)
    print(inviteTarget)
    await updateUserData(inviteTarget)
    return {"message": "Invite sent", "id": formData.UserEmail}


@router.patch("/invite/accept")
async def accept_invite(group_id: int, currUser: User = Depends(getCurrentUser)):
    if group_id not in currUser.Groups_invited:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not Invited to group"
        )
    currUser.Groups_invited.remove(group_id)
    currUser.Groups_joined.append(group_id)
    group = await getGroup(group_id)
    group.Users.append(currUser.User_id)
    await updateUserData(currUser)
    await updateGroup(group)
    return {
        "message": "Joined the group",
    }


@router.patch("/invite/reject")
async def reject_invite(group_id: int, currUser: User = Depends(getCurrentUser)):
    if group_id not in currUser.Groups_invited:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not Invited to group"
        )
    currUser.Groups_invited.remove(group_id)
    await updateUserData(currUser)
    return {
        "message": "Rejected the request",
    }
