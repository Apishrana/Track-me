from pydantic import BaseModel, field_validator, Field


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    User_id: int


class User(BaseModel):
    User_id: int
    Name: str
    Email: str
    Groups_joined: list[int] | None = None
    Groups_invited: list[int] | None = None

    @field_validator("Groups_joined", mode="before")
    @classmethod
    def none_to_empty_list(cls, v):
        if v is None:
            return []
        return v

    @field_validator("Groups_invited", mode="before")
    @classmethod
    def none_to_empty_list(cls, v):
        if v is None:
            return []
        return v


class UserDB(User):
    Password: str
    Fcm_token: str | None = None


class UpdateUsernameModel(BaseModel):
    newName: str


class UpdateEmailModel(BaseModel):
    Email: str


class UpdatePasswordModel(BaseModel):
    oldPassword: str
    newPassword: str
