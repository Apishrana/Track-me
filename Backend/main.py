from fastapi import FastAPI
from dotenv import load_dotenv
import uvicorn
import os

from Routs import auth

load_dotenv()

BACKEND_HOST = os.getenv("BACKEND_HOST")
BACKEND_PORT = int(os.getenv("BACKEND_PORT"))


app = FastAPI()
app.include_router(auth.router)


@app.get("/")
def root():
    return {"Msg": 67}


if __name__ == "__main__":
    uvicorn.run("main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)
