#!/usr/bin/env python3

import json
from connect_db import ConnectDB
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from db_requests import Bikes, User
from collect_data.main_collect_data import launch_collect_data

priorityEnum = ['low', 'important', 'urgent']
reasonEnum = ['brake problem', 'gear problem', 'seat problem', 'touch panel not working', 'other']

USER = os.environ.get('DB_USER')
PASSWORD = os.environ.get('DB_PASSWORD')

db = ConnectDB(USER, PASSWORD)
bikes = Bikes(db)
user = User(db)
app = FastAPI()
launch_collect_data()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"code": 200, "message": "Hello World"}

@app.get("/collect_data")
async def root():
    if os.path.exists("collect_data/data/mean_general.json"):
        f = open("collect_data/data/mean_general.json", "r")
        res = json.loads(f.read())
        f.close()
        return { "code": 200, "message": "OK", "data": res }
    else:
        return { "code": 404, "message": "Not found" }

@app.get("/get_bikes")
async def get_bikes():
    res = bikes.get_bikes()
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    else:
        return {"code": 200, "message": "Success", "data": res}
    
@app.post("/remove_bike/{bike_id}")
async def remove_bike(bike_id: int, request: Request):
    body = await request.json()
    username = body['username']
    password = body['password']
    res = user.connect(username, password)
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    elif res is False:
        return {"code": 401, "message": "Unauthorized"}
    res = bikes.remove_bike(bike_id)
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    elif res is False:
        return {"code": 500, "message": "Database query failed"}
    else:
        return {"code": 200, "message": "Success"}
    
@app.post("/add_broken_bike")
async def add_broken_bike(request: Request):
    body = await request.json()
    bike_id = body['bike_id']
    priority = body['priority']
    reason = body['reason']
    description = body['description']
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
    body = await request.json()
    username = body['username']
    password = body['password']
    res = user.connect(username, password)
    if res is None:
        return {"code": 500, "message": "Database query failed"}
    elif res is False:
        return {"code": 401, "message": "Invalid credentials"}
    else:
        return {"code": 200, "message": "Success", "data": res}
