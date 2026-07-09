import os
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from postgrest import APIError
from pydantic import BaseModel

from db import supabase

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
TOKEN_EXPIRATION_TIME_MINUTS = os.getenv("TOKEN_EXPIRATION_TIME_MINUTS")

router = APIRouter(
    prefix="/auth", tags=["auth"], responses={404: {"description": "Not found"}}
)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    Email: str


class User(BaseModel):
    User_id: int
    Name: str
    Email: str
    Groups_joined: list[int]


class UserDB(User):
    Password: str


pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
OAuth2Scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def verifyPass(password, hashedPass):
    return pwdContext.verify(password, hashedPass)


def hashPass(password):
    return pwdContext.hash(password)


def getUser(email):
    try:
        response = (
            supabase.table("Users").select("*").eq("Email", email).single().execute()
        )
        print(response.data)
        return UserDB(**response.data)

    except:
        return None


def authenticateUser(email, password):
    user = getUser(email)
    if not user:
        return False
    if not verifyPass(password, user.Password):
        return False

    return user


def createAccessToken(data, expiresDelta):
    toEncode = data.copy()
    expire = datetime.utcnow() + expiresDelta

    toEncode["exp"] = expire
    encoded = jwt.encode(toEncode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded


async def getCurrentUser(token=Depends(OAuth2Scheme)):
    credentialException = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not authenticate the credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload["sub"]
        if email is None:
            raise credentialException
        tokenData = TokenData(Email=email)

    except JWTError:
        raise credentialException

    user = getUser(email=tokenData.Email)
    if user is None:
        raise credentialException

    return user


@router.post("/login", response_model=Token)
async def login(formData: OAuth2PasswordRequestForm = Depends()):
    user = authenticateUser(formData.username, formData.password)
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
