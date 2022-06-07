import logging
import os
from typing import List
import json
import requests
import time
import pandas as pd


class Station:
    name: str
    id: int
    capacity: int
    bikes: int
    slots: int

    def __init__(self, name: str, id: int, capacity: int, bikes: int, slots: int):
        self.name = name
        self.id = id
        self.capacity = capacity
        self.bikes = bikes
        self.slots = slots


def get_stations_json() -> List[Station]:
    """
    Get the JSON data from the stations.
    """
    logging.info("Getting stations JSON...")
    try:
        bikesUrl = "https://montpellier-fr-smoove.klervi.net/gbfs/en/station_status.json"
        infoBikes = requests.get(bikesUrl).json()["data"]["stations"]

        stationsUrl = "https://montpellier-fr-smoove.klervi.net/gbfs/en/station_information.json"
        infoStations = requests.get(stationsUrl).json()["data"]["stations"]

        res = []
        for station in infoStations:
            for bike in infoBikes:
                if bike["station_id"] == station["station_id"]:
                    res.append(Station(station["name"], station["station_id"], station["capacity"],
                               bike["num_bikes_available"], bike["num_docks_available"]))
        return res
    except Exception as e:
        logging.error("Error while getting data from the stations: %s", e)
        return None


def append_data_to_csv(stations: List[Station], output_path: str) -> pd.DataFrame:
    """
    Append the data to the CSV file.
    """
    logging.info("Appending data to CSV...")
    if not os.path.exists(output_path):
        df = pd.DataFrame(
            columns=["name", "station_id", "bikes", "slots", "capacity"])
    else:
        df = pd.read_csv(output_path, index_col=0)
    df = df.append([{"name": station.name, "station_id": station.id, "bikes": station.bikes,
                   "slots": station.slots, "capacity": station.capacity} for station in stations], ignore_index=True)
    df.to_csv(output_path)
    return df


def update_mean(df: pd.DataFrame, output_path: str) -> pd.DataFrame:
    """
    Update the mean of the data.
    """
    logging.info("Updating mean...")
    res = {
        "stations": [],
    }
    names = df["name"].unique()
    for name in names:
        df_name = df[df["name"] == name]
        mean = df_name.mean(numeric_only=True)
        res["stations"].append({
            "name": name,
            "bikes": mean["bikes"],
            "slots": mean["slots"],
            "capacity": mean["capacity"],
        })
    # Write the mean to a CSV file
    f = open(output_path, "w")
    f.write(json.dumps(res, sort_keys=True, ensure_ascii=False))
    f.close()


def update_general_mean():
    logging.info("Updating general mean...")
    hours = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
             "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
    res = {}

    for hour in hours:
        try:
            f = open("collect_data/data/mean_" + hour + ".json", "r")
            stations = json.loads(f.read())["stations"]
            f.close()
            for station in stations:
                res[station["name"]] = {
                    hour: {
                        "bikes": station["bikes"],
                        "slots": station["slots"],
                        "capacity": station["capacity"],
                    }
                }
        except Exception as e:
            logging.error("Error while getting mean data: %s", e)
            continue
    # Write res in a CSV file
    f = open("collect_data/data/mean_general.json", "w")
    f.write(json.dumps(res, sort_keys=True, ensure_ascii=False))
    f.close()


def collect_data():
    """
    Collect data from the sensors.
    """
    logging.info("Collecting data...")
    stations = get_stations_json()
    if stations is None:
        logging.error("Error while getting stations data")
        return
    hour = time.strftime("%H")
    logging.info("Hour: %s", hour)
    output_path = os.path.join(
        "collect_data/data", "data_" + str(hour) + ".csv")
    df = append_data_to_csv(stations, output_path)
    output_path = os.path.join(
        "collect_data/data", "mean_" + str(hour) + ".json")
    update_mean(df, output_path)
    update_general_mean()
