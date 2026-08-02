from db import supabase
from firebase_admin import messaging
import fb
import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

LOCATION_ENCRYPTION_KEY = base64.urlsafe_b64decode(
    os.environ["LOCATION_ENCRYPTION_KEY"]
)


def encryptLocationValue(value):
    nonce = os.urandom(12)
    aesgcm = AESGCM(LOCATION_ENCRYPTION_KEY)
    ciphertext = aesgcm.encrypt(nonce, str(value).encode("utf-8"), None)
    return base64.urlsafe_b64encode(nonce + ciphertext).decode("utf-8")


def decryptLocationValue(value):
    encrypted = base64.urlsafe_b64decode(value.encode("utf-8"))
    nonce = encrypted[:12]
    ciphertext = encrypted[12:]
    aesgcm = AESGCM(LOCATION_ENCRYPTION_KEY)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return float(plaintext.decode("utf-8"))


def decryptLocationRows(rows):
    for row in rows:
        if row.get("Latitude") is not None:
            try:
                row["Latitude"] = decryptLocationValue(row["Latitude"])
            except (ValueError, TypeError, base64.binascii.Error):
                row["Latitude"] = float(row["Latitude"])

        if row.get("Longitude") is not None:
            try:
                row["Longitude"] = decryptLocationValue(row["Longitude"])
            except (ValueError, TypeError, base64.binascii.Error):
                row["Longitude"] = float(row["Longitude"])
    return rows


async def getLocation(user_id):
    request = (
        supabase.table("Location")
        .select("*")
        .eq("User_id", user_id)
        .order("Created_at", desc=True)
        .limit(1)
        .execute()
    )
    return decryptLocationRows(request.data)


async def getAllLocation(user_id):
    request = (
        supabase.table("Location")
        .select("*")
        .eq("User_id", user_id)
        .order("Created_at", desc=True)
        .execute()
    )
    return decryptLocationRows(request.data)


async def uploadLocation(longitude, latitude, accuracy, userID):
    data = {
        "Latitude": encryptLocationValue(latitude),
        "Longitude": encryptLocationValue(longitude),
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
