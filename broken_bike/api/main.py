#!/usr/bin/env python3

from connect_db import ConnectDB
import os
import uvicorn
from fastapi import FastAPI

USER = os.environ.get('DB_USER')
PASSWORD = os.environ.get('DB_PASSWORD')

db = ConnectDB(USER, PASSWORD)
app = FastAPI()

@app.get("/")
async def root():
    if db.conn is None:
        return {"message": "DB connection failed"}
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
