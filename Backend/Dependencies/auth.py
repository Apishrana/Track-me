import os
from datetime import datetime
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from db import supabase
from models.user import TokenData, UserDB

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def verifyPass(password, hashedPass):
    return pwdContext.verify(password, hashedPass)


def hashPass(password):
    return pwdContext.hash(password)


def getUser(userId):
    try:
        response = (
            supabase.table("Users").select("*").eq("User_id", userId).single().execute()
        )
        print(response.data)
        return UserDB(**response.data)
    except Exception as e:
        print(e)
        return None


def getUserFromEmail(email):
    try:
        response = (
            supabase.table("Users").select("*").eq("Email", email).single().execute()
        )
        print(response.data)
        return UserDB(**response.data)
    except Exception as e:
        print(e)
        return None


def authenticateUser(email, password):
    user = getUserFromEmail(email)
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


async def getCurrentUser(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    credentialException = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not authenticate the credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        userId = int(payload["sub"])
        if userId is None:
            raise credentialException
        tokenData = TokenData(User_id=userId)

    except JWTError as e:
        print(e)
        raise credentialException

    user = getUser(userId=tokenData.User_id)
    if user is None:
        raise credentialException

    return user
