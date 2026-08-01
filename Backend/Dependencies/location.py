from db import supabase
from firebase_admin import messaging
import fb


async def getLocation(user_id):
    request = (
        supabase.table("Location")
        .select("*")
        .eq("User_id", user_id)
        .order("Created_at", desc=True)
        .limit(1)
        .execute()
    )
    return request.data


async def getAllLocation(user_id):
    request = (
        supabase.table("Location")
        .select("*")
        .eq("User_id", user_id)
        .order("Created_at", desc=True)
        .execute()
    )
    return request.data


async def uploadLocation(longitude, latitude, accuracy, userID):
    data = {
        "Latitude": latitude,
        "Longitude": longitude,
        "Accuracy": accuracy,
        "User_id": userID,
    }
    res = supabase.table("Location").insert(data).execute()
    print(res.data[0])


def sendLocationRequest(token, requester):
    message = messaging.Message(
        token=token,
        notification=messaging.Notification(
            title="Location Requested", body="Tap to open the app."
        ),
        data={"action": "Upload location", "requester": str(requester)},
    )

    res = messaging.send(message)
    return res


def sendLocationConfirmation(token):
    message = messaging.Message(
        token=token,
        data={
            "action": "Render location",
        },
    )

    res = messaging.send(message)
    return res
