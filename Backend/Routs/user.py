from fastapi import APIRouter, Depends, HTTPException, status

from models.user import (
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


@router.get("/me", response_model=User)
async def me(currUser=Depends(getCurrentUser)):
    return currUser


@router.post("/update/name", response_model=User)
async def update_username(
    username: UpdateUsernameModel, currUser: UserDB = Depends(getCurrentUser)
):
    currUser.Name = username.newName
    await updateUserData(currUser)
    return currUser


@router.post("/update/Email", response_model=User)
async def update_email(
    Email: UpdateEmailModel, currUser: UserDB = Depends(getCurrentUser)
):
    currUser.Email = Email.Email
    await updateUserData(currUser)
    return currUser


@router.post("/update/Password", response_model=User)
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
