from db import supabase
from firebase_admin import messaging


async def getLocation(user_id):
    request = (
        supabase.table("Location")
        .select("*")
        .eq("User_id", user_id)
        .order("Created_at", desc=True)
        .execute()
    )
    return request.data


async def uploadLocation(longitude, latitude, userID):
    data = {
        "Latitude": latitude,
        "Longitude": longitude,
        "User_id": [userID],
    }
    res = supabase.table("Location").insert(data).execute()
    print(res.data[0])
    return res.data[0]


def sendLocationRequest(token):
    message = messaging.Message(
        token=token,
        notification=messaging.Notification(
            title="Location Requested", body="Tap to open the app."
        ),
        data={"action": "Upload location"},
    )

    res = messaging.send(message)
    return res
