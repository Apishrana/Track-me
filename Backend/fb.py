import json
import os

import firebase_admin
from firebase_admin import credentials

credDict = json.loads(os.getenv("FIREBASE_CREDENTIALS"))

cred = credentials.Certificate(credDict)

firebase_admin.initialize_app(cred)
