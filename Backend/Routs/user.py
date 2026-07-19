from fastapi import APIRouter, Depends, HTTPException, status, Request
from Models.groups import GroupDB
from Dependencies.groups import getGroup
from Models.user import (
    UpdateUsernameModel,
    User,
    UserDB,
    UpdateEmailModel,
    UpdatePasswordModel,
)
from Dependencies.auth import getCurrentUser, hashPass, verifyPass
from Dependencies.user import updateUserData

router = APIRouter(
    prefix="/user", tags=["user"], responses={404: {"description": "Not found"}}
)


@router.get("/Debug")
async def debug(request: Request):
    return {
        "headers": dict(request.headers),
        "scope_headers": [
            [k.decode(), v.decode()] for k, v in request.scope["headers"]
        ],
    }


@router.get("/me", response_model=User)
async def me(currUser=Depends(getCurrentUser)):
    return currUser


@router.get("/groups/joined")
async def groups_joined(currUser: User = Depends(getCurrentUser)):
    joinedGroups = currUser.Groups_joined
    if joinedGroups is None:
        joinedGroups = []
    returnData = []
    for i in joinedGroups:
        grp: GroupDB = await getGroup(i)
        returnData.append(grp)
    return {"Groups": returnData}


@router.get("/groups/invite")
async def groups_invite(currUser: User = Depends(getCurrentUser)):
    invitedGroups = currUser.Groups_invited
    if invitedGroups is None:
        invitedGroups = []
    returnData = []
    for i in invitedGroups:
        grp: GroupDB = await getGroup(i)
        returnData.append(grp)
    return {"Groups": returnData}


@router.patch("/update/name", response_model=User)
async def update_username(
    username: UpdateUsernameModel, currUser: UserDB = Depends(getCurrentUser)
):
    currUser.Name = username.newName
    await updateUserData(currUser)
    return currUser


@router.patch("/update/Email", response_model=User)
async def update_email(
    Email: UpdateEmailModel, currUser: UserDB = Depends(getCurrentUser)
):
    currUser.Email = Email.Email
    await updateUserData(currUser)
    return currUser


@router.patch("/update/Password", response_model=User)
async def update_password(
    password: UpdatePasswordModel, currUser: UserDB = Depends(getCurrentUser)
):
    if not verifyPass(password.oldPassword, currUser.Password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    currUser.Password = hashPass(password.newPassword)
    await updateUserData(currUser)
    return currUser
