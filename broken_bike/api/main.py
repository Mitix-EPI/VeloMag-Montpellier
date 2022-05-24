#!/usr/bin/env python3

from connect_db import ConnectDB
import os
import uvicorn
from fastapi import FastAPI, Request
from db_requests import Bikes, User

priorityEnum = ['low', 'important', 'urgent']
reasonEnum = ['brake problem', 'gear problem', 'seat problem', 'touch panel not working', 'other']

USER = os.environ.get('DB_USER')
PASSWORD = os.environ.get('DB_PASSWORD')

db = ConnectDB(USER, PASSWORD)
bikes = Bikes(db)
user = User(db)
app = FastAPI()

@app.get("/")
async def root():
    if db.conn is None:
        return {"code": 500, "message": "Database connection failed"}
    return {"code": 200, "message": "Hello World"}

@app.get("/get_bikes")
async def get_bikes():
    if db.conn is None:
        return {"code": 500, "message": "Database connection failed"}
    res = bikes.get_bikes()
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    else:
        return {"code": 200, "message": "Success", "data": res}
    
@app.post("/remove_bike/{bike_id}")
async def remove_bike(bike_id: int):
    if db.conn is None:
        return {"code": 500, "message": "Database connection failed"}
    res = bikes.remove_bike(bike_id)
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    else:
        return {"code": 200, "message": "Success"}
    
@app.post("/add_broken_bike")
async def add_broken_bike(request: Request):
    body = request.json()
    bike_id = body['bike_id']
    priority = body['priority']
    reason = body['reason']
    description = body['description']
    if db.conn is None:
        return {"code": 500, "message": "Database connection failed"}
    if priority not in priorityEnum:
        return {"code": 400, "message": "Priority must be one of the following: " + str(priorityEnum)}
    if reason not in reasonEnum:
        return {"code": 400, "message": "Reason must be one of the following: " + str(reasonEnum)}
    res = bikes.add_broken_bike(bike_id, priority, reason, description)
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    else:
        return {"code": 200, "message": "Success"}

@app.post("/login")
async def login(request: Request):
    body = request.json()
    username = body['username']
    password = body['password']
    if db.conn is None:
        return {"code": 500, "message": "Database connection failed"}
    res = user.connect(username, password)
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    elif res is False:
        return {"code": 401, "message": "Invalid credentials"}
    else:
        return {"code": 200, "message": "Success", "data": res}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
