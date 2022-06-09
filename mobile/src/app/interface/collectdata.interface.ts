export interface CollectData {
    [key: string]: { [key: string]: StationCollectData };
}

export interface StationCollectData {
    bikes:    number;
    slots:    number;
    capacity: number;
}
