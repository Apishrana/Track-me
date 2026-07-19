from pydantic import BaseModel


class LoginRequest(BaseModel):
    Email: str
    Password: str
    Fcm_token: str


class SignupRequest(LoginRequest):
    Name: str
