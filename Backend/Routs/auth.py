import os
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status

from Dependencies.user import updateUserData
from db import supabase
from Dependencies.auth import authenticateUser, createAccessToken, hashPass
from Models.user import Token, User
from Models.auth import LoginRequest, SignupRequest

TOKEN_EXPIRATION_TIME_MINUTS = int(os.getenv("TOKEN_EXPIRATION_TIME_MINUTS"))

router = APIRouter(
    prefix="/auth", tags=["auth"], responses={404: {"description": "Not found"}}
)


@router.post("/login", response_model=Token)
async def login(formData: LoginRequest = Depends()):
    user = authenticateUser(formData.Email, formData.Password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Email or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    accessTokenExpire = timedelta(minutes=TOKEN_EXPIRATION_TIME_MINUTS)
    accessToken = createAccessToken(
        data={"sub": str(user.User_id)}, expiresDelta=accessTokenExpire
    )
    user.Fcm_token = formData.Fcm_token
    await updateUserData(user)
    return {"access_token": accessToken, "token_type": "bearer"}


@router.post("/signup", response_model=Token)
async def signup(formData: SignupRequest = Depends()):
    data = {
        "Name": formData.Name,
        "Email": formData.Email,
        "Password": hashPass(formData.Password),
        "Fcm_token": formData.Fcm_token,
    }
    supabase.table("Users").insert(data).execute()
    user: User = authenticateUser(formData.Email, formData.Password)
    accessTokenExpire = timedelta(minutes=TOKEN_EXPIRATION_TIME_MINUTS)
    accessToken = createAccessToken(
        data={"sub": user.User_id}, expiresDelta=accessTokenExpire
    )
    return {"access_token": accessToken, "token_type": "bearer"}
