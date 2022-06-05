#!/usr/bin/env python3

import logging
import os
import sys
import time
import traceback
import threading
from collect_data import collect_data

def every(delay, task):
    next_time = time.time() + delay
    while True:
        time.sleep(max(0, next_time - time.time()))
        try:
            task()
        except Exception:
            traceback.print_exc()
        next_time += (time.time() - next_time) // delay * delay + delay


def main():
    hour = 3600
    threading.Thread(target=lambda: every(hour, collect_data)).start()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
