from fastapi import FastAPI, status
from dotenv import load_dotenv
from fastapi.responses import RedirectResponse
import uvicorn
import os

from Routs import auth
from Routs import user
from Routs import groups

load_dotenv()

BACKEND_HOST = os.getenv("BACKEND_HOST")
BACKEND_PORT = int(os.getenv("BACKEND_PORT"))


app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(groups.router)


@app.get("/")
def root():
    return RedirectResponse(url="/docs", status_code=status.HTTP_307_TEMPORARY_REDIRECT)


"""
    <html>
        <head><title>Location Backend</title></head>
        <body>
        <a href='/docs'>,</a>
        </body>
    </html>
    """


if __name__ == "__main__":
    uvicorn.run("main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)
