#!/usr/bin/env python3

import logging
import os
import time
import traceback
import threading
from collect_data.collect_data import collect_data

def every(delay, task):
    next_time = time.time() + delay
    while True:
        time.sleep(max(0, next_time - time.time()))
        try:
            task()
        except Exception:
            traceback.print_exc()
        next_time += (time.time() - next_time) // delay * delay + delay

def launch_collect_data():
    print("launching")
    forty_minutes = 40
    logging.basicConfig(level=logging.INFO)
    if not os.path.exists("collect_data/data"):
        os.mkdir("collect_data/data")
    threading.Thread(target=lambda: every(forty_minutes, collect_data)).start()
