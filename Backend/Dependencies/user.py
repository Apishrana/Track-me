from models.user import UserDB
from db import supabase


async def updateUserData(user: UserDB):
    res = (
        supabase.table("Users")
        .update(
            {
                "Email": user.Email,
                "Password": user.Password,
                "Name": user.Name,
                "Groups_joined": user.Groups_joined,
            }
        )
        .eq("User_id", user.User_id)
        .execute()
    )
    print(res.data)
