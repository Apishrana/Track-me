from Models.groups import GroupDB
from Dependencies.user import updateUserData
from Models.user import UserDB
from db import supabase


async def createGroup(groupName, user: UserDB):
    data = {
        "Group_name": groupName,
        "Created_by": user.User_id,
        "Users": [user.User_id],
    }
    res = supabase.table("Groups").insert(data).execute()
    groupID = res.data[0]["Group_id"]
    user.Groups_joined.append(groupID)
    await updateUserData(user)
    return groupID


async def getGroup(groupID):
    response = (
        supabase.table("Groups").select("*").eq("Group_id", groupID).single().execute()
    )
    print(response.data)
    return GroupDB(**response.data)
