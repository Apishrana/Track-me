import os
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status

from db import supabase
from Dependencies.auth import authenticateUser, createAccessToken, hashPass
from models.user import Token
from models.auth import LoginRequest, SignupRequest

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
        data={"sub": user.Email}, expiresDelta=accessTokenExpire
    )
    return {"access_token": accessToken, "token_type": "bearer"}


@router.post("/signup", response_model=Token)
async def signup(formData: SignupRequest = Depends()):
    data = {
        "Name": formData.Name,
        "Email": formData.Email,
        "Password": hashPass(formData.Password),
    }
    supabase.table("Users").insert(data).execute()
    user = authenticateUser(formData.Email, formData.Password)
    accessTokenExpire = timedelta(minutes=TOKEN_EXPIRATION_TIME_MINUTS)
    accessToken = createAccessToken(
        data={"sub": user.Email}, expiresDelta=accessTokenExpire
    )
    return {"access_token": accessToken, "token_type": "bearer"}
